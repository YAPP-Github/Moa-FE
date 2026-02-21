import { format, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getDDayLabel } from '../lib/date';
import { RETROSPECT_METHOD_LABELS } from '../model/constants';
import type { RetrospectListItem } from '../model/schema';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

interface RetrospectCardProps {
  item: RetrospectListItem;
}

export function RetrospectCard({ item }: RetrospectCardProps) {
  const date = new Date(item.retrospectDate);
  const formattedDate = format(date, 'yyyy.MM.dd', { locale: ko });
  const dayOfWeek = DAY_LABELS[getDay(date)];
  const methodLabel = RETROSPECT_METHOD_LABELS[item.retrospectMethod] ?? item.retrospectMethod;
  const dDayLabel = getDDayLabel(item.retrospectDate);

  return (
    <div className="flex w-[284px] flex-col rounded-xl border border-grey-200 bg-white px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="truncate text-title-5 text-grey-1000">{item.projectName}</span>
        {dDayLabel && (
          <span className="shrink-0 ml-2 rounded-md bg-blue-100 px-2 py-0.5 text-caption-5 text-blue-500">
            {dDayLabel}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-[4px] bg-blue-200 px-2 py-0.5 text-caption-5 text-blue-500">
          {methodLabel}
        </span>
      </div>
      <div className="mt-auto pt-4">
        <span className="text-caption-3 text-grey-600">
          {formattedDate} ({dayOfWeek})
        </span>
      </div>
    </div>
  );
}
