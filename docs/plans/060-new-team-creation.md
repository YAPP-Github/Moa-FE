# Task Plan: 새 팀 생성 기능

**Issue**: #60
**Type**: Feature
**Created**: 2026-02-01
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 사용자가 팀을 생성하려면 로그인 플로우를 거쳐야 합니다. 로그인 이후에는 `NoTeamEmptyState`에서 "팀 생성하기" 버튼이 있지만 실제 동작하지 않습니다.

- 로그인 플로우 외부에서 독립적으로 팀을 생성할 수 없음
- 기존 사용자가 새 팀을 추가로 만들 방법이 없음
- `NoTeamEmptyState`의 "팀 생성하기" 버튼이 미구현 상태

### Objectives

1. 팀 생성 모달 다이얼로그 UI 구현
2. 팀 생성 API (`createRetroRoom`) 연동
3. `NoTeamEmptyState`와 팀 생성 모달 연결
4. 성공/실패 피드백 제공

### Scope

**In Scope**:

- 팀 생성 모달 다이얼로그 컴포넌트 구현
- 팀 이름 입력 폼 (10자 제한, 유효성 검사)
- `createRetroRoom` API 호출 및 에러 핸들링
- `NoTeamEmptyState` 버튼과 모달 연결
- 성공 시 사이드바 갱신 (팀 목록 리패치)

**Out of Scope**:

- 팀 참여(초대 링크) 기능 (별도 이슈)
- 팀 설정/수정 기능
- 팀 삭제 기능

---

## 2. Requirements

### Functional Requirements

**FR-1**: 팀 생성 모달 표시

- `NoTeamEmptyState`의 "팀 생성하기" 버튼 클릭 시 모달 열림
- 모달에 팀 이름 입력 필드와 생성 버튼 표시

**FR-2**: 팀 이름 입력 및 유효성 검사

- 팀 이름은 1~10자 제한
- 빈 값이면 생성 버튼 비활성화
- 실시간 글자 수 카운터 표시

**FR-3**: 팀 생성 API 호출

- "생성하기" 버튼 클릭 시 `createRetroRoom` API 호출
- 로딩 상태 표시
- 성공 시 모달 닫기 및 사이드바 갱신
- 실패 시 에러 메시지 표시

**FR-4**: 성공 후 처리

- 팀 목록 리패치 (사이드바 갱신)
- 생성된 팀으로 자동 이동 (선택사항)

### Technical Requirements

**TR-1**: FSD 아키텍처 준수

- 팀 생성 모달: `src/features/team/ui/CreateTeamDialog.tsx`
- API 호출: `src/features/team/api/team.mutations.ts` (React Query)
- 스키마: `src/features/team/model/schema.ts`

**TR-2**: 기존 컴포넌트 재사용

- Dialog 컴포넌트: `src/shared/ui/dialog/Dialog.tsx`
- Button: `src/shared/ui/button/Button.tsx`
- Input: `src/shared/ui/input/Input.tsx`
- Field: `src/shared/ui/field/Field.tsx`

**TR-3**: React Query 사용

- `useMutation`으로 팀 생성 API 호출
- 성공 시 `listRetroRooms` 쿼리 무효화

### Non-Functional Requirements

**NFR-1**: 접근성

- 모달 포커스 트래핑
- ESC 키로 모달 닫기
- 키보드 네비게이션 지원

**NFR-2**: 사용자 경험

- 로딩 중 버튼 비활성화 및 스피너 표시
- 에러 발생 시 명확한 메시지 제공

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── features/
│   └── team/
│       ├── ui/
│       │   ├── NoTeamEmptyState.tsx     # 수정: 모달 연결
│       │   └── CreateTeamDialog.tsx     # 신규: 팀 생성 모달
│       ├── api/
│       │   └── team.mutations.ts        # 신규: React Query mutation
│       └── model/
│           └── schema.ts                # 신규: Zod 스키마
└── docs/
    └── plans/
        └── 060-new-team-creation.md     # 이 문서
```

### Design Decisions

**Decision 1**: Dialog 기반 모달 구현

- **Rationale**: 간단한 단일 입력 폼이므로 모달이 적합. 페이지 이동 없이 빠른 생성 가능.
- **Approach**: 기존 `DialogRoot` primitive 컴포넌트 활용
- **Trade-offs**: 복잡한 멀티스텝보다 단순하지만 확장성은 낮음
- **Impact**: LOW

**Decision 2**: React Query `useMutation` 사용

- **Rationale**: API 호출 상태 관리, 에러 핸들링, 캐시 무효화를 선언적으로 처리
- **Approach**: `useMutation` + `queryClient.invalidateQueries`
- **Benefit**: 보일러플레이트 최소화, 일관된 패턴

**Decision 3**: Controlled Dialog 패턴

- **Rationale**: 부모 컴포넌트(`NoTeamEmptyState`)에서 모달 열림 상태 제어
- **Implementation**: `open`, `onOpenChange` props로 제어

### Component Design

**CreateTeamDialog**:

```typescript
interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (retroRoom: RetroRoomCreateResponse) => void;
}

function CreateTeamDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateTeamDialogProps) {
  const { register, handleSubmit, watch, reset } = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
  });

  const mutation = useCreateRetroRoom();

  const onSubmit = async (data: CreateTeamFormData) => {
    await mutation.mutateAsync({ title: data.teamName });
    reset();
    onOpenChange(false);
    onSuccess?.(mutation.data);
  };

  // ...
}
```

**플로우 다이어그램**:

```
NoTeamEmptyState: 버튼 클릭
    ↓
CreateTeamDialog: open={true}
    ↓
User: 팀 이름 입력
    ↓
User: "생성하기" 클릭
    ↓
useMutation: createRetroRoom API 호출
    ↓
Success: queryClient.invalidateQueries(['retroRooms'])
    ↓
Dialog 닫기 + 사이드바 갱신
```

### Data Models

```typescript
// src/features/team/model/schema.ts
import { z } from "zod";

export const createTeamSchema = z.object({
  teamName: z
    .string()
    .min(1, "팀 이름을 입력해주세요")
    .max(10, "팀 이름은 10글자 이내로 입력해주세요"),
});

export type CreateTeamFormData = z.infer<typeof createTeamSchema>;
```

### API Design

**기존 API 사용**: `createRetroRoom` (Orval 생성)

**Endpoint**: `POST /api/v1/retro-rooms`

**Request**:

```json
{
  "title": "팀 이름",
  "description": null
}
```

**Response**:

```json
{
  "code": "string",
  "isSuccess": true,
  "message": "string",
  "result": {
    "inviteCode": "ABC123",
    "retroRoomId": 1,
    "title": "팀 이름"
  }
}
```

---

## 4. Implementation Plan

### Phase 1: Schema & API Layer

**Tasks**:

1. `createTeamSchema` Zod 스키마 생성
2. `useCreateRetroRoom` mutation hook 생성

**Files to Create**:

- `src/features/team/model/schema.ts` (CREATE)
- `src/features/team/api/team.mutations.ts` (CREATE)

### Phase 2: UI Components

**Tasks**:

1. `CreateTeamDialog` 컴포넌트 구현
2. 폼 유효성 검사 및 에러 표시
3. 로딩/성공/에러 상태 처리

**Files to Create**:

- `src/features/team/ui/CreateTeamDialog.tsx` (CREATE)

**Dependencies**: Phase 1 완료 필요

### Phase 3: Integration

**Tasks**:

1. `NoTeamEmptyState`에서 `CreateTeamDialog` 연결
2. 성공 시 팀 목록 갱신 확인
3. 전체 플로우 테스트

**Files to Modify**:

- `src/features/team/ui/NoTeamEmptyState.tsx` (MODIFY)

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: 직접 import 사용 (barrel export 미사용)

**HIGH**:

- `server-cache-react`: React Query 캐시 활용

**MEDIUM**:

- `rerender-memo`: Dialog 불필요한 리렌더링 방지

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 수동 테스트

- 테스트 타입: Manual/E2E
- 테스트 케이스:
  - 빈 팀 이름으로 생성 시도 → 버튼 비활성화
  - 11자 이상 입력 시 → 입력 제한
  - 유효한 팀 이름으로 생성 → 성공 + 사이드바 갱신
  - API 에러 발생 시 → 에러 메시지 표시

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] 팀 생성 모달 UI 구현
- [x] 팀 이름 입력 폼 (10자 제한, 유효성 검사)
- [x] 팀 생성 API 연동
- [x] 성공/실패 피드백 제공
- [x] NoTeamEmptyState 버튼과 연결
- [x] 빌드 및 타입 체크 통과

### Validation Checklist

**기능 동작**:

- [ ] 모달 열기/닫기 정상 동작
- [ ] 팀 이름 입력 및 글자 수 카운터 동작
- [ ] 빈 값일 때 버튼 비활성화
- [ ] API 호출 및 성공 처리
- [ ] 에러 시 에러 메시지 표시

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] FSD 아키텍처 준수
- [ ] 직접 import 사용 (barrel export 미사용)

**접근성**:

- [ ] ESC 키로 모달 닫기
- [ ] 키보드 네비게이션 동작
- [ ] 포커스 트래핑

---

## 6. Risks & Dependencies

### Risks

**R-1**: API 연결 실패

- **Risk**: 백엔드 API가 예상대로 동작하지 않을 수 있음
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: Orval 생성 API 타입 활용, 에러 핸들링 구현
- **Status**: Monitored

### Dependencies

**D-1**: Dialog 컴포넌트

- **Dependency**: `src/shared/ui/dialog/Dialog.tsx`
- **Required For**: CreateTeamDialog 구현
- **Status**: AVAILABLE

**D-2**: React Query 설정

- **Dependency**: QueryClient Provider
- **Required For**: useMutation 사용
- **Status**: AVAILABLE (확인 필요)

**D-3**: 인증 토큰

- **Dependency**: 사용자 로그인 상태
- **Required For**: API 호출 시 Authorization 헤더
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. PR 생성 및 코드 리뷰
2. dev 브랜치 머지 후 스테이징 테스트
3. main 머지 후 프로덕션 배포

### Success Metrics

**SM-1**: 팀 생성 성공률

- **Metric**: 팀 생성 API 호출 성공률
- **Target**: 99% 이상
- **Measurement**: API 응답 로깅

---

## 8. Timeline & Milestones

### Milestones

**M1**: Schema & API Layer 완료

- Zod 스키마 및 mutation hook 구현
- **Status**: NOT_STARTED

**M2**: UI 컴포넌트 완료

- CreateTeamDialog 구현 및 스타일링
- **Status**: NOT_STARTED

**M3**: 통합 완료

- NoTeamEmptyState 연결 및 전체 테스트
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #60: [새 팀 생성 기능](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/60)
- Issue #13: NoTeamEmptyState 구현 (완료)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [.claude/rules/fsd.md](../../.claude/rules/fsd.md)

**참조 코드**:

- `src/features/auth/ui/TeamNameStep.tsx` - 팀 이름 입력 UI 패턴
- `src/shared/ui/dialog/Dialog.tsx` - Dialog primitive
- `src/shared/api/generated/index.ts` - createRetroRoom API

### External Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev/)

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-02-01
**Next Action**: 사용자 승인 후 구현 시작
