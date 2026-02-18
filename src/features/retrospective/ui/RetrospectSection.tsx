import { useState } from 'react';
import { RetrospectRow } from './RetrospectRow';
import type { RetrospectListItem } from '@/shared/api/generated/index';
import IcNote from '@/shared/ui/logos/IcNote';

interface RetrospectSectionProps {
  title: string;
  count: number;
  items: RetrospectListItem[];
  onItemClick?: (item: RetrospectListItem) => void;
}

export function RetrospectSection({ title, count, items, onItemClick }: RetrospectSectionProps) {
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
          <div className="flex flex-col items-center justify-center py-16">
            <IcNote width={29} height={34} className="mb-[16px]" />
            <p className="text-caption-3-medium text-grey-700">회고 내역이 없어요</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-0 mt-1">
          {items.map((item, index) => (
            <RetrospectRow
              key={item.retrospectId}
              retrospect={item}
              index={index}
              isParticipantOpen={openDropdownId === item.retrospectId}
              onToggleParticipant={() =>
                setOpenDropdownId(openDropdownId === item.retrospectId ? null : item.retrospectId)
              }
              onClick={() => onItemClick?.(item)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
