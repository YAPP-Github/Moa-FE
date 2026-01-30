interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={`h-[54px] bg-[#FFFFFF] border-b border-[#F3F4F5] flex items-center justify-between px-4 ${
        className ?? ''
      }`}
    >
      {/* TODO: 실제 로고와 프로필 아바타로 교체 */}
      <div className="w-8 h-8 rounded bg-gray-200" />
      <div className="w-8 h-8 rounded bg-gray-200" />
    </header>
  );
}
