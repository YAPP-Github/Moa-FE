import { format, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useRef } from 'react';
import { RETROSPECT_METHOD_LABELS } from '@/features/retrospective/model/constants';
import type { RetrospectListItem } from '@/shared/api/generated/index';
import IcChevronDown from '@/shared/ui/icons/IcChevronDown';

interface RetrospectRowProps {
  retrospect: RetrospectListItem;
  participantCount?: number;
  onClick?: () => void;
  index?: number;
  isParticipantOpen?: boolean;
  onToggleParticipant?: () => void;
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

// 더미 참여자 데이터
const DUMMY_PARTICIPANTS = [
  '김민지',
  '손민수',
  '이지은',
  '박서준',
  '최유나',
  '정하늘',
  '강민호',
  '윤서아',
];

export function RetrospectRow({
  retrospect,
  participantCount = 0,
  onClick,
  index = 0,
  isParticipantOpen = false,
  onToggleParticipant,
}: RetrospectRowProps) {
  const date = new Date(retrospect.retrospectDate);
  const formattedDate = format(date, 'M.dd', { locale: ko });
  const dayOfWeek = DAY_LABELS[getDay(date)];
  const methodLabel =
    RETROSPECT_METHOD_LABELS[retrospect.retrospectMethod] ?? retrospect.retrospectMethod;

  const hasBackground = index % 2 === 0;

  // participantCount만큼 더미 참여자 표시
  const participants = DUMMY_PARTICIPANTS.slice(0, participantCount);

  // 참여인원 드롭다운 외부 클릭 감지
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isParticipantOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggleParticipant?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isParticipantOpen, onToggleParticipant]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Row wrapper with nested button for participant toggle
    // biome-ignore lint/a11y/noStaticElementInteractions: Interactive row with nested button
    <div
      className={`flex w-full cursor-pointer items-center pl-[10px] pr-4 py-3 text-left transition-colors rounded-lg ${
        hasBackground ? 'bg-grey-50' : 'bg-transparent'
      }`}
      onClick={onClick}
    >
      {/* 날짜 */}
      <div className="flex shrink-0 items-baseline gap-1 w-[60px]">
        <span className="text-caption-2 text-grey-700">{formattedDate}</span>
        <span className="text-caption-2 text-grey-700">{dayOfWeek}</span>
      </div>

      {/* 타이틀 */}
      <div className="ml-[46px] flex-1 min-w-0 pr-5">
        <span className="truncate text-body-1 font-medium text-grey-900 block">
          {retrospect.projectName}
        </span>
      </div>

      {/* 태그 */}
      <div className="shrink-0">
        <span className="bg-blue-200 rounded-[4px] py-1 px-3 text-sub-title-4 text-blue-500">
          {methodLabel}
        </span>
      </div>

      {/* 참여인원 */}
      <div ref={dropdownRef} className="relative shrink-0 ml-5">
        <button
          type="button"
          className={`flex items-center text-sub-title-3 text-grey-900 px-2 py-1 rounded-md transition-colors cursor-pointer ${
            isParticipantOpen ? 'bg-grey-100' : 'hover:bg-grey-50'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleParticipant?.();
          }}
        >
          <span className="inline-block">참여인원</span>
          <span className="inline-block w-4 text-right">{participantCount}</span>
          <IcChevronDown className={`w-4 h-4 ${isParticipantOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* 참여인원 드롭다운 */}
        {isParticipantOpen && (
          <div className="absolute top-full mt-1 left-0 bg-white p-3 rounded-lg shadow-lg z-10 min-w-[120px]">
            <p className="text-caption-4 text-grey-700">참여인원 {participantCount}명</p>
            <div className="flex flex-col gap-3 mt-3">
              {participants.map((name) => (
                <span key={name} className="text-sub-title-2 text-grey-900">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
