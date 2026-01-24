import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { generateUUID } from '@/lib/utils';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  answeredQuestions: number;
}

export interface Question {
  title: string;
}

export interface Answer {
  content: string;
  participantId: string;
  questionIndex: number;
}

export interface Retrospective {
  id: string;
  title: string;
  description: string;
  sprint: number;
  status: 'in_progress' | 'completed' | 'planned';
  retrospectiveType: 'KPT';
  participants: Participant[];
  totalQuestions: number;
  questions: Question[];
  answers: Answer[];
  endTime: string;
}

interface RetrospectiveStore {
  retrospectives: Retrospective[];
  activeRetrospectiveId: string | null;
  addRetrospective: (retrospective: Omit<Retrospective, 'id' | 'createdAt'>) => void;
  updateParticipantProgress: (
    retrospectiveId: string,
    participantId: string,
    answeredQuestions: number
  ) => void;
  completeOtherParticipants: (retrospectiveId: string, excludeParticipantId: string) => void;
  setActiveRetrospective: (id: string | null) => void;
  addAnswer: (retrospectiveId: string, answer: Answer) => void;
  generateMockAnswers: (retrospectiveId: string, excludeParticipantId: string) => void;
  completeRetrospective: (retrospectiveId: string) => void;
}

export const useRetrospectiveStore = create<RetrospectiveStore>()(
  devtools((set) => ({
    retrospectives: [],
    activeRetrospectiveId: null,
    addRetrospective: (retrospective) =>
      set((state) => ({
        retrospectives: [
          ...state.retrospectives,
          {
            ...retrospective,
            id: generateUUID(),
          },
        ],
      })),
    updateParticipantProgress: (retrospectiveId, participantId, answeredQuestions) =>
      set((state) => ({
        retrospectives: state.retrospectives.map((r) =>
          r.id === retrospectiveId
            ? {
                ...r,
                participants: r.participants.map((p) =>
                  p.id === participantId ? { ...p, answeredQuestions } : p
                ),
              }
            : r
        ),
      })),
    completeOtherParticipants: (retrospectiveId, excludeParticipantId) =>
      set((state) => ({
        retrospectives: state.retrospectives.map((r) =>
          r.id === retrospectiveId
            ? {
                ...r,
                participants: r.participants.map((p) =>
                  p.id === excludeParticipantId ? p : { ...p, answeredQuestions: r.totalQuestions }
                ),
              }
            : r
        ),
      })),
    setActiveRetrospective: (id) => set({ activeRetrospectiveId: id }),
    addAnswer: (retrospectiveId, answer) =>
      set((state) => ({
        retrospectives: state.retrospectives.map((r) =>
          r.id === retrospectiveId
            ? {
                ...r,
                answers: [...r.answers, answer],
              }
            : r
        ),
      })),
    generateMockAnswers: (retrospectiveId, excludeParticipantId) =>
      set((state) => ({
        retrospectives: state.retrospectives.map((r) => {
          if (r.id !== retrospectiveId) return r;

          const mockAnswers: Answer[] = [];
          const otherParticipants = r.participants.filter((p) => p.id !== excludeParticipantId);

          for (const participant of otherParticipants) {
            for (let questionIndex = 0; questionIndex < r.totalQuestions; questionIndex++) {
              mockAnswers.push({
                content: `${participant.name}님의 ${r.questions[questionIndex]?.title}에 대한 답변입니다. 이번 스프린트에서 ${questionIndex + 1}번째 질문에 대해 다양한 경험과 인사이트를 얻을 수 있었습니다.`,
                participantId: participant.id,
                questionIndex,
              });
            }
          }

          return {
            ...r,
            answers: [...r.answers, ...mockAnswers],
          };
        }),
      })),
    completeRetrospective: (retrospectiveId) =>
      set((state) => ({
        retrospectives: state.retrospectives.map((r) =>
          r.id === retrospectiveId
            ? {
                ...r,
                endTime: new Date().toISOString(),
                status: 'completed' as const,
              }
            : r
        ),
      })),
  }))
);
