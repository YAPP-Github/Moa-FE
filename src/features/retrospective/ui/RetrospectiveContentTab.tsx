/**
 * RetrospectiveContentTab - 회고 내용 탭 컴포넌트
 *
 * 팀원들의 회고 내용을 질문별로 표시하는 컴포넌트
 */

import { useState } from 'react';
import IcComment from '@/shared/ui/icons/IcComment';
import IcHeartInactive from '@/shared/ui/icons/IcHeartInactive';

// ============================================================================
// Types
// ============================================================================

interface Comment {
  id: number;
  author: string;
  content: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_QUESTIONS = [
  '이번 일을 통해 유지했으면 하는 문화나 방식이 있나요?',
  '이번 일을 하는 중 문제라고 판단되었던 점이 있나요?',
  '이번 일을 겪으면서 새롭게 시도해보고 싶은 게 있나요?',
];

const MOCK_ANSWERS = [
  {
    id: 1,
    questionIndex: 0,
    author: '박소은',
    timeAgo: '12분전',
    content:
      '기한 맞춰서 작업하는 것을 잘했고요... 팀 매니징에 있어서 자잘한 업무를 정리하기 (피그마 정리, 역할분담 등등) 르렙 우선순위대로 스프린트 진행하기 ( 유저 니즈랑 비슷한 방향으로 스프린트를 진행하고 있을지도..',
    likeCount: 12,
    commentCount: 2,
    comments: [
      { id: 1, author: '김민수', content: '기한 맞춰서 작업하는 것을 잘했고요...' },
      { id: 2, author: '이영희', content: '저도 동의합니다!' },
    ],
  },
  {
    id: 2,
    questionIndex: 0,
    author: '김민지',
    timeAgo: '15분전',
    content:
      '매주 정기적인 스탠드업 미팅을 진행한 것이 좋았습니다. 서로의 진행 상황을 파악하고 블로커를 빠르게 해결할 수 있었어요.',
    likeCount: 8,
    commentCount: 1,
    comments: [{ id: 1, author: '정서연', content: '스탠드업 미팅 정말 좋았어요!' }],
  },
  {
    id: 3,
    questionIndex: 0,
    author: '이준혁',
    timeAgo: '20분전',
    content:
      '코드 리뷰 문화가 잘 정착된 것 같아요. 서로의 코드를 봐주면서 많이 배웠고, 코드 품질도 향상되었습니다.',
    likeCount: 15,
    commentCount: 3,
    comments: [],
  },
  {
    id: 4,
    questionIndex: 1,
    author: '박소은',
    timeAgo: '12분전',
    content:
      '기한 맞춰서 작업하는 것을 잘했고요... 팀 매니징에 있어서 자잘한 업무를 정리하기 (피그마 정리, 역할분담 등등) 르렙 우선순위대로 스프린트 진행하기 ( 유저 니즈랑 비슷한 방향으로 스프린트를 진행하고 있을지도..',
    likeCount: 12,
    commentCount: 2,
    comments: [],
  },
  {
    id: 5,
    questionIndex: 1,
    author: '정서연',
    timeAgo: '25분전',
    content:
      '일정 산정이 다소 타이트했던 것 같아요. 버퍼 시간을 좀 더 확보했으면 좋겠습니다. 예상치 못한 이슈가 발생했을 때 대응하기 어려웠어요.',
    likeCount: 20,
    commentCount: 5,
    comments: [],
  },
  {
    id: 6,
    questionIndex: 1,
    author: '최영호',
    timeAgo: '30분전',
    content:
      '디자인 시안이 늦게 나와서 개발 일정이 촉박했습니다. 다음에는 디자인과 개발 일정을 더 잘 조율했으면 좋겠어요.',
    likeCount: 18,
    commentCount: 4,
    comments: [],
  },
  {
    id: 7,
    questionIndex: 2,
    author: '박소은',
    timeAgo: '12분전',
    content:
      '자동화 테스트를 도입해보고 싶어요. 수동 테스트에 시간이 많이 소요되어서, CI/CD 파이프라인에 테스트를 포함시키면 좋을 것 같습니다.',
    likeCount: 25,
    commentCount: 6,
    comments: [],
  },
  {
    id: 8,
    questionIndex: 2,
    author: '김민지',
    timeAgo: '35분전',
    content:
      '페어 프로그래밍을 더 자주 해보고 싶어요. 복잡한 로직을 구현할 때 함께 고민하면 더 좋은 결과가 나올 것 같아요.',
    likeCount: 10,
    commentCount: 2,
    comments: [],
  },
  {
    id: 9,
    questionIndex: 2,
    author: '이준혁',
    timeAgo: '40분전',
    content:
      '스프린트 회고를 좀 더 체계적으로 진행해보고 싶습니다. 액션 아이템을 명확히 정하고 다음 스프린트에 반영하는 프로세스를 만들면 좋겠어요.',
    likeCount: 14,
    commentCount: 3,
    comments: [],
  },
  {
    id: 10,
    questionIndex: 0,
    author: '정서연',
    timeAgo: '45분전',
    content:
      '슬랙에서 빠른 커뮤니케이션이 잘 이루어진 것 같아요. 질문에 대한 응답이 빨라서 작업이 막히는 시간이 줄었습니다.',
    likeCount: 9,
    commentCount: 1,
    comments: [],
  },
];

// ============================================================================
// Component
// ============================================================================

function RetrospectiveContentTab() {
  const [activeFilter, setActiveFilter] = useState<'all' | number>('all');
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [comments, setComments] = useState<Record<number, Comment[]>>(() => {
    // 초기 댓글 데이터 설정
    const initial: Record<number, Comment[]> = {};
    for (const answer of MOCK_ANSWERS) {
      initial[answer.id] = answer.comments;
    }
    return initial;
  });

  const filteredAnswers =
    activeFilter === 'all'
      ? MOCK_ANSWERS
      : MOCK_ANSWERS.filter((answer) => answer.questionIndex === activeFilter);

  // 질문별로 그룹화
  const groupedByQuestion = filteredAnswers.reduce(
    (acc, answer) => {
      const questionIndex = answer.questionIndex;
      if (!acc[questionIndex]) {
        acc[questionIndex] = [];
      }
      acc[questionIndex].push(answer);
      return acc;
    },
    {} as Record<number, typeof MOCK_ANSWERS>
  );

  const handleCommentToggle = (answerId: number) => {
    setOpenCommentId(openCommentId === answerId ? null : answerId);
  };

  const handleCommentInputChange = (answerId: number, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [answerId]: value }));
  };

  const handleCommentSubmit = (answerId: number) => {
    const content = commentInputs[answerId]?.trim();
    if (!content) return;

    const newComment: Comment = {
      id: Date.now(),
      author: '나',
      content,
    };

    setComments((prev) => ({
      ...prev,
      [answerId]: [...(prev[answerId] || []), newComment],
    }));
    setCommentInputs((prev) => ({ ...prev, [answerId]: '' }));
  };

  return (
    <div className="flex flex-col overflow-y-auto px-5 pb-8 scrollbar-hide">
      {/* 필터 탭 */}
      <div className="flex items-center gap-2.5">
        {/* 전체 버튼 */}
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`cursor-pointer rounded-lg px-3 py-1.5 text-sub-title-4 transition-colors ${
            activeFilter === 'all' ? 'bg-grey-800 text-grey-0' : 'bg-grey-100 text-grey-800'
          }`}
        >
          전체
        </button>

        {/* 구분선 */}
        <div className="h-[18px] w-px bg-[#DFE1E8]" />

        {/* 질문 버튼들 */}
        {MOCK_QUESTIONS.map((question, index) => (
          <button
            key={question}
            type="button"
            onClick={() => setActiveFilter(index)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-sub-title-4 transition-colors ${
              activeFilter === index ? 'bg-grey-800 text-grey-0' : 'bg-grey-100 text-grey-800'
            }`}
          >
            질문{index + 1}
          </button>
        ))}
      </div>

      {/* 질문별 답변 목록 */}
      <div className="mt-4 flex flex-col gap-5">
        {Object.entries(groupedByQuestion).map(([questionIndex, answers]) => (
          <div key={questionIndex} className="flex flex-col">
            {/* 질문 제목 */}
            <h3 className="text-title-4 text-grey-1000">{MOCK_QUESTIONS[Number(questionIndex)]}</h3>

            {/* 답변 목록 */}
            <div className="mt-4 flex flex-col">
              {answers.map((answer, answerIndex) => (
                <div key={answer.id}>
                  {/* 구분선 (첫 번째 아이템 제외) */}
                  {answerIndex > 0 && <div className="my-4 h-px bg-grey-100" />}

                  {/* 답변 아이템 */}
                  <div className="flex gap-2">
                    {/* 프로필 아바타 */}
                    <div className="h-7 w-7 shrink-0 rounded-full bg-grey-200" />

                    {/* 콘텐츠 */}
                    <div className="flex flex-1 flex-col gap-1">
                      {/* 작성자 이름 */}
                      <span className="text-sub-title-4 text-grey-700">{answer.author}</span>

                      {/* 시간 */}
                      <span className="text-caption-6 text-grey-700">{answer.timeAgo}</span>

                      {/* 내용 */}
                      <p className="mt-1.5 text-long-2 text-grey-900">{answer.content}</p>

                      {/* 좋아요/댓글 */}
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          type="button"
                          className="flex cursor-pointer items-center gap-0.5 text-grey-600"
                        >
                          <IcHeartInactive className="h-4 w-4" />
                          <span className="text-[13px] font-medium">{answer.likeCount}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCommentToggle(answer.id)}
                          className={`flex cursor-pointer items-center gap-0.5 rounded-md px-1 py-0.5 text-grey-600 transition-colors ${
                            openCommentId === answer.id
                              ? 'bg-grey-300'
                              : 'hover:bg-grey-200 active:bg-grey-300'
                          }`}
                        >
                          <IcComment className="h-4 w-4" />
                          <span className="text-[13px] font-medium">
                            {comments[answer.id]?.length || answer.commentCount}
                          </span>
                        </button>
                      </div>

                      {/* 댓글 섹션 */}
                      {openCommentId === answer.id && (
                        <div className="mt-3">
                          {/* 댓글 입력 */}
                          <div className="flex gap-3">
                            {/* 프로필 아이콘 */}
                            <div className="h-[25px] w-[25px] shrink-0 rounded-full border border-grey-200 bg-[#EAD4FC]" />

                            {/* 입력창 */}
                            <label className="flex flex-1 cursor-text flex-col rounded-xl border border-grey-200 bg-grey-50 px-3 py-2">
                              <input
                                type="text"
                                value={commentInputs[answer.id] || ''}
                                onChange={(e) =>
                                  handleCommentInputChange(answer.id, e.target.value)
                                }
                                placeholder="댓글로 의견을 남겨보세요"
                                className="w-full bg-transparent text-caption-3 font-medium text-grey-900 placeholder:text-grey-500 focus:outline-none"
                              />
                              <div className="mt-2 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleCommentSubmit(answer.id)}
                                  className="cursor-pointer rounded-sm bg-blue-500 px-2.5 py-[6px] text-sub-title-5 text-grey-0"
                                >
                                  남기기
                                </button>
                              </div>
                            </label>
                          </div>

                          {/* 댓글 리스트 */}
                          {comments[answer.id]?.length > 0 && (
                            <div className="mt-4 max-h-[120px] flex-col gap-3 overflow-y-auto scrollbar-hide">
                              {comments[answer.id].map((comment) => (
                                <div key={comment.id} className="flex gap-2 py-1.5 first:pt-0">
                                  {/* 아바타 */}
                                  <div className="h-[25px] w-[25px] shrink-0 rounded-full border border-grey-200 bg-[#EAD4FC]" />

                                  {/* 댓글 내용 */}
                                  <div className="flex flex-col gap-1">
                                    <span className="text-sub-title-4 text-grey-700">
                                      {comment.author}
                                    </span>
                                    <p className="text-long-2 text-grey-900">{comment.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { RetrospectiveContentTab };
