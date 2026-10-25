import { Post, Comment, Vote, Report, ModerationAction, UserProfile, Category, ModerationStatus } from '../types';
import { generateAnonymousUsername, getRandomAvatarColor } from '../utils/anonymous';

const STORAGE_KEYS = {
  POSTS: 'italk_posts_v1',
  COMMENTS: 'italk_comments_v1',
  VOTES: 'italk_votes_v1',
  REPORTS: 'italk_reports_v1',
  MODERATION_ACTIONS: 'italk_moderation_actions_v1',
  CURRENT_USER: 'italk_current_user_v1',
  ALL_PROFILES: 'italk_profiles_v1'
};

// Seed posts representing authentic problems faced by citizens across India
const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    author_id: 'user-quietowl',
    anonymous_username: 'QuietOwl284',
    avatar_color: '#FF4500',
    title: 'Why is garbage collection irregular in our area?',
    description: 'Garbage has not been collected regularly in our neighborhood for several days. It piles up near the crossroad and stray animals are scattering it everywhere. Has anyone found the right department or zonal engineer number to contact in Anantapur Municipal Corporation?',
    category: 'Civic',
    city: 'Anantapur',
    status: 'open',
    moderation_status: 'approved',
    upvotes_count: 24,
    comments_count: 4,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 'post-2',
    author_id: 'user-orangeriver',
    anonymous_username: 'OrangeRiver617',
    avatar_color: '#0284C7',
    title: 'SBI debited ₹4,200 at petrol pump during UPI timeout; neither bank nor bunk resolving',
    description: 'Paid via SBI YONO UPI at an Indian Oil pump on Western Express Highway. The QR transaction showed timeout, but ₹4,200 immediately debited from my account. Petrol pump manager refused to give fuel without second payment. It has been 5 business days and SBI branch says "transaction successful from our end". How do I raise a chargeback or escalate to RBI Ombudsman?',
    category: 'Money',
    city: 'Mumbai',
    status: 'resolved',
    moderation_status: 'approved',
    upvotes_count: 57,
    comments_count: 6,
    created_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'post-3',
    author_id: 'user-helpfultiger',
    anonymous_username: 'HelpfulTiger392',
    avatar_color: '#D97706',
    title: 'IT company in Hitec City demanding ₹2 Lakhs bond compensation for resigning during probation',
    description: 'Joined a mid-scale software firm 3 months ago. The work environment has unapproved 14-hour weekend shifts and toxic verbal abuse. I submitted my resignation with 1 month notice as per appointment letter, but HR is citing a 2-year indemnity bond and threatening to withhold my relieving letter and PF transfer unless I pay ₹2,00,000. Is this legally enforceable in Telangana?',
    category: 'Job',
    city: 'Hyderabad',
    status: 'open',
    moderation_status: 'approved',
    upvotes_count: 83,
    comments_count: 7,
    created_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'post-4',
    author_id: 'user-curiousbanyan',
    anonymous_username: 'CuriousBanyan109',
    avatar_color: '#9333EA',
    title: 'Flipkart delivered cracked 27-inch monitor; replacement rejected stating "No Open Box Delivery opted"',
    description: 'Ordered an LG UltraGear monitor on Big Billion Days. Delivery boy handed over the sealed box without waiting. Upon unboxing in 10 minutes, the internal display panel had spider-web cracks. Raised return request within 1 hour with photos and video. Support closed the ticket saying transit damage must be rejected at doorstep. Need help with Consumer Forum e-Daakhil filing.',
    category: 'Consumer',
    city: 'Delhi-NCR',
    status: 'open',
    moderation_status: 'approved',
    upvotes_count: 42,
    comments_count: 5,
    created_at: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'post-5',
    author_id: 'user-silentganga',
    anonymous_username: 'SilentGanga743',
    avatar_color: '#E11D48',
    title: 'Bengaluru landlord deducting ₹35,000 from ₹80,000 deposit for "complete wall repainting & deep cleaning"',
    description: 'Vacating a 2BHK in Indiranagar after 11 months lease. The flat is in clean condition with normal wear and tear. Landlord sent an itemized deduction: ₹22,000 for repainting entire flat + ₹8,000 for deep cleaning + ₹5,000 for "admin fee". Contract only mentions painting deduction if walls are discolored. He is refusing to refund the balance until I hand over keys.',
    category: 'Personal',
    city: 'Bengaluru',
    status: 'resolved',
    moderation_status: 'approved',
    upvotes_count: 91,
    comments_count: 8,
    created_at: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'post-6',
    author_id: 'user-desihawk',
    anonymous_username: 'DesiHawk512',
    avatar_color: '#0D9488',
    title: 'BBMP contractor dumped road repair bitumen and gravel 3 weeks ago on 17th Main, blocking traffic',
    description: 'Road digging for Cauvery 5th stage pipe was completed a month ago in HSR Layout Sector 2. The tar contractor dumped a massive heap of loose gravel and stones right on the turn, causing three two-wheeler skids already during evening rain. We logged tickets on BBMP Sahaya app but status is marked "In Progress" with zero work.',
    category: 'Civic',
    city: 'Bengaluru',
    status: 'open',
    moderation_status: 'approved',
    upvotes_count: 36,
    comments_count: 3,
    created_at: new Date(Date.now() - 65 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    post_id: 'post-1',
    author_id: 'user-civicworker',
    anonymous_username: 'BravePeacock420',
    avatar_color: '#16A34A',
    content: 'Call the Anantapur Municipal Corporation Sanitary Inspector for your ward directly, or dial the toll-free civic grievances helpline at 1800-425-4440. You can also tag @AnantapurMC on X (Twitter) with photos; they usually clear it within 24 hours.',
    moderation_status: 'approved',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comm-2',
    post_id: 'post-1',
    author_id: 'user-localsup',
    anonymous_username: 'SwiftNeem319',
    avatar_color: '#0284C7',
    content: 'Which cross is this near? If it is near Sapthagiri circle, the tractor driver was on strike for wage settlement. Work resumed this morning in neighboring lanes.',
    moderation_status: 'approved',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'comm-3',
    post_id: 'post-2',
    author_id: 'user-finhelper',
    anonymous_username: 'WiseBanyan312',
    avatar_color: '#16A34A',
    content: 'Do NOT wait for SBI branch. File a formal complaint on the RBI CMS portal (cms.rbi.org.in). Under RBI circular on failed ATM/UPI transactions, if money is not auto-reversed within T+5 days, the customer is entitled to ₹100 per day compensation. Note down your UTR number.',
    moderation_status: 'approved',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comm-4',
    post_id: 'post-2',
    author_id: 'user-orangeriver',
    anonymous_username: 'OrangeRiver617',
    avatar_color: '#0284C7',
    content: 'UPDATE: Filed on RBI CMS with the screenshot of UTR and petrol bunk slip. Money got credited back to my account with ₹200 delayed compensation! Marking this problem resolved.',
    moderation_status: 'approved',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comm-5',
    post_id: 'post-3',
    author_id: 'user-legalguide',
    anonymous_username: 'ResilientOtter114',
    avatar_color: '#4F46E5',
    content: 'Section 27 of the Indian Contract Act declares agreements in restraint of trade void. Indian courts (including Supreme Court in Central Inland Water Transport Corp case) have held that employment bonds without reasonable training expenses incurred by employer cannot be enforced. They cannot hold your PF or experience letter. Send a formal email citing your resignation and mark a copy to Telangana Labor Commissioner.',
    moderation_status: 'approved',
    created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comm-6',
    post_id: 'post-4',
    author_id: 'user-consumerhelper',
    anonymous_username: 'KindSparrow521',
    avatar_color: '#9333EA',
    content: 'Do not panic. Call National Consumer Helpline at 1915 or use consumerhelpline.gov.in app. Also file a grievance on INGRAM portal. E-commerce platforms settle 90% of open-box issues once the NCH docket number is sent to grievance-officer@flipkart.com.',
    moderation_status: 'approved',
    created_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comm-7',
    post_id: 'post-5',
    author_id: 'user-blradvice',
    anonymous_username: 'CalmMonsoon881',
    avatar_color: '#16A34A',
    content: 'Send a formal registered notice citing Karnataka Rent Control Act / Model Tenancy Act. Clearly state that painting can only be deducted if specifically signed and original paint invoices are produced. Tell him you will approach the Small Causes Court and police station for criminal breach of trust. Landlords usually back off when you ask for GST tax receipts for painting.',
    moderation_status: 'approved',
    created_at: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-1',
    reporter_id: 'user-anon99',
    target_type: 'post',
    target_id: 'post-sample-flagged',
    target_preview: 'Part-time data entry job offering ₹40,000 per week, click bit.ly/telegram-scam...',
    reason: 'Fraud or scam',
    details: 'Spam link asking users to join unauthorized telegram group for investment scheme.',
    status: 'action_taken',
    action_taken: 'Post removed and user blocked',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reviewed_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    reviewed_by: 'Admin Moderator'
  }
];

class StorageService {
  private posts: Post[] = [];
  private comments: Comment[] = [];
  private votes: Vote[] = [];
  private reports: Report[] = [];
  private moderationActions: ModerationAction[] = [];
  private currentUser: UserProfile | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (storedPosts) {
        this.posts = JSON.parse(storedPosts);
      } else {
        this.posts = [...INITIAL_POSTS];
        this.savePosts();
      }

      const storedComments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      if (storedComments) {
        this.comments = JSON.parse(storedComments);
      } else {
        this.comments = [...INITIAL_COMMENTS];
        this.saveComments();
      }

      const storedVotes = localStorage.getItem(STORAGE_KEYS.VOTES);
      if (storedVotes) {
        this.votes = JSON.parse(storedVotes);
      } else {
        // Preload some initial votes
        this.votes = [
          { id: 'v1', post_id: 'post-1', user_id: 'seed-user-1', created_at: new Date().toISOString() },
          { id: 'v2', post_id: 'post-2', user_id: 'seed-user-2', created_at: new Date().toISOString() }
        ];
        this.saveVotes();
      }

      const storedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (storedReports) {
        this.reports = JSON.parse(storedReports);
      } else {
        this.reports = [...INITIAL_REPORTS];
        this.saveReports();
      }

      const storedActions = localStorage.getItem(STORAGE_KEYS.MODERATION_ACTIONS);
      if (storedActions) {
        this.moderationActions = JSON.parse(storedActions);
      } else {
        this.moderationActions = [];
      }

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error('Failed to initialize storage:', e);
      this.posts = [...INITIAL_POSTS];
      this.comments = [...INITIAL_COMMENTS];
    }
  }

  private savePosts() {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(this.posts));
  }

  private saveComments() {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(this.comments));
  }

  private saveVotes() {
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(this.votes));
  }

  private saveReports() {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));
  }

  private saveActions() {
    localStorage.setItem(STORAGE_KEYS.MODERATION_ACTIONS, JSON.stringify(this.moderationActions));
  }

  // --- Auth / User Management ---
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  setCurrentUser(user: UserProfile) {
    this.currentUser = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
    if (!this.currentUser) return null;
    this.currentUser = { ...this.currentUser, ...updates };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  clearCurrentUser() {
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  loginWithGoogle(email: string, preferredCity?: string): UserProfile {
    // Generate stable anonymous handle or fetch if user existed
    const id = 'user-' + btoa(email.toLowerCase()).replace(/=/g, '').slice(0, 10);
    const existing = this.currentUser && this.currentUser.id === id ? this.currentUser : null;

    const user: UserProfile = existing || {
      id,
      email,
      anonymous_username: generateAnonymousUsername(),
      avatar_color: getRandomAvatarColor(),
      preferred_city: preferredCity || 'Bengaluru',
      is_admin: email.includes('admin') || email.includes('shaikmohammedabrar'),
      created_at: new Date().toISOString()
    };

    if (preferredCity) {
      user.preferred_city = preferredCity;
    }

    this.setCurrentUser(user);
    return user;
  }

  // --- Posts ---
  getPosts(options: {
    city?: string;
    category?: Category | 'All';
    tab?: 'nearby' | 'trending' | 'latest' | 'my_posts';
    statusFilter?: 'all' | 'open' | 'resolved';
    searchQuery?: string;
    currentUserId?: string;
    includePendingForAuthor?: boolean;
  } = {}): Post[] {
    const { city, category, tab = 'nearby', statusFilter = 'all', searchQuery, currentUserId, includePendingForAuthor } = options;

    return this.posts
      .filter((post) => {
        // Moderation filter: Visitors and general users only see approved posts
        // Authors can see their own pending/needs_review posts
        const isAuthor = currentUserId && post.author_id === currentUserId;
        if (post.moderation_status !== 'approved') {
          if (!includePendingForAuthor || !isAuthor) {
            return false;
          }
        }

        // My Posts tab
        if (tab === 'my_posts') {
          if (!currentUserId || post.author_id !== currentUserId) {
            return false;
          }
        }

        // City filter (if 'All India' or empty, show all)
        if (city && city !== 'All India' && tab === 'nearby') {
          if (post.city.toLowerCase() !== city.toLowerCase()) {
            return false;
          }
        }

        // Category filter
        if (category && category !== 'All') {
          if (post.category !== category) {
            return false;
          }
        }

        // Status filter
        if (statusFilter && statusFilter !== 'all') {
          if (post.status !== statusFilter) {
            return false;
          }
        }

        // Search query
        if (searchQuery && searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = post.title.toLowerCase().includes(q);
          const matchDesc = post.description.toLowerCase().includes(q);
          const matchCity = post.city.toLowerCase().includes(q);
          const matchCat = post.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCity && !matchCat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (tab === 'trending') {
          // Score formula based on upvotes, comments, recency
          const hoursAgoA = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60);
          const hoursAgoB = (Date.now() - new Date(b.created_at).getTime()) / (1000 * 60 * 60);
          const scoreA = (a.upvotes_count * 2 + a.comments_count * 3) / Math.pow(hoursAgoA + 2, 1.2);
          const scoreB = (b.upvotes_count * 2 + b.comments_count * 3) / Math.pow(hoursAgoB + 2, 1.2);
          return scoreB - scoreA;
        }

        // Default or latest: newest first
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }

  getPostById(id: string): Post | null {
    return this.posts.find(p => p.id === id) || null;
  }

  createPost(data: {
    title: string;
    description: string;
    category: Category;
    city: string;
    image_path?: string;
    author: UserProfile;
    moderation_status?: ModerationStatus;
    moderation_reason?: string;
  }): Post {
    const newPost: Post = {
      id: 'post-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      author_id: data.author.id,
      anonymous_username: data.author.anonymous_username,
      avatar_color: data.author.avatar_color,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      city: data.city.trim(),
      image_path: data.image_path,
      status: 'open',
      moderation_status: data.moderation_status || 'approved',
      moderation_reason: data.moderation_reason,
      upvotes_count: 1, // Author starts with 1 upvote
      comments_count: 0,
      created_at: new Date().toISOString()
    };

    this.posts.unshift(newPost);
    this.savePosts();

    // Automatically add author's vote
    this.votes.push({
      id: 'vote-' + Date.now(),
      post_id: newPost.id,
      user_id: data.author.id,
      created_at: new Date().toISOString()
    });
    this.saveVotes();

    return newPost;
  }

  updatePostStatus(postId: string, status: 'open' | 'resolved', userId: string): boolean {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;
    // Ownership check (author or admin)
    if (post.author_id !== userId && !this.currentUser?.is_admin) {
      return false;
    }
    post.status = status;
    post.updated_at = new Date().toISOString();
    this.savePosts();
    return true;
  }

  deletePost(postId: string, userId: string): boolean {
    const index = this.posts.findIndex(p => p.id === postId);
    if (index === -1) return false;
    const post = this.posts[index];
    if (post.author_id !== userId && !this.currentUser?.is_admin) {
      return false;
    }
    this.posts.splice(index, 1);
    this.savePosts();
    return true;
  }

  // --- Comments ---
  getComments(postId: string): Comment[] {
    return this.comments
      .filter(c => c.post_id === postId && c.moderation_status === 'approved')
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  addComment(postId: string, content: string, author: UserProfile): Comment {
    const newComment: Comment = {
      id: 'comm-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      post_id: postId,
      author_id: author.id,
      anonymous_username: author.anonymous_username,
      avatar_color: author.avatar_color,
      content: content.trim(),
      moderation_status: 'approved',
      created_at: new Date().toISOString()
    };

    this.comments.push(newComment);
    this.saveComments();

    // Increment post comments count
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.comments_count += 1;
      this.savePosts();
    }

    return newComment;
  }

  // --- Upvotes ---
  hasUserVoted(postId: string, userId: string): boolean {
    return this.votes.some(v => v.post_id === postId && v.user_id === userId);
  }

  toggleVote(postId: string, userId: string): { voted: boolean; newCount: number } {
    const existingIndex = this.votes.findIndex(v => v.post_id === postId && v.user_id === userId);
    const post = this.posts.find(p => p.id === postId);

    if (existingIndex > -1) {
      // Remove vote
      this.votes.splice(existingIndex, 1);
      this.saveVotes();
      if (post) {
        post.upvotes_count = Math.max(0, post.upvotes_count - 1);
        this.savePosts();
      }
      return { voted: false, newCount: post ? post.upvotes_count : 0 };
    } else {
      // Add vote
      this.votes.push({
        id: 'vote-' + Date.now().toString(36),
        post_id: postId,
        user_id: userId,
        created_at: new Date().toISOString()
      });
      this.saveVotes();
      if (post) {
        post.upvotes_count += 1;
        this.savePosts();
      }
      return { voted: true, newCount: post ? post.upvotes_count : 1 };
    }
  }

  // --- Reports & Moderation ---
  createReport(data: {
    reporter_id: string;
    target_type: 'post' | 'comment';
    target_id: string;
    target_preview: string;
    reason: Report['reason'];
    details?: string;
  }): Report {
    const newReport: Report = {
      id: 'rep-' + Date.now().toString(36),
      reporter_id: data.reporter_id,
      target_type: data.target_type,
      target_id: data.target_id,
      target_preview: data.target_preview,
      reason: data.reason,
      details: data.details?.trim(),
      status: 'pending',
      created_at: new Date().toISOString()
    };

    this.reports.unshift(newReport);
    this.saveReports();
    return newReport;
  }

  getReports(): Report[] {
    return [...this.reports];
  }

  updateReportStatus(
    reportId: string,
    status: Report['status'],
    actionTaken?: string,
    reviewerName: string = 'Admin'
  ): boolean {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return false;

    report.status = status;
    report.action_taken = actionTaken;
    report.reviewed_at = new Date().toISOString();
    report.reviewed_by = reviewerName;
    this.saveReports();

    if (actionTaken) {
      this.moderationActions.unshift({
        id: 'act-' + Date.now(),
        target_type: report.target_type,
        target_id: report.target_id,
        action: status === 'action_taken' ? 'hidden' : 'dismissed',
        reason: actionTaken,
        moderator_name: reviewerName,
        created_at: new Date().toISOString()
      });
      this.saveActions();
    }

    return true;
  }

  adminModeratePost(
    postId: string,
    action: 'approved' | 'hidden' | 'deleted',
    reason: string,
    moderatorName: string = 'Admin'
  ): boolean {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    if (action === 'deleted') {
      const idx = this.posts.findIndex(p => p.id === postId);
      if (idx > -1) this.posts.splice(idx, 1);
    } else if (action === 'hidden') {
      post.moderation_status = 'rejected';
      post.moderation_reason = reason;
    } else if (action === 'approved') {
      post.moderation_status = 'approved';
    }

    this.savePosts();

    this.moderationActions.unshift({
      id: 'act-' + Date.now(),
      target_type: 'post',
      target_id: postId,
      action,
      reason,
      moderator_name: moderatorName,
      created_at: new Date().toISOString()
    });
    this.saveActions();

    return true;
  }

  getModerationActions(): ModerationAction[] {
    return [...this.moderationActions];
  }

  resetToDefaultData() {
    this.posts = [...INITIAL_POSTS];
    this.comments = [...INITIAL_COMMENTS];
    this.votes = [];
    this.reports = [...INITIAL_REPORTS];
    this.moderationActions = [];
    this.savePosts();
    this.saveComments();
    this.saveVotes();
    this.saveReports();
    this.saveActions();
  }
}

export const storage = new StorageService();
