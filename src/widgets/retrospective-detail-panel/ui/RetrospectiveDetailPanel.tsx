/**
 * RetrospectiveDetailPanel - 회고 진행 사이드 패널
 *
 * 오늘 회고 카드 클릭 시 우측에서 나타나는 회고 진행 패널입니다.
 * 질문별 회고 내용을 입력하고 제출할 수 있습니다.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useAssistantGuide,
  useCreateParticipant,
  useDeleteRetrospect,
  useSaveDraft,
} from '@/features/retrospective/api/retrospective.mutations';
import {
  useReferences,
  useRetrospectDetail,
} from '@/features/retrospective/api/retrospective.queries';
import type { GuideItem } from '@/features/retrospective/model/types';
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
  onSubmitted?: () => void;
}

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

// ============================================================================
// Submission Tracking Helpers (오늘 제출한 회고 추적)
// ============================================================================

const SUBMITTED_STORAGE_KEY_PREFIX = 'retrospect_submitted_';

function getSubmittedStorageKey(retrospectId: number): string {
  return `${SUBMITTED_STORAGE_KEY_PREFIX}${retrospectId}`;
}

/**
 * 해당 회고가 오늘 제출되었는지 확인
 * 오늘 날짜와 제출 날짜가 같으면 true
 */
export function isSubmittedToday(retrospectId: number): boolean {
  try {
    const key = getSubmittedStorageKey(retrospectId);
    const submittedDate = localStorage.getItem(key);
    if (submittedDate) {
      const today = new Date().toISOString().split('T')[0];
      return submittedDate === today;
    }
  } catch {
    // 파싱 실패 시 false 반환
  }
  return false;
}

// ============================================================================
// Component
// ============================================================================

function RetrospectiveDetailPanel({
  retrospect,
  onClose,
  isExpanded = false,
  onScaleToggle,
  onSubmitted: _onSubmitted,
}: RetrospectiveDetailPanelProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isMemberActive, setIsMemberActive] = useState(false);
  const [isLinkActive, setIsLinkActive] = useState(false);
  const [lastSelectedPanel, setLastSelectedPanel] = useState<'member' | 'link'>('member');
  // 질문별 AI 어시스턴트 상태 (질문 인덱스 → 가이드 배열)
  const [assistantGuidesMap, setAssistantGuidesMap] = useState<Record<number, GuideItem[]>>({});
  const [assistantLoadingIndex, setAssistantLoadingIndex] = useState<number | null>(null);
  const hasRegisteredParticipant = useRef(false);
  const prevRetrospectIdRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { showToast } = useToast();

  // 회고 ID 변경 시 모든 상태 리셋
  useEffect(() => {
    if (
      prevRetrospectIdRef.current !== null &&
      prevRetrospectIdRef.current !== retrospect.retrospectId
    ) {
      // 이전 회고와 다른 회고가 선택되면 모든 상태 초기화
      setCurrentQuestionIndex(0);
      setAnswers([]);

      setIsMemberActive(false);
      setIsLinkActive(false);
      setAssistantGuidesMap({});
      setAssistantLoadingIndex(null);
      hasRegisteredParticipant.current = false;
      // 진행 중인 API 호출 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    }
    prevRetrospectIdRef.current = retrospect.retrospectId;
  }, [retrospect.retrospectId]);

  // API Queries - 회고 상세 정보 및 참고자료 조회
  const { data: detailData, isLoading: isDetailLoading } = useRetrospectDetail(
    retrospect.retrospectId
  );
  const { data: referencesData, isLoading: isReferencesLoading } = useReferences(
    retrospect.retrospectId
  );

  // API 데이터 추출
  const questions = useMemo(() => {
    return (
      detailData?.result?.questions?.sort((a, b) => a.index - b.index).map((q) => q.content) ?? []
    );
  }, [detailData]);

  const members = useMemo(() => {
    return detailData?.result?.members ?? [];
  }, [detailData]);

  const references = useMemo(() => {
    return referencesData?.result ?? [];
  }, [referencesData]);

  // API Mutations
  const createParticipantMutation = useCreateParticipant(retrospect.retrospectId);
  const saveDraftMutation = useSaveDraft(retrospect.retrospectId);
  // questionId는 1-based index (API 스펙에 따라)
  const assistantMutation = useAssistantGuide(retrospect.retrospectId, currentQuestionIndex + 1);
  const deleteRetrospect = useDeleteRetrospect();

  // 링크 복사 핸들러
  const handleCopyLink = async () => {
    const url = `${window.location.origin}/retrospects/${retrospect.retrospectId}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast({ variant: 'success', message: '링크가 복사되었습니다.' });
    } catch {
      showToast({ variant: 'warning', message: '링크 복사에 실패했습니다.' });
    }
  };

  // 내보내기 핸들러 (PDF 파일 다운로드)
  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const exportUrl = `${baseUrl}/api/v1/retrospects/${retrospect.retrospectId}/export`;
    window.open(exportUrl, '_blank');
  };

  // 삭제 핸들러
  const handleDelete = () => {
    deleteRetrospect.mutate(retrospect.retrospectId, {
      onSuccess: () => {
        showToast({ variant: 'success', message: '회고가 삭제되었습니다.' });
        onClose();
      },
      onError: () => {
        showToast({ variant: 'warning', message: '삭제에 실패했습니다.' });
      },
    });
  };

  // 회고 참여 시 참석자 등록 (패널 열릴 때 한 번만 호출)
  useEffect(() => {
    if (!hasRegisteredParticipant.current) {
      hasRegisteredParticipant.current = true;
      createParticipantMutation.mutate();
    }
  }, [createParticipantMutation]);

  // 질문 데이터가 로드되면 answers 배열 초기화
  useEffect(() => {
    if (questions.length > 0 && answers.length === 0) {
      // 먼저 로컬스토리지에서 임시저장 데이터 확인
      const draft = loadDraftFromStorage(retrospect.retrospectId);
      if (draft && draft.length === questions.length) {
        setAnswers(draft);
      } else {
        // 임시저장 데이터가 없으면 빈 배열로 초기화
        setAnswers(questions.map(() => ''));
      }
    }
  }, [questions, answers.length, retrospect.retrospectId]);

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
      setLastSelectedPanel('member');
    }
  };

  const handleLinkToggle = () => {
    setIsLinkActive(!isLinkActive);
    if (!isLinkActive) {
      setIsMemberActive(false);
      setLastSelectedPanel('link');
    }
  };

  // 사이드바 토글 버튼 (IcOpen) 핸들러
  const handleSidebarToggle = () => {
    const isPanelOpen = isMemberActive || isLinkActive;

    if (isPanelOpen) {
      // 패널이 열려있으면 닫기
      setIsMemberActive(false);
      setIsLinkActive(false);
    } else {
      // 패널이 닫혀있으면 마지막 선택된 패널 열기
      if (lastSelectedPanel === 'link') {
        setIsLinkActive(true);
      } else {
        setIsMemberActive(true);
      }
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
    // TODO: 제출 확인 모달 재구현
  };

  // 닫기 버튼 클릭 핸들러
  const handleCloseClick = () => {
    onClose();
  };

  // 임시저장 핸들러
  const handleSaveDraft = async () => {
    // localStorage에 먼저 저장 (빠른 피드백)
    saveDraftToStorage(retrospect.retrospectId, answers);

    try {
      await saveDraftMutation.mutateAsync({
        drafts: answers.map((content, index) => ({
          questionNumber: index + 1,
          content: content || null,
        })),
      });
      showToast({ variant: 'success', message: '임시저장 되었어요!' });
    } catch {
      showToast({
        variant: 'warning',
        message: '서버 저장에 실패했지만, 로컬에 저장되었어요.',
      });
    }
  };

  // 질문 변경 또는 언마운트 시 진행 중인 API 호출 취소
  // biome-ignore lint/correctness/useExhaustiveDependencies: 의도적으로 질문/회고 변경 시 cleanup 실행
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setAssistantLoadingIndex(null);
    };
  }, [currentQuestionIndex, retrospect.retrospectId]);

  // 현재 질문의 어시스턴트 가이드
  const currentAssistantGuides = assistantGuidesMap[currentQuestionIndex];
  const isCurrentQuestionLoading = assistantLoadingIndex === currentQuestionIndex;

  // AI 어시스턴트 생성 핸들러
  const handleAssistantGenerate = async () => {
    if (isCurrentQuestionLoading) return;

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const questionIndexAtStart = currentQuestionIndex;

    setAssistantLoadingIndex(currentQuestionIndex);

    try {
      const response = await assistantMutation.mutateAsync({
        content: currentAnswer || null,
      });

      // 요청이 취소되었거나 질문이 바뀌었으면 결과 무시
      if (controller.signal.aborted || currentQuestionIndex !== questionIndexAtStart) {
        return;
      }

      setAssistantGuidesMap((prev) => ({
        ...prev,
        [questionIndexAtStart]: response.result.guides,
      }));
    } catch (error) {
      // AbortError는 무시
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      showToast({
        variant: 'warning',
        message: 'AI 어시스턴트 생성에 실패했어요.',
      });
    } finally {
      if (!controller.signal.aborted && currentQuestionIndex === questionIndexAtStart) {
        setAssistantLoadingIndex(null);
      }
    }
  };

  // ============================================================================
  // 로딩 상태 렌더링
  // ============================================================================
  if (isDetailLoading || isReferencesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
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
              onClick={() => {
                /* TODO: 미리보기 모달 재구현 */
              }}
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
                  className="flex flex-col gap-3 p-3 rounded-[8px] border border-grey-200 bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)] min-w-[160px]"
                  align="end"
                  sideOffset={4}
                >
                  <div className="text-caption-4 text-grey-700 font-medium">
                    {retrospect.projectName}
                  </div>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onSelect={handleCopyLink}
                  >
                    <span className="text-sub-title-3 text-grey-900">링크복사</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onSelect={handleExport}
                  >
                    <span className="text-sub-title-3 text-grey-900">내보내기</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onSelect={handleDelete}
                  >
                    <span className="text-sub-title-3 text-red-300">삭제하기</span>
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
              {!currentAssistantGuides && !isCurrentQuestionLoading ? (
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
              ) : isCurrentQuestionLoading ? (
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
                    {currentAssistantGuides?.map((guide) => (
                      <li key={guide.title} className="flex gap-2">
                        <div className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full bg-grey-900" />
                        <div className="flex-1">
                          <p className="text-[14px] font-bold text-grey-900">{guide.title}</p>
                          <p className="text-[14px] font-medium text-grey-900">
                            {guide.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 다시 생성 버튼 (생성 완료 후에만 표시) */}
              {currentAssistantGuides && !isCurrentQuestionLoading && (
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
        className={`border-l border-grey-200 bg-grey-50 overflow-y-auto overflow-x-hidden ${
          isMemberActive || isLinkActive ? 'w-[280px] px-5 pt-6' : 'w-0 px-0 pt-0'
        }`}
      >
        <div
          className={`${
            isMemberActive || isLinkActive ? 'opacity-100' : 'opacity-0'
          } min-w-[240px]`}
        >
          {/* 참여자 패널 */}
          {isMemberActive && (
            <>
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
                  <span className="text-sub-title-1 text-[#6B7684]">{members.length}명</span>
                </div>
                <div className="mt-3 flex flex-col gap-[10px]">
                  {members.map((member) => (
                    <div key={member.memberId} className="flex items-center gap-[10px]">
                      <div className="h-6 w-6 rounded-full bg-grey-200" />
                      <span className="text-caption-2 text-grey-900">{member.userName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 참고자료 패널 */}
          {isLinkActive && (
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-sub-title-1 text-grey-1000">참고자료</h3>
                <span className="text-sub-title-1 text-[#6B7684]">{references.length}개</span>
              </div>
              <div className="mt-3 flex flex-col gap-[10px]">
                {references.length > 0 ? (
                  references.map((ref) => (
                    <a
                      key={ref.referenceId}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-caption-2 text-blue-500 hover:underline"
                    >
                      <IcLinkActive className="h-4 w-4 shrink-0" />
                      <span className="truncate">{ref.urlName || ref.url}</span>
                    </a>
                  ))
                ) : (
                  <p className="text-caption-3 text-grey-500">등록된 참고자료가 없습니다.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="flex w-[62px] flex-col items-center border-l border-grey-200 bg-grey-50 pt-5">
        <div className="flex flex-col items-center gap-5">
          {/* Open/Collapse Button */}
          <button
            type="button"
            onClick={handleSidebarToggle}
            className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md text-grey-500 hover:text-grey-700"
            aria-label={isMemberActive || isLinkActive ? '접기' : '펼치기'}
          >
            <IcOpen className="h-[30px] w-[30px]" />
          </button>

          {/* Member Button */}
          <button
            type="button"
            onClick={handleMemberToggle}
            className="group flex cursor-pointer flex-col items-center gap-1 rounded-md p-1"
            aria-label="참여자"
          >
            <div
              className={`flex h-[30px] w-[30px] items-center justify-center rounded-md ${
                isMemberActive ? 'bg-[#DEE0E4]' : ''
              }`}
            >
              {isMemberActive ? (
                <IcMemberActive className="h-[30px] w-[30px] text-grey-600" />
              ) : (
                <IcMemberInactive className="h-[30px] w-[30px] text-grey-500 group-hover:text-grey-700" />
              )}
            </div>
            <span className="text-sub-title-5 text-[#677281] group-hover:text-grey-900">
              참여자
            </span>
          </button>

          {/* Link Button */}
          <button
            type="button"
            onClick={handleLinkToggle}
            className="group flex cursor-pointer flex-col items-center gap-1 rounded-md p-1"
            aria-label="참고자료"
          >
            <div
              className={`flex h-[30px] w-[30px] items-center justify-center rounded-md ${
                isLinkActive ? 'bg-[#DEE0E4]' : ''
              }`}
            >
              {isLinkActive ? (
                <IcLinkActive className="h-[30px] w-[30px] text-grey-600" />
              ) : (
                <IcLinkInactive className="h-[30px] w-[30px] text-grey-500 group-hover:text-grey-700" />
              )}
            </div>
            <span className="text-sub-title-5 text-[#677281] group-hover:text-grey-900">
              참고자료
            </span>
          </button>
        </div>
      </aside>

      {/* TODO: 모달 컴포넌트 재구현 필요 */}
    </div>
  );
}

export { RetrospectiveDetailPanel, type RetrospectiveDetailPanelProps, type Retrospect };
