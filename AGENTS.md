# 프로젝트 규칙 (AI / 에이전트용)

이 문서는 이 저장소에서 코드를 작성·수정할 때 **반드시 따를 기준**이다. 사용자가 매번 스택과 스타일을 설명하지 않아도 되도록 유지한다.

---

## 기술 스택 (고정)

| 영역 | 선택 |
|------|------|
| 프레임워크 | **Next.js** — **App Router** (`app/` 디렉터리)만 사용 |
| 언어 | **TypeScript** (`.ts` / `.tsx`) — JavaScript 기본 파일 생성 금지 |
| 스타일 | **Tailwind CSS** — 유틸리티 클래스 기반 스타일링 |
| 데이터베이스 / 백엔드 | **Supabase** (클라이언트·서버에서 공식 패턴 사용) |

---

## 반드시 지킬 것 (DO)

- **App Router**로 라우팅한다. 페이지는 `app/` 아래 `page.tsx`, 레이아웃은 `layout.tsx`, API는 **Route Handlers** `route.ts`를 사용한다. `pages/` 디렉터리 기반 Pages Router는 쓰지 않는다.
- **TypeScript**로만 작성한다. 타입은 `interface` 또는 `type`으로 명시하고, `any`는 정말 불가피할 때만 최소 범위로 사용한다.
- **Tailwind CSS**로 UI를 만든다. 공통 스타일은 `@apply`보다 **컴포넌트 추출** 또는 **Tailwind 설정/테마**로 맞춘다.
- **Supabase**와 연동할 때는 환경 변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 등)를 사용하고, 서버 전용 키는 **서버 컴포넌트·Route Handler·Server Actions**에만 둔다. 클라이언트에 노출하면 안 되는 값은 `NEXT_PUBLIC_` 접두어를 붙이지 않는다.
- **서버/클라이언트 경계**를 구분한다. 브라우저 API·`useState` 등이 필요하면 파일 상단에 `'use client'`를 붙이고, 기본은 서버 컴포넌트를 우선한다.
- Next.js **권장 패턴**을 따른다: `next/image`, `next/link`, 메타데이터 API(`metadata` / `generateMetadata`) 등.
- 새 의존성을 제안할 때는 **이유**를 한 줄이라도 적고, 스택과 중복되지 않는지 확인한다.

---

## 하면 안 되는 것 (DON'T)

- **Pages Router** (`pages/`, `getServerSideProps`, `getStaticProps` 전용 구조 등)로 새 기능을 만들지 않는다.
- **순수 JavaScript** (`.js` / `.jsx`)로 새 파일을 추가하지 않는다. 기존 레거시가 없다면 TypeScript만 사용한다.
- **인라인 스타일**이나 **CSS Modules / styled-components 등**으로 새 UI를 구성하지 않는다. (프로젝트에 이미 도입된 경우가 아니라면 Tailwind만 사용.)
- **Supabase 대신** Prisma + Postgres 직접 연결, Firebase, MongoDB 등 **다른 DB/백엔드**로 바꾸는 제안을 기본 스택으로 삼지 않는다. (사용자가 명시적으로 요청한 경우만 예외.)
- **시크릿·서비스 롤 키**를 클라이언트 번들이나 `NEXT_PUBLIC_` 변수에 넣지 않는다.
- **불필요한 `'use client'`**로 전체 레이아웃이나 큰 트리를 감싸지 않는다. 필요한 최소 컴포넌트에만 붙인다.
- 사용자가 요청하지 않은 **대규모 리팩터·무관한 파일 수정**을 하지 않는다.

---

## 요약 한 줄

> Next.js **App Router** + **TypeScript** + **Tailwind CSS** + **Supabase**; 서버/클라이언트와 시크릿 경계를 지키고, Pages Router·순수 JS·Tailwind 외 스타일·다른 DB를 기본으로 쓰지 않는다.
