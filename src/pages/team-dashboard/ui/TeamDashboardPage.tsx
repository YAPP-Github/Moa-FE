import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useRetrospects } from '@/features/retrospective/api/retrospective.queries';
import { CreateRetrospectDialog } from '@/features/retrospective/ui/CreateRetrospectDialog';
import { RetrospectSection } from '@/features/retrospective/ui/RetrospectSection';
import { useRetroRoomMembers, useRetroRooms } from '@/features/team/api/team.queries';
import { InviteMemberDialog } from '@/features/team/ui/InviteMemberDialog';
import { Button } from '@/shared/ui/button/Button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import IcChevronDown from '@/shared/ui/icons/IcChevronDown';
import IcPlus from '@/shared/ui/icons/IcPlus';
import IcPlusBlue from '@/shared/ui/icons/IcPlusBlue';
import IcUserProfile from '@/shared/ui/icons/IcUserProfile';
import { SidePanel } from '@/shared/ui/side-panel/SidePanel';
import { SwiperContent, SwiperItem, SwiperRoot } from '@/shared/ui/swiper/Swiper';
import { RetrospectiveDetailPanel } from '@/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel';

interface TodayRetrospect {
  retrospectId: number;
  projectName: string;
  retrospectDate: string;
  retrospectMethod: string;
  retrospectTime: string;
  participantCount?: number;
}

// 테스트용 오늘 회고 더미 데이터
const TODAY_DATE = new Date().toISOString().split('T')[0];
const MOCK_TODAY_RETROSPECT: TodayRetrospect = {
  retrospectId: 9999,
  projectName: '모아 스프린트 1주차',
  retrospectDate: TODAY_DATE,
  retrospectMethod: 'KPT',
  retrospectTime: '14:00',
  participantCount: 5,
};

// 시간을 오전/오후 형식으로 변환 (예: "14:00" → "오후 2시")
function formatTimeToKorean(time: string): string {
  const date = parse(time, 'HH:mm', new Date());
  return format(date, 'a h시', { locale: ko });
}

export function TeamDashboardPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const retroRoomId = Number(teamId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedRetrospect, setSelectedRetrospect] = useState<TodayRetrospect | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  const handleTodayRetrospectClick = (retrospect: TodayRetrospect) => {
    setSelectedRetrospect(retrospect);
    setIsSidePanelOpen(true);
  };

  const handleSidePanelClose = () => {
    setIsSidePanelOpen(false);
    setIsPanelExpanded(false);
  };

  const handleScaleToggle = () => {
    setIsPanelExpanded((prev) => !prev);
  };

  const { data: roomData } = useRetroRooms();
  const { data: retrospectsData, isLoading, isError } = useRetrospects(retroRoomId);
  const { data: membersData } = useRetroRoomMembers(retroRoomId);

  // 존재하지 않는 팀이거나 접근 권한이 없는 경우 리다이렉트
  useEffect(() => {
    if (isError && roomData) {
      const teams = roomData.result ?? [];
      if (teams.length > 0) {
        navigate(`/teams/${teams[0].retroRoomId}`, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isError, roomData, navigate]);

  const currentRoom = roomData?.result?.find((r) => r.retroRoomId === retroRoomId);
  const retrospects = retrospectsData?.result ?? [];

  // 날짜 기반으로 회고 분류
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRetrospects = [
    MOCK_TODAY_RETROSPECT, // 테스트용 더미 데이터
    ...retrospects.filter((r) => {
      const retroDate = new Date(r.retrospectDate);
      retroDate.setHours(0, 0, 0, 0);
      return retroDate.getTime() === today.getTime();
    }),
  ];

  const pendingRetrospects = retrospects.filter((r) => {
    const retroDate = new Date(r.retrospectDate);
    retroDate.setHours(0, 0, 0, 0);
    return retroDate.getTime() > today.getTime();
  });

  const completedRetrospects = retrospects.filter((r) => {
    const retroDate = new Date(r.retrospectDate);
    retroDate.setHours(0, 0, 0, 0);
    return retroDate.getTime() < today.getTime();
  });

  const members = membersData?.result ?? [];
  const memberCount = members.length;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-full p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="w-full max-w-[90%] sm:max-w-[95%] lg:max-w-[96%] xl:max-w-[98%] flex flex-col flex-1">
        {/* Team Name */}
        <div className="mb-5 shrink-0 pl-[10px]">
          <h1 className="text-title-1 text-grey-1000">{currentRoom?.retroRoomName ?? '팀'}</h1>
        </div>

        {/* Buttons and Cards Section */}
        <div className="flex flex-col gap-5 shrink-0 mb-5">
          {/* Header Buttons */}
          <div className="flex justify-between items-center pl-[10px]">
            <Button
              variant="primary"
              size="md"
              className="gap-1.5"
              onClick={() => setIsDialogOpen(true)}
            >
              <IcPlus className="w-2 h-2" />
              회고 추가하기
            </Button>

            <DropdownMenuRoot>
              <DropdownMenuTrigger>
                <Button
                  variant="tertiary"
                  size="md"
                  className="gap-1.5 data-[state=open]:bg-[#DEE0E4]"
                >
                  <IcUserProfile className="w-5 h-5" />
                  <span>멤버 {memberCount}</span>
                  <IcChevronDown className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent
                  align="end"
                  sideOffset={4}
                  className="flex flex-col gap-3 p-3 rounded-[8px] border border-grey-200 bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)] min-w-[120px]"
                >
                  {/* 멤버 목록 */}
                  {memberCount > 0 ? (
                    <div className="flex flex-col gap-2">
                      {members.map((member) => (
                        <div key={member.memberId} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full border border-grey-300" />
                          <span className="text-sub-title-3 text-grey-900">{member.nickname}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-caption-4 text-grey-500">멤버 없음</div>
                  )}

                  <DropdownMenuSeparator className="border-t border-grey-200 -mx-3" />

                  {/* 추가하기 버튼 */}
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onSelect={() => setIsInviteDialogOpen(true)}
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center">
                      <IcPlusBlue className="w-2 h-2 text-blue-500" />
                    </div>
                    <span className="text-sub-title-3 text-blue-500">추가하기</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </div>

          {/* Today's Retrospects */}
          <SwiperRoot className="min-h-16">
            <SwiperContent className="gap-2">
              {todayRetrospects.map((retro) => (
                <SwiperItem key={retro.retrospectId}>
                  <button
                    type="button"
                    onClick={() => handleTodayRetrospectClick(retro)}
                    className="flex items-center gap-[10px] bg-white px-[10px] py-3 rounded-[20px] min-w-[186px] h-16 hover:bg-grey-50 transition-colors cursor-pointer text-left"
                  >
                    <div className="w-[38px] h-[38px] bg-grey-100 rounded-[10px] flex items-center justify-center shrink-0">
                      <span className="text-sub-title-5 text-grey-900">오늘</span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sub-title-2 text-grey-1000 truncate">
                        {retro.projectName}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-caption-3 font-medium text-grey-700">
                          {retro.retrospectMethod}
                        </span>
                        <span className="text-caption-3 font-medium text-grey-700">·</span>
                        <span className="text-caption-3 font-medium text-grey-700">
                          {formatTimeToKorean(retro.retrospectTime)}
                        </span>
                      </div>
                    </div>
                  </button>
                </SwiperItem>
              ))}
            </SwiperContent>
          </SwiperRoot>
        </div>

        {/* Content */}
        <div className="flex gap-4 sm:gap-6 lg:gap-8 min-h-0 flex-1">
          <div className="flex-1 flex flex-col">
            <RetrospectSection
              title="회고 대기 중"
              count={pendingRetrospects.length}
              items={pendingRetrospects}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <RetrospectSection
              title="완료된 회고"
              count={completedRetrospects.length}
              items={completedRetrospects}
            />
          </div>
        </div>
      </div>

      {/* 회고 생성 Dialog */}
      <CreateRetrospectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        retroRoomId={retroRoomId}
      />

      {/* 멤버 초대 Dialog */}
      <InviteMemberDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        retroRoomId={retroRoomId}
      />

      {/* 회고 진행 사이드 패널 */}
      <SidePanel
        open={isSidePanelOpen}
        onOpenChange={setIsSidePanelOpen}
        showBackdrop={false}
        topOffset="54px"
        width={isPanelExpanded ? 'calc(100% - 240px)' : 'calc(50% - 120px)'}
      >
        {selectedRetrospect && (
          <RetrospectiveDetailPanel
            retrospect={selectedRetrospect}
            onClose={handleSidePanelClose}
            isExpanded={isPanelExpanded}
            onScaleToggle={handleScaleToggle}
          />
        )}
      </SidePanel>
    </div>
  );
}
