import React from 'react';
import { MapPin, Search, Plus, User, ShieldAlert, LogIn, ChevronDown } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  selectedCity: string;
  onOpenCitySelector: () => void;
  onOpenShareModal: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  onOpenCitySelector,
  onOpenShareModal,
  currentUser,
  onOpenAuth,
  onOpenSettings,
  onOpenAdmin,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] px-4 sm:px-6 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Brand Wordmark & City Selector */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xl sm:text-2xl font-black text-[#000000] tracking-tight group"
          >
            <span>i</span>
            <span className="text-[#FF4500]">Talk</span>
          </a>

          {/* City Selector Pill */}
          <button
            onClick={onOpenCitySelector}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F6F6F6] hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
            title="Change City"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF4500]" />
            <span className="max-w-[100px] sm:max-w-[140px] truncate">{selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Center: Search Bar (Desktop / Tablet) */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search problems, cities, departments, issues..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F6F6F6] hover:bg-slate-100 focus:bg-white border border-[#E5E5E5] focus:border-[#FF4500] rounded-xl focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: Primary CTA (+ Share a Problem) & Account / Auth */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Prominent Primary CTA */}
          <button
            onClick={onOpenShareModal}
            className="px-3.5 sm:px-4 py-2 bg-[#FF4500] hover:bg-[#e03d00] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Share a Problem</span>
          </button>

          {/* Admin link */}
          {currentUser?.is_admin && (
            <button
              onClick={onOpenAdmin}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex items-center gap-1 text-xs font-semibold"
              title="Admin Moderation"
            >
              <ShieldAlert className="w-4 h-4 text-[#FF4500]" />
              <span className="hidden lg:inline">Moderation</span>
            </button>
          )}

          {/* User Profile / Login Button */}
          {currentUser ? (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 bg-[#F6F6F6] hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
              title={`Account: ${currentUser.anonymous_username}`}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: currentUser.avatar_color }}
              >
                {currentUser.anonymous_username.slice(0, 1)}
              </div>
              <span className="text-xs font-semibold text-slate-800 hidden sm:inline max-w-[120px] truncate">
                {currentUser.anonymous_username}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 text-xs font-bold text-slate-800 hover:text-[#FF4500] hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
