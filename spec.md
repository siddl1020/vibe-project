# 나만의 일기장 — 기능 명세서 (spec.md)

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 이름 | 나만의 일기장 |
| 목적 | 개인용 일기를 작성·관리할 수 있는 웹 애플리케이션 |
| 대상 사용자 | 하루를 기록하고 싶은 개인 사용자 |

---

## 2. 기술 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js — App Router (`app/` 디렉터리) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 데이터베이스 / 인증 | Supabase (Database + Auth) |

---

## 3. 기능별 상세 설명 (Phase 1)

### 3-1. 회원가입

| 항목 | 내용 |
|------|------|
| 페이지 경로 | `/signup` |
| 동작 | 이메일과 비밀번호를 입력하여 신규 계정을 생성한다. |
| Supabase 기능 | `supabase.auth.signUp({ email, password })` |
| 비고 | 가입 완료 후 로그인 페이지로 이동한다. |

### 3-2. 로그인

| 항목 | 내용 |
|------|------|
| 페이지 경로 | `/login` |
| 동작 | 이메일과 비밀번호로 인증한다. |
| Supabase 기능 | `supabase.auth.signInWithPassword({ email, password })` |
| 비고 | 로그인 성공 시 일기 목록(`/entries`)으로 이동한다. 비로그인 사용자가 보호 경로에 접근하면 이 페이지로 리다이렉트한다. |

### 3-3. 로그아웃

| 항목 | 내용 |
|------|------|
| 동작 | 현재 세션을 종료한다. |
| Supabase 기능 | `supabase.auth.signOut()` |
| 비고 | 로그아웃 후 로그인 페이지로 이동한다. |

### 3-4. 일기 작성

| 항목 | 내용 |
|------|------|
| 페이지 경로 | `/entries/new` |
| 동작 | 제목, 본문, 기분을 입력하여 새 일기를 저장한다. |
| Supabase 기능 | `supabase.from('entries').insert({ user_id, title, content, mood })` |
| 입력 필드 | **제목**(text, 필수), **본문**(textarea, 필수), **기분**(select, 필수 — happy · sad · angry · neutral · excited) |
| 비고 | 저장 완료 후 해당 일기 상세 페이지로 이동한다. |

### 3-5. 일기 목록 조회

| 항목 | 내용 |
|------|------|
| 페이지 경로 | `/entries` |
| 동작 | 로그인한 사용자의 일기를 최신순(날짜 내림차순)으로 표시한다. |
| Supabase 기능 | `supabase.from('entries').select('*').eq('user_id', userId).order('created_at', { ascending: false })` |
| 표시 항목 | 제목, 기분, 작성일 |
| 비고 | 각 항목을 클릭하면 상세 페이지로 이동한다. |

### 3-6. 일기 상세 조회

| 항목 | 내용 |
|------|------|
| 페이지 경로 | `/entries/[id]` |
| 동작 | 선택한 일기의 전체 내용을 표시한다. |
| Supabase 기능 | `supabase.from('entries').select('*').eq('id', id).single()` |
| 표시 항목 | 제목, 본문, 기분, 작성일, 수정일 |
| 비고 | 수정 버튼(→ `/entries/[id]/edit`)과 삭제 버튼을 포함한다. |

### 3-7. 일기 수정

| 항목 | 내용 |
|------|------|
| 페이지 경로 | `/entries/[id]/edit` |
| 동작 | 기존 일기의 제목, 본문, 기분을 수정한다. |
| Supabase 기능 | `supabase.from('entries').update({ title, content, mood, updated_at }).eq('id', id)` |
| 비고 | 저장 완료 후 해당 일기 상세 페이지로 이동한다. |

### 3-8. 일기 삭제

| 항목 | 내용 |
|------|------|
| 동작 | 일기 상세 페이지에서 삭제 버튼을 눌러 일기를 제거한다. 확인 다이얼로그를 표시한다. |
| Supabase 기능 | `supabase.from('entries').delete().eq('id', id)` |
| 비고 | 삭제 완료 후 일기 목록(`/entries`)으로 이동한다. |

---

## 4. DB 테이블 스키마

### `entries` 테이블

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| `id` | `uuid` | PK, `default gen_random_uuid()` | 일기 고유 ID |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | 작성자 |
| `title` | `text` | NOT NULL | 일기 제목 |
| `content` | `text` | NOT NULL | 일기 본문 |
| `mood` | `text` | NOT NULL, CHECK (`mood` IN ('happy','sad','angry','neutral','excited')) | 기분 |
| `created_at` | `timestamptz` | NOT NULL, `default now()` | 작성일시 |
| `updated_at` | `timestamptz` | NOT NULL, `default now()` | 수정일시 |
---

## 5. 페이지 구조

```
app/
├── layout.tsx              # 루트 레이아웃 (공통 헤더·인증 Provider)
├── page.tsx                # 랜딩 / 홈
├── login/
│   └── page.tsx            # 로그인
├── signup/
│   └── page.tsx            # 회원가입
└── entries/
    ├── page.tsx            # 일기 목록
    ├── new/
    │   └── page.tsx        # 일기 작성
    └── [id]/
        ├── page.tsx        # 일기 상세
        └── edit/
            └── page.tsx    # 일기 수정
```
