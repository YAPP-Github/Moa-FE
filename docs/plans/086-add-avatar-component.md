# Task Plan: Avatar 공통 컴포넌트 구현

**Issue**: #86
**Type**: Feature
**Created**: 2026-02-03
**Status**: Planning

---

## 1. Overview

### Problem Statement

사용자 프로필, 팀원 목록 등에서 아바타를 표시할 수 있는 공통 컴포넌트가 필요합니다.

- 현재 프로젝트에 Avatar 컴포넌트가 없어 사용자 이미지를 일관되게 표시할 방법이 없음
- 이미지 로드 실패 시 fallback 처리가 필요함
- 다양한 크기와 스타일을 지원해야 함

### Objectives

1. 기존 컴포넌트 패턴(cva + forwardRef)을 따르는 Avatar 컴포넌트 구현
2. 다양한 크기(xs, sm, md, lg, xl) 지원
3. 이미지, 텍스트(이니셜), fallback 아이콘 지원
4. Storybook 스토리 작성

### Scope

**In Scope**:

- Avatar 컴포넌트 구현 (`src/shared/ui/avatar/Avatar.tsx`)
- Storybook 스토리 작성 (`src/shared/ui/avatar/Avatar.stories.tsx`)
- TypeScript 타입 정의
- 이미지 로드 실패 시 fallback 처리

**Out of Scope**:

- Avatar 그룹 컴포넌트 (AvatarGroup)
- 온라인 상태 표시 (presence indicator)
- 애니메이션 효과

---

## 2. Requirements

### Functional Requirements

**FR-1**: 이미지 Avatar 표시

- 이미지 URL을 받아 원형 아바타로 표시
- `src` prop으로 이미지 URL 전달
- `alt` prop으로 대체 텍스트 제공

**FR-2**: Fallback 처리

- 이미지 로드 실패 시 자동으로 fallback 표시
- 텍스트(이니셜) fallback 지원
- 기본 아이콘 fallback 지원

**FR-3**: 다양한 크기 지원

- xs (24px), sm (28px), md (32px), lg (36px), xl (48px)
- 기존 IconButton과 동일한 크기 체계 사용

### Technical Requirements

**TR-1**: 기존 컴포넌트 패턴 준수

- cva (class-variance-authority) 사용
- forwardRef 패턴 적용
- cn 유틸리티로 className 병합

**TR-2**: 이미지 로딩 상태 관리

- React useState로 이미지 로딩 상태 관리
- onError 이벤트로 로드 실패 감지
- 외부 라이브러리 없이 순수 React로 구현

### Non-Functional Requirements

**NFR-1**: 접근성

- 이미지에 적절한 alt 텍스트 제공
- role="img" 또는 적절한 ARIA 속성 사용
- 스크린 리더 지원

**NFR-2**: 성능

- 이미지 lazy loading 지원 (optional)
- 불필요한 리렌더링 방지

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/ui/
└── avatar/
    ├── Avatar.tsx           # 메인 컴포넌트 (CREATE)
    └── Avatar.stories.tsx   # Storybook 스토리 (CREATE)
```

### Design Decisions

**Decision 1**: 외부 라이브러리 없이 순수 React로 구현

- **Rationale**: 프로젝트에 Radix UI가 설치되어 있지 않으며, 간단한 Avatar 컴포넌트는 순수 React로 충분히 구현 가능
- **Approach**: useState로 이미지 로딩 상태 관리, onError 이벤트로 fallback 처리
- **Trade-offs**: Radix UI의 delayMs 같은 고급 기능은 없지만, 추가 의존성 없음
- **Impact**: LOW

**Decision 2**: 기존 IconButton 크기 체계 사용

- **Rationale**: 디자인 시스템 일관성 유지
- **Implementation**: IconButton과 동일한 size variants (xs, sm, md, lg, xl)
- **Benefit**: 다른 컴포넌트와 조합 시 크기 일관성

### Component Design

**Avatar 컴포넌트 구조**:

```typescript
interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt, fallback, size, className, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);
    const showFallback = !src || imageError;

    return (
      <span
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {showFallback ? (
          <span className="fallback">{fallback || getInitials(alt)}</span>
        ) : (
          <img src={src} alt={alt} onError={() => setImageError(true)} />
        )}
      </span>
    );
  }
);
```

### Data Models

```typescript
// Size variants
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

// Props interface
interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  /** 이미지 URL */
  src?: string;
  /** 대체 텍스트 (이미지 설명, 이니셜 생성에도 사용) */
  alt?: string;
  /** 이미지 로드 실패 시 표시할 fallback 콘텐츠 */
  fallback?: React.ReactNode;
}
```

---

## 4. Implementation Plan

### Phase 1: Core Implementation

**Tasks**:

1. Avatar 컴포넌트 파일 생성
2. cva variants 정의 (size)
3. 이미지 로딩 상태 관리 로직 구현
4. Fallback 렌더링 로직 구현

**Files to Create/Modify**:

- `src/shared/ui/avatar/Avatar.tsx` (CREATE)

**Estimated Effort**: Small

### Phase 2: Storybook Stories

**Tasks**:

1. Storybook 스토리 파일 생성
2. 각 크기별 스토리 작성
3. Fallback 시나리오 스토리 작성
4. 이미지/텍스트/아이콘 fallback 예시

**Files to Create/Modify**:

- `src/shared/ui/avatar/Avatar.stories.tsx` (CREATE)

**Dependencies**: Phase 1 완료 필요

### Phase 3: Quality Validation

**Tasks**:

1. 빌드 검증
2. 타입 체크
3. 린트 검증
4. Storybook에서 시각적 확인

### Vercel React Best Practices

**MEDIUM**:

- `rerender-memo`: 불필요한 리렌더링 방지 (이미지 로딩 상태만 변경 시 리렌더)

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: Storybook Visual Testing

- 테스트 타입: Visual
- 모든 크기 조합 확인
- 이미지 로드 성공/실패 시나리오 확인

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] Avatar 컴포넌트 구현 (다양한 크기 지원)
- [x] 이미지 로드 실패 시 fallback 처리
- [x] Storybook 스토리 작성
- [x] TypeScript 타입 정의
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 이미지 URL로 아바타 표시
- [ ] 이미지 없을 때 fallback 표시
- [ ] 이미지 로드 실패 시 fallback 표시
- [ ] 모든 크기(xs~xl) 정상 렌더링

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 기존 컴포넌트 패턴 준수

**접근성**:

- [ ] 이미지에 alt 텍스트 적용
- [ ] 적절한 role 속성

---

## 6. Risks & Dependencies

### Risks

**R-1**: 이미지 CORS 이슈

- **Risk**: 외부 이미지 URL 사용 시 CORS 에러 발생 가능
- **Impact**: LOW
- **Probability**: LOW
- **Mitigation**: onError 핸들러로 fallback 처리
- **Status**: 대응 방안 마련됨

### Dependencies

**D-1**: 기존 유틸리티

- **Dependency**: `@/shared/lib/cn` (className 병합 유틸리티)
- **Required For**: className 조합
- **Status**: AVAILABLE

**D-2**: class-variance-authority

- **Dependency**: `class-variance-authority` 패키지
- **Required For**: Variant 스타일 관리
- **Status**: AVAILABLE (package.json에 설치됨)

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. Phase 1: Avatar 컴포넌트 구현 및 테스트
2. Phase 2: Storybook 스토리 추가
3. Phase 3: PR 생성 및 리뷰

### Success Metrics

**SM-1**: 컴포넌트 완성도

- **Metric**: 모든 크기 variant 정상 동작
- **Target**: 100%
- **Measurement**: Storybook 시각적 확인

---

## 8. Timeline & Milestones

### Milestones

**M1**: Core Implementation

- Avatar 컴포넌트 구현 완료
- **Status**: NOT_STARTED

**M2**: Storybook Stories

- 모든 스토리 작성 완료
- **Status**: NOT_STARTED

**M3**: Quality Validation

- 빌드/타입/린트 통과
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #86: [Feature] Avatar 공통 컴포넌트 구현

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [.claude/rules/fsd.md](../../.claude/rules/fsd.md)

### External Resources

- [Radix UI Avatar](https://www.radix-ui.com/primitives/docs/components/avatar) - 참고용 API 디자인

### Code References

**참고 컴포넌트**:

- `src/shared/ui/button/Button.tsx` - cva + forwardRef 패턴
- `src/shared/ui/icon-button/IconButton.tsx` - 크기 체계 참고

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-02-03
**Next Action**: 사용자 승인 후 구현 시작
