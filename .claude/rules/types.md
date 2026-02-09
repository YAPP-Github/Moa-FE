# 타입 컨벤션

- 목표: 명확한 타입 경계, 예측 가능한 네이밍, import 구분

## 네이밍

- `PascalCase` for `type`/`interface`
- `camelCase` for 변수/함수, `SCREAMING_SNAKE_CASE` for 상수
- `enum` 지양 → `as const` 객체 + 유니온

## 파일/모듈

- 도메인 타입: `*.types.ts`
- 스키마/밸리데이션: `*.schema.ts`
- 타입 전용 import: `import type { Foo } from './foo.types'`

## 선택 기준

- `type`: 유니온/인터섹션/Utility 조합
- `interface`: 외부 노출·확장 전제 구조

## 기타

- 함수 반환 타입 명시(공용 API는 필수), `never`로 불가능 상태 명시.
- `unknown`으로 입력 수용 후 좁히기, `any` 사용 금지.
- 불변성: `readonly` 속성, `ReadonlyArray<T>` 우선.
- 입력/출력 타입 분리(`*Input`, `*Response`), UI 파생 타입은 도메인 타입을 조합해 생성.
- React 컴포넌트 prop 타입은 도메인 타입을 import 후 확장/선택하여 선언, `children` 명시.
- 유틸 타입 사용 예: `Pick/Partial/Omit` 대신 구체 타입 설계 우선, 공용 Utility는 `shared/lib`에 배치.\*\*\*
