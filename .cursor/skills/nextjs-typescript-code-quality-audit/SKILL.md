---
name: nextjs-typescript-code-quality-audit
description: Reviews the codebase as a senior Next.js/TypeScript architect for duplication, oversized functions/components (50+ lines, SRP), typing (any, loose types), naming consistency, and unnecessary dependencies (unused imports, props drilling). Outputs a Korean findings table with High/Medium/Low priority. Use when the user asks for a structural/code-quality audit, maintainability review, or architecture-style pass without code changes.
---

# Next.js + TypeScript 코드 품질·구조 점검 (시니어 소프트웨어 아키텍트 역할)

## 역할

에이전트는 **Next.js와 TypeScript에 정통한 시니어 소프트웨어 아키텍트** 관점에서 저장소를 읽고 점검한다. 사용자가 **리포트만** 요청하면 **코드를 수정하지 않고** 아래 출력 형식의 표로만 보고한다.

## 점검 항목 (필수)

1. **코드 중복**: 동일·유사 로직이 여러 파일에 산재했는지(복붙 유틸, 반복되는 검증·포맷·fetch 래핑, 동일 UI 패턴의 미추출 등).
2. **함수·컴포넌트 크기**: 단일 파일·단일 함수·단일 컴포넌트가 **50줄 이상**으로 비대한지, **단일 책임 원칙(SRP)**을 벗어나 여러 관심사(데이터 로드 + 폼 + 레이아웃 등)를 한 덩어리로 묶었는지.
3. **타입 정의**: `any` 사용, 과도한 `unknown`/`Record<string, unknown>`만으로 끝나는 느슨한 타입, API·props·DB 행에 대한 **누락된 인터페이스/`type`**, `as` 남용으로 타입을 무력화하는 패턴.
4. **네이밍 일관성**: 함수명·변수명·파일명이 프로젝트 컨벤션(camelCase/PascalCase, `kebab-case` 파일 등)과 어긋나는지, 동일 개념에 다른 용어가 혼용되는지.
5. **불필요한 의존성**: **사용하지 않는 import**, 죽은 코드 경로, 과도한 **props drilling**(깊은 트리로만 내려가는 값이면 컨텍스트·서버 데이터 합성·작은 상태 끌어올리기 등 대안을 권고할 수 있음).

## 우선순위 기준

- **High**: 유지보수·버그·온보딩 비용에 직접적인 영향(광범위 중복, 명백한 SRP 붕괴, `any`로 계약이 깨짐, 심한 네이밍 혼선).
- **Medium**: 규모가 커지면 문제가 되는 구조, 국소적 중복, 약한 타입, 불필요 import 다수.
- **Low**: 스타일·일관성·미세 리팩터 후보, 취향에 가까운 개선.

## 출력 형식 (사용자가 다른 형식을 지정하지 않은 경우)

**단일 마크다운 표**로 모든 이슈를 나열한다. 이슈가 없으면 한 행으로 요약한다.

```markdown
| 일련번호 | 우선순위 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
```

- **파일**: 저장소 기준 상대 경로(예: `frontend/app/page.tsx`).
- **위치**: 줄 번호 또는 개념적 위치(예: `useEffect` 블록, 특정 컴포넌트 본문).
- **문제**: 짧은 사실 서술.
- **권고사항**: 추출·분리·타입 도입·네이밍 정리 등 **실행 가능한** 한 줄 이상 권고.

## 워크플로

1. `app/`, `components/`, `lib/` 등 앱 루트를 프로젝트 구조에 맞게 훑고, **중복 문자열·함수 시그니처**를 검색(`grep`/시맨틱 검색)해 후보를 모은다.
2. **50줄 이상** 파일·함수·컴포넌트는 열어 SRP 위반 여부를 판단한다(기계적 50줄만이 아니라 책임 경계를 우선한다).
3. `any`, `eslint-disable` `@typescript-eslint`, 넓은 `Record`, 암시적 `any` 후보를 검색한다.
4. import 목록과 실제 참조를 대조해 **미사용 import**를 표에 넣을 수 있으면 넣는다.
5. **리포트만** 요청된 경우 **파일을 수정하지 않는다**.

## 스택 가정

이 저장소는 **Next.js App Router**, **TypeScript**, **Tailwind**, **Supabase**를 기본으로 한다. 점검 시 `AGENTS.md`의 서버/클라이언트 경계·시크릿 규칙과 **충돌하지 않는** 구조 개선만 권고한다(스택 교체 제안은 기본으로 하지 않음).
