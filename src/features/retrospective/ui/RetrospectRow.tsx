import { format, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { RETROSPECT_METHOD_LABELS } from '@/features/retrospective/model/constants';
import type { RetrospectListItem } from '@/shared/api/generated/index';
import SvgIcCaretDown from '@/shared/ui/icons/IcCaretDown';

interface RetrospectRowProps {
  retrospect: RetrospectListItem;
  participantCount?: number;
  onClick?: () => void;
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export function RetrospectRow({ retrospect, participantCount = 0, onClick }: RetrospectRowProps) {
  const date = new Date(retrospect.retrospectDate);
  const formattedDate = format(date, 'M.dd', { locale: ko });
  const dayOfWeek = DAY_LABELS[getDay(date)];
  const methodLabel =
    RETROSPECT_METHOD_LABELS[retrospect.retrospectMethod] ?? retrospect.retrospectMethod;

  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center gap-4 rounded-lg border border-grey-200 bg-white px-5 py-4 text-left transition-colors hover:border-blue-300"
      onClick={onClick}
    >
      <div className="flex w-16 shrink-0 items-baseline gap-1">
        <span className="text-body-1 font-medium text-grey-900">{formattedDate}</span>
        <span className="text-caption-1 text-grey-500">{dayOfWeek}</span>
      </div>

      <div className="min-w-0 flex-1">
        <span className="truncate text-body-1 font-medium text-grey-900">
          {retrospect.projectName}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-caption-1 font-medium text-blue-600">
          {methodLabel}
        </span>

        <span className="flex items-center gap-1 text-body-2 text-grey-600">
          <span>참여인원 {participantCount}</span>
          <SvgIcCaretDown className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}
