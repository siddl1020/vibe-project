# 나만의 일기장 — API 명세서 (api-spec.md)

> `spec.md`의 기능 정의를 기반으로, 서버 ↔ 클라이언트 간 데이터 흐름을 정리한다.

---

## 1. 데이터 접근 방식

| 방식 | 사용 위치 | 설명 |
|------|-----------|------|
| Server Actions | 폼 제출 (작성, 수정, 삭제, 인증) | `'use server'` 함수로 서버에서 Supabase 호출 |
| Server Component 직접 조회 | 목록, 상세 페이지 | 서버 컴포넌트에서 Supabase 클라이언트로 직접 SELECT |

---

## 2. 인증 API

### 2-1. 회원가입

| 항목 | 내용 |
|------|------|
| 방식 | Server Action |
| 파일 | `app/signup/actions.ts` |
| 함수 | `signup(formData: FormData)` |
| 입력 | `email: string`, `password: string` |
| 처리 | `supabase.auth.signUp({ email, password })` |
| 성공 | `/login`으로 redirect |
| 실패 | 에러 메시지 반환 (이메일 중복, 비밀번호 조건 미달 등) |

### 2-2. 로그인

| 항목 | 내용 |
|------|------|
| 방식 | Server Action |
| 파일 | `app/login/actions.ts` |
| 함수 | `login(formData: FormData)` |
| 입력 | `email: string`, `password: string` |
| 처리 | `supabase.auth.signInWithPassword({ email, password })` |
| 성공 | `/entries`로 redirect |
| 실패 | 에러 메시지 반환 (잘못된 이메일/비밀번호) |

### 2-3. 로그아웃

| 항목 | 내용 |
|------|------|
| 방식 | Server Action |
| 파일 | `app/actions/auth.ts` |
| 함수 | `logout()` |
| 처리 | `supabase.auth.signOut()` |
| 성공 | `/login`으로 redirect |

### 2-4. 인증 미들웨어

| 항목 | 내용 |
|------|------|
| 파일 | `middleware.ts` (프로젝트 루트) |
| 보호 경로 | `/entries`, `/entries/*` |
| 동작 | 세션이 없으면 `/login`으로 redirect |
| 비보호 경로 | `/`, `/login`, `/signup` |

---

## 3. 일기 API

### 3-1. 일기 작성 (CREATE)

| 항목 | 내용 |
|------|------|
| 방식 | Server Action |
| 파일 | `app/entries/new/actions.ts` |
| 함수 | `createEntry(formData: FormData)` |
| 입력 | `title: string`, `content: string`, `mood: string` |
| 처리 | `supabase.from('entries').insert({ user_id, title, content, mood })` |
| 성공 | `/entries/[새 id]`로 redirect |
| 실패 | 에러 메시지 반환 (필수 필드 누락 등) |

### 3-2. 일기 목록 조회 (READ — LIST)

| 항목 | 내용 |
|------|------|
| 방식 | Server Component 직접 조회 |
| 파일 | `app/entries/page.tsx` |
| 처리 | `supabase.from('entries').select('id, title, mood, created_at').eq('user_id', userId).order('created_at', { ascending: false })` |
| 반환 | `Array<{ id, title, mood, created_at }>` |

### 3-3. 일기 상세 조회 (READ — SINGLE)

| 항목 | 내용 |
|------|------|
| 방식 | Server Component 직접 조회 |
| 파일 | `app/entries/[id]/page.tsx` |
| 처리 | `supabase.from('entries').select('*').eq('id', id).single()` |
| 반환 | `{ id, user_id, title, content, mood, created_at, updated_at }` |
| 에러 | 존재하지 않는 id → `notFound()` 호출 |

### 3-4. 일기 수정 (UPDATE)

| 항목 | 내용 |
|------|------|
| 방식 | Server Action |
| 파일 | `app/entries/[id]/edit/actions.ts` |
| 함수 | `updateEntry(id: string, formData: FormData)` |
| 입력 | `title: string`, `content: string`, `mood: string` |
| 처리 | `supabase.from('entries').update({ title, content, mood, updated_at: new Date().toISOString() }).eq('id', id)` |
| 성공 | `/entries/[id]`로 redirect |
| 실패 | 에러 메시지 반환 |

### 3-5. 일기 삭제 (DELETE)

| 항목 | 내용 |
|------|------|
| 방식 | Server Action |
| 파일 | `app/entries/[id]/actions.ts` |
| 함수 | `deleteEntry(id: string)` |
| 처리 | `supabase.from('entries').delete().eq('id', id)` |
| 성공 | `/entries`로 redirect |
| 실패 | 에러 메시지 반환 |

---

## 4. 타입 정의

파일: `types/index.ts`

```typescript
export interface Entry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited';
  created_at: string;
  updated_at: string;
}

export type EntryListItem = Pick<Entry, 'id' | 'title' | 'mood' | 'created_at'>;

export interface ActionResult {
  error?: string;
}
```

---

## 5. Supabase 클라이언트 구성

| 파일 | 용도 |
|------|------|
| `lib/supabase/client.ts` | 클라이언트 컴포넌트용 (`createBrowserClient`) |
| `lib/supabase/server.ts` | 서버 컴포넌트 / Server Action용 (`createServerClient`) |

환경 변수:

| 변수 | 노출 범위 |
|------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | 클라이언트 + 서버 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 클라이언트 + 서버 |
