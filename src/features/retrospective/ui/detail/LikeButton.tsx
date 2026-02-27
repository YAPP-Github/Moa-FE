import { useState } from 'react';
import { useToggleLike } from '../../api/retrospective.mutations';
import IcHeartActive from '@/shared/ui/icons/IcHeartActive';
import IcHeartInactive from '@/shared/ui/icons/IcHeartInactive';

interface LikeButtonProps {
  responseId: number;
  likeCount: number;
  isLiked?: boolean;
}

export function LikeButton({ responseId, likeCount, isLiked = false }: LikeButtonProps) {
  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
  const [optimisticCount, setOptimisticCount] = useState(likeCount);
  const mutation = useToggleLike();

  const handleClick = () => {
    const nextLiked = !optimisticLiked;
    setOptimisticLiked(nextLiked);
    setOptimisticCount((prev) => (nextLiked ? prev + 1 : prev - 1));

    mutation.mutate(responseId, {
      onError: () => {
        setOptimisticLiked(optimisticLiked);
        setOptimisticCount(likeCount);
      },
    });
  };

  return (
    <button
      type="button"
      className={`flex cursor-pointer items-center gap-0.5 rounded-[4px] p-px leading-none text-caption-3-medium transition-colors ${
        optimisticLiked ? 'text-red-300 hover:bg-red-200' : 'text-grey-600 hover:bg-grey-100'
      }`}
      onClick={handleClick}
      disabled={mutation.isPending}
    >
      {optimisticLiked ? (
        <IcHeartActive className="shrink-0" width={18} height={18} />
      ) : (
        <IcHeartInactive className="shrink-0" width={18} height={18} />
      )}
      <span className="min-w-[1ch] translate-y-px tabular-nums">{optimisticCount}</span>
    </button>
  );
}
