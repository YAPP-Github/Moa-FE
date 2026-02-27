import IcComment from '@/shared/ui/icons/IcComment';

interface CommentButtonProps {
  commentCount: number;
  onClick: () => void;
}

export function CommentButton({ commentCount, onClick }: CommentButtonProps) {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-0.5 rounded-[4px] p-px leading-none text-caption-3-medium text-grey-600 hover:bg-grey-100"
      onClick={onClick}
    >
      <IcComment className="shrink-0" width={18} height={18} />
      <span className="translate-y-px">{commentCount}</span>
    </button>
  );
}
