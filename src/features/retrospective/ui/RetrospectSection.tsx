import { RetrospectEmptyState } from './RetrospectEmptyState';
import { RetrospectRow } from './RetrospectRow';
import type { RetrospectListItem } from '@/shared/api/generated/index';

interface RetrospectSectionProps {
  title: string;
  count: number;
  items: RetrospectListItem[];
}

export function RetrospectSection({ title, count, items }: RetrospectSectionProps) {
  return (
    <section className="flex-1 flex flex-col">
      <h2 className="text-title-4 text-grey-1000">
        {title} {count}
      </h2>
      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <RetrospectEmptyState />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <RetrospectRow key={item.retrospectId} retrospect={item} />
          ))}
        </div>
      )}
    </section>
  );
}
