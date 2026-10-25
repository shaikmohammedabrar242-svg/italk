import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Ban, Eye, Trash2, Clock, Check } from 'lucide-react';
import { Report, ModerationAction, UserProfile } from '../types';
import { storage } from '../services/storage';
import { formatRelativeTime } from '../utils/time';

interface AdminModerationModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onPostActionTaken: () => void;
}

export const AdminModerationModal: React.FC<AdminModerationModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onPostActionTaken
}) => {
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [reports, setReports] = useState<Report[]>(storage.getReports());
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionReason, setActionReason] = useState('');

  if (!isOpen) return null;

  const refreshReports = () => {
    setReports(storage.getReports());
  };

  const filteredReports = reports.filter((r) => (filter === 'pending' ? r.status === 'pending' : true));

  const handleDismiss = (report: Report) => {
    storage.updateReportStatus(report.id, 'dismissed', 'Content verified as legitimate discussion', currentUser?.anonymous_username || 'Admin');
    refreshReports();
    setSelectedReport(null);
    onPostActionTaken();
  };

  const handleHideContent = (report: Report) => {
    if (report.target_type === 'post') {
      storage.adminModeratePost(report.target_id, 'hidden', actionReason || report.reason, currentUser?.anonymous_username || 'Admin');
    }
    storage.updateReportStatus(report.id, 'action_taken', `Content hidden: ${actionReason || report.reason}`, currentUser?.anonymous_username || 'Admin');
    refreshReports();
    setSelectedReport(null);
    setActionReason('');
    onPostActionTaken();
  };

  const handleDeleteContent = (report: Report) => {
    if (report.target_type === 'post') {
      storage.adminModeratePost(report.target_id, 'deleted', actionReason || report.reason, currentUser?.anonymous_username || 'Admin');
    }
    storage.updateReportStatus(report.id, 'action_taken', `Permanently deleted: ${actionReason || report.reason}`, currentUser?.anonymous_username || 'Admin');
    refreshReports();
    setSelectedReport(null);
    setActionReason('');
    onPostActionTaken();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#FF4500]" />
            <div>
              <h2 className="font-bold text-base leading-tight">Admin Moderation Console</h2>
              <p className="text-[11px] text-slate-300">Review reported posts & protect anonymous discourse</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Reports ({reports.filter((r) => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Reports ({reports.length})
            </button>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Logged in as Administrator</span>
        </div>

        {/* Reports Content */}
        <div className="overflow-y-auto p-5 divide-y divide-slate-100 flex-1 space-y-4">
          {filteredReports.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">Moderation Queue is Clean</p>
              <p className="text-xs text-slate-400 mt-1">No pending reports require moderation attention right now.</p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const isSelected = selectedReport?.id === report.id;
              return (
                <div key={report.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-red-100 text-[#C62828]">
                          {report.reason}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 font-medium capitalize">{report.target_type}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{formatRelativeTime(report.created_at)}</span>
                      </div>

                      <div className="text-sm font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        {report.target_preview}
                      </div>

                      {report.details && (
                        <p className="text-xs text-slate-600 mt-1.5 italic">
                          Reporter note: "{report.details}"
                        </p>
                      )}

                      {report.status !== 'pending' && (
                        <div className="mt-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                          Resolved: {report.action_taken || report.status} by {report.reviewed_by}
                        </div>
                      )}
                    </div>

                    {report.status === 'pending' && (
                      <button
                        onClick={() => setSelectedReport(isSelected ? null : report)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                      >
                        {isSelected ? 'Cancel' : 'Take Action'}
                      </button>
                    )}
                  </div>

                  {/* Action panel */}
                  {isSelected && (
                    <div className="p-3 bg-slate-100 rounded-xl space-y-3 mt-2 border border-slate-300">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Moderation Reason / Action Log:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Confirmed phone number leak / Prohibited promotional spam"
                          value={actionReason}
                          onChange={(e) => setActionReason(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF4500]"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <button
                          onClick={() => handleHideContent(report)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Hide Content
                        </button>

                        <button
                          onClick={() => handleDeleteContent(report)}
                          className="px-3 py-1.5 bg-[#C62828] hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Content
                        </button>

                        <button
                          onClick={() => handleDismiss(report)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Dismiss Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
