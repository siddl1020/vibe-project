# Next.js + Supabase 성능 감사 보고서

**대상**: `frontend/` (Next.js App Router, `@supabase/ssr`)  
**기준**: 프로젝트 스킬(리렌더링·데이터 페칭·번들·이미지/폰트·select)  
**일자**: 2026-03-28

## 요약

쿠키 기반 세션은 **전 경로 정적 캐시**를 제한하는 편이며, 현재는 미들웨어에서 매 요청 `getUser()`를 호출하고, 같은 HTTP 요청의 RSC 트리에서 **Header와 여러 페이지가 각각 다시 `getUser()`**를 호출해 Supabase Auth 라운드트립이 누적됩니다. 목록 쿼리에는 **limit/페이지네이션**이 없고, 상세·수정은 `.select('*')`를 사용합니다. 번들은 가볍고, `next/font`(Geist)는 적용되어 있습니다.

## 이슈 표

| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | High | `frontend/middleware.ts`, `frontend/components/Header.tsx`, `frontend/app/entries/page.tsx`, `frontend/app/entries/[id]/page.tsx`, `frontend/app/entries/[id]/edit/page.tsx` | `auth.getUser()` 호출 | 미들웨어(Edge)에서 1회, 동일 요청의 RSC에서 Header·페이지가 각각 다시 `getUser()`를 호출해 **요청당 최대 3회** 수준의 Auth 조회가 발생할 수 있음. | RSC 트리 안에서는 `React.cache`로 `getUser`(또는 세션) 조회를 **한 번만** 수행하도록 공통 헬퍼로 감싼 뒤 Header·페이지에서 재사용한다. 미들웨어는 세션 갱신·보호용으로 유지하되, 불필요한 중복을 줄이려면 문서화된 Supabase SSR 패턴과 트레이드오프(Edge vs Node)를 검토한다. |
| 2 | Medium | `frontend/app/entries/page.tsx` | 목록 `query.order(...)` (`.select` 이후) | 로그인 사용자의 일기를 **전부** 가져오며 `limit` / `range` / 페이지네이션 없음. 검색 시 `title`·`content` `ilike`로 본문까지 스캔. | `limit`+`range`(또는 키셋 페이지네이션)으로 페이지 크기를 고정하고, 필요 시 “더 보기”·페이지 UI를 추가한다. 데이터가 커지면 검색은 전문 검색·별도 인덱스 전략을 검토한다. |
| 3 | Medium | `frontend/app/entries/[id]/page.tsx`, `frontend/app/entries/[id]/edit/page.tsx` | `.select("*")` | 현재 스키마가 작아 체감은 작을 수 있으나, 컬럼 증가 시 **불필요 필드**와 응답 크기가 함께 커짐. | `id, user_id, title, content, mood, created_at, updated_at` 등 화면에 필요한 컬럼만 명시한다. |
| 4 | Medium | `frontend/lib/supabase/client.ts` | 모듈 전체 | `createBrowserClient` 래퍼가 저장소 내 **다른 파일에서 import되지 않음**(미사용). | 클라이언트에서 Supabase를 쓸 계획이 없으면 파일을 제거하거나, 실제 사용처가 생길 때까지 README/주석으로 의도를 밝힌다(유지보수·혼동 방지). |

## 리렌더링·클라이언트 컴포넌트

| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| — | — | `LoginForm.tsx`, `SignupForm.tsx`, `NewEntryForm.tsx`, `EditEntryForm.tsx` | `useEffect` + `useActionState` | 오류 시 `scrollTo`만 수행, 의존성은 `state?.error` 등으로 좁음. | 과도한 메모이제이션 없이 현 상태로 무방. 폼은 제어 컴포넌트 패턴(`EditEntryForm`의 `useState`)이 자연스러움. |

(별도 이슈 행 없음 — 규모상 `memo`/`useCallback` 강제 권고는 하지 않음.)

## 잘 된 점 (짧게)

- **목록 API**: `entries/page.tsx`에서 `id, title, mood, created_at`만 선택해 리스트 페이로드를 줄임.
- **폰트**: `app/layout.tsx`에서 `next/font/google`(Geist) 사용, CLS 완화에 유리.
- **의존성**: `next`, `react`, `@supabase/*` 위주로 번들이 단순함; 무거운 차트/UI 라이브러리 없음.
- **이미지**: 앱 내 `<img>` / `next/image` 사용처 없음 — 텍스트 중심 UI로 LCP 이미지 이슈 없음.
- **N+1**: 목록 후 항목별 추가 `select` 패턴은 보이지 않음.
