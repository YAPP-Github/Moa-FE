import { useState } from 'react';
import { useParams } from 'react-router';
// import { useRetrospects } from '@/features/retrospective/api/retrospective.queries';
import { CreateRetrospectDialog } from '@/features/retrospective/ui/CreateRetrospectDialog';
import { RetrospectSection } from '@/features/retrospective/ui/RetrospectSection';
// import { useRetroRooms } from '@/features/team/api/team.queries';
import { Button } from '@/shared/ui/button/Button';
import IcChevronDown from '@/shared/ui/icons/IcChevronDown';
import IcPlus from '@/shared/ui/icons/IcPlus';
import IcUserProfile from '@/shared/ui/icons/IcUserProfile';

export function TeamDashboardPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const retroRoomId = Number(teamId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const { data: roomData } = useRetroRooms();
  // const { data: retrospectsData, isLoading, isError, refetch } = useRetrospects(retroRoomId);

  // const currentRoom = roomData?.result?.find((r) => r.retroRoomId === retroRoomId);
  // const retrospects = retrospectsData?.result ?? [];

  const isSopt = retroRoomId === 2;

  const currentRoom = isSopt
    ? { retroRoomId: 2, retroRoomName: 'SOPT' }
    : { retroRoomId: 1, retroRoomName: 'YAPP WEB 3팀 - 모아' };

  const memberCount = isSopt ? 1 : 12;
  const isLoading = false; // Dummy loading state

  const dummyTodayRetrospects = [
    {
      retrospectId: 1,
      projectName: '3차 스프린트 회고',
      retrospectDate: '2025-01-12',
      retrospectMethod: 'KPT',
      retrospectTime: '오후 8:00',
      participantCount: 2,
    },
    {
      retrospectId: 2,
      projectName: '3차 스프린트 회고',
      retrospectDate: '2025-01-12',
      retrospectMethod: 'KPT',
      retrospectTime: '오후 10:00',
      participantCount: 2,
    },
  ];

  const dummyPendingRetrospects = [
    {
      retrospectId: 3,
      projectName: '1차 스프린트 회고',
      retrospectDate: '2025-01-12',
      retrospectMethod: 'KPT',
      retrospectTime: '20:00',
      participantCount: 2,
    },
    {
      retrospectId: 4,
      projectName: '1차 스프린트 회고',
      retrospectDate: '2025-01-12',
      retrospectMethod: 'KPT',
      retrospectTime: '22:00',
      participantCount: 2,
    },
  ];

  const dummyCompletedRetrospects = [
    {
      retrospectId: 5,
      projectName: '2차 스프린트 회고',
      retrospectDate: '2025-01-10',
      retrospectMethod: 'KPT',
      retrospectTime: '20:00',
      participantCount: 3,
    },
    {
      retrospectId: 6,
      projectName: '프로젝트 킥오프 회고',
      retrospectDate: '2025-01-08',
      retrospectMethod: 'KPT',
      retrospectTime: '18:00',
      participantCount: 5,
    },
    {
      retrospectId: 7,
      projectName: '1차 스프린트 회고',
      retrospectDate: '2025-01-05',
      retrospectMethod: 'KPT',
      retrospectTime: '19:00',
      participantCount: 4,
    },
    {
      retrospectId: 8,
      projectName: '디자인 시스템 구축 회고',
      retrospectDate: '2025-01-03',
      retrospectMethod: 'KPT',
      retrospectTime: '20:30',
      participantCount: 6,
    },
    {
      retrospectId: 9,
      projectName: '온보딩 프로세스 개선 회고',
      retrospectDate: '2025-01-01',
      retrospectMethod: 'KPT',
      retrospectTime: '18:30',
      participantCount: 4,
    },
    {
      retrospectId: 10,
      projectName: '연말 종합 회고',
      retrospectDate: '2024-12-30',
      retrospectMethod: 'KPT',
      retrospectTime: '17:00',
      participantCount: 8,
    },
    {
      retrospectId: 11,
      projectName: '전체 팀 회고',
      retrospectDate: '2024-12-28',
      retrospectMethod: 'KPT',
      retrospectTime: '19:00',
      participantCount: 12,
    },
  ];

  // TODO: API에서 status 필드를 제공하면 실제 상태로 구분
  // 현재는 임시로 전체를 "대기 중"으로 표시
  const pendingRetrospects = isSopt ? [] : dummyPendingRetrospects;
  const completedRetrospects = isSopt ? [] : dummyCompletedRetrospects;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  /*
  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-body-1 text-gray-600 mb-4">회고 목록을 불러오는데 실패했습니다.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }
  */

  const todayRetrospects = isSopt ? [] : dummyTodayRetrospects;

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
              className="gap-1.5 px-[10px] py-2 text-[13px] font-semibold text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              <IcPlus className="w-2 h-2" />
              회고 추가하기
            </Button>

            <button
              type="button"
              className="flex items-center gap-1 p-2 rounded-lg bg-grey-100 text-body-2 font-medium text-gray-700 hover:bg-grey-200 transition-colors"
            >
              <IcUserProfile className="w-5 h-5 text-gray-500" />
              <span className="mr-0.5">멤버 {memberCount}</span>
              <IcChevronDown className="w-4 h-4 text-gray-500" />
            </button>
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
