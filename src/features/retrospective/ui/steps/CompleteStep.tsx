/**
 * @deprecated 회고 생성 완료 시 토스트 알림으로 대체됨. 추후 제거 예정.
 * @see CreateRetrospectForm - showToast({ variant: 'success', message: '회고 생성 완료!' })
 */
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { RETROSPECT_METHOD_LABELS } from '@/features/retrospective/model/constants';
import { Button } from '@/shared/ui/button/Button';
import IcCheckBlueBgLightblue from '@/shared/ui/icons/IcCheckBlueBgLightblue';

interface CompleteStepProps {
  teamName: string;
  projectName: string;
  retrospectDate: Date;
  retrospectMethod: string;
  onClose: () => void;
}

export function CompleteStep({
  projectName,
  retrospectDate,
  retrospectMethod,
  onClose,
}: CompleteStepProps) {
  const formattedDate = format(retrospectDate, 'yyyy년 M월 d일 EEEE', {
    locale: ko,
  });

  return (
    <div className="flex h-full flex-col items-center">
      <IcCheckBlueBgLightblue width={48} height={48} />

      <h2 className="mt-3 text-title-2 text-grey-1000">회고 생성을 완료했어요</h2>

      {/* Retrospect Info Card */}
      <div className="mt-7 w-full rounded-[6px] bg-grey-50 py-4 pl-4">
        <span className="text-title-6 text-grey-1000">{projectName}</span>
        <div className="mt-1.5 flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span className="text-caption-3-medium text-grey-800">회고 날짜</span>
            <span className="text-caption-4 text-grey-700">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-caption-3-medium text-grey-800">회고 유형</span>
            <span className="text-caption-4 text-grey-700">
              {RETROSPECT_METHOD_LABELS[retrospectMethod] ?? retrospectMethod}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-7 flex w-full justify-end">
        <Button
          variant="primary"
          onClick={onClose}
          className="rounded-[8px] px-[18px] py-[9px] text-sub-title-4"
        >
          확인
        </Button>
      </div>
    </div>
  );
}
