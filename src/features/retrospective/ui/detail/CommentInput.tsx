import { useState } from 'react';
import { useCreateComment } from '../../api/retrospective.mutations';
import { Button } from '@/shared/ui/button/Button';

interface CommentInputProps {
  responseId: number;
}

export function CommentInput({ responseId }: CommentInputProps) {
  const [content, setContent] = useState('');
  const mutation = useCreateComment(responseId);

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    await mutation.mutateAsync({ content: trimmed });
    setContent('');
  };

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-grey-200 bg-grey-50 px-3.5 py-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글로 의견을 남겨보세요"
        className="flex-1 bg-transparent text-caption-3-medium text-grey-900 outline-none placeholder:text-grey-500"
        disabled={mutation.isPending}
      />
      <Button
        variant="primary"
        size="sm"
        onClick={handleSubmit}
        disabled={!content.trim() || mutation.isPending}
        className="px-[7px] py-[4px] rounded-[6px] text-sub-title-5"
      >
        남기기
      </Button>
    </div>
  );
}
