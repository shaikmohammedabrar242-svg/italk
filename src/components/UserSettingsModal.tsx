import React, { useState } from 'react';
import { X, User, MapPin, Shield, LogOut, Check, Trash2, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';
import { INDIAN_CITIES } from '../utils/cities';
import { storage } from '../services/storage';

interface UserSettingsModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onLogout: () => void;
  onProfileUpdated: (updated: UserProfile) => void;
  onResetData: () => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onLogout,
  onProfileUpdated,
  onResetData
}) => {
  const [preferredCity, setPreferredCity] = useState(currentUser?.preferred_city || 'Bengaluru');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.updateUserProfile({ preferred_city: preferredCity });
    if (updated) {
      onProfileUpdated(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <User className="w-4 h-4 text-[#FF4500]" />
            <span>Account & Privacy Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Public Anonymous Identity card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500 font-medium mb-1">Public Anonymous Identity</div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-xs"
                style={{ backgroundColor: currentUser.avatar_color }}
              >
                {currentUser.anonymous_username.slice(0, 1)}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>{currentUser.anonymous_username}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                    Public
                  </span>
                </div>
                <div className="text-xs text-slate-500">Auto-generated · Never reveals your identity</div>
              </div>
            </div>
          </div>

          {/* Private Account Info */}
          <div className="text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Private Account Info</div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Google Email:</span>
              <span className="font-medium text-slate-800">{currentUser.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Visibility:</span>
              <span className="text-[#21865B] font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" /> Fully Hidden from Public
              </span>
            </div>
          </div>

          {/* Change Preferred City */}
          <form onSubmit={handleSave} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Preferred City
            </label>
            <div className="flex gap-2">
              <select
                value={preferredCity}
                onChange={(e) => setPreferredCity(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-[#FF4500]"
              >
                {INDIAN_CITIES.filter((c) => c !== 'All India').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : 'Save'}
              </button>
            </div>
            {savedSuccess && <p className="text-xs text-emerald-600 font-medium">Preferred city updated!</p>}
          </form>

          {/* Privacy Principles */}
          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-[11px] text-amber-900 leading-relaxed">
            <strong>iTalk Privacy Guarantee:</strong> We do not track GPS coordinates, sell user profiles, or display
            real names. Your problems and comments can be marked resolved or removed anytime.
          </div>

          {/* Actions: Sign out & Reset */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>

            <button
              onClick={() => {
                if (confirm('Reset demo data to initial Indian community problems?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-xs text-slate-400 hover:text-slate-600 py-1 transition-colors flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Demo Discussions to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
