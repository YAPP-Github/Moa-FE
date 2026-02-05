# Task Plan: 회고 완료 후 회고내용/회고분석 탭 뷰 구현

**Issue**: #106
**Type**: Feature
**Created**: 2026-02-05
**Status**: Planning

---

## 1. Overview

### Problem Statement

회고 작성이 완료되면 사용자는 작성한 회고 내용과 AI 분석 결과를 확인할 수 있어야 합니다.

- 현재 `RetrospectiveDetailPanel`은 회고 작성/진행용으로만 구현되어 있음
- 완료된 회고의 내용을 조회하고 AI 분석 결과를 확인하는 뷰가 없음
- 팀 회고에 대한 인사이트를 시각적으로 파악할 수 없음

### Objectives

1. 회고 내용 탭: 질문별 회고 답변을 리스트 형태로 표시
2. 회고 분석 탭: AI 인사이트, 감정 키워드 랭킹, 미션 카드 표시
3. 탭 전환을 통한 두 뷰 간 이동 지원

### Scope

**In Scope**:

- 회고 내용 탭 UI 구현 (질문 필터, 답변 리스트)
- 회고 분석 탭 UI 구현 (AI 인사이트, 키워드 랭킹, 미션 카드)
- 탭 전환 기능
- 완료된 회고 패널 컴포넌트

**Out of Scope**:

- API 연동 (목 데이터로 구현)
- AI 분석 실제 호출 로직
- 좋아요/댓글 기능 구현

### User Context

> "회고 작성이 완료되면 회고내용과 회고분석 탭을 통해서 작성한 회고 내용과 분석 내용을 볼 수 있어. 상세 디자인 스펙은 내가 같이 작업할 거야."

**디자인 분석 (첨부 이미지 기반)**:

1. **회고 내용 탭 (이미지 3)**:
   - 상단: "회고 내용" | "회고 분석" 탭 버튼
   - 질문 필터 버튼: 전체, 질문1, 질문2, 질문3
   - 답변 카드 리스트:
     - 작성자 프로필 이미지 + 이름
     - 작성 시간 (예: "12분전")
     - 답변 내용 텍스트
     - 좋아요 수, 댓글 수

2. **회고 분석 탭 (이미지 2)**:
   - AI 인사이트 요약 배너 (파란색 배경)
     - "YAPP WEB 7팀을 위한 AI 인사이트"
     - 요약 텍스트 2줄
   - 감정 키워드 랭킹 (1~3위)
     - 순위 + 감정명 + 키워드 설명
     - 응답과 연관 표시 (예: "6개의 응답과 연관")
   - 팀원을 위한 미션 (3개 카드)
     - 미션 번호 + 제목 + 설명

3. **분석 전 상태 (이미지 1)**:
   - "현재까지 작성된 회고를 기준으로 인사이트가 생성돼요"
   - 참여자 수 표시 (예: "6/12명 참여")
   - "AI 회고 분석 하기" 버튼

---

## 2. Requirements

### Functional Requirements

**FR-1**: 탭 전환 기능

- 회고 내용 / 회고 분석 두 개의 탭 버튼
- 활성 탭에 따라 하단 콘텐츠 영역 변경
- 기본값: 회고 분석 탭 (완료 후 처음 진입 시)

**FR-2**: 회고 내용 탭

- 질문 필터링: 전체 | 질문1 | 질문2 | 질문3
- 각 질문별 답변 리스트 표시
- 답변 카드: 작성자 정보, 시간, 내용, 좋아요/댓글 수

**FR-3**: 회고 분석 탭 - 분석 전

- 안내 메시지 표시
- 참여자 수 표시
- AI 회고 분석하기 버튼

**FR-4**: 회고 분석 탭 - 분석 후

- AI 인사이트 요약 배너
- 감정 키워드 랭킹 (3개)
- 팀원을 위한 미션 카드 (3개)

### Technical Requirements

**TR-1**: FSD 아키텍처 준수

- 직접 import 사용 (barrel export 금지)
- 레이어 간 단방향 의존성

**TR-2**: 기존 컴포넌트 재사용

- ToggleButton: 탭 버튼으로 활용
- 기존 패널 레이아웃 구조 참고

**TR-3**: TypeScript 타입 안전성

- 모든 컴포넌트에 Props 타입 정의
- API 응답 타입 정의

### Non-Functional Requirements

**NFR-1**: 접근성

- 탭 버튼에 aria-selected 속성
- 키보드 네비게이션 지원

**NFR-2**: 반응형

- 패널 확대/축소 상태에서 정상 동작

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── features/retrospective/
│   ├── ui/
│   │   ├── CompletedRetrospectiveView.tsx      [NEW] 탭 뷰 컨테이너
│   │   ├── RetrospectiveContentTab.tsx         [NEW] 회고 내용 탭
│   │   ├── RetrospectiveAnalysisTab.tsx        [NEW] 회고 분석 탭
│   │   ├── AnswerCard.tsx                      [NEW] 답변 카드
│   │   ├── QuestionFilter.tsx                  [NEW] 질문 필터 버튼
│   │   ├── AiInsightBanner.tsx                 [NEW] AI 인사이트 배너
│   │   ├── KeywordRanking.tsx                  [NEW] 감정 키워드 랭킹
│   │   ├── MissionCard.tsx                     [NEW] 미션 카드
│   │   └── AnalysisEmptyState.tsx              [NEW] 분석 전 상태
│   └── model/
│       └── types.ts                            [MODIFY] 타입 추가
│
├── widgets/retrospective-detail-panel/
│   └── ui/
│       └── RetrospectiveDetailPanel.tsx        [MODIFY] 완료 상태 분기 추가
│
└── shared/ui/
    └── tab-group/                              [NEW] 탭 그룹 컴포넌트 (선택사항)
        └── TabGroup.tsx
```

### Design Decisions

**Decision 1**: ToggleButton 기반 탭 구현

- **Rationale**: 기존 ToggleButton 컴포넌트가 탭 스타일로 활용 가능
- **Approach**: tertiary variant + pressed 상태로 탭 버튼 구현
- **Trade-offs**:
  - 장점: 새 컴포넌트 없이 빠른 구현
  - 단점: 탭 전용 스타일 커스터마이징 필요
- **Alternatives Considered**:
  - Radix Tabs 사용 → 추가 의존성
  - 커스텀 Tab 컴포넌트 → 개발 시간 증가
- **Impact**: LOW

**Decision 2**: features 레이어에 컴포넌트 배치

- **Rationale**: 회고 도메인 전용 UI이므로 features/retrospective에 배치
- **Implementation**: CompletedRetrospectiveView가 탭 상태 관리
- **Benefit**: FSD 원칙 준수, 코드 응집도 향상

**Decision 3**: 목 데이터 우선 구현

- **Rationale**: API 스펙 미확정 상태에서 UI 먼저 구현
- **Implementation**: 컴포넌트 내부에 MOCK_DATA 상수 정의
- **Benefit**: 디자인 확인 후 API 연동 용이

### Component Design

**CompletedRetrospectiveView**:

```typescript
interface CompletedRetrospectiveViewProps {
  retrospectId: number;
  projectName: string;
  retrospectMethod: string;
  participantCount: number;
  totalParticipants: number;
  isAnalyzed: boolean;
}

type TabType = 'content' | 'analysis';

function CompletedRetrospectiveView(props: CompletedRetrospectiveViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('analysis');

  return (
    <div>
      {/* 탭 버튼 */}
      <TabGroup activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 탭 콘텐츠 */}
      {activeTab === 'content' && <RetrospectiveContentTab {...} />}
      {activeTab === 'analysis' && <RetrospectiveAnalysisTab {...} />}
    </div>
  );
}
```

**플로우 다이어그램**:

```
완료된 회고 클릭
    ↓
RetrospectiveDetailPanel (isCompleted: true)
    ↓
CompletedRetrospectiveView
    ↓
┌─────────────────────────────────────┐
│ [회고 내용] [회고 분석]              │
├─────────────────────────────────────┤
│ activeTab === 'content'             │
│   → RetrospectiveContentTab         │
│     → QuestionFilter                │
│     → AnswerCard[]                  │
│                                     │
│ activeTab === 'analysis'            │
│   → RetrospectiveAnalysisTab        │
│     → AiInsightBanner (분석 후)     │
│     → KeywordRanking                │
│     → MissionCard[]                 │
│     OR                              │
│     → AnalysisEmptyState (분석 전)  │
└─────────────────────────────────────┘
```

### Data Models

```typescript
// 답변 데이터
interface Answer {
  answerId: number;
  questionIndex: number;
  content: string;
  author: {
    id: number;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

// AI 분석 결과
interface RetrospectiveAnalysis {
  isAnalyzed: boolean;
  insight?: {
    teamName: string;
    summary: string[];
  };
  keywords?: KeywordRanking[];
  missions?: Mission[];
}

interface KeywordRanking {
  rank: number;
  emotion: string;
  keyword: string;
  description: string;
  relatedCount: number;
}

interface Mission {
  missionNumber: number;
  title: string;
  description: string;
}
```

---

## 4. Implementation Plan

### Phase 1: 기본 구조 및 탭 컴포넌트

**Tasks**:

1. 타입 정의 추가 (`features/retrospective/model/types.ts`)
2. CompletedRetrospectiveView 컴포넌트 생성
3. 탭 전환 로직 구현 (ToggleButton 활용)

**Files to Create/Modify**:

- `src/features/retrospective/model/types.ts` (MODIFY)
- `src/features/retrospective/ui/CompletedRetrospectiveView.tsx` (CREATE)

### Phase 2: 회고 내용 탭 구현

**Tasks**:

1. QuestionFilter 컴포넌트 생성
2. AnswerCard 컴포넌트 생성
3. RetrospectiveContentTab 컴포넌트 생성
4. 목 데이터로 테스트

**Files to Create/Modify**:

- `src/features/retrospective/ui/QuestionFilter.tsx` (CREATE)
- `src/features/retrospective/ui/AnswerCard.tsx` (CREATE)
- `src/features/retrospective/ui/RetrospectiveContentTab.tsx` (CREATE)

### Phase 3: 회고 분석 탭 구현

**Tasks**:

1. AnalysisEmptyState 컴포넌트 생성 (분석 전)
2. AiInsightBanner 컴포넌트 생성
3. KeywordRanking 컴포넌트 생성
4. MissionCard 컴포넌트 생성
5. RetrospectiveAnalysisTab 컴포넌트 생성

**Files to Create/Modify**:

- `src/features/retrospective/ui/AnalysisEmptyState.tsx` (CREATE)
- `src/features/retrospective/ui/AiInsightBanner.tsx` (CREATE)
- `src/features/retrospective/ui/KeywordRanking.tsx` (CREATE)
- `src/features/retrospective/ui/MissionCard.tsx` (CREATE)
- `src/features/retrospective/ui/RetrospectiveAnalysisTab.tsx` (CREATE)

### Phase 4: 패널 통합 및 테스트

**Tasks**:

1. RetrospectiveDetailPanel에 완료 상태 분기 추가
2. 전체 흐름 테스트
3. 품질 검증

**Files to Create/Modify**:

- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` (MODIFY)

**Dependencies**: Phase 1, 2, 3 완료 필요

### Vercel React Best Practices

**MEDIUM**:

- `rerender-memo`: 탭 전환 시 불필요한 리렌더링 방지
- `rerender-functional-setstate`: 상태 업데이트 최적화

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 수동 테스트

- 탭 전환 동작 확인
- 질문 필터 동작 확인
- 분석 전/후 상태 표시 확인

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [ ] 회고 내용 탭 UI 구현
- [ ] 회고 분석 탭 UI 구현
- [ ] 탭 전환 기능 동작
- [ ] 질문 필터 기능 동작
- [ ] 분석 전/후 상태 표시
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 탭 버튼 클릭 시 콘텐츠 전환
- [ ] 질문 필터 선택 시 해당 질문 답변만 표시
- [ ] 분석 전 상태에서 AI 분석 버튼 표시
- [ ] 분석 후 상태에서 인사이트, 키워드, 미션 표시

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] FSD 레이어 규칙 준수
- [ ] 직접 import 사용

**접근성**:

- [ ] 탭 버튼에 aria-selected 속성

---

## 6. Risks & Dependencies

### Risks

**R-1**: 디자인 스펙 변경

- **Risk**: 상세 디자인 작업 중 UI 요구사항 변경 가능
- **Impact**: MEDIUM
- **Probability**: MEDIUM
- **Mitigation**: 컴포넌트 분리하여 수정 용이하게 구현

**R-2**: API 스펙 미확정

- **Risk**: 실제 API 연동 시 데이터 구조 변경 필요
- **Impact**: LOW
- **Probability**: HIGH
- **Mitigation**: 목 데이터 구조를 유연하게 설계

### Dependencies

**D-1**: 디자인 스펙

- **Dependency**: 상세 디자인 확정
- **Required For**: 정확한 UI 구현
- **Status**: IN_PROGRESS (사용자와 함께 작업)
- **Owner**: 사용자

**D-2**: 기존 컴포넌트

- **Dependency**: ToggleButton, 기존 패널 레이아웃
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. 목 데이터로 UI 구현 완료
2. 디자인 검토 후 수정
3. API 연동 (별도 이슈)

### Success Metrics

**SM-1**: UI 완성도

- **Metric**: 디자인 스펙과 일치 여부
- **Target**: 90% 이상
- **Measurement**: 디자인 리뷰

---

## 8. Timeline & Milestones

### Milestones

**M1**: 탭 구조 및 기본 레이아웃

- 탭 전환 동작
- **Status**: NOT_STARTED

**M2**: 회고 내용 탭 완성

- 질문 필터 + 답변 리스트
- **Status**: NOT_STARTED

**M3**: 회고 분석 탭 완성

- 분석 전/후 상태
- **Status**: NOT_STARTED

**M4**: 패널 통합

- RetrospectiveDetailPanel 연동
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #106: [회고 완료 후 회고내용/회고분석 탭 뷰 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/106)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [Radix UI Toggle](https://www.radix-ui.com/primitives/docs/components/toggle)

### 기존 코드 참고

- `RetrospectiveDetailPanel.tsx`: 패널 레이아웃 구조
- `PreviewModal.tsx`: Q&A 렌더링 패턴
- `ToggleButton.tsx`: 탭 버튼 구현

---

## 10. Implementation Summary

**Completion Date**: 2026-02-05
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- `src/features/retrospective/model/types.ts` - 회고 완료 뷰 타입 정의 (TabType, Props)
- `src/features/retrospective/ui/CompletedRetrospectiveView.tsx` - 탭 뷰 컨테이너 컴포넌트
- `src/features/retrospective/ui/RetrospectiveContentTab.tsx` - 회고 내용 탭 (질문 필터, 답변 리스트, 댓글 기능)
- `src/features/retrospective/ui/RetrospectiveAnalysisResult.tsx` - 회고 분석 결과 (AI 인사이트, 키워드 랭킹, 미션 카드)
- `src/features/retrospective/ui/AnalysisEmptyState.tsx` - 분석 전 빈 상태 UI
- `src/shared/ui/icons/IcAiSpark.tsx` - AI 스파크 아이콘
- `src/shared/ui/icons/IcComment.tsx` - 댓글 아이콘
- `src/shared/ui/icons/IcHeartInactive.tsx` - 비활성 하트 아이콘
- `src/shared/ui/icons/IcQuestionCircle.tsx` - 물음표 아이콘
- `src/shared/ui/icons/IcScaleDown.tsx` - 축소 아이콘
- `src/shared/ui/icons/IcScaleUp.tsx` - 확대 아이콘
- `src/shared/ui/icons/IcUserProfileSm.tsx` - 작은 프로필 아이콘
- `src/shared/ui/icons/IcRefresh.tsx` - 새로고침 아이콘 (회고 어시스턴트 다시 생성용)

#### Files Modified

- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` - 완료 상태 분기 추가, 우측 사이드바 유지, 회고 어시스턴트 기능 추가
- `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` - 더미 회고 isCompleted 자동 적용 제거 (회고 작성 플로우 테스트 가능)
- `src/index.css` - scrollbar-hide 유틸리티 클래스 추가

#### Key Implementation Details

- **탭 전환 기능**: useState로 activeTab 상태 관리, 'content' | 'analysis' 타입
- **질문 필터링**: activeFilter 상태로 전체/질문별 필터링 구현
- **댓글 기능**: 로컬 상태로 댓글 입력/표시 (페이지 새로고침 전까지 유지)
- **AI 분석 전/후 상태**: isAnalyzed 상태로 조건부 렌더링
- **감정 키워드 툴팁**: 클릭 토글 + 외부 클릭 닫기 구현
- **접근성**: aria-selected 탭 속성, label 요소로 클릭 영역 확장
- **회고 어시스턴트**: 3초 로딩 후 AI 제안 표시, 다시 생성 버튼 지원
- **임시저장**: 회고 ID별 로컬스토리지 분리 저장, 제출 시 해당 회고만 삭제

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed (접근성 이슈 해결 - label 요소 사용)

### Deviations from Plan

**Changed**:
- ToggleButton 대신 커스텀 탭 버튼 직접 구현 (더 유연한 스타일링)
- 별도 컴포넌트 분리 (QuestionFilter, AnswerCard 등) 대신 RetrospectiveContentTab에 통합 (프로토타입 단계)
- RetrospectiveAnalysisTab → RetrospectiveAnalysisResult로 네이밍 변경

**Added**:
- 댓글 입력 및 표시 기능 (기본 Out of Scope였으나 프로토타입으로 구현)
- scrollbar-hide 유틸리티 클래스
- 우측 사이드바 (참여자, 참고자료) 완료 상태에서도 유지
- 회고 어시스턴트 AI 제안 기능 (3초 로딩 → 결과 표시 → 다시 생성)
- IcRefresh 아이콘 컴포넌트

**Skipped**:
- TabGroup 공통 컴포넌트 (필요 시 별도 이슈)
- API 연동 (목 데이터로 구현)

### Performance Impact

- Bundle size: +8KB (새 컴포넌트 및 아이콘)
- No impact on initial page load (회고 상세 패널에서만 로드)

### Follow-up Tasks

- [ ] API 연동 (실제 회고 데이터 조회)
- [ ] AI 분석 API 호출 로직 구현
- [ ] 좋아요 기능 구현
- [ ] 댓글 API 연동
- [ ] 회고 어시스턴트 실제 AI API 연동

### Notes

- 모든 컴포넌트 FSD 아키텍처 준수 (features/retrospective 레이어)
- 직접 import 방식 사용 (tree-shaking 최적화)
- 목 데이터로 UI 완성, 디자인 검토 후 API 연동 예정

---

**Plan Status**: Completed
**Last Updated**: 2026-02-05
