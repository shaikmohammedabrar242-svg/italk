import React from 'react';
import { ArrowUp, MessageSquare, Share2, Flag, CheckCircle2, AlertCircle } from 'lucide-react';
import { Post } from '../types';
import { formatRelativeTime } from '../utils/time';
import { CATEGORIES } from '../utils/cities';

interface ProblemCardProps {
  post: Post;
  hasVoted: boolean;
  onVote: (postId: string) => void;
  onOpenDetail: (postId: string) => void;
  onShare: (post: Post) => void;
  onReport: (post: Post) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  post,
  hasVoted,
  onVote,
  onOpenDetail,
  onShare,
  onReport
}) => {
  const categoryMeta = CATEGORIES[post.category] || CATEGORIES.Civic;
  const isResolved = post.status === 'resolved';

  return (
    <article
      onClick={() => onOpenDetail(post.id)}
      className="bg-white rounded-2xl border border-[#E5E5E5] p-4 sm:p-5 hover:border-slate-300 transition-all cursor-pointer shadow-xs relative group flex flex-col justify-between"
    >
      <div>
        {/* Top metadata line: Zero-pill discipline (Category · City · Time · Status) */}
        <div className="flex items-center justify-between text-xs text-[#666666] mb-2.5 flex-wrap gap-y-1">
          <div className="flex items-center gap-1.5 font-medium">
            <span style={{ color: categoryMeta.color }} className="font-semibold">
              {post.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-800">{post.city}</span>
            <span aria-hidden="true">·</span>
            <span>{formatRelativeTime(post.created_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            {post.moderation_status === 'needs_review' && (
              <span className="text-amber-600 text-xs font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Under Review
              </span>
            )}

            {isResolved ? (
              <span className="inline-flex items-center gap-1 text-[#21865B] text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Resolved
              </span>
            ) : (
              <span className="text-slate-500 text-xs font-medium">
                Open
              </span>
            )}
          </div>
        </div>

        {/* Problem Title */}
        <h2 className="text-base sm:text-lg font-bold text-[#000000] leading-snug tracking-tight mb-2 group-hover:text-[#FF4500] transition-colors">
          {post.title}
        </h2>

        {/* Short Description */}
        <p className="text-sm text-[#444444] line-clamp-3 leading-relaxed mb-3">
          {post.description}
        </p>

        {/* Optional Image thumbnail */}
        {post.image_path && (
          <div className="mb-3 rounded-xl overflow-hidden max-h-48 bg-slate-100 border border-slate-200">
            <img
              src={post.image_path}
              alt={post.title}
              className="w-full h-44 object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Footer metadata & Isolated Actions */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-1">
        {/* Author Anonymous Display */}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            style={{ backgroundColor: post.avatar_color || '#FF4500' }}
          >
            {post.anonymous_username.slice(0, 1)}
          </div>
          <span className="text-xs text-[#666666] font-medium truncate max-w-[140px] sm:max-w-[200px]">
            {post.anonymous_username}
          </span>
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Upvote button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onVote(post.id);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              hasVoted
                ? 'bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30 shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 border border-transparent'
            }`}
            title={hasVoted ? 'Remove upvote' : 'Upvote problem'}
            aria-label="Upvote"
          >
            <ArrowUp className={`w-3.5 h-3.5 stroke-[2.5] ${hasVoted ? 'text-[#FF4500]' : 'text-slate-500'}`} />
            <span className="tabular-nums">{post.upvotes_count}</span>
          </button>

          {/* Comment button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(post.id);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            title="View advice & comments"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span className="tabular-nums">{post.comments_count}</span>
          </button>

          {/* Share button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShare(post);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Share discussion"
            aria-label="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Report button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReport(post);
            }}
            className="p-1.5 text-slate-400 hover:text-[#C62828] hover:bg-red-50 rounded-lg transition-colors"
            title="Report inappropriate content"
            aria-label="Report"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
