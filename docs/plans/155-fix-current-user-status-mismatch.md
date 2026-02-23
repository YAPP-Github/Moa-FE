# [#155] Fix: currentUserStatus 값 불일치로 임시저장/제출 에러 발생

## 1. Overview

서버 API(`GET /api/v1/retrospects/{retrospectId}`)의 `currentUserStatus` 응답 값이 `NOT_JOINED`에서 `NOT_PARTICIPATED`로 변경되었으나, 프론트엔드 코드가 여전히 `NOT_JOINED`을 기대하고 있어 회고 임시저장/제출 에러가 발생하고 있다.

서버 측에서 member에 상태를 추가하는 작업 과정에서 enum 값이 변경된 것으로 추정.

## 2. Requirements

### 기능 요구사항
- **FR-1**: `currentUserStatus` 타입을 서버 응답에 맞게 `NOT_PARTICIPATED`로 변경
- **FR-2**: 회고 작성 페이지에서 참가자 자동 등록이 정상 동작해야 함
- **FR-3**: 임시저장/제출이 에러 없이 동작해야 함

## 3. Architecture & Design

단순 enum 값 변경이므로 아키텍처 변경 없음. `NOT_JOINED` → `NOT_PARTICIPATED` 문자열 교체.

## 4. Implementation Plan

### 변경 파일 목록

| # | 파일 | 변경 내용 |
|---|------|----------|
| 1 | `src/features/retrospective/model/types.ts:113` | 타입 `'NOT_JOINED'` → `'NOT_PARTICIPATED'` |
| 2 | `src/pages/retrospective-write/ui/WritePageContent.tsx:100-102` | 비교 문자열 + 주석 변경 |
| 3 | `src/shared/api/mocks/fixtures/retrospective.ts:102,211,247` | mock 타입 및 데이터 변경 |
| 4 | `src/shared/api/mocks/handlers/retrospective.ts:41` | fallback mock 데이터 변경 |

### 변경하지 않는 파일
- `src/shared/api/generated/index.ts` — Orval 자동 생성 파일 (참조용, 직접 수정 X)

## 5. Quality Gates

- [x] `pnpm run build` 성공
- [x] `pnpm tsc --noEmit` 통과
- [x] `pnpm run lint` 통과
- [x] 모든 `NOT_JOINED` 참조가 `NOT_PARTICIPATED`로 변경됨

## 6. Risks & Dependencies

- **Low Risk**: 단순 문자열 값 변경이므로 사이드 이펙트 최소
- **Dependency**: 서버 API가 실제로 `NOT_PARTICIPATED`를 반환하는지 확인 필요 (사용자가 확인 완료)
