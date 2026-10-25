import React, { useState } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Loader2,
  Trash2
} from 'lucide-react';
import { Category, UserProfile, Post } from '../types';
import { INDIAN_CITIES, CATEGORIES } from '../utils/cities';
import { storage } from '../services/storage';
import { runContentModeration } from '../utils/moderation';

interface CreateProblemModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onRequestLogin: (pendingAction?: () => void) => void;
  onPostCreated: (post: Post) => void;
}

export const CreateProblemModal: React.FC<CreateProblemModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onRequestLogin,
  onPostCreated
}) => {
  const [category, setCategory] = useState<Category>('Civic');
  const [city, setCity] = useState(currentUser?.preferred_city || 'Bengaluru');
  const [customCity, setCustomCity] = useState('');
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdPost, setCreatedPost] = useState<Post | null>(null);

  if (!isOpen) return null;

  // Real-time privacy warnings
  const privacyCheck = runContentModeration(title, description);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be under 5MB in size.');
      return;
    }

    // Validate format
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setImageError('Only JPEG, PNG, or WebP images are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequestLogin(() => {
        // Continue after auth
      });
      return;
    }

    const finalCity = isCustomCity ? customCity.trim() : city;
    if (!finalCity) {
      setError('Please select or specify a city.');
      return;
    }

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 5) {
      setError('Problem title must be at least 5 characters.');
      return;
    }
    if (trimmedTitle.length > 100) {
      setError('Problem title cannot exceed 100 characters.');
      return;
    }

    const trimmedDesc = description.trim();
    if (trimmedDesc.length < 20) {
      setError('Please provide at least 20 characters in the description.');
      return;
    }
    if (trimmedDesc.length > 3000) {
      setError('Description cannot exceed 3,000 characters.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Run Content Moderation check
      const modResult = runContentModeration(trimmedTitle, trimmedDesc);

      const post = storage.createPost({
        title: trimmedTitle,
        description: trimmedDesc,
        category,
        city: finalCity,
        image_path: imageFile || undefined,
        author: currentUser,
        moderation_status: modResult.status,
        moderation_reason: modResult.reason
      });

      setCreatedPost(post);
      onPostCreated(post);
    } catch (err) {
      setError('An error occurred while posting your problem. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setImageFile(null);
    setCreatedPost(null);
    setError(null);
    onClose();
  };

  // Success view as per PRD 9.3
  if (createdPost) {
    const isNeedsReview = createdPost.moderation_status === 'needs_review';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 text-center shadow-2xl border border-[#E5E5E5]">
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
              isNeedsReview ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-[#21865B]'
            }`}
          >
            {isNeedsReview ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            {isNeedsReview ? 'Post Submitted for Review' : 'Your problem is out there.'}
          </h2>

          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {isNeedsReview
              ? 'Our moderation safety check flagged potential phone/identity details. Community moderators will review and approve it shortly.'
              : 'Your post is ready for the community. Indians facing similar issues can now provide advice and solutions.'}
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                onClose();
              }}
              className="w-full py-3 px-4 bg-[#FF4500] hover:bg-[#e03d00] text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
            >
              View My Problem
            </button>
            <button
              onClick={handleResetForm}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-colors"
            >
              Back to Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/55 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Share a Problem</h2>
            <p className="text-xs text-slate-500">Post anonymously · Get real advice from across India</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* Privacy Reminder Banner (PRD 9.1) */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-semibold">Your public identity is anonymous.</span> Avoid sharing passwords,
              account numbers, phone numbers, personal addresses, or private details about other people.
            </div>
          </div>

          {/* Current anonymous username */}
          {currentUser && (
            <div className="flex items-center justify-between text-xs px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-600">Posting anonymously as:</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block"
                  style={{ backgroundColor: currentUser.avatar_color }}
                />
                {currentUser.anonymous_username}
              </div>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Category <span className="text-[#FF4500]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(CATEGORIES) as Category[]).map((cat) => {
                const meta = CATEGORIES[cat];
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                      isSelected
                        ? 'border-[#FF4500] bg-[#FF4500]/5 text-[#FF4500] font-bold shadow-xs'
                        : 'border-[#E5E5E5] text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="font-semibold text-sm">{meta.label}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{meta.tagline}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* City Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                City / Location <span className="text-[#FF4500]">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomCity(!isCustomCity)}
                className="text-xs text-[#FF4500] hover:underline font-semibold"
              >
                {isCustomCity ? 'Pick from popular cities' : '+ Other / Custom City'}
              </button>
            </div>

            {isCustomCity ? (
              <input
                type="text"
                placeholder="Enter city or district name (e.g., Anantapur, Warangal)"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#FF4500]"
                required
              />
            ) : (
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#FF4500] text-slate-800"
              >
                {INDIAN_CITIES.filter((c) => c !== 'All India').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Problem Title <span className="text-[#FF4500]">*</span>
              </label>
              <span className="text-xs text-slate-400 tabular-nums">{title.length}/100</span>
            </div>
            <input
              type="text"
              placeholder="Describe your problem in one line"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
              className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500]"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Detailed Description <span className="text-[#FF4500]">*</span>
              </label>
              <span className="text-xs text-slate-400 tabular-nums">{description.length}/3000</span>
            </div>
            <textarea
              rows={5}
              placeholder="Explain what's happening, what you've tried, and what kind of help you need."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={3000}
              required
              className="w-full p-3.5 text-sm text-slate-800 bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] leading-relaxed resize-y"
            />
            <p className="text-[11px] text-slate-400 mt-1">Minimum 20 characters recommended.</p>
          </div>

          {/* Real-time Content Warning if sensitive info detected */}
          {!privacyCheck.passed && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#C62828] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Privacy warning before publishing:</p>
                <p className="mt-0.5">{privacyCheck.reason}</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Please mask any phone numbers or bank details to keep your post completely anonymous and safe.
                </p>
              </div>
            </div>
          )}

          {/* Optional Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Attach Image <span className="text-slate-400 font-normal">(Optional, max 5MB)</span>
            </label>

            {imageFile ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-48 group">
                <img src={imageFile} alt="Problem attachment" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-lg transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700">Click to upload photo or screenshot</span>
                <span className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG, WebP up to 5MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
            {imageError && <p className="text-xs text-[#C62828] mt-1">{imageError}</p>}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-[#C62828] text-xs font-medium rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#FF4500] hover:bg-[#e03d00] text-white font-bold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing anonymously...
                </>
              ) : (
                'Post anonymously'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
