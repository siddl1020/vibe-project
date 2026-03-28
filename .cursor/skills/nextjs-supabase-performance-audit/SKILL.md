---
name: nextjs-supabase-performance-audit
description: Audits Next.js App Router and Supabase apps for render efficiency, data fetching (N+1, duplication, caching), bundle size, next/image and font usage, and Supabase select projections. Outputs a Korean findings table with Critical/High/Medium severity. Use when the user asks for a performance review, Web Vitals-related code audit, or optimization pass for this stack.
---

# Next.js + Supabase 성능 감사

## 역할

에이전트는 **시니어 성능 엔지니어** 관점에서 코드를 읽고, 아래 범위를 점검한다. 사용자가 **리포트만** 요청하면 파일을 수정하지 않는다.

## 감사 항목 (필수)

1. **리렌더링**: 클라이언트 컴포넌트의 `useEffect` 의존성 배열, 불필요한 `useState` 이중화, 큰 자식에 대한 `memo`/`useCallback` 필요 여부(과도한 메모이제이션 권장은 하지 않음).
2. **데이터 페칭**: N+1(목록 후 건별 쿼리), 동일 요청 내 `getUser()` 등 **중복 호출**, `fetch`/`unstable_cache`/`React.cache` 활용 가능성, 페이지네이션 부재로 인한 대량 조회.
3. **번들**: 무거운 라이브러리 전역 import, 코드 스플릿 후보(`next/dynamic`), **사용되지 않는 모듈**(예: 미참조 `lib/supabase/client.ts`).
4. **이미지·폰트**: `next/image` 대신 `<img>` 여부, LCP 후보, `next/font` 사용 여부 및 CLS 관련 마크업.
5. **API/Supabase 응답**: `.select('*')` vs 명시 컬럼, 목록 쿼리에 불필요한 큰 필드 포함 여부.

## 심각도

- **Critical**: 프로덕션에서 확실한 대규모 장애·비용 폭증(예: 무제한 전 테이블 스캔 패턴).
- **High**: 누적 시 지연·쿼터·비용에 큰 영향(예: 요청당 반복되는 동일 Auth/DB 라운드트립).
- **Medium**: 개선 여지·모범 사항·규모 확대 시 병목.

## 출력 형식

다음 마크다운 표로 정리한다. 이슈가 없으면 한 행으로 요약하고, 잘 된 점은 짧게 bullet로 덧붙일 수 있다.

```markdown
| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
```

## 워크플로

1. `middleware.ts`, 루트 `layout.tsx`, 공통 레이아웃 컴포넌트(예: `Header`)에서 **인증·세션 조회**가 페이지와 중복되는지 확인한다.
2. `grep` 또는 검색: `.select(`, `useEffect`, `next/image`, `from "next/font`, `dynamic(`.
3. Supabase 호출은 **한 화면에 여러 번** 같은 리소스를 가져오는지, 목록 쿼리에 **페이지네이션/limit**이 있는지 본다.
4. **리포트만** 요청 시 코드 변경을 하지 않는다.

## 스택 가정

Next.js **App Router**, Supabase **JS + SSR(`@supabase/ssr`)**, 서버 컴포넌트 기본. 쿠키 기반 세션은 전체 라우트 **정적 캐시**를 제한할 수 있음을 필요 시 한 줄로 언급한다.
