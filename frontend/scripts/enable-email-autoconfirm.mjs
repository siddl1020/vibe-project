/**
 * 호스팅된 Supabase 프로젝트에서 이메일 가입 확인(Confirm email)을 끕니다.
 * Management API: PATCH /v1/projects/{ref}/config/auth — mailer_autoconfirm: true
 *
 * 필요: Supabase 대시보드 → Account → Access Tokens 에서 Personal Access Token 발급
 *       → frontend/.env.local 에 SUPABASE_ACCESS_TOKEN=... 저장 (Git 커밋 금지)
 *
 * 프로젝트 ref: .env.local 의 SUPABASE_PROJECT_REF 또는 NEXT_PUBLIC_SUPABASE_URL 에서 추출
 *
 * 실행: npm run auth:enable-email-autoconfirm
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envLocalPath = join(__dirname, "..", ".env.local");

function loadEnvLocal() {
  if (!existsSync(envLocalPath)) return;
  const text = readFileSync(envLocalPath, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

loadEnvLocal();

const API = "https://api.supabase.com";

function refFromSupabaseUrl(url) {
  if (!url || typeof url !== "string") return null;
  const m = url.trim().match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  return m ? m[1] : null;
}

const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref =
  process.env.SUPABASE_PROJECT_REF ||
  refFromSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
  "kfhrspfpgzmmbnkwoctf";

async function main() {
  if (!token) {
    console.error(
      [
        "SUPABASE_ACCESS_TOKEN 이 없습니다.",
        "",
        "1) https://supabase.com/dashboard/account/tokens 에서 Personal Access Token 생성",
        "2) frontend/.env.local 파일에 한 줄 추가:",
        "   SUPABASE_ACCESS_TOKEN=여기에_토큰_붙여넣기",
        "3) 다시 실행: npm run auth:enable-email-autoconfirm",
        "",
        `현재 사용할 프로젝트 ref: ${ref} (NEXT_PUBLIC_SUPABASE_URL 또는 기본값)`,
      ].join("\n"),
    );
    process.exit(1);
  }

  const res = await fetch(`${API}/v1/projects/${ref}/config/auth`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mailer_autoconfirm: true }),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`HTTP ${res.status}: ${text}`);
    if (res.status === 401 || res.status === 403) {
      console.error(
        "\n토큰 권한을 확인하세요. PAT가 만료되었거나 이 조직의 프로젝트가 아닐 수 있습니다.",
      );
    }
    if (res.status === 404) {
      console.error(
        `\n프로젝트 ref가 잘못되었을 수 있습니다. .env.local 에 SUPABASE_PROJECT_REF=정확한_ref 를 넣어 보세요.`,
      );
    }
    process.exit(1);
  }

  console.log(
    "적용 완료: mailer_autoconfirm=true (이메일 확인 없이 가입·로그인 가능)\n" +
      `프로젝트 ref: ${ref}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
