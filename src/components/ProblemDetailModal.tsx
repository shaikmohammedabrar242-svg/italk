import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowUp,
  Share2,
  Flag,
  CheckCircle2,
  Clock,
  Send,
  Lock,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { Post, Comment, UserProfile } from '../types';
import { storage } from '../services/storage';
import { formatRelativeTime, formatDateTime } from '../utils/time';
import { CATEGORIES } from '../utils/cities';

interface ProblemDetailModalProps {
  postId: string | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onRequestLogin: (pendingAction?: () => void) => void;
  onVote: (postId: string) => void;
  hasVoted: boolean;
  onShare: (post: Post) => void;
  onReport: (post: Post) => void;
  onReportComment: (comment: Comment) => void;
  onPostUpdated: () => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  postId,
  currentUser,
  onClose,
  onRequestLogin,
  onVote,
  hasVoted,
  onShare,
  onReport,
  onReportComment,
  onPostUpdated
}) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      loadPostAndComments();
    }
  }, [postId]);

  const loadPostAndComments = () => {
    if (!postId) return;
    const p = storage.getPostById(postId);
    setPost(p);
    if (p) {
      setComments(storage.getComments(postId));
    }
  };

  if (!postId || !post) return null;

  const categoryMeta = CATEGORIES[post.category] || CATEGORIES.Civic;
  const isAuthor = currentUser && currentUser.id === post.author_id;
  const isResolved = post.status === 'resolved';

  const handleToggleResolved = () => {
    if (!currentUser) {
      onRequestLogin();
      return;
    }
    const newStatus = isResolved ? 'open' : 'resolved';
    storage.updatePostStatus(post.id, newStatus, currentUser.id);
    loadPostAndComments();
    onPostUpdated();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequestLogin(() => {
        // Will focus back on submit if user logs in
      });
      return;
    }

    const trimmed = newComment.trim();
    if (trimmed.length < 5) {
      setCommentError('Comment must be at least 5 characters long.');
      return;
    }
    if (trimmed.length > 1500) {
      setCommentError('Comment cannot exceed 1,500 characters.');
      return;
    }

    setIsSubmitting(true);
    setCommentError(null);

    try {
      storage.addComment(post.id, trimmed, currentUser);
      setNewComment('');
      loadPostAndComments();
      onPostUpdated();
    } catch (err) {
      setCommentError('Failed to post advice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/55 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E5E5] bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span style={{ color: categoryMeta.color }}>{post.category}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-700">{post.city}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 divide-y divide-slate-100 flex-1">
          {/* Main Problem Details */}
          <div className="pb-6">
            {/* Status & Author info */}
            <div className="flex items-center justify-between mb-3 text-xs text-[#666666] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: post.avatar_color }}
                >
                  {post.anonymous_username.slice(0, 1)}
                </div>
                <span className="font-semibold text-slate-800">{post.anonymous_username}</span>
                <span className="text-slate-300">·</span>
                <span title={formatDateTime(post.created_at)}>{formatRelativeTime(post.created_at)}</span>
              </div>

              {/* Status Badge */}
              <div>
                {isResolved ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#21865B] text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resolved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Open for Help
                  </span>
                )}
              </div>
            </div>

            {/* Problem Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-[#000000] tracking-tight mb-4 leading-snug">
              {post.title}
            </h1>

            {/* Problem Description */}
            <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-5">
              {post.description}
            </div>

            {/* Uploaded Image (if any) */}
            {post.image_path && (
              <div className="mb-5 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={post.image_path}
                  alt={post.title}
                  className="w-full max-h-96 object-contain bg-slate-900/5"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Author Controls */}
            {isAuthor && (
              <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between flex-wrap gap-2">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">You authored this problem.</span> Has the community advice helped?
                </div>
                <button
                  onClick={handleToggleResolved}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    isResolved
                      ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      : 'bg-[#21865B] text-white hover:bg-emerald-700 shadow-xs'
                  }`}
                >
                  {isResolved ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reopen Problem
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark as Resolved
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onVote(post.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    hasVoted
                      ? 'bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ArrowUp className={`w-4 h-4 stroke-[2.5] ${hasVoted ? 'text-[#FF4500]' : 'text-slate-600'}`} />
                  <span className="tabular-nums">{post.upvotes_count} Upvotes</span>
                </button>

                <button
                  type="button"
                  onClick={() => onShare(post)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => onReport(post)}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-[#C62828] hover:bg-red-50 rounded-lg transition-colors"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            </div>
          </div>

          {/* Advice / Comments Section */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                Community Advice & Answers
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                  {comments.length}
                </span>
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="border border-[#E5E5E5] rounded-xl overflow-hidden focus-within:border-[#FF4500] focus-within:ring-1 focus-within:ring-[#FF4500] transition-all bg-white">
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={
                    currentUser
                      ? "Share practical advice, department contacts, or solutions anonymously..."
                      : "Sign in with Google to share helpful advice..."
                  }
                  maxLength={1500}
                  className="w-full p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    {currentUser ? (
                      <span>Posting as <strong className="text-slate-800">{currentUser.anonymous_username}</strong></span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Lock className="w-3 h-3" /> Sign in required to answer
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 tabular-nums">{newComment.length}/1500</span>
                    <button
                      type="submit"
                      disabled={isSubmitting || !newComment.trim()}
                      className="px-3.5 py-1.5 bg-[#FF4500] text-white font-semibold rounded-lg hover:bg-[#e03d00] disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Post Advice
                    </button>
                  </div>
                </div>
              </div>
              {commentError && (
                <p className="text-xs text-[#C62828] mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {commentError}
                </p>
              )}
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm font-medium text-slate-700">
                  No advice yet. You could be the first to help.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Share phone helplines, official portals, or practical steps you found useful.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3.5 bg-[#F6F6F6] rounded-xl border border-slate-200 text-sm"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ backgroundColor: comm.avatar_color }}
                        >
                          {comm.anonymous_username.slice(0, 1)}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {comm.anonymous_username}
                        </span>
                        <span>·</span>
                        <span>{formatRelativeTime(comm.created_at)}</span>
                      </div>

                      <button
                        onClick={() => onReportComment(comm)}
                        className="text-slate-400 hover:text-[#C62828] p-1 rounded transition-colors"
                        title="Report inappropriate comment"
                      >
                        <Flag className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-slate-800 leading-relaxed whitespace-pre-line text-sm">
                      {comm.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
