import React from 'react';
import { Home, Search, PlusCircle, Bookmark, User, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';

interface MobileBottomNavProps {
  activeTab: 'nearby' | 'trending' | 'latest' | 'my_posts';
  onSelectFeed: () => void;
  onOpenSearch: () => void;
  onOpenShareModal: () => void;
  onSelectMyPosts: () => void;
  onOpenProfile: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectFeed,
  onOpenSearch,
  onOpenShareModal,
  onSelectMyPosts,
  onOpenProfile,
  currentUser,
  onOpenAuth
}) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] px-2 py-1.5 flex items-center justify-around">
      {/* Home / Feed */}
      <button
        onClick={onSelectFeed}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] ${
          activeTab !== 'my_posts' ? 'text-[#FF4500]' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight mt-0.5">Feed</span>
      </button>

      {/* Search trigger */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center p-1.5 min-w-[56px] text-slate-500 hover:text-slate-900"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight mt-0.5">Search</span>
      </button>

      {/* Share Problem (+) */}
      <button
        onClick={onOpenShareModal}
        className="flex flex-col items-center justify-center p-1.5 min-w-[56px] text-[#FF4500] active:scale-95 transition-transform"
        title="Share a Problem"
      >
        <div className="w-9 h-9 rounded-full bg-[#FF4500] text-white flex items-center justify-center shadow-md">
          <span className="text-xl font-bold leading-none mb-0.5">+</span>
        </div>
        <span className="text-[10px] font-bold tracking-tight text-[#FF4500] mt-0.5">Post</span>
      </button>

      {/* My Posts */}
      <button
        onClick={() => {
          if (!currentUser) onOpenAuth();
          else onSelectMyPosts();
        }}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] ${
          activeTab === 'my_posts' ? 'text-[#FF4500]' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Bookmark className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight mt-0.5">My Posts</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => {
          if (!currentUser) onOpenAuth();
          else onOpenProfile();
        }}
        className="flex flex-col items-center justify-center p-1.5 min-w-[56px] text-slate-500 hover:text-slate-900"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight mt-0.5">
          {currentUser ? 'Account' : 'Sign In'}
        </span>
      </button>
    </nav>
  );
};
