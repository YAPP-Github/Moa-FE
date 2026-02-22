import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { RETROSPECT_METHOD_LABELS } from '@/features/retrospective/model/constants';
import imgRetrospectComplete from '@/shared/assets/images/img_retrospect_complete.png';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcClose from '@/shared/ui/icons/IcClose';

interface CompleteStepProps {
  teamName: string;
  projectName: string;
  retrospectDate: Date;
  retrospectMethod: string;
  onClose: () => void;
}

export function CompleteStep({
  teamName,
  projectName,
  retrospectDate,
  retrospectMethod,
  onClose,
}: CompleteStepProps) {
  const formattedDate = format(retrospectDate, 'yyyy년 M월 d일 EEEE', {
    locale: ko,
  });

  return (
    <div className="flex h-full flex-col">
      {/* Close Button */}
      <div className="mb-6 flex justify-end">
        <IconButton variant="ghost" size="sm" onClick={onClose} aria-label="닫기">
          <IcClose className="size-5" />
        </IconButton>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-sub-title-2 text-blue-500">{teamName}팀 회고</span>
        <span className="text-title-2 text-grey-1000">회고 생성을 완료했어요</span>
      </div>

      {/* Illustration */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex h-[215px] w-[394px] items-center justify-center">
          <img src={imgRetrospectComplete} width={177} height={177} alt="회고 생성 완료" />
        </div>
      </div>

      {/* Retrospect Info Card */}
      <div className="rounded-md bg-grey-50 p-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-title-6 text-grey-1000">{projectName}</span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-caption-3-medium text-grey-800">회고 날짜</span>
              <span className="text-caption-4 text-grey-700">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-caption-3-medium text-grey-800">회고 유형</span>
              <span className="text-caption-4 text-grey-700">
                {RETROSPECT_METHOD_LABELS[retrospectMethod] ?? retrospectMethod}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
