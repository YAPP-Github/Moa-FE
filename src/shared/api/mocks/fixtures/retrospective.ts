export const retrospects: Record<
  number,
  {
    retrospectId: number;
    projectName: string;
    retrospectMethod: string;
    retrospectDate: string;
    participantCount: number;
    status: string;
    members?: { memberId: number; userName: string }[];
  }[]
> = {
  1: [
    {
      retrospectId: 101,
      projectName: '스프린트 1 회고',
      retrospectMethod: 'KPT',
      retrospectDate: '2026-02-22T14:00:00',
      participantCount: 3,
      status: 'IN_PROGRESS',
    },
    {
      retrospectId: 102,
      projectName: '온보딩 개선',
      retrospectMethod: 'FOUR_L',
      retrospectDate: '2026-02-24T10:00:00',
      participantCount: 2,
      status: 'IN_PROGRESS',
    },
    {
      retrospectId: 103,
      projectName: '디자인 시스템 구축',
      retrospectMethod: 'PMI',
      retrospectDate: '2026-02-25T15:00:00',
      participantCount: 3,
      status: 'DRAFT',
    },
    {
      retrospectId: 104,
      projectName: '1월 팀 회고',
      retrospectMethod: 'KPT',
      retrospectDate: '2026-01-31T14:00:00',
      participantCount: 3,
      status: 'COMPLETED',
      members: [
        { memberId: 1, userName: '홍길동' },
        { memberId: 2, userName: '김철수' },
        { memberId: 3, userName: '이영희' },
      ],
    },
    {
      retrospectId: 105,
      projectName: '킥오프 회고',
      retrospectMethod: 'FIVE_F',
      retrospectDate: '2026-01-15T10:00:00',
      participantCount: 3,
      status: 'COMPLETED',
      members: [
        { memberId: 1, userName: '홍길동' },
        { memberId: 2, userName: '김철수' },
        { memberId: 3, userName: '이영희' },
      ],
    },
  ],
  2: [
    {
      retrospectId: 201,
      projectName: 'API 리팩토링',
      retrospectMethod: 'KPT',
      retrospectDate: '2026-02-23T14:00:00',
      participantCount: 2,
      status: 'IN_PROGRESS',
    },
    {
      retrospectId: 202,
      projectName: 'DB 마이그레이션',
      retrospectMethod: 'PMI',
      retrospectDate: '2026-02-10T10:00:00',
      participantCount: 2,
      status: 'COMPLETED',
      members: [
        { memberId: 1, userName: '김민지' },
        { memberId: 4, userName: '손민수' },
      ],
    },
  ],
  3: [
    {
      retrospectId: 301,
      projectName: 'UI 컴포넌트 리뷰',
      retrospectMethod: 'FOUR_L',
      retrospectDate: '2026-02-24T11:00:00',
      participantCount: 4,
      status: 'IN_PROGRESS',
    },
  ],
};

export const retrospectDetails: Record<
  number,
  {
    currentUserStatus: 'NOT_JOINED' | 'DRAFT' | 'SUBMITTED';
    members: { memberId: number; userName: string }[];
    questions: { content: string; index: number }[];
    retroCategory: string;
    retroRoomId: number;
    startTime: string;
    title: string;
    totalCommentCount: number;
    totalLikeCount: number;
  }
> = {
  101: {
    currentUserStatus: 'DRAFT',
    members: [
      { memberId: 1, userName: '홍길동' },
      { memberId: 2, userName: '김철수' },
      { memberId: 3, userName: '이영희' },
    ],
    questions: [
      { content: '이번 일을 통해 유지했으면 하는 문화나 방식이 있나요?', index: 0 },
      { content: '이번 일을 하는 중 문제라고 판단되었던 점이 있나요?', index: 1 },
      { content: '이번 일을 겪으면서 새롭게 시도해보고 싶은 게 있나요?', index: 2 },
    ],
    retroCategory: 'KPT',
    retroRoomId: 1,
    startTime: '2026-02-20T14:00:00',
    title: '스프린트 1 회고',
    totalCommentCount: 5,
    totalLikeCount: 8,
  },
  102: {
    currentUserStatus: 'NOT_JOINED',
    members: [
      { memberId: 1, userName: '홍길동' },
      { memberId: 2, userName: '김철수' },
    ],
    questions: [
      { content: '이번 일을 하면서 기억에 남는 좋은 순간이 있었나요?', index: 0 },
      { content: '이번 일을 통해 새롭게 알게 되거나 성장한 부분이 있나요?', index: 1 },
      { content: '이번 일을 하면서 아쉬웠거나 더 필요했던 게 있나요?', index: 2 },
      { content: '앞으로 일할 때 이런 부분이 개선되면 좋겠다고 생각한 게 있나요?', index: 3 },
    ],
    retroCategory: 'FOUR_L',
    retroRoomId: 1,
    startTime: '2026-02-18T10:00:00',
    title: '온보딩 개선',
    totalCommentCount: 2,
    totalLikeCount: 3,
  },
};

export const responses = {
  responses: [
    {
      commentCount: 2,
      content: '매일 아침 스탠드업 미팅이 팀 커뮤니케이션에 큰 도움이 되었어요.',
      likeCount: 3,
      responseId: 1001,
      userName: '홍길동',
    },
    {
      commentCount: 1,
      content: '코드 리뷰 문화가 코드 품질 향상에 많이 기여한 것 같습니다.',
      likeCount: 5,
      responseId: 1002,
      userName: '김철수',
    },
    {
      commentCount: 0,
      content: '페어 프로그래밍으로 지식 공유가 잘 이루어졌어요.',
      likeCount: 2,
      responseId: 1003,
      userName: '이영희',
    },
  ],
  hasNext: false,
  nextCursor: null,
};

export const comments = {
  comments: [
    {
      commentId: 2001,
      content: '저도 동의합니다! 스탠드업이 정말 효과적이었어요.',
      createdAt: '2026-02-20T15:30:00',
      memberId: 2,
      userName: '김철수',
    },
    {
      commentId: 2002,
      content: '다음 스프린트에서도 유지하면 좋겠네요.',
      createdAt: '2026-02-20T16:00:00',
      memberId: 3,
      userName: '이영희',
    },
  ],
  hasNext: false,
  nextCursor: null,
};

export const references: Record<number, { referenceId: number; url: string; urlName: string }[]> = {
  101: [
    { referenceId: 1, url: 'https://github.com/example/project', urlName: 'GitHub Repository' },
    { referenceId: 2, url: 'https://figma.com/design/example', urlName: 'Figma Design' },
  ],
};

export const analysisResult = {
  emotionRank: [
    {
      count: 8,
      description: '팀원들이 전반적으로 긍정적인 감정을 보였어요.',
      label: '만족',
      rank: 1,
    },
    { count: 5, description: '새로운 시도에 대한 기대감이 있어요.', label: '기대', rank: 2 },
    { count: 2, description: '일부 아쉬운 부분이 있었어요.', label: '아쉬움', rank: 3 },
  ],
  insight:
    '이번 스프린트에서 팀은 전반적으로 높은 만족도를 보였으며, 특히 스탠드업 미팅과 코드 리뷰 문화에 대한 긍정적 평가가 많았습니다. 다음 스프린트에서는 기술 부채 해소에 더 많은 시간을 투자하면 좋겠습니다.',
  personalMissions: [
    {
      missions: [
        { missionDesc: '매주 1개 이상의 기술 블로그 포스트 작성하기', missionTitle: '기술 공유' },
      ],
      userId: 1,
      userName: '홍길동',
    },
    {
      missions: [
        { missionDesc: '코드 리뷰 시 구체적인 개선 제안 포함하기', missionTitle: '코드 리뷰 개선' },
      ],
      userId: 2,
      userName: '김철수',
    },
  ],
};

export const assistantResult = {
  guideType: 'PERSONALIZED',
  guides: [
    {
      description: '구체적인 상황이나 사례를 들어 설명하면 팀원들이 더 잘 이해할 수 있어요.',
      title: '구체적인 사례 추가',
    },
    {
      description: '개선점뿐만 아니라 잘한 점도 함께 언급하면 균형 잡힌 회고가 될 수 있어요.',
      title: '긍정적 피드백 포함',
    },
  ],
  questionContent: '이번 일을 통해 유지했으면 하는 문화나 방식이 있나요?',
  questionId: 1,
  remainingCount: 4,
};

let nextRetrospectId = 400;

export function getNextRetrospectId() {
  return nextRetrospectId++;
}
