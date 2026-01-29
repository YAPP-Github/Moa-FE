# Swiper 컴포넌트 구현

## Overview

마우스/터치 드래그로 가로 스크롤이 가능한 Swiper 컴포넌트 구현

## Requirements

### 기능 요구사항

- FR-1: 마우스 드래그로 가로 스크롤
- FR-2: 터치 드래그 지원
- FR-3: 커서 상태 표시 (grab/grabbing)
- FR-4: 드래그 중 내부 요소 클릭 방지
- FR-5: Content Inset (좌우 여백) 지원
- FR-6: Tab 키 네비게이션 지원 (내부 interactive 요소)

### 기술 요구사항

- TR-1: Compound Component 패턴 (SwiperRoot, SwiperContent, SwiperItem)
- TR-2: Primitive/Headless 컴포넌트 (스타일 없음, className으로 커스터마이징)
- TR-3: forwardRef 지원
- TR-4: React Context로 상태 공유

---

## Implementation Summary

**Completion Date**: 2025-01-29
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- `src/shared/ui/swiper/Swiper.tsx` - 메인 컴포넌트 (SwiperRoot, SwiperContent, SwiperItem)
- `src/shared/ui/swiper/Swiper.stories.tsx` - Storybook 스토리 (6개)
- `src/shared/ui/swiper/index.ts` - Public API export

#### Files Modified

- `src/shared/ui/index.ts` - Swiper export 추가

### Key Implementation Details

1. **Compound Component 패턴**: Context를 통해 isDragging 상태 공유
2. **드래그 핸들링**: mousedown/move/up, touchstart/move/end 이벤트 처리
3. **Content Inset**: `inset` prop으로 paddingInline 스타일 적용
4. **드래그 중 클릭 방지**: SwiperItem에 `pointer-events-none` 적용
5. **스크롤바 숨김**: CSS로 네이티브 스크롤바 숨김 처리

### Storybook Stories

- Default: 기본 드래그 스크롤
- WithInset: Content Inset 예시
- WithInteractiveElements: 버튼이 있는 카드 (Tab 네비게이션)
- WithLinks: 링크가 있는 카드 (Tab 네비게이션)
- ImageGallery: 이미지 갤러리 예시
- SmallItems: 태그 버튼 예시

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed (swiper 파일)

### Deviations from Initial Plan

**Removed**:

- `snap` 기능 제거 (사용자 요청)
- `wheelScroll` 기능 제거 (사용자 요청)

**Added**:

- `inset` prop 추가 (Content Inset / Edge Padding)
- Tab 네비게이션 예시 스토리 추가

### Notes

- 브라우저가 포커스된 요소로 자동 스크롤하므로 별도 Tab 처리 불필요
- biome-ignore 주석으로 a11y lint 예외 처리 (드래그는 보조 기능)
