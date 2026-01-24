import type { Participant } from '@/store/retrospective';

export function getProgressStatus(participant: Participant, totalQuestions: number): string {
  if (participant.answeredQuestions >= totalQuestions) {
    return '완료';
  }
  return `${participant.answeredQuestions}번 질문 답변중...`;
}

export function getRetrospectiveProgress(
  participants: Participant[],
  totalQuestions: number
): {
  completed: number;
  total: number;
  percentage: number;
} {
  const completed = participants.filter((p) => p.answeredQuestions >= totalQuestions).length;
  const total = participants.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}
