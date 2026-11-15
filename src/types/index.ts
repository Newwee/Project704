export type AppMode = 'CAMPUS_FRIENDS' | 'ADULT_DATING';

export type Gender = 'male' | 'female' | 'non-binary' | 'other';

export type SwipeAction = 'like' | 'pass' | 'superlike';

export type ReportCategory = 
  | 'Fake Profile'
  | 'Harassment'
  | 'Spam'
  | 'Inappropriate Content'
  | 'Impersonation'
  | 'Other';

export interface Interest {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface ProfilePhoto {
  id: string;
  user_id: string;
  url: string;
  order_index: number;
  is_primary: boolean;
}

export interface UserPreferences {
  preferred_gender: 'all' | 'male' | 'female' | 'non-binary';
  min_age: number;
  max_age: number;
  campus_filter: string;
  notifications_enabled: boolean;
  discovery_active: boolean;
}

export interface UserProfile {
  id: string;
  email?: string;
  display_name: string;
  birthdate: string; // YYYY-MM-DD
  age: number;
  gender: Gender;
  bio: string;
  school_department: string;
  mode: AppMode;
  is_verified: boolean;
  is_hidden: boolean;
  is_suspended: boolean;
  is_banned: boolean;
  is_admin: boolean;
  avatar_url: string;
  photos: ProfilePhoto[];
  interests: Interest[];
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
  
  // Computed dynamic client-side fields
  compatibility_score?: number;
  shared_interests_count?: number;
}

export interface MatchItem {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: string;
  is_active: boolean;
  other_user: UserProfile;
  last_message?: string;
  last_message_at?: string;
}

export interface MessageItem {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  image_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationItem {
  id: string;
  match_id: string;
  other_user: UserProfile;
  last_message_text: string;
  last_message_at: string;
  unread_count: number;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  sender_id?: string;
  sender_profile?: UserProfile;
  type: 'like' | 'match' | 'message' | 'system' | 'verification';
  title: string;
  body: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface ReportItem {
  id: string;
  reporter_id: string;
  reported_id: string;
  reporter_name?: string;
  reported_name?: string;
  category: ReportCategory;
  details: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  created_at: string;
}

export interface BlockItem {
  id: string;
  blocker_id: string;
  blocked_id: string;
  reason?: string;
  created_at: string;
}
