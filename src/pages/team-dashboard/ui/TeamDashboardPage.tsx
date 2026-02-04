import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useRetrospects } from '@/features/retrospective/api/retrospective.queries';
import { CreateRetrospectDialog } from '@/features/retrospective/ui/CreateRetrospectDialog';
import { RetrospectSection } from '@/features/retrospective/ui/RetrospectSection';
import { useRetroRooms } from '@/features/team/api/team.queries';
import { Button } from '@/shared/ui/button/Button';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import IcChevronDown from '@/shared/ui/icons/IcChevronDown';
import IcPlus from '@/shared/ui/icons/IcPlus';
import IcUserProfile from '@/shared/ui/icons/IcUserProfile';

export function TeamDashboardPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const retroRoomId = Number(teamId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: roomData } = useRetroRooms();
  const { data: retrospectsData, isLoading, isError } = useRetrospects(retroRoomId);

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

  const todayRetrospects = retrospects.filter((r) => {
    const retroDate = new Date(r.retrospectDate);
    retroDate.setHours(0, 0, 0, 0);
    return retroDate.getTime() === today.getTime();
  });

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

  // TODO: API에서 멤버 수 제공 시 대체
  const memberCount = 0;

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
                  className="bg-white p-3 rounded-lg shadow-lg min-w-[160px]"
                >
                  <p className="text-caption-4 text-grey-700">멤버 {memberCount}명</p>
                  {memberCount > 0 ? (
                    <div className="flex flex-col gap-3 mt-3">
                      {/* TODO: API 연동 시 멤버 목록 표시 */}
                    </div>
                  ) : (
                    <div className="mt-3 text-caption-4 text-grey-500">멤버 없음</div>
                  )}
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </div>

          {/* Today's Retrospects */}
          <div className="flex gap-2 min-h-16">
            {todayRetrospects.map((retro) => (
              <div
                key={retro.retrospectId}
                className="flex items-center gap-[10px] bg-white px-[10px] py-3 rounded-[20px] w-48 h-16"
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
                      {retro.retrospectTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}
