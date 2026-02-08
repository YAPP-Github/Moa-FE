# Task Plan: 카카오톡 초대하기 기능 제거

**Issue**: #126
**Type**: Chore
**Created**: 2026-02-09
**Status**: Planning

---

## 1. Overview

### Problem Statement

`InviteMemberDialog` 컴포넌트에 카카오톡 공유 버튼이 존재하지만, 실제 카카오톡 공유 API 연동 없이 "준비 중입니다" 토스트만 표시하는 미완성 상태이다. 카카오톡 공유 기능을 사용하지 않기로 결정하여 관련 코드를 제거해야 한다.

### Objectives

1. `InviteMemberDialog`에서 카카오톡 전달 버튼 및 관련 핸들러 제거
2. 초대링크 복사 기능만 남겨 UI 단순화
3. 불필요한 import 정리

### Scope

**In Scope**:

- `InviteMemberDialog` 내 카카오톡 버튼, `handleKakaoShare` 핸들러, `IcKakao` import 제거

**Out of Scope**:

- `IcKakao` 컴포넌트 삭제 (LoginStep.tsx에서 카카오 OAuth 로그인에 사용 중)
- 카카오 OAuth 관련 코드 (oauth.ts, LoginStep.tsx)
- 환경 변수 (VITE_KAKAO_CLIENT_ID, VITE_KAKAO_CLIENT_SECRET)

---

## 2. Requirements

### Functional Requirements

**FR-1**: 카카오톡 전달 버튼 제거

- `InviteMemberDialog`에서 카카오톡 공유 버튼 UI 삭제
- `handleKakaoShare` 핸들러 삭제
- `IcKakao` import 제거

**FR-2**: 초대링크 복사 기능 유지

- 기존 초대링크 복사 버튼은 정상 동작 유지
- `handleCopyLink` 로직 변경 없음

### Technical Requirements

**TR-1**: 빌드/린트/타입체크 통과

- `npm run build` 성공
- `npx tsc --noEmit` 통과
- `npm run lint` 통과

---

## 3. Architecture & Design

### 변경 대상 파일

```
src/
└── features/
    └── team/
        └── ui/
            └── InviteMemberDialog.tsx  (MODIFY - 카카오 버튼 제거)
```

### Design Decisions

**Decision 1**: IcKakao 컴포넌트 유지

- **Rationale**: `LoginStep.tsx`에서 카카오 OAuth 로그인 버튼에 활발히 사용 중
- **Impact**: LOW - InviteMemberDialog에서 import만 제거

### Component Design (변경 후)

```tsx
// InviteMemberDialog - 변경 후 구조
InviteMemberDialog
├── inviteLink 생성 (유지)
├── handleCopyLink (유지)
└── UI:
    ├── Dialog header: "멤버를 추가하시겠어요?" (유지)
    ├── Description (유지)
    └── 초대링크 복사 버튼 (유지)
```

---

## 4. Implementation Plan

### Phase 1: 코드 제거

**Tasks**:

1. `IcKakao` import 문 제거
2. `handleKakaoShare` 핸들러 함수 제거
3. 카카오톡 전달 버튼 JSX 제거
4. 불필요해진 `{/* 카카오톡 전달 버튼 */}` 주석 제거

**Files to Modify**:

- `src/features/team/ui/InviteMemberDialog.tsx` (MODIFY)

**Estimated Effort**: Small

### Phase 2: 검증

**Tasks**:

1. 빌드 검증 (`npm run build`)
2. 타입 체크 (`npx tsc --noEmit`)
3. 린트 (`npm run lint`)

---

## 5. Quality Gates

### Acceptance Criteria

- [x] `InviteMemberDialog`에서 카카오톡 관련 코드 제거
- [ ] 초대링크 복사 기능 정상 동작 확인
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 멤버 초대 다이얼로그 정상 열림
- [ ] 초대링크 복사 버튼 정상 동작
- [ ] 카카오톡 버튼 제거됨

**코드 품질**:

- [ ] 미사용 import 없음
- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음

---

## 6. Risks & Dependencies

### Risks

**R-1**: IcKakao 오삭제 위험

- **Risk**: IcKakao 컴포넌트를 함께 삭제하면 LoginStep.tsx 빌드 실패
- **Impact**: HIGH
- **Probability**: LOW
- **Mitigation**: IcKakao.tsx는 삭제하지 않음 - LoginStep.tsx에서 사용 중 확인 완료

---

## 9. References

### Related Issues

- Issue #126: [[Chore] 카카오톡 초대하기 기능 제거](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/126)

### IcKakao 사용처

- `src/features/auth/ui/steps/LoginStep.tsx` - 카카오 OAuth 로그인 버튼 (유지)
- `src/shared/ui/logos/Logos.stories.tsx` - Storybook (유지)
- `src/features/team/ui/InviteMemberDialog.tsx` - 카카오톡 공유 (제거 대상)

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-02-09
**Next Action**: 사용자 승인 후 구현 시작
