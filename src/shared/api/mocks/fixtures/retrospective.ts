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
    currentUserStatus: 'SUBMITTED',
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
  103: {
    currentUserStatus: 'DRAFT',
    members: [
      { memberId: 1, userName: '홍길동' },
      { memberId: 2, userName: '김철수' },
      { memberId: 3, userName: '이영희' },
    ],
    questions: [
      { content: '이번 작업에서 긍정적이었던 부분은 무엇인가요?', index: 0 },
      { content: '부정적이거나 아쉬웠던 부분은 무엇인가요?', index: 1 },
      { content: '흥미롭거나 새로 발견한 점이 있나요?', index: 2 },
    ],
    retroCategory: 'PMI',
    retroRoomId: 1,
    startTime: '2026-02-19T15:00:00',
    title: '디자인 시스템 구축',
    totalCommentCount: 0,
    totalLikeCount: 0,
  },
  104: {
    currentUserStatus: 'SUBMITTED',
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
    startTime: '2026-01-31T14:00:00',
    title: '1월 팀 회고',
    totalCommentCount: 7,
    totalLikeCount: 12,
  },
  105: {
    currentUserStatus: 'SUBMITTED',
    members: [
      { memberId: 1, userName: '홍길동' },
      { memberId: 2, userName: '김철수' },
      { memberId: 3, userName: '이영희' },
    ],
    questions: [
      { content: '이번 프로젝트에서 가장 잘 된 점은 무엇인가요?', index: 0 },
      { content: '아쉬웠던 점이나 개선할 부분이 있나요?', index: 1 },
      { content: '다음에 시도해보고 싶은 것이 있나요?', index: 2 },
      { content: '팀원에게 하고 싶은 말이 있나요?', index: 3 },
      { content: '개인적으로 성장한 부분이 있나요?', index: 4 },
    ],
    retroCategory: 'FIVE_F',
    retroRoomId: 1,
    startTime: '2026-01-15T10:00:00',
    title: '킥오프 회고',
    totalCommentCount: 10,
    totalLikeCount: 15,
  },
  201: {
    currentUserStatus: 'NOT_JOINED',
    members: [
      { memberId: 1, userName: '김민지' },
      { memberId: 4, userName: '손민수' },
    ],
    questions: [
      { content: '이번 일을 통해 유지했으면 하는 문화나 방식이 있나요?', index: 0 },
      { content: '이번 일을 하는 중 문제라고 판단되었던 점이 있나요?', index: 1 },
      { content: '이번 일을 겪으면서 새롭게 시도해보고 싶은 게 있나요?', index: 2 },
    ],
    retroCategory: 'KPT',
    retroRoomId: 2,
    startTime: '2026-02-21T14:00:00',
    title: 'API 리팩토링',
    totalCommentCount: 0,
    totalLikeCount: 0,
  },
  202: {
    currentUserStatus: 'SUBMITTED',
    members: [
      { memberId: 1, userName: '김민지' },
      { memberId: 4, userName: '손민수' },
    ],
    questions: [
      { content: '이번 마이그레이션에서 잘 된 점은 무엇인가요?', index: 0 },
      { content: '예상치 못한 문제가 있었나요?', index: 1 },
      { content: '다음 마이그레이션에서 개선할 점은?', index: 2 },
    ],
    retroCategory: 'PMI',
    retroRoomId: 2,
    startTime: '2026-02-10T10:00:00',
    title: 'DB 마이그레이션',
    totalCommentCount: 3,
    totalLikeCount: 4,
  },
  301: {
    currentUserStatus: 'NOT_JOINED',
    members: [
      { memberId: 5, userName: '박지훈' },
      { memberId: 6, userName: '최수아' },
      { memberId: 7, userName: '정우진' },
      { memberId: 8, userName: '한서연' },
    ],
    questions: [
      { content: '이번 일을 하면서 기억에 남는 좋은 순간이 있었나요?', index: 0 },
      { content: '이번 일을 통해 새롭게 알게 되거나 성장한 부분이 있나요?', index: 1 },
      { content: '이번 일을 하면서 아쉬웠거나 더 필요했던 게 있나요?', index: 2 },
      { content: '앞으로 일할 때 이런 부분이 개선되면 좋겠다고 생각한 게 있나요?', index: 3 },
    ],
    retroCategory: 'FOUR_L',
    retroRoomId: 3,
    startTime: '2026-02-22T11:00:00',
    title: 'UI 컴포넌트 리뷰',
    totalCommentCount: 0,
    totalLikeCount: 0,
  },
};

// retrospectId → category → responses
type ResponseItem = {
  commentCount: number;
  content: string;
  createdAt?: string;
  likeCount: number;
  responseId: number;
  userName: string;
};

export const responsesByRetrospect: Record<
  number,
  Record<string, { responses: ResponseItem[]; hasNext: boolean; nextCursor: null }>
> = {
  // 스프린트 1 회고 (KPT, 질문 3개)
  101: {
    QUESTION_1: {
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
    },
    QUESTION_2: {
      responses: [
        {
          commentCount: 1,
          content: '배포 프로세스가 너무 수동적이라 시간이 많이 걸렸어요.',
          likeCount: 4,
          responseId: 1004,
          userName: '홍길동',
        },
        {
          commentCount: 0,
          content: '테스트 커버리지가 낮아서 버그를 놓치는 경우가 있었습니다.',
          likeCount: 2,
          responseId: 1005,
          userName: '김철수',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
    QUESTION_3: {
      responses: [
        {
          commentCount: 0,
          content: 'CI/CD 파이프라인을 자동화해보고 싶어요.',
          likeCount: 6,
          responseId: 1006,
          userName: '홍길동',
        },
        {
          commentCount: 1,
          content: 'E2E 테스트를 도입하면 좋을 것 같습니다.',
          likeCount: 3,
          responseId: 1007,
          userName: '이영희',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
  },
  // 온보딩 개선 (FOUR_L, 질문 4개 — SUBMITTED 테스트용)
  102: {
    QUESTION_1: {
      responses: [
        {
          commentCount: 1,
          content: '팀원들과 온보딩 프로세스를 함께 설계한 시간이 좋았어요.',
          likeCount: 3,
          responseId: 1021,
          userName: '홍길동',
        },
        {
          commentCount: 0,
          content: '신규 입사자분이 빠르게 적응하는 모습을 보며 보람을 느꼈습니다.',
          likeCount: 2,
          responseId: 1022,
          userName: '김철수',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
    QUESTION_2: {
      responses: [
        {
          commentCount: 0,
          content: '문서화 도구 사용법을 익히면서 기술 스택 이해도가 높아졌어요.',
          likeCount: 2,
          responseId: 1023,
          userName: '홍길동',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
    QUESTION_3: {
      responses: [
        {
          commentCount: 1,
          content: '온보딩 체크리스트가 너무 길어서 핵심 내용이 묻힌 감이 있었어요.',
          likeCount: 3,
          responseId: 1024,
          userName: '홍길동',
        },
        {
          commentCount: 0,
          content: '멘토링 시간이 부족했던 것 같습니다.',
          likeCount: 1,
          responseId: 1025,
          userName: '김철수',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
    QUESTION_4: {
      responses: [
        {
          commentCount: 0,
          content: '온보딩 가이드를 영상으로도 제공하면 좋겠어요.',
          likeCount: 4,
          responseId: 1026,
          userName: '홍길동',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
  },
  // 1월 팀 회고 (KPT, 질문 3개)
  104: {
    QUESTION_1: {
      responses: [
        {
          commentCount: 3,
          content: '주간 회의에서 각자 진행 상황을 공유하는 문화가 좋았어요.',
          createdAt: '2026-02-22T09:10:00',
          likeCount: 5,
          responseId: 1041,
          userName: '홍길동',
        },
        {
          commentCount: 1,
          content: '문서화를 꼼꼼히 하는 습관이 다른 팀원에게도 도움이 되었습니다.',
          createdAt: '2026-02-22T09:22:00',
          likeCount: 4,
          responseId: 1042,
          userName: '김철수',
        },
        {
          commentCount: 0,
          content: '서로의 PR을 빠르게 리뷰해주는 문화가 좋았어요.',
          createdAt: '2026-02-22T09:35:00',
          likeCount: 3,
          responseId: 1043,
          userName: '이영희',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
    QUESTION_2: {
      responses: [
        {
          commentCount: 2,
          content: '일정 산정이 너무 빡빡해서 품질에 영향이 있었어요.',
          likeCount: 6,
          responseId: 1044,
          userName: '홍길동',
        },
        {
          commentCount: 0,
          content: '디자인 변경이 잦아서 개발 일정이 밀렸습니다.',
          likeCount: 3,
          responseId: 1045,
          userName: '김철수',
        },
        {
          commentCount: 1,
          content: '요구사항 정리가 늦어져서 개발 시작이 지연된 적이 있었어요.',
          likeCount: 2,
          responseId: 1046,
          userName: '이영희',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
    QUESTION_3: {
      responses: [
        {
          commentCount: 0,
          content: '스프린트 플래닝을 좀 더 체계적으로 해보고 싶어요.',
          likeCount: 4,
          responseId: 1047,
          userName: '홍길동',
        },
        {
          commentCount: 1,
          content: '기술 세미나를 정기적으로 열면 좋겠습니다.',
          likeCount: 5,
          responseId: 1048,
          userName: '김철수',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
  },
  // 킥오프 회고 (FIVE_F, 질문 5개)
  105: {
    QUESTION_1: {
      responses: [
        {
          commentCount: 2,
          content: '팀 빌딩 활동이 서로를 이해하는 데 큰 도움이 됐어요.',
          createdAt: '2026-02-22T08:00:00',
          likeCount: 7,
          responseId: 1051,
          userName: '홍길동',
        },
        {
          commentCount: 1,
          content: '프로젝트 목표를 명확히 설정한 것이 좋았습니다.',
          createdAt: '2026-02-22T08:12:00',
          likeCount: 4,
          responseId: 1052,
          userName: '김철수',
        },
        {
          commentCount: 0,
          content: '역할 분담이 잘 이루어져서 효율적으로 시작할 수 있었어요.',
          createdAt: '2026-02-22T08:25:00',
          likeCount: 3,
          responseId: 1053,
          userName: '이영희',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
    QUESTION_2: {
      responses: [
        {
          commentCount: 1,
          content: '초반에 개발 환경 세팅하는 데 시간이 너무 오래 걸렸어요.',
          likeCount: 3,
          responseId: 1054,
          userName: '홍길동',
        },
        {
          commentCount: 0,
          content: '컨벤션 통일이 늦어져서 초반 코드 스타일이 제각각이었습니다.',
          likeCount: 2,
          responseId: 1055,
          userName: '김철수',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
    QUESTION_3: {
      responses: [
        {
          commentCount: 0,
          content: '모노레포 구조를 도입해보고 싶어요.',
          likeCount: 5,
          responseId: 1056,
          userName: '홍길동',
        },
        {
          commentCount: 2,
          content: 'Storybook으로 컴포넌트 문서화를 시도해보고 싶습니다.',
          likeCount: 4,
          responseId: 1057,
          userName: '이영희',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
    QUESTION_4: {
      responses: [
        {
          commentCount: 1,
          content: '서로 응원해주는 분위기가 정말 좋았어요. 앞으로도 잘 부탁드립니다!',
          likeCount: 8,
          responseId: 1058,
          userName: '홍길동',
        },
        {
          commentCount: 0,
          content: '다들 열정적이어서 저도 동기부여가 많이 됐어요.',
          likeCount: 6,
          responseId: 1059,
          userName: '김철수',
        },
        {
          commentCount: 1,
          content: '모르는 거 물어볼 때 친절하게 알려줘서 감사했습니다.',
          likeCount: 5,
          responseId: 1060,
          userName: '이영희',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
    QUESTION_5: {
      responses: [
        {
          commentCount: 0,
          content: 'React Query 패턴을 깊이 이해하게 되었어요.',
          likeCount: 3,
          responseId: 1061,
          userName: '홍길동',
        },
        {
          commentCount: 1,
          content: 'TypeScript 제네릭 활용에 자신감이 생겼습니다.',
          likeCount: 4,
          responseId: 1062,
          userName: '김철수',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
  },
  // DB 마이그레이션 (PMI, 질문 3개)
  202: {
    QUESTION_1: {
      responses: [
        {
          commentCount: 1,
          content: '사전에 롤백 플랜을 준비한 것이 안정적인 마이그레이션에 도움이 됐어요.',
          likeCount: 3,
          responseId: 2021,
          userName: '김민지',
        },
        {
          commentCount: 0,
          content: '스키마 변경 스크립트를 자동화한 것이 좋았습니다.',
          likeCount: 2,
          responseId: 2022,
          userName: '손민수',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
    QUESTION_2: {
      responses: [
        {
          commentCount: 2,
          content: '데이터 정합성 체크에서 예상치 못한 누락 데이터가 발견됐어요.',
          likeCount: 4,
          responseId: 2023,
          userName: '김민지',
        },
        {
          commentCount: 0,
          content: '마이그레이션 시간이 예상보다 2배 이상 걸렸습니다.',
          likeCount: 1,
          responseId: 2024,
          userName: '손민수',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
    QUESTION_3: {
      responses: [
        {
          commentCount: 0,
          content: '다음에는 스테이징 환경에서 충분히 검증하고 진행하면 좋겠어요.',
          likeCount: 3,
          responseId: 2025,
          userName: '김민지',
        },
      ],
      hasNext: false,
      nextCursor: null,
    },
  },
};

export const emptyResponses = {
  responses: [] as ResponseItem[],
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
      count: 6,
      description: '짧은 스프린트 기간으로 인해 피로함을 느꼈어요',
      label: '피로',
      rank: 1,
    },
    {
      count: 6,
      description: '마이크로 매니징에 관해 압박감을 호소했어요',
      label: '압박',
      rank: 2,
    },
    {
      count: 6,
      description: '적당한 작업범위로 성취감을 느꼈어요',
      label: '성취감',
      rank: 3,
    },
  ],
  insight:
    '이번 회고에서 팀은 목표 의식은 분명했지만,\n에너지 관리 측면에서 공통적인 아쉬움이 드러났어요.',
  personalMissions: [
    {
      missions: [
        {
          missionTitle: '타 파트에 의견 표현 적극적으로 하기',
          missionDesc: '의견을 빠르게 공유하고 협업들을 적극적으로 활용해 팀 소통의 밀도를 높여요',
        },
        {
          missionTitle: '중간 점검에 대한 루틴 만들기',
          missionDesc: '정해진 기한 내 규칙적인 스크럼은 작업 효율을 높여요',
        },
        {
          missionTitle: '변동 사항 있을 때 미리 공유하기',
          missionDesc: '즉각적인 응답과 활발한 협업들을 사상으로 팀 운영의 안정성을 높여요',
        },
      ],
      userId: 1,
      userName: '모아',
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
