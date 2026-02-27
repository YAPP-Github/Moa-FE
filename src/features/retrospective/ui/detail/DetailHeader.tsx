import { RETROSPECTIVE_TAB_LABELS } from '../../model/constants';
import type { RetrospectiveTabType } from '../../model/types';
import { cn } from '@/shared/lib/cn';

const TABS: RetrospectiveTabType[] = ['question', 'member', 'analysis'];

interface DetailHeaderProps {
  title: string;
  activeTab: RetrospectiveTabType;
  onTabChange: (tab: RetrospectiveTabType) => void;
}

export function DetailHeader({ title, activeTab, onTabChange }: DetailHeaderProps) {
  return (
    <div className="flex flex-col pt-[36px]">
      <h1 className="text-title-1 text-grey-1000">{title}</h1>

      <div className="mt-6 mb-4 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={cn(
              'cursor-pointer rounded-[27px] px-4 py-[4.5px] text-grey-900 transition-colors',
              activeTab === tab ? 'bg-grey-200 text-sub-title-2' : 'text-log-1 hover:bg-grey-200'
            )}
            onClick={() => onTabChange(tab)}
          >
            {RETROSPECTIVE_TAB_LABELS[tab]}
          </button>
        ))}
      </div>
    </div>
  );
}
