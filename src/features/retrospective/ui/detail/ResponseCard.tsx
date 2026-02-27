import { CommentButton } from './CommentButton';
import { CommentSection } from './CommentSection';
import { LikeButton } from './LikeButton';
import { formatRelativeTime } from '../../lib/date';
import type { ResponseListItem } from '../../model/types';
import { Avatar } from '@/shared/ui/avatar/Avatar';

interface ResponseCardProps {
  response: ResponseListItem;
  hideAuthor?: boolean;
  openCommentId: number | null;
  onToggleComment: (responseId: number) => void;
  draft: string;
  onDraftChange: (responseId: number, content: string) => void;
}

export function ResponseCard({
  response,
  hideAuthor = false,
  openCommentId,
  onToggleComment,
  draft,
  onDraftChange,
}: ResponseCardProps) {
  const showComments = openCommentId === response.responseId;

  return (
    <div className={hideAuthor ? 'py-4' : 'border-b border-grey-100 py-4 last:border-b-0'}>
      <div className={hideAuthor ? '' : 'flex items-start gap-2'}>
        {!hideAuthor && <Avatar size="sm" />}
        <div className="flex-1">
          <div className="flex gap-1 flex-col">
            {!hideAuthor && (
              <span className="text-sub-title-4 text-grey-900">{response.userName}</span>
            )}
            {!hideAuthor && response.submittedAt && (
              <span className="text-caption-6 text-grey-700">
                {formatRelativeTime(response.submittedAt)}
              </span>
            )}
            <p className="whitespace-pre-wrap break-all text-long-2 text-grey-900">
              {response.content}
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <LikeButton
                responseId={response.responseId}
                likeCount={response.likeCount}
                isLiked={response.isLiked}
              />
              <CommentButton
                commentCount={response.commentCount}
                onClick={() => onToggleComment(response.responseId)}
              />
            </div>

            {showComments && (
              <CommentSection
                responseId={response.responseId}
                draft={draft}
                onDraftChange={(content) => onDraftChange(response.responseId, content)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
