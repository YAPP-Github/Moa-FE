export const RetrospectMethod = {
  KPT: 'KPT',
  FOUR_L: 'FOUR_L',
  FIVE_F: 'FIVE_F',
  PMI: 'PMI',
  FREE: 'FREE',
} as const;

export type RetrospectMethod = (typeof RetrospectMethod)[keyof typeof RetrospectMethod];

export const RetrospectListStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  DRAFT: 'DRAFT',
  COMPLETED: 'COMPLETED',
} as const;

export type RetrospectListStatus = (typeof RetrospectListStatus)[keyof typeof RetrospectListStatus];

export const RETROSPECT_METHOD_LABELS: Record<string, string> = {
  [RetrospectMethod.KPT]: 'KPT',
  [RetrospectMethod.FOUR_L]: '4L',
  [RetrospectMethod.FIVE_F]: '5F',
  [RetrospectMethod.PMI]: 'PMI',
  [RetrospectMethod.FREE]: '자유 회고',
};

export const RETROSPECT_METHOD_DESCRIPTIONS: Record<string, string> = {
  [RetrospectMethod.KPT]: '스프린트 단위 프로젝트를 회고할 때',
  [RetrospectMethod.FOUR_L]: '팀 분위기와 관계, 배움을 돌아볼 때',
  [RetrospectMethod.FIVE_F]: '중장기 프로젝트를 회고할 때',
  [RetrospectMethod.PMI]: '빠른 회고가 필요할 때',
  [RetrospectMethod.FREE]: '맞춤형 회고를 진행할때',
};

export const RETROSPECT_METHOD_DETAILS: Record<string, string[]> = {
  [RetrospectMethod.KPT]: [
    '이번 일을 통해 유지했으면 하는 문화나 방식이 있나요?',
    '이번 일을 하는 중 문제라고 판단되었던 점이 있나요?',
    '이번 일을 겪으면서 새롭게 시도해보고 싶은 게 있나요?',
  ],
  [RetrospectMethod.FOUR_L]: [
    '이번 일을 하면서 기억에 남는 좋은 순간이 있었나요?',
    '이번 일을 통해 새롭게 알게 되거나 성장한 부분이 있나요?',
    '이번 일을 하면서 아쉬웠거나 더 필요했던 게 있나요?',
    '앞으로 일할 때 이런 부분이 개선되면 좋겠다고 생각한 게 있나요?',
  ],
  [RetrospectMethod.FIVE_F]: [
    '이번 업무를 통해 새롭게 알게 된 사실이 있나요?',
    '업무 중 가장 힘들었던 순간과 가장 뿌듯했던 순간은 언제였나요?',
    '업무를 진행하면서 예상하지 못했던 발견이 있었나요?',
    '비슷한 업무를 다시 한다면 어떤 점을 다르게 하고 싶나요?',
    '함께 업무를 진행한 분들에게 하고 싶은 이야기가 있나요?',
  ],
  [RetrospectMethod.PMI]: [
    '이번 일을 통해 도움이 되었던 문화나 방법은 무엇인가요?',
    '이번 일을 통해 안 좋은 영향을 끼쳤던 것은 무엇인가요?',
    '이번 일을 하면서 새롭게 발견한 점은 무엇인가요?',
  ],
  [RetrospectMethod.FREE]: ['정해진 형식 없이 자유롭게 회고를 작성할 수 있어요.'],
};

export const MAX_QUESTIONS = 5;
export const MAX_REFERENCE_URLS = 10;

export const RETROSPECTIVE_TAB_LABELS: Record<string, string> = {
  question: '질문',
  member: '팀원',
  analysis: '회고 분석',
};

export const QUESTION_CATEGORIES = [
  'QUESTION_1',
  'QUESTION_2',
  'QUESTION_3',
  'QUESTION_4',
  'QUESTION_5',
] as const;

export const RETROSPECT_STATUS_LABELS: Record<string, string> = {
  [RetrospectListStatus.IN_PROGRESS]: '진행중',
  [RetrospectListStatus.DRAFT]: '임시저장',
  [RetrospectListStatus.COMPLETED]: '종료',
};
