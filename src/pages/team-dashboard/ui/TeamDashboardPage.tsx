import { useState } from 'react';
import { useParams } from 'react-router';
import { useRetrospects } from '@/features/retrospective/api/retrospective.queries';
import { CreateRetrospectDialog } from '@/features/retrospective/ui/CreateRetrospectDialog';
import { RetrospectSection } from '@/features/retrospective/ui/RetrospectSection';
import { useRetroRooms } from '@/features/team/api/team.queries';
import { Button } from '@/shared/ui/button/Button';
import IcPlus from '@/shared/ui/icons/IcPlus';

export function TeamDashboardPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const retroRoomId = Number(teamId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: roomData } = useRetroRooms();
  const { data: retrospectsData, isLoading, isError, refetch } = useRetrospects(retroRoomId);

  const currentRoom = roomData?.result?.find((r) => r.retroRoomId === retroRoomId);
  const retrospects = retrospectsData?.result ?? [];

  // TODO: API에서 status 필드를 제공하면 실제 상태로 구분
  // 현재는 임시로 전체를 "대기 중"으로 표시
  const pendingRetrospects = retrospects;
  const completedRetrospects: typeof retrospects = [];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

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

  return (
    <div className="h-full p-6 flex flex-col">
      {/* Header */}
      <div className="mb-28 shrink-0">
        <h1 className="text-title-1 text-grey-1000 mb-5">{currentRoom?.retroRoomName ?? '팀'}</h1>
        <Button
          variant="primary"
          size="md"
          className="gap-1.5"
          onClick={() => setIsDialogOpen(true)}
        >
          <IcPlus className="w-2 h-2" />
          회고 추가하기
        </Button>
      </div>

      {/* Content */}
      <div className="flex gap-6 flex-1 min-h-0">
        <RetrospectSection
          title="회고 대기 중"
          count={pendingRetrospects.length}
          items={pendingRetrospects}
        />
        <RetrospectSection
          title="완료된 회고"
          count={completedRetrospects.length}
          items={completedRetrospects}
        />
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
