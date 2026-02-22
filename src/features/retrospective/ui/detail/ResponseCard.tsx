import { useState } from 'react';
import { CommentButton } from './CommentButton';
import { CommentSection } from './CommentSection';
import { LikeButton } from './LikeButton';
import { formatRelativeTime } from '../../lib/date';
import type { ResponseListItem } from '../../model/types';
import { Avatar } from '@/shared/ui/avatar/Avatar';

interface ResponseCardProps {
  response: ResponseListItem;
  hideAuthor?: boolean;
}

export function ResponseCard({ response, hideAuthor = false }: ResponseCardProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className={hideAuthor ? 'py-4' : 'border-b border-grey-100 py-4 last:border-b-0'}>
      <div className={hideAuthor ? '' : 'flex items-start gap-2'}>
        {!hideAuthor && <Avatar size="sm" />}
        <div className="flex-1">
          <div className="flex gap-1 flex-col">
            {!hideAuthor && (
              <span className="text-sub-title-4 text-grey-900">{response.userName}</span>
            )}
            {!hideAuthor && response.createdAt && (
              <span className="text-caption-6 text-grey-700">
                {formatRelativeTime(response.createdAt)}
              </span>
            )}
            <p className="whitespace-pre-wrap text-long-2 text-grey-900">{response.content}</p>
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
                onClick={() => setShowComments((prev) => !prev)}
              />
            </div>

            {showComments && <CommentSection responseId={response.responseId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
