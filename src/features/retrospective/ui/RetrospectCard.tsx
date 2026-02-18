import type { RetrospectListItem } from '@/shared/api/generated/index';

interface RetrospectCardProps {
  retrospect: RetrospectListItem;
}

const METHOD_LABELS: Record<string, string> = {
  KPT: 'KPT',
  FOUR_L: '4L',
  FIVE_F: '5F',
  PMI: 'PMI',
  FREE: '자유',
};

export function RetrospectCard({ retrospect }: RetrospectCardProps) {
  const methodLabel = METHOD_LABELS[retrospect.retrospectMethod] ?? retrospect.retrospectMethod;

  return (
    <div className="rounded-lg border border-grey-200 bg-white p-4 hover:border-primary-300 transition-colors cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-body-1 font-medium text-grey-900 truncate">
            {retrospect.projectName}
          </h3>
          <p className="text-body-2 text-grey-500 mt-1">
            {retrospect.retrospectDate} {retrospect.retrospectTime}
          </p>
        </div>
        <span className="ml-2 shrink-0 rounded-full bg-grey-100 px-2 py-0.5 text-caption text-grey-600">
          {methodLabel}
        </span>
      </div>
    </div>
  );
}
