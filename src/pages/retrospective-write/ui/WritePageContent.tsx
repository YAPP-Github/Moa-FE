/**
 * WritePageContent - 회고 작성 페이지 메인 콘텐츠
 *
 * 질문별 답변 작성, AI 어시스턴트, 사이드바, 하단 바를 조립합니다.
 */

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { PreviewModal } from './PreviewModal';
import { SaveDraftDialog } from './SaveDraftDialog';
import { SubmitConfirmModal } from './SubmitConfirmModal';
import { SubmitSuccessModal } from './SubmitSuccessModal';
import { WriteBottomBar } from './WriteBottomBar';
import { WriteContent } from './WriteContent';
import { WriteSidebar } from './WriteSidebar';
import {
  useAssistantGuide,
  useCreateParticipant,
  useSaveDraft,
  useSubmitRetrospect,
} from '@/features/retrospective/api/retrospective.mutations';
import {
  retrospectiveQueryKeys,
  useReferences,
} from '@/features/retrospective/api/retrospective.queries';
import type { GuideItem, RetrospectDetailResponse } from '@/features/retrospective/model/types';
import { useRetroRooms } from '@/features/team/api/team.queries';
import { useToast } from '@/shared/ui/toast/Toast';
import { RetrospectivePageHeader } from '@/widgets/header/ui/RetrospectivePageHeader';

// ============================================================================
// LocalStorage Helpers
// ============================================================================

const DRAFT_STORAGE_KEY_PREFIX = 'retrospect_draft_';

function loadDraftFromStorage(retrospectId: number): string[] | null {
  try {
    const key = `${DRAFT_STORAGE_KEY_PREFIX}${retrospectId}`;
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
    const key = `${DRAFT_STORAGE_KEY_PREFIX}${retrospectId}`;
    localStorage.setItem(key, JSON.stringify(answers));
  } catch {
    // 저장 실패 시 무시
  }
}

// ============================================================================
// Component
// ============================================================================

interface WritePageContentProps {
  retrospectId: number;
  teamId: number;
  detail: RetrospectDetailResponse;
}

export function WritePageContent({ retrospectId, teamId, detail }: WritePageContentProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // ---- State ----
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [assistantGuidesMap, setAssistantGuidesMap] = useState<Record<number, GuideItem[]>>({});
  const [assistantLoadingIndex, setAssistantLoadingIndex] = useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
  const [submitSuccessOpen, setSubmitSuccessOpen] = useState(false);
  const [saveDraftDialogOpen, setSaveDraftDialogOpen] = useState(false);
  const hasRegisteredParticipant = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const savedAnswersRef = useRef<string[]>([]);

  // ---- Derived Data ----
  const questions = useMemo(
    () => detail.questions.sort((a, b) => a.index - b.index).map((q) => q.content),
    [detail.questions]
  );

  const { data: referencesData } = useReferences(retrospectId);
  const references = useMemo(() => referencesData?.result ?? [], [referencesData]);

  const { data: retroRoomsData } = useRetroRooms();
  const teamName = useMemo(
    () => retroRoomsData.result.find((r) => r.retroRoomId === teamId)?.retroRoomName ?? '',
    [retroRoomsData, teamId]
  );

  // ---- Mutations ----
  const createParticipantMutation = useCreateParticipant(retrospectId);
  const saveDraftMutation = useSaveDraft(retrospectId);
  const submitMutation = useSubmitRetrospect(retrospectId);
  const assistantMutation = useAssistantGuide(retrospectId, currentQuestionIndex + 1);

  // ---- 참가자 등록 (NOT_PARTICIPATED인 경우 한 번만) ----
  useEffect(() => {
    if (detail.currentUserStatus === 'NOT_PARTICIPATED' && !hasRegisteredParticipant.current) {
      hasRegisteredParticipant.current = true;
      createParticipantMutation.mutate();
    }
  }, [detail.currentUserStatus, createParticipantMutation]);

  // ---- 답변 초기화 (질문 로드 후) ----
  useEffect(() => {
    if (questions.length > 0 && answers.length === 0) {
      const draft = loadDraftFromStorage(retrospectId);
      if (draft && draft.length === questions.length) {
        setAnswers(draft);
        savedAnswersRef.current = draft;
      } else {
        const initial = questions.map(() => '');
        setAnswers(initial);
        savedAnswersRef.current = initial;
      }
    }
  }, [questions, answers.length, retrospectId]);

  // ---- 질문 변경 시 abort 처리 ----
  // biome-ignore lint/correctness/useExhaustiveDependencies: 의도적으로 질문 변경 시 cleanup 실행
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setAssistantLoadingIndex(null);
    };
  }, [currentQuestionIndex, retrospectId]);

  // ---- Handlers ----
  const currentAnswer = answers[currentQuestionIndex] || '';
  const maxLength = 1000;

  const handleAnswerChange = (value: string) => {
    if (value.length <= maxLength) {
      setAnswers((prev) => {
        const next = [...prev];
        next[currentQuestionIndex] = value;
        return next;
      });
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
  };

  const handleSaveDraft = async () => {
    saveDraftToStorage(retrospectId, answers);
    await saveDraftMutation.mutateAsync({
      drafts: answers.map((content, index) => ({
        questionNumber: index + 1,
        content: content || null,
      })),
    });
    savedAnswersRef.current = [...answers];
    queryClient.invalidateQueries({ queryKey: retrospectiveQueryKeys.list(teamId) });
    showToast({ variant: 'success', message: '임시 저장 완료!' });
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleSubmit = () => {
    const hasEmptyAnswer = answers.some((answer) => answer.trim() === '');
    if (hasEmptyAnswer) {
      showToast({ variant: 'warning', message: '모든 회고에 답변을 작성해야 제출할 수 있어요' });
      return;
    }
    setSubmitConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      await submitMutation.mutateAsync({
        answers: answers.map((content, index) => ({
          questionNumber: index + 1,
          content,
        })),
      });
      setSubmitConfirmOpen(false);
      setSubmitSuccessOpen(true);
    } catch {
      setSubmitConfirmOpen(false);
    }
  };

  const invalidateAfterSubmit = () => {
    queryClient.invalidateQueries({ queryKey: retrospectiveQueryKeys.detail(retrospectId) });
    queryClient.invalidateQueries({ queryKey: ['retrospects'] });
  };

  const handleSuccessClose = () => {
    setSubmitSuccessOpen(false);
    invalidateAfterSubmit();
    navigate(`/teams/${teamId}`, { replace: true });
  };

  const handleSuccessConfirm = () => {
    setSubmitSuccessOpen(false);
    invalidateAfterSubmit();
    navigate(`/teams/${teamId}/retrospects/${retrospectId}`, { replace: true });
  };

  const handleAssistantGenerate = async () => {
    if (assistantLoadingIndex === currentQuestionIndex) return;

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

      if (controller.signal.aborted) return;

      setAssistantGuidesMap((prev) => ({
        ...prev,
        [questionIndexAtStart]: response.result.guides,
      }));
    } catch {
      // 글로벌 에러 핸들러에서 서버 메시지 토스트 처리
    } finally {
      if (!controller.signal.aborted) {
        setAssistantLoadingIndex(null);
      }
    }
  };

  // ---- 홈 이동 시 임시저장 팝업 ----
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hasUnsavedChanges = answers.some((a, i) => a !== (savedAnswersRef.current[i] ?? ''));
    if (hasUnsavedChanges) {
      e.preventDefault();
      setSaveDraftDialogOpen(true);
    }
  };

  const handleSaveDraftAndLeave = async () => {
    saveDraftToStorage(retrospectId, answers);
    try {
      await saveDraftMutation.mutateAsync({
        drafts: answers.map((content, index) => ({
          questionNumber: index + 1,
          content: content || null,
        })),
      });
      savedAnswersRef.current = [...answers];
      queryClient.invalidateQueries({ queryKey: retrospectiveQueryKeys.list(teamId) });
      showToast({ variant: 'success', message: '임시 저장 완료!' });
    } catch {
      // 글로벌 에러 핸들러에서 처리
    }
    setSaveDraftDialogOpen(false);
    navigate(`/teams/${teamId}`);
  };

  const handleLeaveWithoutSave = () => {
    setSaveDraftDialogOpen(false);
    navigate(`/teams/${teamId}`);
  };

  const currentAssistantGuides = assistantGuidesMap[currentQuestionIndex];
  const isCurrentQuestionLoading = assistantLoadingIndex === currentQuestionIndex;

  return (
    <>
      <RetrospectivePageHeader teamId={teamId} title={detail.title} onHomeClick={handleHomeClick} />
      <div className="flex h-[calc(100vh-54px)] flex-col bg-white">
        <div className="flex min-h-0 flex-1">
          {/* Main Content */}
          <div className="flex flex-1 flex-col">
            <div className="mx-auto flex w-full max-w-[802px] flex-1 flex-col overflow-y-auto pt-10">
              <WriteContent
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                currentAnswer={currentAnswer}
                maxLength={maxLength}
                onAnswerChange={handleAnswerChange}
                onPrevQuestion={handlePrevQuestion}
                onNextQuestion={handleNextQuestion}
                assistantGuides={currentAssistantGuides}
                isAssistantLoading={isCurrentQuestionLoading}
                onAssistantGenerate={handleAssistantGenerate}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <WriteSidebar
            questions={questions}
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionSelect={handleQuestionSelect}
            references={references}
          />
        </div>

        {/* Bottom Bar */}
        <WriteBottomBar
          title={detail.title}
          teamName={teamName}
          onPreview={handlePreview}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          isSaving={saveDraftMutation.isPending}
          isSubmitting={submitMutation.isPending}
        />

        {/* Modals */}
        <PreviewModal
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          questions={questions}
          answers={answers}
        />
        <SubmitConfirmModal
          open={submitConfirmOpen}
          onOpenChange={setSubmitConfirmOpen}
          questions={questions}
          answers={answers}
          onSubmit={handleConfirmSubmit}
          isSubmitting={submitMutation.isPending}
        />
        <SubmitSuccessModal
          open={submitSuccessOpen}
          onClose={handleSuccessClose}
          onConfirm={handleSuccessConfirm}
        />
        <SaveDraftDialog
          open={saveDraftDialogOpen}
          onOpenChange={setSaveDraftDialogOpen}
          onSaveAndLeave={handleSaveDraftAndLeave}
          onLeave={handleLeaveWithoutSave}
          isSaving={saveDraftMutation.isPending}
        />
      </div>
    </>
  );
}
