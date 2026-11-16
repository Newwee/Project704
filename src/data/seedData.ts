import { Interest, UserProfile } from '@/types';

export const MASTER_INTERESTS: Interest[] = [
  { id: 'int-1', name: 'Coding & Tech', category: 'Technology', icon: '💻' },
  { id: 'int-2', name: 'AI & Robotics', category: 'Technology', icon: '🤖' },
  { id: 'int-3', name: 'Badminton', category: 'Sports', icon: '🏸' },
  { id: 'int-4', name: 'Basketball', category: 'Sports', icon: '🏀' },
  { id: 'int-5', name: 'Running', category: 'Sports', icon: '🏃' },
  { id: 'int-6', name: 'Indie Rock', category: 'Music', icon: '🎸' },
  { id: 'int-7', name: 'T-Pop & K-Pop', category: 'Music', icon: '🎶' },
  { id: 'int-8', name: 'Guitar & Piano', category: 'Music', icon: '🎹' },
  { id: 'int-9', name: 'Film Photography', category: 'Art', icon: '📷' },
  { id: 'int-10', name: 'Digital Art', category: 'Art', icon: '🎨' },
  { id: 'int-11', name: 'Sci-Fi Movies', category: 'Movies', icon: '🚀' },
  { id: 'int-12', name: 'Anime & Manga', category: 'Movies', icon: '🎌' },
  { id: 'int-13', name: 'Board Games', category: 'Gaming', icon: '🎲' },
  { id: 'int-14', name: 'Valorant & LoL', category: 'Gaming', icon: '🎮' },
  { id: 'int-15', name: 'Specialty Coffee', category: 'Food', icon: '☕' },
  { id: 'int-16', name: 'Street Food', category: 'Food', icon: '🍜' },
  { id: 'int-17', name: 'Backpacking & Travel', category: 'Travel', icon: '🎒' },
  { id: 'int-18', name: 'Camping & Nature', category: 'Travel', icon: '🏕️' },
  { id: 'int-19', name: 'Novels & Philosophy', category: 'Reading', icon: '📚' },
  { id: 'int-20', name: 'Astronomy & Physics', category: 'Science', icon: '🔭' },
];

// Simulated profile: John ("จอน" - โปรไฟล์คนสมมุติสำหรับทดสอบระบบ)
export const SIMULATED_USER_JOHN: UserProfile = {
  id: 'user-simulated-john',
  display_name: 'จอน',
  birthdate: '2006-08-15',
  age: 19,
  gender: 'male',
  school_department: 'คนสมมุติ / ทดสอบระบบ',
  bio: 'สวัสดีครับ! ผมชื่อ "จอน" เป็นโปรไฟล์คนสมมุติสำหรับทดสอบระบบจับคู่และแชท (Simulated Profile) ลองปัดไลก์แล้วมาคุยกันได้เลยครับ!',
  mode: 'CAMPUS_FRIENDS',
  is_verified: true,
  is_hidden: false,
  is_suspended: false,
  is_banned: false,
  is_admin: false,
  is_simulated: true,
  is_online: true,
  avatar_url: '/images/john.jpg',
  photos: [
    {
      id: 'john-p1',
      user_id: 'user-simulated-john',
      url: '/images/john.jpg',
      order_index: 0,
      is_primary: true,
    },
    {
      id: 'john-p2',
      user_id: 'user-simulated-john',
      url: '/images/john-2.jpg',
      order_index: 1,
      is_primary: false,
    },
  ],
  interests: [
    { id: 'int-1', name: 'Coding & Tech', category: 'Technology', icon: '💻' },
    { id: 'int-2', name: 'AI & Robotics', category: 'Technology', icon: '🤖' },
    { id: 'int-6', name: 'Indie Rock', category: 'Music', icon: '🎸' },
    { id: 'int-15', name: 'Specialty Coffee', category: 'Food', icon: '☕' },
  ],
  preferences: {
    preferred_gender: 'all',
    min_age: 16,
    max_age: 30,
    campus_filter: 'all',
    notifications_enabled: true,
    discovery_active: true,
  },
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  compatibility_score: 98,
};

// Clean slate: Simulated John profile is available for testing
export const INITIAL_PROFILES: UserProfile[] = [SIMULATED_USER_JOHN];
