import { Button } from '@/shared/ui/button/Button';
import IcPlus from '@/shared/ui/icons/IcPlus';
import IcNote from '@/shared/ui/logos/IcNote';

export function NoTeamEmptyState() {
  const handleStartRetrospective = () => {
    console.log('TODO: 회고 시작 플로우로 이동');
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <IcNote />

        <p className="text-[20px] text-[#4E5968] font-semibold leading-none">
          회고를 시작하려면 팀 생성이 필요해요
        </p>

        <Button size="lg" onClick={handleStartRetrospective} className="gap-1">
          <IcPlus className="w-3 h-3" /> 팀 생성하기
        </Button>
      </div>
    </div>
  );
}
