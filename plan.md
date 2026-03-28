# 나만의 일기장 — 개발 계획 (plan.md)

> `spec.md` 기준 Phase 1 구현 순서. 체크리스트로 진행 상황을 추적한다.

---

## Step 1. 프로젝트 초기 설정

- [ ] Next.js + TypeScript 프로젝트 생성 (`create-next-app`)
- [ ] Tailwind CSS 설정 확인
- [ ] 프로젝트 폴더 구조 생성 (`app/`, `lib/`, `types/` 등)
- [ ] Supabase 클라이언트 설정 (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- [ ] 환경 변수 파일 구성 (`.env.local` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## Step 2. Supabase DB 테이블 생성

- [ ] `entries` 테이블 생성 (id, user_id, title, content, mood, created_at, updated_at)
- [ ] FK 제약조건 설정 (`user_id` → `auth.users(id)`, ON DELETE CASCADE)
- [ ] CHECK 제약조건 설정 (`mood` IN ('happy','sad','angry','neutral','excited'))

---

## Step 3. 공통 레이아웃

- [ ] 루트 레이아웃 (`app/layout.tsx`) — HTML 기본 구조, 글로벌 스타일
- [ ] 공통 헤더 컴포넌트 — 로고, 로그인/로그아웃 버튼
- [ ] 인증 상태에 따른 헤더 분기 (로그인 전: 로그인 버튼 / 로그인 후: 로그아웃 버튼)

---

## Step 4. 인증 (회원가입 / 로그인 / 로그아웃)

- [ ] 회원가입 페이지 (`app/signup/page.tsx`) — 이메일·비밀번호 폼, `signUp` 호출
- [ ] 로그인 페이지 (`app/login/page.tsx`) — 이메일·비밀번호 폼, `signInWithPassword` 호출
- [ ] 로그아웃 기능 — 헤더의 로그아웃 버튼, `signOut` 호출
- [ ] 인증 보호 미들웨어 — 비로그인 사용자가 `/entries/*` 접근 시 `/login`으로 리다이렉트

---

## Step 5. 일기 작성

- [ ] 일기 작성 페이지 (`app/entries/new/page.tsx`)
- [ ] 입력 폼 구현 — 제목(text), 본문(textarea), 기분(select)
- [ ] 폼 제출 시 `entries` 테이블에 INSERT
- [ ] 저장 완료 후 상세 페이지로 이동

---

## Step 6. 일기 목록 조회

- [ ] 일기 목록 페이지 (`app/entries/page.tsx`)
- [ ] 사용자의 일기를 최신순으로 조회 (SELECT + ORDER BY created_at DESC)
- [ ] 목록 항목 표시 — 제목, 기분, 작성일
- [ ] 항목 클릭 시 상세 페이지로 이동 (`/entries/[id]`)
- [ ] "새 일기 쓰기" 버튼 → `/entries/new`

---

## Step 7. 일기 상세 조회

- [ ] 일기 상세 페이지 (`app/entries/[id]/page.tsx`)
- [ ] 일기 전체 내용 표시 — 제목, 본문, 기분, 작성일, 수정일
- [ ] 수정 버튼 → `/entries/[id]/edit`
- [ ] 삭제 버튼 (확인 다이얼로그 포함)

---

## Step 8. 일기 수정

- [ ] 일기 수정 페이지 (`app/entries/[id]/edit/page.tsx`)
- [ ] 기존 데이터를 폼에 미리 채우기
- [ ] 폼 제출 시 `entries` 테이블 UPDATE (`updated_at` 포함)
- [ ] 저장 완료 후 상세 페이지로 이동

---

## Step 9. 일기 삭제

- [ ] 상세 페이지의 삭제 버튼 클릭 → 확인 다이얼로그
- [ ] 확인 시 `entries` 테이블 DELETE
- [ ] 삭제 완료 후 목록 페이지(`/entries`)로 이동

---

## Step 10. 홈 페이지 & 마무리

- [ ] 랜딩 페이지 (`app/page.tsx`) — 서비스 소개, 로그인/회원가입 링크
- [ ] 전체 페이지 UI 다듬기 (여백, 반응형, 빈 상태 메시지 등)
- [ ] 에러 처리 확인 (폼 유효성 검사, API 에러 메시지 표시)
