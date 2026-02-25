import { CommentInput } from './CommentInput';
import { useComments } from '../../api/retrospective.queries';
import { Avatar } from '@/shared/ui/avatar/Avatar';

interface CommentSectionProps {
  responseId: number;
  draft: string;
  onDraftChange: (content: string) => void;
}

export function CommentSection({ responseId, draft, onDraftChange }: CommentSectionProps) {
  const { data, isLoading } = useComments(responseId);
  const comments = data?.result?.comments ?? [];

  return (
    <div className="flex flex-col gap-3">
      <CommentInput
        responseId={responseId}
        initialContent={draft}
        onContentChange={onDraftChange}
      />

      {isLoading && <p className="text-caption-4 text-grey-400">댓글 불러오는 중...</p>}

      {comments.map((comment) => (
        <div key={comment.commentId} className="flex items-start gap-2">
          <Avatar size="sm" />
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-sub-title-4 text-grey-700">{comment.userName}</span>
            <p className="whitespace-pre-wrap break-all text-long-2 text-grey-900">
              {comment.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
