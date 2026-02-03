import { useState } from 'react';
import { RetrospectEmptyState } from './RetrospectEmptyState';
import { RetrospectRow } from './RetrospectRow';
import type { RetrospectListItem } from '@/shared/api/generated/index';

interface RetrospectSectionProps {
  title: string;
  count: number;
  items: (RetrospectListItem & { participantCount?: number })[];
}

export function RetrospectSection({ title, count, items }: RetrospectSectionProps) {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  return (
    <section className="flex flex-col flex-1">
      <div className="py-[10px] pl-[10px]">
        <h2 className="text-title-4 text-grey-1000">
          {title} {count}
        </h2>
      </div>
      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <RetrospectEmptyState />
        </div>
      ) : (
        <div className="flex flex-col gap-0 mt-1">
          {items.map((item, index) => (
            <RetrospectRow
              key={item.retrospectId}
              retrospect={item}
              participantCount={item.participantCount}
              index={index}
              isParticipantOpen={openDropdownId === item.retrospectId}
              onToggleParticipant={() =>
                setOpenDropdownId(openDropdownId === item.retrospectId ? null : item.retrospectId)
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
