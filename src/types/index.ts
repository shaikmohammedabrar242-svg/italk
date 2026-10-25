export type Category = 'Civic' | 'Money' | 'Job' | 'Consumer' | 'Personal';

export type PostStatus = 'open' | 'resolved';

export type ModerationStatus = 'pending' | 'approved' | 'needs_review' | 'rejected';

export type ReportReason =
  | 'Spam'
  | 'Harassment or hate'
  | 'Personal information exposure'
  | 'Fraud or scam'
  | 'Harmful content'
  | 'Other';

export type ReportStatus = 'pending' | 'reviewed' | 'dismissed' | 'action_taken';

export interface UserProfile {
  id: string;
  email: string;
  anonymous_username: string;
  preferred_city?: string;
  avatar_color: string;
  is_admin?: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  anonymous_username: string;
  avatar_color: string;
  title: string;
  description: string;
  category: Category;
  city: string;
  image_path?: string;
  status: PostStatus;
  moderation_status: ModerationStatus;
  moderation_reason?: string;
  upvotes_count: number;
  comments_count: number;
  created_at: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  anonymous_username: string;
  avatar_color: string;
  content: string;
  moderation_status: ModerationStatus;
  created_at: string;
}

export interface Vote {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'post' | 'comment';
  target_id: string;
  target_preview: string;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  action_taken?: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface ModerationAction {
  id: string;
  target_type: 'post' | 'comment' | 'user';
  target_id: string;
  action: 'approved' | 'hidden' | 'deleted' | 'dismissed' | 'warned';
  reason: string;
  moderator_name: string;
  created_at: string;
}
