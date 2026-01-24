import type * as React from 'react';
import { cn } from '@/lib/utils';
import type { Retrospective } from '@/store/retrospective';

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  bgColor: string;
  textColor: string;
}

const Chip = ({ label, bgColor, textColor, className, ...props }: ChipProps) => {
  return (
    <div
      className={cn(
        'flex h-[27px] items-center justify-center rounded px-[10px]',
        bgColor,
        className
      )}
      {...props}
    >
      <p className={cn('text-nowrap text-sm font-semibold', textColor)}>{label}</p>
    </div>
  );
};

interface RetrospectiveCardProps {
  retrospective: Retrospective;
  onClick: () => void;
}

const statusConfig = {
  in_progress: {
    label: '진행중',
    bgColor: 'bg-[rgba(28,138,255,0.14)]',
    textColor: 'text-[#1c8aff]',
  },
  completed: {
    label: '완료',
    bgColor: 'bg-[rgba(76,175,80,0.14)]',
    textColor: 'text-[#4caf50]',
  },
  planned: {
    label: '예정',
    bgColor: 'bg-[rgba(255,152,0,0.14)]',
    textColor: 'text-[#ff9800]',
  },
};

const typeConfig = {
  KPT: {
    label: 'KPT',
    bgColor: 'bg-[rgba(166,166,166,0.14)]',
    textColor: 'text-[#6a6a6a]',
  },
};

export function RetrospectiveCard({ retrospective, onClick }: RetrospectiveCardProps) {
  const status = statusConfig[retrospective.status];
  const type = typeConfig[retrospective.retrospectiveType];
  const participantCount = retrospective.participants.length;

  const content = (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-2">
            <Chip label={status.label} bgColor={status.bgColor} textColor={status.textColor} />
            <Chip label={type.label} bgColor={type.bgColor} textColor={type.textColor} />
          </div>
          <p className="text-xl font-semibold text-black">{retrospective.title}</p>
        </div>
        <span className="text-base font-medium text-black/42">{retrospective.description}</span>
      </div>
      <div className="flex items-center">
        <p className="text-sm font-semibold text-black">참여 인원 {participantCount}</p>
      </div>
    </div>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer rounded-xl bg-white p-5 text-left"
    >
      {content}
    </button>
  );
}
