import { RetrospectCard } from './RetrospectCard';
import type { RetrospectListItem } from '../model/schema';

interface RetrospectColumnProps {
  title: string;
  items: RetrospectListItem[];
  teamId: number;
}

export function RetrospectColumn({ title, items, teamId }: RetrospectColumnProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="text-caption-2 text-grey-900">{title}</span>
        <span className="text-caption-2 text-grey-900">{items.length}</span>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <RetrospectCard key={item.retrospectId} item={item} teamId={teamId} />
        ))}
      </div>
    </div>
  );
}
