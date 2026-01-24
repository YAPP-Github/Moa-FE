import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import type { ToneStyle } from '@/api';
import { guideRetrospective, refineRetrospective } from '@/api';
import { svg } from '@/assets';
import { SpeechBubble } from '@/components/SpeechBubble';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useRetrospectiveStore } from '@/store/retrospective';

export function RetrospectiveDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [isAiFilterEnabled, setIsAiFilterEnabled] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ToneStyle>('KIND');
  const [refinedContent, setRefinedContent] = useState('');
  const [guideMessage, setGuideMessage] = useState('');

  const retrospectives = useRetrospectiveStore((state) => state.retrospectives);
  const updateParticipantProgress = useRetrospectiveStore(
    (state) => state.updateParticipantProgress
  );
  const addAnswer = useRetrospectiveStore((state) => state.addAnswer);

  const retrospective = retrospectives.find((r) => r.id === id);

  useEffect(() => {
    const handleRefineContent = async () => {
      if (!isAiFilterEnabled || !answer.trim()) {
        setRefinedContent('');
        return;
      }

      try {
        const response = await refineRetrospective({
          content: answer,
          toneStyle: selectedTone,
          secretKey: 'web3secretweb',
        });

        if (response.isSuccess && response.result) {
          setRefinedContent(response.result.refinedContent);
        } else {
          setRefinedContent('');
        }
      } catch (_error) {
        setRefinedContent('');
      }
    };

    handleRefineContent();
  }, [isAiFilterEnabled, selectedTone, answer]);

  useEffect(() => {
    if (!answer.trim()) {
      setGuideMessage('');
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await guideRetrospective({
          currentContent: answer,
          secretKey: 'web3secretweb',
        });

        if (response.isSuccess && response.result) {
          setGuideMessage(response.result.guideMessage);
        } else {
          setGuideMessage('');
        }
      } catch (_error) {
        setGuideMessage('');
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [answer]);

  if (!retrospective) {
    return <Navigate to="/retrospective" replace />;
  }

  const user = retrospective.participants[0];
  const currentQuestion = (user?.answeredQuestions ?? 0) + 1;
  const totalQuestions = retrospective.totalQuestions;

  const handleToneChange = (tone: ToneStyle) => {
    setSelectedTone(tone);
  };

  const handleNextQuestion = () => {
    if (answer.trim()) {
      const contentToSave = isAiFilterEnabled && refinedContent ? refinedContent : answer;

      addAnswer(retrospective.id, {
        content: contentToSave,
        participantId: user.id,
        questionIndex: currentQuestion - 1,
      });
    }

    if (currentQuestion === totalQuestions) {
      updateParticipantProgress(retrospective.id, user.id, totalQuestions);
      navigate(`/retrospective/${id}/submit`);
      return;
    }

    updateParticipantProgress(retrospective.id, user.id, currentQuestion);
    setAnswer('');
    setRefinedContent('');
    setGuideMessage('');
  };

  return (
    <div className="flex min-h-full flex-col gap-14">
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-lg font-bold text-[#1C8AFF]">질문 {currentQuestion}</span>{' '}
            <span className="text-lg font-bold text-[#00000042]">/{totalQuestions}</span>
          </div>
          <h2 className="text-3xl font-bold">
            {retrospective.questions[currentQuestion - 1].title}
          </h2>
        </div>
        <Button onClick={handleNextQuestion}>
          {currentQuestion === totalQuestions ? '최종제출' : '다음'}
        </Button>
      </div>
      <div className="flex flex-1 flex-col items-start">
        <SpeechBubble message={guideMessage} />
        <div className="mt-3 flex w-full flex-1 gap-6">
          <div className="flex flex-1 flex-col gap-6 rounded-[20px] bg-white p-6">
            <textarea
              className="h-full flex-1 resize-none text-lg text-black placeholder:text-[#00000017] focus:outline-none"
              placeholder="솔직한 회고 내용을 적어주세요"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <div className="flex items-center justify-end gap-3">
              <div className="flex items-center gap-1.5">
                <img src={svg.star} alt="star" />
                <p className="text-base font-medium text-black">AI 필터링</p>
                <img src={svg.infoCircle} alt="info-circle" />
              </div>
              <Switch checked={isAiFilterEnabled} onCheckedChange={setIsAiFilterEnabled} />
            </div>
          </div>
          {isAiFilterEnabled && (
            <div className="flex w-[370px] flex-col gap-4 rounded-[20px] bg-white p-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleToneChange('KIND')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedTone === 'KIND'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  상냥체
                </button>
                <button
                  type="button"
                  onClick={() => handleToneChange('POLITE')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedTone === 'POLITE'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  정중체
                </button>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                {refinedContent ? (
                  <p className="text-sm text-gray-800">{refinedContent}</p>
                ) : (
                  <p className="text-sm text-gray-400">
                    회고 내용을 입력하면 AI가 정제된 내용을 제공합니다.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
