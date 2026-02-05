/**
 * RetrospectiveDetailPanel - 회고 진행 사이드 패널
 *
 * 오늘 회고 카드 클릭 시 우측에서 나타나는 회고 진행 패널입니다.
 * 질문별 회고 내용을 입력하고 제출할 수 있습니다.
 */

import { useEffect, useState } from 'react';
import { CloseConfirmModal } from '@/features/retrospective/ui/CloseConfirmModal';
import { CompletedRetrospectiveView } from '@/features/retrospective/ui/CompletedRetrospectiveView';
import { PreviewModal } from '@/features/retrospective/ui/PreviewModal';
import { SubmitConfirmModal } from '@/features/retrospective/ui/SubmitConfirmModal';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import IcChevronActiveRight from '@/shared/ui/icons/IcChevronActiveRight';
import IcChevronDisabledLeft from '@/shared/ui/icons/IcChevronDisabledLeft';
import IcChevronRightPink from '@/shared/ui/icons/IcChevronRightPink';
import IcClose from '@/shared/ui/icons/IcClose';
import IcLinkActive from '@/shared/ui/icons/IcLinkActive';
import IcLinkInactive from '@/shared/ui/icons/IcLinkInactive';
import IcMeatball from '@/shared/ui/icons/IcMeatball';
import IcMemberActive from '@/shared/ui/icons/IcMemberActive';
import IcMemberInactive from '@/shared/ui/icons/IcMemberInactive';
import IcOpen from '@/shared/ui/icons/IcOpen';
import IcRefresh from '@/shared/ui/icons/IcRefresh';
import IcScaleDown from '@/shared/ui/icons/IcScaleDown';
import IcScaleUp from '@/shared/ui/icons/IcScaleUp';
import IcSparklePink from '@/shared/ui/icons/IcSparklePink';
import { useToast } from '@/shared/ui/toast/Toast';

// ============================================================================
// Mock Data for AI Assistant
// ============================================================================

const MOCK_ASSISTANT_SUGGESTIONS = [
  {
    title: '시작 배경 구체화하기',
    description:
      '마감 기한을 맞추기 위해 언제부터 어떤 방식으로 준비했고 중간에 무엇을 조정했는지 덧붙이면 좋아요',
  },
  {
    title: '과정에서의 변화 담기',
    description:
      '오래전부터 시작했지만 끝까지 참여하는 과정에서 힘들었던 순간과 그때 선택한 대응을 함께 적으면 좋아요',
  },
  {
    title: '결과의 의미 연결하기',
    description:
      '끝까지 잘 참여했다는 결과가 스스로에게 어떤 의미였는지 한 문장으로 정리해 보면 좋아요',
  },
];

// ============================================================================
// Types
// ============================================================================

interface Retrospect {
  retrospectId: number;
  projectName: string;
  retrospectDate: string;
  retrospectMethod: string;
  retrospectTime: string;
  participantCount?: number;
  totalParticipants?: number;
}

interface RetrospectiveDetailPanelProps {
  retrospect: Retrospect;
  onClose: () => void;
  isExpanded?: boolean;
  onScaleToggle?: () => void;
  isCompleted?: boolean;
}

// ============================================================================
// Mock Data
// ============================================================================

const KPT_QUESTIONS = [
  '이번 일을 통해 유지했으면 하는 문화나 방식이 있나요?',
  '이번 일을 하는 중 문제라고 판단되었던 점이 있나요?',
  '이번 일을 겪으면서 새롭게 시도해보고 싶은 게 있나요?',
];

const MOCK_PARTICIPANTS = [
  { id: 1, name: '김민지' },
  { id: 2, name: '김민지' },
  { id: 3, name: '김민지' },
  { id: 4, name: '김민지' },
  { id: 5, name: '김민지' },
];

// ============================================================================
// LocalStorage Helpers
// ============================================================================

const DRAFT_STORAGE_KEY_PREFIX = 'retrospect_draft_';

function getDraftStorageKey(retrospectId: number): string {
  return `${DRAFT_STORAGE_KEY_PREFIX}${retrospectId}`;
}

function loadDraftFromStorage(retrospectId: number): string[] | null {
  try {
    const key = getDraftStorageKey(retrospectId);
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // 파싱 실패 시 null 반환
  }
  return null;
}

function saveDraftToStorage(retrospectId: number, answers: string[]): void {
  try {
    const key = getDraftStorageKey(retrospectId);
    localStorage.setItem(key, JSON.stringify(answers));
  } catch {
    // 저장 실패 시 무시
  }
}

function removeDraftFromStorage(retrospectId: number): void {
  try {
    const key = getDraftStorageKey(retrospectId);
    localStorage.removeItem(key);
  } catch {
    // 삭제 실패 시 무시
  }
}

// ============================================================================
// Component
// ============================================================================

function RetrospectiveDetailPanel({
  retrospect,
  onClose,
  isExpanded = false,
  onScaleToggle,
  isCompleted = false,
}: RetrospectiveDetailPanelProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(KPT_QUESTIONS.map(() => ''));
  const [savedDraft, setSavedDraft] = useState<string[]>(KPT_QUESTIONS.map(() => ''));
  const [isMemberActive, setIsMemberActive] = useState(false);
  const [isLinkActive, setIsLinkActive] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAssistantGenerated, setIsAssistantGenerated] = useState(false);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);

  const { showToast } = useToast();

  // 로컬스토리지에서 임시저장 데이터 로드
  useEffect(() => {
    const draft = loadDraftFromStorage(retrospect.retrospectId);
    if (draft) {
      setAnswers(draft);
      setSavedDraft(draft);
    }
  }, [retrospect.retrospectId]);

  // 회고 방법에 따른 질문 선택 (현재는 KPT만 지원)
  const questions = retrospect.retrospectMethod === 'KPT' ? KPT_QUESTIONS : KPT_QUESTIONS;

  const currentAnswer = answers[currentQuestionIndex] || '';
  const maxLength = 1000;

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleAnswerChange = (value: string) => {
    if (value.length <= maxLength) {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = value;
        return newAnswers;
      });
    }
  };

  const handleMemberToggle = () => {
    setIsMemberActive(!isMemberActive);
    if (!isMemberActive) {
      setIsLinkActive(false);
    }
  };

  const handleLinkToggle = () => {
    setIsLinkActive(!isLinkActive);
    if (!isLinkActive) {
      setIsMemberActive(false);
    }
  };

  const handleSubmitClick = () => {
    const hasEmptyAnswer = answers.some((answer) => answer.trim() === '');
    if (hasEmptyAnswer) {
      showToast({
        variant: 'warning',
        message: '모든 회고에 답변을 작성해야 제출할 수 있어요',
      });
      return;
    }
    setIsSubmitModalOpen(true);
  };

  const handleSubmitConfirm = () => {
    // TODO: API 호출 로직 추가
    removeDraftFromStorage(retrospect.retrospectId);
    showToast({ variant: 'success', message: '회고 제출이 완료되었어요!' });
    setIsSubmitted(true);
  };

  // 현재 답변이 임시저장된 버전과 다른지 확인
  const hasUnsavedChanges = (): boolean => {
    return answers.some((answer, index) => answer !== savedDraft[index]);
  };

  // 닫기 버튼 클릭 핸들러
  const handleCloseClick = () => {
    if (hasUnsavedChanges()) {
      setIsCloseModalOpen(true);
    } else {
      onClose();
    }
  };

  // 임시저장 핸들러
  const handleSaveDraft = () => {
    saveDraftToStorage(retrospect.retrospectId, answers);
    setSavedDraft([...answers]);
    showToast({ variant: 'success', message: '임시저장 되었어요!' });
  };

  // 닫기 확인 모달에서 임시저장 클릭
  const handleSaveAndClose = () => {
    saveDraftToStorage(retrospect.retrospectId, answers);
    setSavedDraft([...answers]);
    showToast({ variant: 'success', message: '임시저장 되었어요!' });
    onClose();
  };

  // AI 어시스턴트 생성 핸들러
  const handleAssistantGenerate = () => {
    if (isAssistantLoading) return;
    setIsAssistantLoading(true);
    // 3초 후 생성 완료
    setTimeout(() => {
      setIsAssistantLoading(false);
      setIsAssistantGenerated(true);
    }, 3000);
  };

  // 닫기 확인 모달에서 나가기 클릭
  const handleLeaveWithoutSave = () => {
    onClose();
  };

  // ============================================================================
  // 완료 상태 렌더링 (외부 prop 또는 제출 성공 시)
  // ============================================================================
  if (isCompleted || isSubmitted) {
    return (
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex flex-1 flex-col px-5 pt-3">
          {/* Header - 완료 상태 */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-md p-1.5 text-grey-500 hover:bg-grey-100 transition-colors"
                aria-label="닫기"
              >
                <IcClose className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onScaleToggle}
                className="cursor-pointer rounded-md p-1.5 text-grey-500 hover:bg-grey-100 transition-colors"
                aria-label={isExpanded ? '축소' : '확대'}
              >
                {isExpanded ? (
                  <IcScaleDown className="h-5 w-5" />
                ) : (
                  <IcScaleUp className="h-5 w-5" />
                )}
              </button>
            </div>

            <DropdownMenuRoot>
              <DropdownMenuTrigger>
                <button
                  type="button"
                  className="cursor-pointer rounded-md p-1.5 text-grey-500 hover:bg-grey-100 data-[state=open]:bg-grey-100 transition-colors"
                  aria-label="더보기"
                >
                  <IcMeatball className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent
                  className="flex flex-col gap-1 p-3 rounded-[8px] border border-grey-200 bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)]"
                  align="end"
                  sideOffset={10}
                >
                  <div className="px-3 py-1.5 text-caption-4 text-grey-700 font-medium">
                    {retrospect.projectName}
                  </div>
                  <DropdownMenuItem className="px-3 py-1.5 text-sub-title-3 text-grey-900 rounded-md cursor-pointer hover:bg-grey-50">
                    링크복사
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-3 py-1.5 text-sub-title-3 text-grey-900 rounded-md cursor-pointer hover:bg-grey-50">
                    내보내기
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-3 py-1.5 text-sub-title-3 text-red-300 rounded-md cursor-pointer hover:bg-red-200">
                    삭제하기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </header>

          {/* Content - 완료 뷰 */}
          <div className="mt-3 flex-1 overflow-hidden bg-white">
            <CompletedRetrospectiveView
              retrospectId={retrospect.retrospectId}
              projectName={retrospect.projectName}
              retrospectMethod={retrospect.retrospectMethod}
              participantCount={retrospect.participantCount ?? 0}
              totalParticipants={retrospect.totalParticipants ?? 12}
            />
          </div>
        </div>

        {/* Expanded Panel (참여자/참고자료) */}
        <div
          className={`border-l border-grey-200 bg-grey-50 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out ${
            isMemberActive ? 'w-[280px] px-5 pt-6' : 'w-0 px-0 pt-0'
          }`}
        >
          <div
            className={`${
              isMemberActive ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-200 min-w-[240px]`}
          >
            {/* 참여자 섹션 */}
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-sub-title-1 text-grey-1000">참여자</h3>
                <span className="text-sub-title-1 text-[#6B7684]">
                  {MOCK_PARTICIPANTS.length}명
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-[10px]">
                {MOCK_PARTICIPANTS.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-[10px]">
                    <div className="h-6 w-6 rounded-full bg-grey-200" />
                    <span className="text-caption-2 text-grey-900">{participant.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="flex w-[62px] flex-col items-center border-l border-grey-200 bg-grey-50 pt-5">
          <div className="flex flex-col items-center gap-5">
            {/* Open/Collapse Button */}
            <button
              type="button"
              className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md text-grey-500 hover:bg-[#DEE0E4]/40"
              aria-label="펼치기"
            >
              <IcOpen className="h-[30px] w-[30px]" />
            </button>

            {/* Member Button */}
            <button
              type="button"
              onClick={handleMemberToggle}
              className="flex cursor-pointer flex-col items-center gap-1 rounded-md p-1 transition-colors hover:bg-[#DEE0E4]/40"
              aria-label="참여자"
            >
              <div
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-md transition-colors ${
                  isMemberActive ? 'bg-[#DEE0E4]' : ''
                }`}
              >
                {isMemberActive ? (
                  <IcMemberActive className="h-[30px] w-[30px] text-grey-600" />
                ) : (
                  <IcMemberInactive className="h-[30px] w-[30px] text-grey-500" />
                )}
              </div>
              <span className="text-sub-title-5 text-[#677281]">참여자</span>
            </button>

            {/* Link Button */}
            <button
              type="button"
              onClick={handleLinkToggle}
              className="flex cursor-pointer flex-col items-center gap-1 rounded-md p-1 transition-colors hover:bg-[#DEE0E4]/40"
              aria-label="참고자료"
            >
              <div
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-md transition-colors ${
                  isLinkActive ? 'bg-[#DEE0E4]' : ''
                }`}
              >
                {isLinkActive ? (
                  <IcLinkActive className="h-[30px] w-[30px] text-grey-600" />
                ) : (
                  <IcLinkInactive className="h-[30px] w-[30px] text-grey-500" />
                )}
              </div>
              <span className="text-sub-title-5 text-[#677281]">참고자료</span>
            </button>
          </div>
        </aside>
      </div>
    );
  }

  // ============================================================================
  // 진행 중 상태 렌더링
  // ============================================================================
  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex flex-1 flex-col px-5 pt-3">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={handleCloseClick}
              className="cursor-pointer rounded-md p-1.5 text-grey-500 hover:bg-grey-100 transition-colors"
              aria-label="닫기"
            >
              <IcClose className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onScaleToggle}
              className="cursor-pointer rounded-md p-1.5 text-grey-500 hover:bg-grey-100 transition-colors"
              aria-label={isExpanded ? '축소' : '확대'}
            >
              {isExpanded ? <IcScaleDown className="h-5 w-5" /> : <IcScaleUp className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="cursor-pointer rounded-md px-3 py-[6px] text-sub-title-3 text-grey-700 hover:bg-grey-100 transition-colors"
            >
              임시저장
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="cursor-pointer rounded-md px-3 py-[6px] text-sub-title-3 bg-blue-200 text-blue-500 hover:bg-blue-300 transition-colors"
            >
              미리보기
            </button>
            <button
              type="button"
              onClick={handleSubmitClick}
              className="cursor-pointer rounded-md px-3 py-[6px] text-sub-title-3 bg-blue-500 text-grey-0 hover:bg-blue-600 transition-colors"
            >
              제출하기
            </button>
            <DropdownMenuRoot>
              <DropdownMenuTrigger>
                <button
                  type="button"
                  className="cursor-pointer rounded-md p-1.5 text-grey-500 hover:bg-grey-100 data-[state=open]:bg-grey-100 transition-colors"
                  aria-label="더보기"
                >
                  <IcMeatball className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent
                  className="flex flex-col gap-1 p-3 rounded-[8px] border border-grey-200 bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)]"
                  align="end"
                  sideOffset={10}
                >
                  <div className="px-3 py-1.5 text-caption-4 text-grey-700 font-medium">
                    {retrospect.projectName}
                  </div>
                  <DropdownMenuItem className="px-3 py-1.5 text-sub-title-3 text-grey-900 rounded-md cursor-pointer hover:bg-grey-50">
                    링크복사
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-3 py-1.5 text-sub-title-3 text-grey-900 rounded-md cursor-pointer hover:bg-grey-50">
                    내보내기
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-3 py-1.5 text-sub-title-3 text-red-300 rounded-md cursor-pointer hover:bg-red-200">
                    삭제하기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </div>
        </header>

        {/* Content */}
        <div className="mt-5 flex-1 overflow-y-auto pl-5">
          {/* Question Navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="cursor-pointer"
              aria-label="이전 질문"
            >
              {currentQuestionIndex === 0 ? (
                <IcChevronDisabledLeft className="h-7 w-7" />
              ) : (
                <IcChevronActiveRight className="h-7 w-7 rotate-180" />
              )}
            </button>
            <div className="rounded-md bg-[#E5E8EB] px-[10px] py-[2px]">
              <span className="text-[13px] font-semibold leading-none text-grey-1000">
                질문 {currentQuestionIndex + 1}
              </span>
            </div>
            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="cursor-pointer"
              aria-label="다음 질문"
            >
              {currentQuestionIndex === questions.length - 1 ? (
                <IcChevronDisabledLeft className="h-7 w-7 rotate-180" />
              ) : (
                <IcChevronActiveRight className="h-7 w-7" />
              )}
            </button>
          </div>

          {/* Question Content */}
          <div className="mt-6 pb-6">
            <h2 className="mb-6 text-lg font-semibold text-grey-900">
              {questions[currentQuestionIndex]}
            </h2>

            {/* Textarea */}
            <div className="flex flex-col gap-0.5">
              <textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="회고 내용을 입력해주세요"
                className="h-32 w-full resize-none rounded-[6px] border border-grey-300 px-4 py-3 text-caption-2 text-grey-900 placeholder:text-grey-400 focus:outline-none"
              />
              <div className="text-right text-caption-3 font-medium text-grey-400">
                {currentAnswer.length}/{maxLength}
              </div>
            </div>

            {/* AI Assistant Section */}
            <div className="mt-[10px]">
              {!isAssistantGenerated && !isAssistantLoading ? (
                // 최초 생성 버튼
                <button
                  type="button"
                  onClick={handleAssistantGenerate}
                  className="flex cursor-pointer items-center rounded-[8px] border border-pink-300 bg-pink-100 px-[10px] py-[6px]"
                >
                  <IcSparklePink className="h-[18px] w-[18px]" />
                  <span className="ml-1 text-title-7 text-pink-400">회고 어시스턴트</span>
                  <IcChevronRightPink className="h-6 w-6" />
                </button>
              ) : isAssistantLoading ? (
                // 로딩 상태 - "생성중"
                <div className="inline-flex h-[38px] items-center rounded-[8px] border border-pink-300 bg-pink-100 px-[10px]">
                  <IcSparklePink className="h-[18px] w-[18px]" />
                  <span className="ml-1 text-title-7 text-pink-400">생성중</span>
                </div>
              ) : (
                // 생성 완료 결과
                <div className="rounded-[8px] border border-pink-300 bg-pink-100 p-4">
                  {/* 헤더 */}
                  <div className="flex items-center">
                    <IcSparklePink className="h-[18px] w-[18px]" />
                    <span className="ml-1 text-title-7 text-pink-400">회고 어시스턴트</span>
                  </div>

                  {/* 생성된 결과 */}
                  <ul className="mt-3 flex flex-col gap-4">
                    {MOCK_ASSISTANT_SUGGESTIONS.map((suggestion) => (
                      <li key={suggestion.title} className="flex gap-2">
                        <div className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full bg-grey-900" />
                        <div className="flex-1">
                          <p className="text-[14px] font-bold text-grey-900">{suggestion.title}</p>
                          <p className="text-[14px] font-medium text-grey-900">
                            {suggestion.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 다시 생성 버튼 (생성 완료 후에만 표시) */}
              {isAssistantGenerated && !isAssistantLoading && (
                <button
                  type="button"
                  onClick={handleAssistantGenerate}
                  className="mt-3 flex cursor-pointer items-center gap-2 text-grey-500"
                >
                  <IcRefresh className="h-4 w-4" />
                  <span className="text-sub-title-4">다시 생성</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Panel (참여자/참고자료) */}
      <div
        className={`border-l border-grey-200 bg-grey-50 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out ${
          isMemberActive ? 'w-[280px] px-5 pt-6' : 'w-0 px-0 pt-0'
        }`}
      >
        <div
          className={`${
            isMemberActive ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200 min-w-[240px]`}
        >
          {/* 전체 질문 섹션 */}
          <div>
            <h3 className="text-sub-title-1 text-grey-1000">전체 질문</h3>
            <div className="mt-4 flex flex-col gap-3">
              {questions.map((question, index) => (
                <button
                  key={`question-${question.slice(0, 20)}`}
                  type="button"
                  onClick={() => handleQuestionSelect(index)}
                  className={`cursor-pointer border-l-2 pl-3 text-left text-sub-title-3 ${
                    currentQuestionIndex === index
                      ? 'border-[#1C8AFF] text-blue-500'
                      : 'border-grey-300 text-grey-800'
                  }`}
                >
                  질문 {index + 1} {question}
                </button>
              ))}
            </div>
          </div>

          {/* 구분선 */}
          <div className="my-6 h-px bg-grey-200" />

          {/* 참여자 섹션 */}
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-sub-title-1 text-grey-1000">참여자</h3>
              <span className="text-sub-title-1 text-[#6B7684]">{MOCK_PARTICIPANTS.length}명</span>
            </div>
            <div className="mt-3 flex flex-col gap-[10px]">
              {MOCK_PARTICIPANTS.map((participant) => (
                <div key={participant.id} className="flex items-center gap-[10px]">
                  <div className="h-6 w-6 rounded-full bg-grey-200" />
                  <span className="text-caption-2 text-grey-900">{participant.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="flex w-[62px] flex-col items-center border-l border-grey-200 bg-grey-50 pt-5">
        <div className="flex flex-col items-center gap-5">
          {/* Open/Collapse Button */}
          <button
            type="button"
            className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md text-grey-500 hover:bg-[#DEE0E4]/40"
            aria-label="펼치기"
          >
            <IcOpen className="h-[30px] w-[30px]" />
          </button>

          {/* Member Button */}
          <button
            type="button"
            onClick={handleMemberToggle}
            className="flex cursor-pointer flex-col items-center gap-1 rounded-md p-1 transition-colors hover:bg-[#DEE0E4]/40"
            aria-label="참여자"
          >
            <div
              className={`flex h-[30px] w-[30px] items-center justify-center rounded-md transition-colors ${
                isMemberActive ? 'bg-[#DEE0E4]' : ''
              }`}
            >
              {isMemberActive ? (
                <IcMemberActive className="h-[30px] w-[30px] text-grey-600" />
              ) : (
                <IcMemberInactive className="h-[30px] w-[30px] text-grey-500" />
              )}
            </div>
            <span className="text-sub-title-5 text-[#677281]">참여자</span>
          </button>

          {/* Link Button */}
          <button
            type="button"
            onClick={handleLinkToggle}
            className="flex cursor-pointer flex-col items-center gap-1 rounded-md p-1 transition-colors hover:bg-[#DEE0E4]/40"
            aria-label="참고자료"
          >
            <div
              className={`flex h-[30px] w-[30px] items-center justify-center rounded-md transition-colors ${
                isLinkActive ? 'bg-[#DEE0E4]' : ''
              }`}
            >
              {isLinkActive ? (
                <IcLinkActive className="h-[30px] w-[30px] text-grey-600" />
              ) : (
                <IcLinkInactive className="h-[30px] w-[30px] text-grey-500" />
              )}
            </div>
            <span className="text-sub-title-5 text-[#677281]">참고자료</span>
          </button>
        </div>
      </aside>

      {/* 제출 확인 모달 */}
      <SubmitConfirmModal
        open={isSubmitModalOpen}
        onOpenChange={setIsSubmitModalOpen}
        onConfirm={handleSubmitConfirm}
      />

      {/* 닫기 확인 모달 */}
      <CloseConfirmModal
        open={isCloseModalOpen}
        onOpenChange={setIsCloseModalOpen}
        onSave={handleSaveAndClose}
        onLeave={handleLeaveWithoutSave}
      />

      {/* 미리보기 모달 */}
      <PreviewModal
        open={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
        questions={questions}
        answers={answers}
      />
    </div>
  );
}

export { RetrospectiveDetailPanel, type RetrospectiveDetailPanelProps, type Retrospect };
