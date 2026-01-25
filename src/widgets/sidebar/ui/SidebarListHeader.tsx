import { icMeatball24 } from '@/shared/assets/svg';

interface SidebarListHeaderProps {
  title: string;
}

export function SidebarListHeader({ title }: SidebarListHeaderProps) {
  return (
    <div className="w-[196px] h-[38px] px-[16px] py-[8px] flex items-center justify-between">
      <span className="text-[16px] font-semibold leading-[130%] text-[#333D4B] truncate">
        {title}
      </span>
      <button type="button" className="shrink-0">
        <img src={icMeatball24} alt="더보기" className="w-6 h-6" />
      </button>
    </div>
  );
}
