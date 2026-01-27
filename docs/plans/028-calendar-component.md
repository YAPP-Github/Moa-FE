# Task Plan: Calendar 컴포넌트 구현

**Issue**: #28
**Type**: Feature
**Created**: 2026-01-27
**Status**: Planning

---

## 1. Overview

### Problem Statement

날짜 선택이 필요한 UI에서 사용할 Calendar 공통 컴포넌트가 필요합니다.

- 현재 프로젝트에 Calendar 컴포넌트가 없어 날짜 선택 UI 구현이 불가능
- 기존 Button, Input, Field, RadioCard와 일관된 패턴으로 구현 필요
- FSD 아키텍처의 shared/ui 레이어에 배치하여 전역 재사용 가능해야 함

### Objectives

1. **자체 구현** Calendar 컴포넌트 (외부 UI 라이브러리 없음)
2. date-fns로 날짜 계산 로직 처리
3. 기존 컴포넌트 패턴(cva, forwardRef, cn) 준수
4. Storybook 스토리 작성으로 문서화 및 시각적 테스트 지원
5. 키보드 네비게이션 및 접근성 지원

### Scope

**In Scope**:

- Calendar 컴포넌트 자체 구현 (단일 날짜 선택 모드)
- date-fns로 날짜 유틸리티 처리
- Tailwind CSS 기반 스타일링
- 키보드 네비게이션 (Arrow keys, Enter, Escape)
- ARIA 접근성 속성
- Storybook 스토리 작성
- TypeScript Props 정의
- shared/ui/index.ts export 추가

**Out of Scope**:

- DatePicker (Input + Popover + Calendar 조합) 컴포넌트
- Range 선택 모드 (추후 확장 가능)
- 시간 선택 기능

---

## 2. Requirements

### Functional Requirements

**FR-1**: 단일 날짜 선택

- 사용자가 캘린더에서 날짜를 클릭하면 선택됨
- selected, onSelect props로 controlled 방식 지원
- 선택된 날짜는 시각적으로 강조 표시

**FR-2**: 월 네비게이션

- 이전/다음 월로 이동 가능 (chevron 버튼)
- 현재 표시 중인 월/년도 표시

**FR-3**: 오늘 날짜 표시

- 오늘 날짜는 시각적으로 구분 표시 (테두리 또는 배경색)

**FR-4**: 키보드 네비게이션

- Arrow keys: 날짜 간 이동
- Enter/Space: 날짜 선택
- Escape: 포커스 해제 (선택사항)

### Technical Requirements

**TR-1**: 라이브러리 사용

- **자체 구현** (외부 UI 라이브러리 없음)
- date-fns로 날짜 계산 로직만 처리
  - `startOfMonth`, `endOfMonth`: 월의 시작/끝 날짜
  - `eachDayOfInterval`: 날짜 배열 생성
  - `isSameDay`, `isSameMonth`, `isToday`: 날짜 비교
  - `addMonths`, `subMonths`: 월 이동
  - `format`: 날짜 포맷팅

**TR-2**: 컴포넌트 패턴

- forwardRef 패턴 적용
- cva로 날짜 셀 variant 스타일 관리
- cn 유틸리티로 클래스 병합

**TR-3**: 스타일링

- Tailwind CSS 4 사용
- 프로젝트 디자인 토큰 활용 (#3182F6 primary blue)
- 다크모드 지원

### Non-Functional Requirements

**NFR-1**: 접근성

- role="grid" 및 적절한 ARIA 속성
- 키보드 네비게이션 완전 지원
- aria-label로 날짜 정보 제공

**NFR-2**: 번들 사이즈

- date-fns만 추가 (tree-shakable)
- 외부 UI 라이브러리 없음으로 번들 최소화

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/ui/
├── calendar/
│   ├── Calendar.tsx          # 메인 컴포넌트 (자체 구현)
│   ├── Calendar.stories.tsx  # Storybook 스토리
│   └── index.ts              # Public API (선택사항)
└── index.ts                  # export 추가
```

### Design Decisions

**Decision 1**: 자체 구현 + date-fns

- **Rationale**: 외부 UI 라이브러리 의존성 제거, 완전한 커스터마이징 가능
- **Approach**: date-fns로 날짜 계산만 처리, UI는 직접 구현
- **Trade-offs**: 구현 복잡도 증가하나 번들 사이즈 최소화 및 완전한 통제
- **Alternatives Considered**: react-day-picker (검증됨, 하지만 외부 의존성)
- **Impact**: MEDIUM

**Decision 2**: 단일 컴포넌트 구조

- **Rationale**: Calendar 하나로 충분, 서브 컴포넌트 분리 불필요
- **Implementation**: Header(월/년 + 네비게이션) + Grid(요일 + 날짜) 구조
- **Benefit**: 간결한 구조, 쉬운 유지보수

### Component Design

**Calendar Props**:

```typescript
export interface CalendarProps {
  /** 선택된 날짜 */
  selected?: Date;
  /** 날짜 선택 핸들러 */
  onSelect?: (date: Date) => void;
  /** 비활성화할 날짜 조건 */
  disabled?: (date: Date) => boolean;
  /** 추가 className */
  className?: string;
}
```

**컴포넌트 구조**:

```typescript
const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  ({ selected, onSelect, disabled, className }, ref) => {
    const [currentMonth, setCurrentMonth] = useState(selected ?? new Date());

    // date-fns로 월의 날짜 배열 생성
    const days = useMemo(() => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    return (
      <div ref={ref} className={cn("p-3", className)} role="grid">
        {/* Header: 월/년 + 네비게이션 */}
        {/* Grid: 요일 헤더 + 날짜 셀 */}
      </div>
    );
  }
);
```

### Styling Strategy (cva 활용)

```typescript
const dayVariants = cva(
  "inline-flex items-center justify-center size-9 rounded-md text-sm font-normal cursor-pointer transition-colors",
  {
    variants: {
      state: {
        default: "hover:bg-accent hover:text-accent-foreground",
        selected: "bg-[#3182F6] text-white hover:bg-[#1B64DA]",
        today: "border border-[#3182F6] text-[#3182F6]",
        disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
        outside: "text-muted-foreground opacity-50",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);
```

### 날짜 그리드 렌더링 로직

```typescript
// 월의 시작 요일에 맞춰 빈 셀 추가
const startDay = getDay(startOfMonth(currentMonth)); // 0(일) ~ 6(토)
const emptyDays = Array(startDay).fill(null);

// 7열 그리드로 렌더링
const allCells = [...emptyDays, ...days];
```

---

## 4. Implementation Plan

### Phase 1: Setup & Dependencies

**Tasks**:

1. date-fns 패키지 설치
2. calendar 폴더 구조 생성

**Commands**:

```bash
npm install date-fns
```

**Files to Create**:

- `src/shared/ui/calendar/Calendar.tsx` (CREATE)

### Phase 2: Core Implementation

**Tasks**:

1. Calendar 컴포넌트 자체 구현
   - Header (월/년 표시, 이전/다음 버튼)
   - 요일 헤더 (일~토)
   - 날짜 그리드 (7열 레이아웃)
2. date-fns 활용 날짜 로직
   - 월의 시작/끝 날짜 계산
   - 날짜 비교 (오늘, 선택됨, 같은 달)
3. 스타일링 (cva + Tailwind)
4. 키보드 네비게이션 구현
5. ARIA 접근성 속성 추가

**Files to Create/Modify**:

- `src/shared/ui/calendar/Calendar.tsx` (CREATE)
- `src/shared/ui/index.ts` (MODIFY - export 추가)

### Phase 3: Documentation & Polish

**Tasks**:

1. Storybook 스토리 작성
2. 다양한 상태 스토리 (Default, Selected, Disabled dates, Controlled)
3. 빌드/린트/타입 검증

**Files to Create**:

- `src/shared/ui/calendar/Calendar.stories.tsx` (CREATE)

### Vercel React Best Practices

**MEDIUM**:

- `rerender-memo`: Calendar 컴포넌트는 props 변경 시에만 리렌더링

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: Storybook Visual Testing

- 테스트 타입: Visual/Manual
- 테스트 케이스:
  - 기본 렌더링
  - 날짜 선택 상호작용
  - 월 네비게이션
  - 비활성화된 날짜 표시

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] Calendar 컴포넌트 구현
- [ ] Storybook 스토리 작성
- [ ] TypeScript 타입 정의
- [ ] Build/Lint/Type check 통과

### Validation Checklist

**기능 동작**:

- [ ] 날짜 선택 동작
- [ ] 월 네비게이션 동작
- [ ] 오늘 날짜 표시
- [ ] 선택된 날짜 하이라이트

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 기존 컴포넌트 패턴 준수

**접근성**:

- [ ] 키보드 네비게이션 동작
- [ ] 스크린 리더 지원

---

## 6. Risks & Dependencies

### Risks

**R-1**: 접근성 구현 복잡도

- **Risk**: 키보드 네비게이션 및 ARIA 구현 누락 가능성
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: WAI-ARIA Grid 패턴 참조하여 구현
- **Status**: MONITORING

### Dependencies

**D-1**: date-fns 패키지

- **Dependency**: npm 패키지 설치 필요
- **Required For**: 날짜 계산, 비교, 포맷팅
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. Phase 1: 패키지 설치 및 컴포넌트 구현
2. Phase 2: Storybook 문서화
3. Phase 3: PR 생성 및 리뷰

### Success Metrics

**SM-1**: 컴포넌트 동작

- **Metric**: Storybook에서 모든 상호작용 정상 동작
- **Target**: 100%

**SM-2**: 빌드 성공

- **Metric**: CI 빌드 통과
- **Target**: 100%

---

## 8. Timeline & Milestones

### Milestones

**M1**: 컴포넌트 구현 완료

- Calendar.tsx 구현
- 스타일링 완료
- **Status**: NOT_STARTED

**M2**: 문서화 완료

- Storybook 스토리 작성
- **Status**: NOT_STARTED

**M3**: 품질 검증 완료

- Build/Lint/Type check 통과
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #28: [Feature] Calendar 컴포넌트 구현

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [date-fns Documentation](https://date-fns.org/)
- [WAI-ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [shadcn/ui Calendar (참고용)](https://ui.shadcn.com/docs/components/calendar)

---

## 10. Implementation Summary

**Completion Date**: 2026-01-27
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- `src/shared/ui/calendar/Calendar.tsx` - Calendar 컴포넌트 자체 구현 (290 lines)
- `src/shared/ui/calendar/Calendar.test.tsx` - 22개 테스트 케이스 (288 lines)
- `src/shared/ui/calendar/Calendar.stories.tsx` - 4개 스토리 (Default, WithSelectedDate, Controlled, DisabledPastDates)
- `src/shared/ui/calendar/index.ts` - Public API export

#### Files Modified

- `src/shared/ui/index.ts` - Calendar export 추가
- `package.json` - date-fns 의존성 추가
- `pnpm-lock.yaml` - 의존성 락파일 업데이트

### Key Implementation Details

**컴포넌트 구조**:

- `forwardRef` 패턴 적용
- `cva`로 날짜 셀 variant 스타일 관리 (default, selected, disabled, outside)
- `cn` 유틸리티로 클래스 병합
- date-fns로 날짜 계산 (ko locale 지원)

**기능**:

- 단일 날짜 선택 (selected/onSelect controlled 방식)
- 월 네비게이션 (이전/다음 버튼)
- 날짜 비활성화 조건 (disabled prop)
- 키보드 네비게이션 (Arrow keys, Enter, Space)
- Roving tabIndex 패턴
- 월 경계 넘어 이동 시 자동 월 전환
- react-hook-form Controller 연동 가능

**스타일링**:

- 헤더 텍스트: 20px, font-semibold (600)
- 요일 헤더: 13px, font-medium (500), #8791A0
- 날짜 텍스트: 15px, font-semibold (600)
- 선택된 날짜: #3182F6 배경, rounded-full
- 컨테이너 기반 반응형 (w-full, aspect-square)

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed (63 files checked)
- [x] Tests: 22/22 passing

### Deviations from Plan

**Added**:

- 월 경계를 넘는 키보드 네비게이션 (원래 계획에 없음)
- Roving tabIndex 패턴으로 접근성 개선
- 테스트 코드 작성 (원래 계획은 Storybook만)
- react-hook-form 연동 확인

**Changed**:

- 오늘 날짜 하이라이트 기능 제거 (사용자 요청)
- 날짜 셀 크기: aspect-square w-full → size-[27px] 고정 + wrapper
- 원형 버튼: rounded-md → rounded-full

**Skipped**:

- role="grid" ARIA 패턴 (단순화)

### Test Coverage

22개 테스트 케이스:

- 렌더링: 5개 (기본 렌더링, selected 날짜 표시, 요일 헤더, 월 날짜, 선택 하이라이트)
- 날짜 선택: 3개 (클릭 선택, disabled 클릭 방지, disabled 스타일)
- 월 네비게이션: 3개 (이전/다음 월, 연속 이동)
- 키보드 네비게이션: 8개 (Enter, Space, Arrow keys, 월 경계 이동)
- Props: 3개 (className, selected 없이, onSelect 없이)

### Performance Impact

- date-fns 추가 (tree-shakable, 사용된 함수만 번들링)
- 번들 사이즈 증가 최소화 (자체 구현으로 외부 UI 라이브러리 없음)

### Notes

- vi.useFakeTimers({ shouldAdvanceTime: true })로 테스트 타임아웃 해결
- userEvent와 fake timers 호환성 위해 advanceTimers 설정 필요
- Storybook에서 useState 사용하여 인터랙티브 선택 구현

---

**Plan Status**: Completed
**Last Updated**: 2026-01-27
