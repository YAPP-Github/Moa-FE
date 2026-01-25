export function NoTeamEmptyState() {
  const handleStartRetrospective = () => {
    console.log('TODO: 회고 시작 플로우로 이동');
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-[35px]">
        <p className="text-[20px] font-semibold leading-none">성장을 위한 회고를 시작해봐요</p>

        <button
          type="button"
          onClick={handleStartRetrospective}
          className="rounded-[8px] bg-[#3182F6] px-[28px] py-[12px] text-white"
        >
          회고 시작하기
        </button>
      </div>
    </div>
  );
}
