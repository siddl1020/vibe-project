/**
 * 호스팅된 Supabase 프로젝트에서 이메일 가입 확인(Confirm email)을 끕니다.
 * Management API: PATCH /v1/projects/{ref}/config/auth — mailer_autoconfirm: true
 *
 * 필요: Supabase 대시보드 → Account → Access Tokens 에서 Personal Access Token 발급
 *
 * 사용:
 *   set SUPABASE_ACCESS_TOKEN=your_pat
 *   set SUPABASE_PROJECT_REF=kfhrspfpgzmmbnkwoctf   (선택, 기본값은 vibe-project ref)
 *   npm run auth:enable-email-autoconfirm
 */

const API = "https://api.supabase.com";

const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref =
  process.env.SUPABASE_PROJECT_REF ?? "kfhrspfpgzmmbnkwoctf";

async function main() {
  if (!token) {
    console.error(
      "SUPABASE_ACCESS_TOKEN 이 없습니다.\n" +
        "Supabase Dashboard → Account → Access Tokens 에서 토큰을 만들고,\n" +
        "PowerShell: $env:SUPABASE_ACCESS_TOKEN=\"<token>\"; npm run auth:enable-email-autoconfirm",
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
