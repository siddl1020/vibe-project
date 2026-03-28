---
name: owasp-security-audit
description: Performs OWASP-aligned security audits focused on SQL injection, session safety, error disclosure, and bcrypt/password hashing rules. Produces a Korean findings table (Critical/High/Medium). Use when the user requests a security review, OWASP audit, penetration-style code review, or compliance check for the vibe-project stack (Next.js, Supabase).
---

# OWASP 중심 보안 감사 (시니어 보안 아키텍트 역할)

## 역할

에이전트는 **OWASP Top 10 및 관련 실무 기준**에 맞춰 코드·설정을 검토한다. 사용자가 **코드 수정 없이 리포트만** 요청하면 변경 제안은 하지 않고 표 형식으로만 보고한다.

## 감사 범위 (필수 체크)

1. **SQL 인젝션**: Raw SQL 문자열 연결, 템플릿 리터럴로 쿼리 조립, ORM/클라이언트에서의 비바인딩 입력. **Supabase/PostgREST** 사용 시 `.eq()`, `.insert()` 등 바인딩과 `.or()`·필터 문자열에 사용자 입력 삽입 여부를 구분해 평가한다.
2. **세션 관리**: 쿠키/JWT 저장 방식, 만료·갱신, OAuth 코드 교환, `next` 등 리다이렉트 파라미터 검증, 토큰 재사용 가능성(커스텀 구현 시).
3. **에러·정보 유출**: 스택 트레이스, DB/스키마/제약조건 메시지, 업스트림 `error.message`를 사용자·URL에 그대로 노출하는지.
4. **Bcrypt 규칙**: 코드에 `bcrypt` 사용 시 `saltRounds` ≥ 12, 평문 해시 직접 비교 금지. **미사용 시** 비밀번호 처리 위치(Supabase Auth 등)와 클라이언트 비밀번호 정책만 짧게 언급한다.

## 심각도

- **Critical**: 즉시 악용 가능한 인증 우회, 광범위 데이터 유출, 원격 코드 실행 등.
- **High**: 기밀 노출·계정 위험·명확한 인젝션/인증 취약점.
- **Medium**: 정보 유출·정책 미흡·방어 심화 권고.

## 출력 형식 (사용자가 다른 형식을 지정하지 않은 경우)

다음 **한 개의 마크다운 표**로 모든 이슈를 나열한다. 이슈가 없으면 한 행으로 "해당 영역에서 코드상 확인된 문제 없음"을 적되, 외부 설정(Supabase 대시보드 등) 점검은 권고 행으로 분리할 수 있다.

```markdown
| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
```

- **파일**: 저장소 기준 상대 경로.
- **위치**: 줄 번호 또는 개념적 위치(예: `login` 액션 내 오류 처리).
- **문제**: 짧은 사실 서술.
- **권고사항**: 구체적이고 실행 가능한 완화책.

## 워크플로

1. `frontend/` 및 공유 `lib`·`middleware`·`app/**/actions.ts`·`route.ts`를 우선 검색한다.
2. `grep` 또는 검색으로 `bcrypt`, `raw`, `.or(`, `error.message`, `redirect`, `searchParams` 패턴을 확인한다.
3. Supabase 사용 프로젝트는 **서비스 롤 키·anon 키 노출**은 기존 `AGENTS.md` 규칙과 중복되면 한 줄로만 교차 참조한다.
4. 리포트만 요청된 경우 **파일을 수정하지 않는다**.

## 참고 (스택)

이 저장소는 Next.js App Router + Supabase 클라이언트가 기본이므로, "parameterized query"는 **PostgREST/Supabase JS의 메서드 체인**과 **필터 문자열 조립**을 구분해 서술한다.
