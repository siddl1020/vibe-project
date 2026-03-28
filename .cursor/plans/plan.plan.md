---
name: 나만의 일기장 개발 계획
overview: spec.md + api-spec.md 기반. 0단계(초기 셋업) → 1단계(목업) → 2단계(실제 구현) 순서로 진행한다. 1단계가 완전히 끝나기 전에는 절대 2단계로 넘어가지 않는다.
todos:
  - id: step0-setup
    content: "0단계: 프로젝트 초기 셋업 (create-next-app, 폴더 구조, 타입, mockData)"
    status: completed
  - id: step1a-layout-home
    content: "섹션 1-A: 공통 레이아웃 및 홈 (layout.tsx, Header, 랜딩 페이지)"
    status: completed
  - id: step1b-auth-ui
    content: "섹션 1-B: 인증 페이지 UI (로그인, 회원가입 폼 — 실제 인증 없음)"
    status: completed
  - id: step1c-entry-list
    content: "섹션 1-C: 일기 목록 페이지 (mockData → 리스트 표시)"
    status: completed
  - id: step1d-entry-new
    content: "섹션 1-D: 일기 작성 페이지 (폼 + console.log)"
    status: completed
  - id: step1e-entry-detail
    content: "섹션 1-E: 일기 상세 페이지 (조회, 수정/삭제 버튼)"
    status: completed
  - id: step1f-entry-edit
    content: "섹션 1-F: 일기 수정 페이지 (기존 데이터 미리 채움 + console.log)"
    status: completed
  - id: step1g-flow-check
    content: "섹션 1-G: 전체 플로우 점검 및 UI 다듬기"
    status: completed
  - id: step2a-supabase-db
    content: "섹션 2-A: Supabase 프로젝트 및 DB 설정 (MCP, entries 테이블)"
    status: completed
  - id: step2b-supabase-client
    content: "섹션 2-B: Supabase 클라이언트 설정 (패키지, env, server/client)"
    status: completed
  - id: step2c-auth-impl
    content: "섹션 2-C: 인증 구현 (Server Actions, 미들웨어, 에러 표시)"
    status: completed
  - id: step2d-crud-impl
    content: "섹션 2-D: 일기 CRUD 구현 (mockData → Supabase 교체)"
    status: completed
  - id: step2e-final
    content: "섹션 2-E: 마무리 및 검증 (전체 플로우, 에러 처리, UI 점검)"
    status: completed
isProject: true
---

# 나만의 일기장 — 개발 계획 ([plan.md](http://plan.md))

> spec.md + api-spec.md 기반. 0단계 → 1단계 → 2단계 순서로 진행한다.

---

## 규칙

- **1단계가 완전히 끝나기 전에는 절대 2단계로 넘어가지 않는다.**
- 각 섹션(1-A, 1-B, ... / 2-A, 2-B, ...) 완료 후 반드시 멈추고 사용자에게 다음 진행 여부를 확인한다.

---

## 0단계: 프로젝트 초기 셋업

- `frontend/` 폴더에 `create-next-app` 실행 (App Router, TypeScript, Tailwind CSS)
- 불필요한 보일러플레이트 정리 (기본 페이지 내용 비우기 등)
- 폴더 구조 생성: `types/`, `lib/`, `data/`
- 타입 정의 파일 생성: `types/index.ts` (`Entry`, `EntryListItem`, `ActionResult`)
- 목 데이터 파일 생성: `data/mockData.ts` (3~5건의 하드코딩 일기 + 목 유저 정보)

---

## 1단계: 목업 (Mock Data 기반, Supabase 연동 없음)

데이터는 `mockData.ts`에서 가져오고, 폼 제출은 `console.log` 또는 로컬 state로 처리한다.

### 섹션 1-A: 공통 레이아웃 및 홈

- 루트 레이아웃 (`app/layout.tsx`) — HTML 기본 구조, 글로벌 폰트/스타일
- 헤더 컴포넌트 (`components/Header.tsx`) — 로고("나만의 일기장"), 로그인/로그아웃 버튼 (목업: 항상 로그인 상태로 표시)
- 랜딩 페이지 (`app/page.tsx`) — 서비스 소개 텍스트, "시작하기" 버튼 → `/entries`로 이동

> **완료 후 멈추고 확인**

### 섹션 1-B: 인증 페이지 (UI만)

- 로그인 페이지 (`app/login/page.tsx`) — 이메일/비밀번호 폼, 제출 시 `/entries`로 이동 (실제 인증 없음)
- 회원가입 페이지 (`app/signup/page.tsx`) — 이메일/비밀번호 폼, 제출 시 `/login`으로 이동 (실제 가입 없음)
- 로그인 ↔ 회원가입 간 링크 연결

> **완료 후 멈추고 확인**

### 섹션 1-C: 일기 목록 페이지

- 일기 목록 페이지 (`app/entries/page.tsx`) — mockData에서 일기 배열을 읽어 리스트 표시
- 목록 항목에 제목, 기분, 작성일 표시
- 각 항목 클릭 시 `/entries/[id]`로 이동
- "새 일기 쓰기" 버튼 → `/entries/new`

> **완료 후 멈추고 확인**

### 섹션 1-D: 일기 작성 페이지

- 일기 작성 페이지 (`app/entries/new/page.tsx`) — 제목(text), 본문(textarea), 기분(select) 폼
- 기분 선택지: happy, sad, angry, neutral, excited
- 제출 시 `console.log`로 입력값 출력 후 `/entries`로 이동
- 취소 버튼 → `/entries`로 이동

> **완료 후 멈추고 확인**

### 섹션 1-E: 일기 상세 페이지

- 일기 상세 페이지 (`app/entries/[id]/page.tsx`) — mockData에서 id로 일기 조회, 전체 내용 표시
- 표시: 제목, 본문, 기분, 작성일, 수정일
- "수정" 버튼 → `/entries/[id]/edit`
- "삭제" 버튼 → 확인 다이얼로그 후 `/entries`로 이동 (실제 삭제 없음)
- 목록으로 돌아가기 링크

> **완료 후 멈추고 확인**

### 섹션 1-F: 일기 수정 페이지

- 일기 수정 페이지 (`app/entries/[id]/edit/page.tsx`) — mockData에서 기존 데이터를 폼에 미리 채움
- 제목, 본문, 기분 수정 가능
- 제출 시 `console.log`로 수정값 출력 후 `/entries/[id]`로 이동
- 취소 버튼 → `/entries/[id]`로 이동

> **완료 후 멈추고 확인**

### 섹션 1-G: 전체 플로우 점검

- 홈 → 로그인 → 목록 → 작성 → 상세 → 수정 → 삭제 흐름이 모두 클릭으로 연결되는지 확인
- UI 다듬기 (여백, 반응형, 빈 상태 메시지)

> **1단계 완료 — 사용자 확인 후에만 2단계 진행**

---

## 2단계: 실제 구현 (Supabase 연동)

mockData를 Supabase 호출로 교체한다. Supabase 작업은 **Supabase MCP**를 사용하며, 프로젝트 이름은 **vibe-tutorial**이다.

### 섹션 2-A: Supabase 프로젝트 및 DB 설정

- Supabase MCP를 통해 `vibe-tutorial` 프로젝트 확인/연결
- `entries` 테이블 생성 (id, user_id, title, content, mood, created_at, updated_at)
- FK 제약조건 (`user_id` → `auth.users(id)`, ON DELETE CASCADE)
- CHECK 제약조건 (`mood` IN ('happy','sad','angry','neutral','excited'))

> **완료 후 멈추고 확인**

### 섹션 2-B: Supabase 클라이언트 설정

- `@supabase/supabase-js`, `@supabase/ssr` 패키지 설치
- 환경 변수 구성 (`.env.local` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- 서버용 Supabase 클라이언트 (`lib/supabase/server.ts` — `createServerClient`)
- 클라이언트용 Supabase 클라이언트 (`lib/supabase/client.ts` — `createBrowserClient`)

> **완료 후 멈추고 확인**

### 섹션 2-C: 인증 구현

- 회원가입 Server Action (`app/signup/actions.ts` — `signup` 함수)
- 로그인 Server Action (`app/login/actions.ts` — `login` 함수)
- 로그아웃 Server Action (`app/actions/auth.ts` — `logout` 함수)
- 인증 미들웨어 (`middleware.ts` — `/entries/`* 보호, 비로그인 시 `/login`으로 redirect)
- 헤더에 실제 로그인 상태 반영 (로그인/로그아웃 버튼 분기)
- 로그인/회원가입 폼에 에러 메시지 표시

> **완료 후 멈추고 확인**

### 섹션 2-D: 일기 CRUD 구현

- 일기 목록 조회 — `app/entries/page.tsx`에서 Supabase SELECT로 교체
- 일기 상세 조회 — `app/entries/[id]/page.tsx`에서 Supabase SELECT + `single()`로 교체, 없는 id는 `notFound()`
- 일기 작성 Server Action (`app/entries/new/actions.ts` — `createEntry` 함수) + 폼 연결
- 일기 수정 Server Action (`app/entries/[id]/edit/actions.ts` — `updateEntry` 함수) + 폼 연결
- 일기 삭제 Server Action (`app/entries/[id]/actions.ts` — `deleteEntry` 함수) + 버튼 연결
- `mockData.ts` import 제거

> **완료 후 멈추고 확인**

### 섹션 2-E: 마무리 및 검증

- 전체 플로우 재검증 (회원가입 → 로그인 → 작성 → 목록 → 상세 → 수정 → 삭제 → 로그아웃)
- 에러 처리 확인 (폼 유효성 검사, API 에러 메시지)
- UI 최종 점검 (로딩 상태, 빈 상태 메시지)

> **2단계 완료**

