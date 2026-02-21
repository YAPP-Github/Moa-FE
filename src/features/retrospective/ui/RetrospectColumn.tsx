import { RetrospectCard } from './RetrospectCard';
import type { RetrospectListItem } from '../model/schema';

interface RetrospectColumnProps {
  title: string;
  items: RetrospectListItem[];
}

export function RetrospectColumn({ title, items }: RetrospectColumnProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="text-sub-title-2 text-grey-900">{title}</span>
        <span className="text-caption-3 text-grey-600">{items.length}</span>
      </div>
      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="flex items-center justify-center rounded-xl border border-dashed border-grey-200 py-10">
            <span className="text-caption-3 text-grey-500">회고가 없어요</span>
          </div>
        ) : (
          items.map((item) => <RetrospectCard key={item.retrospectId} item={item} />)
        )}
      </div>
    </div>
  );
}
