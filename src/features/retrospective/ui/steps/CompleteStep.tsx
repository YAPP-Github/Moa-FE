import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { RETROSPECT_METHOD_LABELS } from '@/features/retrospective/model/constants';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcClose from '@/shared/ui/icons/IcClose';
import IcLink from '@/shared/ui/icons/IcLink';

interface CompleteStepProps {
  teamName: string;
  projectName: string;
  retrospectDate: Date;
  retrospectTime: string;
  retrospectMethod: string;
  shareLink: string;
  onClose: () => void;
}

export function CompleteStep({
  teamName,
  projectName,
  retrospectDate,
  retrospectTime,
  retrospectMethod,
  shareLink,
  onClose,
}: CompleteStepProps) {
  const formattedDate = format(retrospectDate, 'yyyy년 M월 d일 EEEE', {
    locale: ko,
  });
  const formattedDateTime = `${formattedDate} ${retrospectTime}`;

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
        <span className="text-sub-title-2 text-blue-500">{teamName} 팀 회고</span>
        <span className="text-title-2 text-grey-1000">회고 생성을 완료했어요</span>
      </div>

      {/* Illustration */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-50">
          <svg
            aria-hidden="true"
            className="h-16 w-16 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Retrospect Info Card */}
      <div className="rounded-md bg-grey-50 p-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-title-6 text-grey-1000">{projectName}</span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-caption-3-medium text-grey-800">회고 날짜</span>
              <span className="text-caption-4 text-grey-700">{formattedDateTime}</span>
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

      {/* Share Link */}
      <div className="mt-6 flex flex-col gap-2.5">
        <span className="text-sub-title-2 text-grey-1000">공유하기</span>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(shareLink)}
            className="flex size-12 items-center justify-center rounded-full bg-grey-100"
            aria-label="링크 복사"
          >
            <IcLink className="size-5" />
          </button>
          <span className="text-long-2 text-grey-800">링크복사</span>
        </div>
      </div>
    </div>
  );
}
