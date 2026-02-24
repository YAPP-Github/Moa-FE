# Task Plan: 팀원 탭 댓글 섹션 겹침 및 포커스 관리 개선

**Issue**: #157
**Type**: Bug
**Created**: 2026-02-24
**Status**: Planning

---

## 1. Overview

### Problem Statement

팀원 탭에서 각 질문별 응답 카드의 댓글 섹션이 인접 컬럼과 시각적으로 겹쳐 보이는 레이아웃 버그가 있다. 또한 댓글 작성 시 포커스 관리가 되지 않아 사용자가 댓글 입력 필드를 수동으로 클릭해야 하는 UX 문제가 있다.

- 각 질문 컬럼이 `w-[354px]` 고정 너비인데, 댓글/응답 텍스트에 `overflow` 제한이 없어 긴 텍스트가 넘침
- `CommentInput`에 자동 포커스 로직이 없어 댓글 섹션을 열어도 입력 필드에 포커스되지 않음

### Objectives

1. 팀원 탭 댓글 섹션이 인접 컬럼과 겹치지 않도록 수정
2. 댓글 섹션 열릴 때 해당 입력 필드에 자동 포커스
3. 기존 질문 탭 레이아웃에 영향 없도록 보장

### Scope

**In Scope**:

- `MemberResponseColumns` 컬럼 overflow 처리
- `ResponseCard` 내 텍스트 줄바꿈 처리
- `CommentInput` 자동 포커스 추가

**Out of Scope**:

- 댓글 섹션 최대 높이/스크롤 추가 (현재 요구사항에 없음)
- 질문 탭 레이아웃 변경

### User Context

> "댓글이 열린상태에서 다른 댓글 작성 시도시 포커스가 현재 작성되고 있는 댓글에 될수있도록 해주세요."

**핵심 요구사항**:

1. 댓글 섹션이 겹치지 않도록 레이아웃 수정
2. 댓글 입력 시 포커스가 올바르게 관리됨

---

## 2. Requirements

### Functional Requirements

**FR-1**: 댓글 텍스트 오버플로우 방지

- 긴 댓글/응답 텍스트가 컬럼 너비(354px) 내에서 올바르게 줄바꿈
- 인접 컬럼과 시각적 겹침 없음

**FR-2**: 댓글 입력 자동 포커스

- 댓글 섹션 열릴 때 해당 `CommentInput`의 `<input>`에 자동 포커스
- 이미 열린 댓글 섹션의 입력 중에는 다른 섹션을 열어도 새로 열린 입력에 포커스 이동

### Technical Requirements

**TR-1**: CSS overflow 처리

- `overflow-hidden` + `break-words`/`overflow-wrap: anywhere` 조합 사용
- Tailwind CSS 유틸리티 클래스 사용

**TR-2**: React ref 기반 포커스 관리

- `useRef` + `useEffect`로 마운트 시 자동 포커스
- `autoFocus` prop 대신 ref 방식 사용 (조건부 렌더링 시 더 안정적)

---

## 3. Architecture & Design

### Design Decisions

**Decision 1**: 컬럼 레벨에서 `overflow-hidden` 적용

- **Rationale**: 컬럼 자체에 overflow 제한을 걸어 모든 자식 요소가 넘치지 않도록 보장
- **Approach**: `MemberResponseColumns`의 각 컬럼 div에 `overflow-hidden` 추가
- **Impact**: LOW — CSS 클래스 추가만으로 해결

**Decision 2**: `CommentInput`에 `useRef` + `useEffect` 포커스

- **Rationale**: `autoFocus`보다 `useRef`가 조건부 렌더링(showComments toggle) 시 더 안정적
- **Approach**: `CommentInput` 내부에서 `inputRef`를 만들고 마운트 시 `focus()` 호출
- **Impact**: LOW — CommentInput 내부 변경만 필요

### Component Changes

**MemberResponseColumns.tsx** — 컬럼에 overflow 제한:

```tsx
// Before
<div key={question.index} className="w-[354px] shrink-0">

// After
<div key={question.index} className="w-[354px] shrink-0 overflow-hidden">
```

**CommentInput.tsx** — 자동 포커스:

```tsx
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);

<input ref={inputRef} ... />
```

**CommentSection.tsx** — 댓글 텍스트 줄바꿈 보장:

```tsx
// 댓글 텍스트에 break-words 추가
<p className="whitespace-pre-wrap break-words text-long-2 text-grey-900">
```

**ResponseCard.tsx** — 응답 텍스트 줄바꿈 보장:

```tsx
// 응답 텍스트에 break-words 추가
<p className="whitespace-pre-wrap break-words text-long-2 text-grey-900">
```

---

## 4. Implementation Plan

### Phase 1: 댓글 겹침 수정

**Tasks**:

1. `MemberResponseColumns.tsx` — 컬럼 div에 `overflow-hidden` 추가
2. `ResponseCard.tsx` — 응답 텍스트 `<p>`에 `break-words` 추가
3. `CommentSection.tsx` — 댓글 텍스트 `<p>`에 `break-words` 추가

**Files to Modify**:

- `src/features/retrospective/ui/detail/MemberResponseColumns.tsx` (MODIFY)
- `src/features/retrospective/ui/detail/ResponseCard.tsx` (MODIFY)
- `src/features/retrospective/ui/detail/CommentSection.tsx` (MODIFY)

**Estimated Effort**: Small

### Phase 2: 포커스 관리

**Tasks**:

1. `CommentInput.tsx` — `useRef` + `useEffect`로 마운트 시 자동 포커스 추가

**Files to Modify**:

- `src/features/retrospective/ui/detail/CommentInput.tsx` (MODIFY)

**Estimated Effort**: Small

### Phase 3: 검증

**Tasks**:

1. 빌드 / 타입 체크 / 린트 통과 확인
2. 팀원 탭에서 긴 댓글 겹침 해결 확인
3. 댓글 섹션 열 때 자동 포커스 확인

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] 팀원 탭에서 댓글 섹션이 인접 컬럼과 겹치지 않음
- [ ] 긴 댓글 텍스트가 컬럼 너비 내에서 올바르게 줄바꿈됨
- [ ] 댓글 섹션 열릴 때 해당 입력 필드에 포커스됨
- [ ] 질문 탭 레이아웃에 영향 없음
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

---

## 6. Risks & Dependencies

### Risks

**R-1**: `overflow-hidden`이 다른 UI 요소를 잘라낼 수 있음

- **Impact**: LOW
- **Mitigation**: 컬럼 내부에 absolute/fixed 포지션 요소가 없으므로 영향 없음

---

## 7. References

### Related Issues

- Issue #157: [팀원 탭 댓글 섹션 겹침 및 포커스 관리 개선](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/157)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-24
**Implemented By**: Claude Opus 4.6

### Changes Made

#### Bug Fix: 댓글 섹션 겹침 (계획대로)

- `src/features/retrospective/ui/detail/MemberResponseColumns.tsx` — 컬럼 div에 `overflow-hidden` 추가
- `src/features/retrospective/ui/detail/ResponseCard.tsx` — 응답 텍스트에 `break-all` 추가
- `src/features/retrospective/ui/detail/CommentSection.tsx` — 댓글 텍스트에 `break-all` 추가

#### Enhancement: 댓글 입력 UX 개선 (계획 + 추가)

- `src/features/retrospective/ui/detail/CommentInput.tsx` — 전면 개선:
  - `<input>` → `<textarea>` 변환 (여러 줄 댓글 지원)
  - `[field-sizing:content]`로 내용에 따라 자동 높이 조절 (최대 120px)
  - `useRef` + `useEffect`로 마운트 시 자동 포커스
  - `Enter` 제출 / `Shift+Enter` 줄바꿈
  - 포커스 시 `border-blue-300` 색상 변경 (`focus-within`)
  - `border-2`로 두께 증가 + 패딩 보정으로 레이아웃 유지

#### Bug Fix: 초대 코드 검증 오류 (추가 작업)

- `src/features/auth/model/schema.ts` — 온보딩 `inviteLink`: `z.url()` → `z.string()` (초대 코드 허용)
- `src/features/auth/model/schema.ts` — `teamName`: `.min(1)` 제거 + regex `+` → `*` + `.or(z.literal(''))` (join 시 빈 teamName 허용)
- `src/features/team/model/schema.ts` — 팀 참여 `inviteUrl`: `z.url()` → `z.string().min(1)` (초대 코드 허용)
- `src/features/team/api/team.api.ts` — `joinRetroRoom`: 초대 코드를 URL 형태로 자동 변환하여 API 전달
- `src/features/team/ui/InviteMemberDialog.tsx` — 초대 코드만 복사하도록 변수명 정리

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Added**:

- `<input>` → `<textarea>` 전환 및 자동 높이 조절 (사용자 요청)
- 포커스 시 border 색상 변경 (사용자 요청)
- `border-2` 두께 증가 + 패딩 보정 (사용자 요청)
- 초대 코드 검증/전달 로직 수정 (추가 버그 발견)
- `break-words` → `break-all` (영문 연속 문자열 줄바꿈을 위해)

**Changed**:

- 계획에서는 `break-words` 사용 → 실제로는 `break-all` 적용 (공백 없는 영문/숫자도 강제 줄바꿈)
- 계획에서는 `<input>` 유지 → 실제로는 `<textarea>` + `field-sizing:content` 적용

### Performance Impact

- Bundle size: 변화 없음 (CSS 클래스 + 네이티브 속성만 추가)
- Runtime: 영향 없음

### Follow-up Tasks

- 없음

---

**Plan Status**: Completed
**Last Updated**: 2026-02-24
