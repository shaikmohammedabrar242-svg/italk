import React, { useState } from 'react';
import { X, Flag, CheckCircle2, AlertCircle } from 'lucide-react';
import { Post, Comment, ReportReason, UserProfile } from '../types';
import { storage } from '../services/storage';

interface ReportModalProps {
  target: { type: 'post'; data: Post } | { type: 'comment'; data: Comment } | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onRequestLogin: () => void;
  onReportSubmitted: () => void;
}

const REPORT_REASONS: { reason: ReportReason; description: string }[] = [
  { reason: 'Personal information exposure', description: 'Displays phone numbers, Aadhaar, private bank or home address' },
  { reason: 'Fraud or scam', description: 'Deceptive investment schemes, cryptocurrency or phishing links' },
  { reason: 'Harassment or hate', description: 'Threatening language, slurs, targeted abuse' },
  { reason: 'Spam', description: 'Repetitive promotional messages, advertising' },
  { reason: 'Harmful content', description: 'Self-harm, violence, illegal activity' },
  { reason: 'Other', description: 'Other community guideline violations' }
];

export const ReportModal: React.FC<ReportModalProps> = ({
  target,
  currentUser,
  onClose,
  onRequestLogin,
  onReportSubmitted
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason>('Personal information exposure');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!target) return null;

  const preview =
    target.type === 'post'
      ? `Post: "${target.data.title}"`
      : `Comment: "${target.data.content.slice(0, 100)}..."`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequestLogin();
      return;
    }

    setIsSubmitting(true);
    try {
      storage.createReport({
        reporter_id: currentUser.id,
        target_type: target.type,
        target_id: target.data.id,
        target_preview: preview,
        reason: selectedReason,
        details: details.trim()
      });
      setIsSubmitted(true);
      onReportSubmitted();
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Flag className="w-4 h-4 text-[#C62828]" />
            <span>Report Content</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-[#21865B] rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Report Received</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Thank you for keeping iTalk safe. Community moderators will inspect this report and take appropriate action.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-2.5 px-4 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Reporting:</span> {preview}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Why are you reporting this?
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map(({ reason, description }) => {
                  const isChecked = selectedReason === reason;
                  return (
                    <label
                      key={reason}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#C62828] bg-red-50/40 text-slate-900 font-medium'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="report_reason"
                        value={reason}
                        checked={isChecked}
                        onChange={() => setSelectedReason(reason)}
                        className="mt-0.5 text-[#C62828] focus:ring-[#C62828]"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{reason}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Additional Details <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Help moderators understand what went wrong..."
                maxLength={300}
                className="w-full p-2.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#C62828] resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#C62828] hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors shadow-xs"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
