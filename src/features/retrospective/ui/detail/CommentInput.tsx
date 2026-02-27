import { useEffect, useRef, useState } from 'react';
import { useCreateComment } from '../../api/retrospective.mutations';
import { Button } from '@/shared/ui/button/Button';

interface CommentInputProps {
  responseId: number;
  initialContent: string;
  onContentChange: (content: string) => void;
}

export function CommentInput({ responseId, initialContent, onContentChange }: CommentInputProps) {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mutation = useCreateComment(responseId);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onContentChange(e.target.value);
  };

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    await mutation.mutateAsync({ content: trimmed });
    setContent('');
    onContentChange('');
  };

  return (
    <div className="flex items-center gap-2.5 rounded-xl border-2 border-grey-200 bg-grey-50 px-[13px] py-[7px]">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        placeholder="댓글로 의견을 남겨보세요"
        rows={1}
        className="max-h-[120px] flex-1 resize-none bg-transparent text-caption-3-medium leading-[normal] text-grey-900 outline-none [field-sizing:content] placeholder:text-grey-500"
        disabled={mutation.isPending}
      />
      <Button
        variant="primary"
        size="sm"
        onClick={handleSubmit}
        disabled={!content.trim() || mutation.isPending}
        className="shrink-0 px-[7px] py-[4px] rounded-[6px] text-sub-title-5 text-grey-0"
      >
        남기기
      </Button>
    </div>
  );
}
