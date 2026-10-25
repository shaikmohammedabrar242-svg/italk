import React from 'react';
import { CheckCircle2, RotateCcw, Clock, Trash2, ArrowUp, MessageSquare, Plus, AlertCircle } from 'lucide-react';
import { Post, UserProfile } from '../types';
import { formatRelativeTime } from '../utils/time';
import { CATEGORIES } from '../utils/cities';

interface MyPostsViewProps {
  currentUser: UserProfile;
  posts: Post[];
  onOpenDetail: (postId: string) => void;
  onToggleStatus: (postId: string, currentStatus: 'open' | 'resolved') => void;
  onDeletePost: (postId: string) => void;
  onCreateNew: () => void;
}

export const MyPostsView: React.FC<MyPostsViewProps> = ({
  currentUser,
  posts,
  onOpenDetail,
  onToggleStatus,
  onDeletePost,
  onCreateNew
}) => {
  const userPosts = posts.filter((p) => p.author_id === currentUser.id);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">My Submitted Problems</h2>
          <p className="text-xs text-slate-500">
            Posting as <span className="font-semibold text-slate-800">{currentUser.anonymous_username}</span> · {userPosts.length} problems submitted
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Share Another Problem
        </button>
      </div>

      {/* Empty State */}
      {userPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 text-[#FF4500] flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">You haven't shared any problems yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
            Need advice on a civic issue, consumer dispute, financial glitch, or workplace challenge? Share it anonymously in under 60 seconds.
          </p>
          <button
            onClick={onCreateNew}
            className="px-5 py-2.5 bg-[#FF4500] text-white text-xs font-bold rounded-xl hover:bg-[#e03d00] transition-colors shadow-xs"
          >
            + Share a Problem Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {userPosts.map((post) => {
            const isResolved = post.status === 'resolved';
            const cat = CATEGORIES[post.category] || CATEGORIES.Civic;

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-[#E5E5E5] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onOpenDetail(post.id)}
                >
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                    <span style={{ color: cat.color }} className="font-semibold">
                      {post.category}
                    </span>
                    <span>·</span>
                    <span className="text-slate-800">{post.city}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(post.created_at)}</span>

                    {post.moderation_status === 'needs_review' && (
                      <span className="text-amber-600 font-semibold flex items-center gap-1 ml-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Under Moderation Review
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 hover:text-[#FF4500] transition-colors mb-1">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <ArrowUp className="w-3.5 h-3.5 text-[#FF4500]" />
                      {post.upvotes_count} upvotes
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      {post.comments_count} pieces of advice
                    </span>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  <button
                    onClick={() => onToggleStatus(post.id, post.status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isResolved
                        ? 'bg-emerald-50 text-[#21865B] border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    title={isResolved ? 'Click to reopen' : 'Mark problem as resolved'}
                  >
                    {isResolved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved (Reopen)
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Mark Resolved
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this problem?')) {
                        onDeletePost(post.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-[#C62828] hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete problem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
