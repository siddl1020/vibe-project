# OWASP 중심 보안 감사 보고서

**대상**: `vibe-project` 프론트엔드(Next.js App Router + Supabase)  
**기준**: OWASP Top 10 및 프로젝트 스킬( SQL 인젝션·세션·정보 유출·bcrypt )  
**일자**: 2026-03-28

## 요약

- **Raw SQL / 문자열 연결 쿼리**: 사용처 없음. Supabase 클라이언트 메서드 체인만 사용.
- **`.or()` 필터**: 검색어는 `escapeIlikePattern`·`quotePostgrestValue`로 PostgREST 리터럴 처리, 기분은 화이트리스트(`parseMoodParam`)로 제한됨.
- **서비스 롤 키**: 코드에 `service_role` 사용 없음. 공개 범위는 `NEXT_PUBLIC_*` anon 키만 — 저장소 규칙 `AGENTS.md`와 동일하게 클라이언트에 서비스 롤을 두지 말 것.
- **bcrypt**: 미사용. 비밀번호는 Supabase Auth가 처리. 클라이언트·서버에서 최소 6자만 검증.

## 이슈 표

| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | High | `frontend/app/signup/actions.ts` | `requestOrigin()` (약 10–15행), `signUp`의 `emailRedirectTo` | `x-forwarded-host`·`x-forwarded-proto`·`host`로 리다이렉트 URL을 조립함. 역프록시가 클라이언트 출처 헤더를 그대로 신뢰하면 확인 메일의 리다이렉트 대상이 공격자 도메인으로 바뀔 수 있음(호스트 헤더·XFH 오염). | 배포 환경에서 신뢰할 수 있는 **고정 `NEXT_PUBLIC_APP_URL`(또는 서버 전용 `APP_URL`)**만 사용해 `emailRedirectTo`를 구성하고, 클라이언트가 조작 가능한 `X-Forwarded-*`는 무시하거나 신뢰된 프록시에서만 설정되도록 인프라에서 정리한다. |
| 2 | Medium | `frontend/app/auth/callback/route.ts` | `exchangeCodeForSession` 실패 시 (약 20–24행) | Supabase `error.message`를 그대로 `login?error=…` 쿼리에 넣어 리다이렉트함. 업스트림 메시지가 URL·로그인 화면에 노출될 수 있음. | `auth_missing_code`와 같이 **짧은 오류 코드**로 매핑하고, 사용자에게는 일반 문구만 표시한다. 디버깅은 서버 로그(민감 정보 제외)로만 한다. |
| 3 | Medium | `frontend/app/login/actions.ts`, `frontend/app/signup/actions.ts`, `frontend/app/entries/new/actions.ts`, `frontend/app/entries/[id]/actions.ts`, `frontend/app/entries/[id]/edit/actions.ts` | 각 액션의 `error` 반환 분기 | 인증·CRUD 실패 시 `error.message`를 그대로 클라이언트 상태로 반환함. PostgREST/DB 제약 관련 문자열이 노출될 수 있음. | 프로덕션에서는 **사용자용 고정 메시지**로 치환하고, 내부 코드(예: `PGRST116`)는 로그에만 남긴다. |
| 4 | Medium | `frontend/app/login/page.tsx` | `error` 쿼리 파라미터 표시 (약 12–24행, `LoginForm`의 `urlError`) | 콜백 등에서 넘긴 `error` 문자열을 디코딩해 화면에 출력. (2)와 결합 시 업스트림 메시지가 그대로 보일 수 있음. | (2)와 동일하게 URL에는 코드만 두고, 페이지에서 코드→문구 매핑으로 표시한다. |
| 5 | Medium | (설정) Supabase 대시보드 / RLS | 저장소 외부 | 코드만으로는 Row Level Security·정책 완전성을 검증할 수 없음. | `entries` 등 테이블에 **RLS 활성화** 및 `user_id` 기준 정책이 의도대로인지 대시보드에서 주기적으로 점검한다. |

## 비고 (해당 영역 양호)

| 영역 | 내용 |
|---|---|
| SQL 인젝션(PostgREST) | 검색 `.or()`는 따옴표 이스케이프된 리터럴로만 값이 들어가며, `mood`는 허용 목록 검증. 동적 필터 변경 시에도 동일 패턴을 유지할 것. |
| 세션·쿠키 | `@supabase/ssr` + 쿠키 기반이며, 미인증 시 `/entries` 접근은 미들웨어에서 `/login?next=…`로 유도. `next`는 `login` 액션·콜백에서 상대경로(`/` 시작, `//` 거부)로 제한됨. |
| bcrypt | 앱 코드에 bcrypt 없음. 해시·라운드는 Supabase Auth에 위임. 클라이언트 정책은 최소 길이 6자 — 조직 정책에 맞게 길이·복잡도를 강화하는 것을 권장. |
