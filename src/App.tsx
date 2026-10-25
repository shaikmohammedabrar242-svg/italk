import React, { useState, useEffect } from 'react';
import {
  MapPin,
  TrendingUp,
  Clock,
  Bookmark,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Sparkles,
  Layers,
  Building2,
  Wallet,
  Briefcase,
  ShoppingBag,
  HeartHandshake
} from 'lucide-react';

import { Post, Comment, Category, UserProfile, PostStatus } from './types';
import { storage } from './services/storage';
import { CATEGORIES } from './utils/cities';

import { Navbar } from './components/Navbar';
import { ProblemCard } from './components/ProblemCard';
import { ProblemDetailModal } from './components/ProblemDetailModal';
import { CreateProblemModal } from './components/CreateProblemModal';
import { AuthModal } from './components/AuthModal';
import { CitySelectorModal } from './components/CitySelectorModal';
import { ReportModal } from './components/ReportModal';
import { UserSettingsModal } from './components/UserSettingsModal';
import { AdminModerationModal } from './components/AdminModerationModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { RightSidebar } from './components/RightSidebar';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // Current user state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => storage.getCurrentUser());

  // City selection
  const [selectedCity, setSelectedCity] = useState<string>(
    () => storage.getCurrentUser()?.preferred_city || 'Bengaluru'
  );

  // Feed tabs: 'nearby' | 'trending' | 'latest' | 'my_posts'
  const [feedTab, setFeedTab] = useState<'nearby' | 'trending' | 'latest' | 'my_posts'>('nearby');

  // Filters
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Modals
  const [citySelectorOpen, setCitySelectorOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<
    | { type: 'post'; data: Post }
    | { type: 'comment'; data: Comment }
    | null
  >(null);
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // Pending action after login (PRD 6.2 requirement: "Return users to the action they originally attempted")
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Post list
  const [posts, setPosts] = useState<Post[]>([]);

  // Load posts whenever dependencies change
  const loadPosts = () => {
    const list = storage.getPosts({
      city: selectedCity,
      category: activeCategory,
      tab: feedTab,
      statusFilter,
      searchQuery,
      currentUserId: currentUser?.id,
      includePendingForAuthor: true
    });
    setPosts(list);
  };

  useEffect(() => {
    loadPosts();
  }, [selectedCity, activeCategory, feedTab, statusFilter, searchQuery, currentUser]);

  // Check URL query on mount for deep linking (e.g. ?post=post-1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postParam = params.get('post');
    if (postParam) {
      setActivePostId(postParam);
    }
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const requireAuth = (action: () => void) => {
    if (currentUser) {
      action();
    } else {
      setPendingAction(() => action);
      setAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.preferred_city) {
      setSelectedCity(user.preferred_city);
    }
    addToast('success', `Signed in as ${user.anonymous_username}`);

    if (pendingAction) {
      const act = pendingAction;
      setPendingAction(null);
      setTimeout(() => act(), 100);
    }
  };

  const handleLogout = () => {
    storage.clearCurrentUser();
    setCurrentUser(null);
    if (feedTab === 'my_posts') {
      setFeedTab('nearby');
    }
    addToast('info', 'You have been signed out.');
  };

  const handleVote = (postId: string) => {
    requireAuth(() => {
      if (!currentUser) return;
      const { voted, newCount } = storage.toggleVote(postId, currentUser.id);
      loadPosts();
      if (voted) {
        addToast('success', `Upvoted anonymously (${newCount})`);
      } else {
        addToast('info', 'Upvote removed');
      }
    });
  };

  const handleShare = async (post: Post) => {
    const url = `${window.location.origin}?post=${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `iTalk: ${post.title}`,
          text: `Read this problem from ${post.city} and join the anonymous discussion:`,
          url
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      addToast('success', 'Discussion link copied to clipboard!');
    } catch {
      addToast('info', `Share link: ${url}`);
    }
  };

  const handleToggleStatus = (postId: string, currentStatus: 'open' | 'resolved') => {
    requireAuth(() => {
      if (!currentUser) return;
      const nextStatus = currentStatus === 'resolved' ? 'open' : 'resolved';
      storage.updatePostStatus(postId, nextStatus, currentUser.id);
      loadPosts();
      addToast('success', nextStatus === 'resolved' ? 'Problem marked as resolved!' : 'Problem reopened');
    });
  };

  const handleDeletePost = (postId: string) => {
    requireAuth(() => {
      if (!currentUser) return;
      storage.deletePost(postId, currentUser.id);
      loadPosts();
      addToast('info', 'Problem post deleted');
    });
  };

  const handleOpenDetail = (postId: string) => {
    setActivePostId(postId);
    const newUrl = `${window.location.pathname}?post=${postId}`;
    window.history.pushState({ postId }, '', newUrl);
  };

  const handleCloseDetail = () => {
    setActivePostId(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  // Category Icon helper
  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'Civic':
        return <Building2 className="w-4 h-4" />;
      case 'Money':
        return <Wallet className="w-4 h-4" />;
      case 'Job':
        return <Briefcase className="w-4 h-4" />;
      case 'Consumer':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Personal':
        return <HeartHandshake className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#000000] flex flex-col font-sans pb-20 sm:pb-8">
      {/* Top Navbar */}
      <Navbar
        selectedCity={selectedCity}
        onOpenCitySelector={() => setCitySelectorOpen(true)}
        onOpenShareModal={() => requireAuth(() => setCreateModalOpen(true))}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 pt-4 sm:pt-6 flex-1 flex gap-6">
        {/* Feed & Content Column (Primary) */}
        <section className="flex-1 max-w-2xl mx-auto lg:mx-0 w-full space-y-4">
          {/* Mobile Search input when toggled */}
          {isMobileSearchOpen && (
            <div className="md:hidden bg-white p-3 rounded-2xl border border-[#E5E5E5] shadow-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search problems, cities, issues..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF4500]"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Feed Tabs: Nearby, Trending, Latest, My Posts (PRD 7.1) */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-1.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <button
                onClick={() => setFeedTab('nearby')}
                className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  feedTab === 'nearby'
                    ? 'bg-[#FF4500] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Nearby</span>
              </button>

              <button
                onClick={() => setFeedTab('trending')}
                className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  feedTab === 'trending'
                    ? 'bg-[#FF4500] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trending</span>
              </button>

              <button
                onClick={() => setFeedTab('latest')}
                className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  feedTab === 'latest'
                    ? 'bg-[#FF4500] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Latest</span>
              </button>

              <button
                onClick={() => {
                  if (!currentUser) {
                    setPendingAction(() => setFeedTab('my_posts'));
                    setAuthModalOpen(true);
                  } else {
                    setFeedTab('my_posts');
                  }
                }}
                className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  feedTab === 'my_posts'
                    ? 'bg-[#FF4500] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>My Posts</span>
              </button>
            </div>

            {/* Quick Status toggle (All / Open / Resolved) */}
            <div className="hidden sm:flex items-center gap-1 pr-1 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-1 rounded-lg font-semibold ${
                  statusFilter === 'all' ? 'text-slate-900 bg-slate-100' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('open')}
                className={`px-2 py-1 rounded-lg font-semibold ${
                  statusFilter === 'open' ? 'text-[#FF4500] bg-orange-50' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setStatusFilter('resolved')}
                className={`px-2 py-1 rounded-lg font-semibold ${
                  statusFilter === 'resolved' ? 'text-[#21865B] bg-emerald-50' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Category Filter Pills (PRD 7.5: Civic, Money, Job, Consumer, Personal) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-3 py-1.5 rounded-xl border transition-colors shrink-0 ${
                activeCategory === 'All'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-[#E5E5E5] hover:bg-slate-100'
              }`}
            >
              All Categories
            </button>

            {(Object.keys(CATEGORIES) as Category[]).map((catKey) => {
              const meta = CATEGORIES[catKey];
              const isSelected = activeCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setActiveCategory(catKey)}
                  className={`px-3 py-1.5 rounded-xl border transition-colors shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-[#E5E5E5] hover:bg-slate-100'
                  }`}
                >
                  <span style={{ color: isSelected ? '#FFFFFF' : meta.color }}>
                    {getCategoryIcon(catKey)}
                  </span>
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>

          {/* City / Context Kicker */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <div className="flex items-center gap-1.5">
              <span>Showing:</span>
              <span className="font-bold text-slate-800">
                {feedTab === 'my_posts'
                  ? 'Your Submitted Problems'
                  : feedTab === 'nearby'
                  ? `Problems in ${selectedCity}`
                  : feedTab === 'trending'
                  ? 'Trending Across India'
                  : 'Latest Problems in India'}
              </span>
              {activeCategory !== 'All' && (
                <>
                  <span>·</span>
                  <span className="font-semibold text-slate-700">{activeCategory}</span>
                </>
              )}
            </div>

            <span className="tabular-nums font-medium">{posts.length} discussions</span>
          </div>

          {/* Feed List */}
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-10 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">No problems found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                {selectedCity !== 'All India' && feedTab === 'nearby'
                  ? `No problems posted for ${selectedCity} in this category yet. Be the first citizen to voice a challenge!`
                  : 'Try selecting a different category or clearing search filters.'}
              </p>
              <div className="flex items-center justify-center gap-2">
                {selectedCity !== 'All India' && feedTab === 'nearby' && (
                  <button
                    onClick={() => setSelectedCity('All India')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
                  >
                    View All-India Feed
                  </button>
                )}
                <button
                  onClick={() => requireAuth(() => setCreateModalOpen(true))}
                  className="px-4 py-2 bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  + Share a Problem
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => {
                const hasVoted = currentUser ? storage.hasUserVoted(post.id, currentUser.id) : false;
                return (
                  <ProblemCard
                    key={post.id}
                    post={post}
                    hasVoted={hasVoted}
                    onVote={handleVote}
                    onOpenDetail={handleOpenDetail}
                    onShare={handleShare}
                    onReport={(p) => setReportTarget({ type: 'post', data: p })}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Right Sidebar (Desktop only) */}
        <RightSidebar
          onSelectCity={(city) => {
            setSelectedCity(city);
            if (feedTab !== 'nearby') setFeedTab('nearby');
          }}
          selectedCity={selectedCity}
          onOpenCitySelector={() => setCitySelectorOpen(true)}
        />
      </main>

      {/* Mobile Bottom Navigation Bar (Ergonomic Thumb-Zone) */}
      <MobileBottomNav
        activeTab={feedTab}
        onSelectFeed={() => {
          if (feedTab === 'my_posts') setFeedTab('nearby');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
        onOpenShareModal={() => requireAuth(() => setCreateModalOpen(true))}
        onSelectMyPosts={() => setFeedTab('my_posts')}
        onOpenProfile={() => setSettingsModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Modals */}
      <CitySelectorModal
        isOpen={citySelectorOpen}
        onClose={() => setCitySelectorOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
          if (currentUser) {
            storage.updateUserProfile({ preferred_city: city });
          }
        }}
      />

      <CreateProblemModal
        isOpen={createModalOpen}
        currentUser={currentUser}
        onClose={() => setCreateModalOpen(false)}
        onRequestLogin={(action) => {
          setCreateModalOpen(false);
          setPendingAction(() => {
            setCreateModalOpen(true);
            action?.();
          });
          setAuthModalOpen(true);
        }}
        onPostCreated={(newPost) => {
          loadPosts();
          setActivePostId(newPost.id);
          addToast('success', 'Your problem is published anonymously!');
        }}
      />

      <ProblemDetailModal
        postId={activePostId}
        currentUser={currentUser}
        onClose={handleCloseDetail}
        onRequestLogin={(action) => {
          setPendingAction(() => action || (() => {}));
          setAuthModalOpen(true);
        }}
        onVote={handleVote}
        hasVoted={currentUser && activePostId ? storage.hasUserVoted(activePostId, currentUser.id) : false}
        onShare={handleShare}
        onReport={(p) => setReportTarget({ type: 'post', data: p })}
        onReportComment={(c) => setReportTarget({ type: 'comment', data: c })}
        onPostUpdated={loadPosts}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      <ReportModal
        target={reportTarget}
        currentUser={currentUser}
        onClose={() => setReportTarget(null)}
        onRequestLogin={() => {
          setReportTarget(null);
          setAuthModalOpen(true);
        }}
        onReportSubmitted={() => {
          addToast('info', 'Report submitted to moderators.');
        }}
      />

      <UserSettingsModal
        isOpen={settingsModalOpen}
        currentUser={currentUser}
        onClose={() => setSettingsModalOpen(false)}
        onLogout={handleLogout}
        onProfileUpdated={(updated) => {
          setCurrentUser(updated);
          if (updated.preferred_city) setSelectedCity(updated.preferred_city);
        }}
        onResetData={() => {
          storage.resetToDefaultData();
          loadPosts();
          addToast('info', 'Reset discussions to default Indian community problems.');
        }}
      />

      <AdminModerationModal
        isOpen={adminModalOpen}
        currentUser={currentUser}
        onClose={() => setAdminModalOpen(false)}
        onPostActionTaken={() => {
          loadPosts();
          addToast('success', 'Moderation action logged.');
        }}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
