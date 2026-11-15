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

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-mina',
    email: 'mina@nmrtup.ac.th',
    display_name: 'Mina (มินา)',
    birthdate: '2008-04-12',
    age: 17,
    gender: 'female',
    bio: 'ม.5 ศิลป์-ภาษาญี่ปุ่น 🇯🇵 ชอบถ่ายรูปฟิล์ม ฟังเพลง T-Pop ไปคาเฟ่หาชาเขียวอร่อย ๆ ยินดีที่ได้รู้จักทุกคนน้า!',
    school_department: 'ศิลป์-ภาษา (Japanese)',
    mode: 'CAMPUS_FRIENDS',
    is_verified: true,
    is_hidden: false,
    is_suspended: false,
    is_banned: false,
    is_admin: false,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    photos: [
      {
        id: 'p-mina-1',
        user_id: 'user-mina',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        order_index: 0,
        is_primary: true,
      },
      {
        id: 'p-mina-2',
        user_id: 'user-mina',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        order_index: 1,
        is_primary: false,
      },
      {
        id: 'p-mina-3',
        user_id: 'user-mina',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        order_index: 2,
        is_primary: false,
      },
    ],
    interests: [
      MASTER_INTERESTS[6], // T-Pop
      MASTER_INTERESTS[8], // Film Photography
      MASTER_INTERESTS[14], // Specialty Coffee
      MASTER_INTERESTS[11], // Anime
    ],
    preferences: {
      preferred_gender: 'all',
      min_age: 16,
      max_age: 19,
      campus_filter: 'all',
      notifications_enabled: true,
      discovery_active: true,
    },
    created_at: '2026-10-01T08:00:00Z',
    updated_at: '2026-10-01T08:00:00Z',
  },
  {
    id: 'user-ken',
    email: 'ken@nmrtup.ac.th',
    display_name: 'Ken (เคน)',
    birthdate: '2007-09-20',
    age: 18,
    gender: 'male',
    bio: 'ม.6 วิทย์-คอมฯ 🤖 ชวนตีแบดหลังเลิกเรียนได้เสมอนะครับ กำลังทำโปรเจกต์หุ่นยนต์ & Hackathon หาบัดดี้แลกเปลี่ยนไอเดีย!',
    school_department: 'วิทย์-คอมพิวเตอร์ (CS)',
    mode: 'CAMPUS_FRIENDS',
    is_verified: true,
    is_hidden: false,
    is_suspended: false,
    is_banned: false,
    is_admin: false,
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    photos: [
      {
        id: 'p-ken-1',
        user_id: 'user-ken',
        url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
        order_index: 0,
        is_primary: true,
      },
      {
        id: 'p-ken-2',
        user_id: 'user-ken',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        order_index: 1,
        is_primary: false,
      },
    ],
    interests: [
      MASTER_INTERESTS[0], // Coding
      MASTER_INTERESTS[1], // AI & Robotics
      MASTER_INTERESTS[2], // Badminton
      MASTER_INTERESTS[13], // Valorant
    ],
    preferences: {
      preferred_gender: 'all',
      min_age: 16,
      max_age: 19,
      campus_filter: 'all',
      notifications_enabled: true,
      discovery_active: true,
    },
    created_at: '2026-10-02T09:30:00Z',
    updated_at: '2026-10-02T09:30:00Z',
  },
  {
    id: 'user-lin',
    email: 'lin@nmrtup.ac.th',
    display_name: 'Linnie (หลิน)',
    birthdate: '2008-01-15',
    age: 17,
    gender: 'female',
    bio: 'ม.5 ห้อง Gifted วิทย์-คณิต 🔭 คลั่งไคล้ดาราศาสตร์และฟิสิกส์ ชอบเล่นบอร์ดเกม ยามว่างฝึกเล่นกีตาร์โปร่ง',
    school_department: 'Gifted Science-Math',
    mode: 'CAMPUS_FRIENDS',
    is_verified: true,
    is_hidden: false,
    is_suspended: false,
    is_banned: false,
    is_admin: false,
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    photos: [
      {
        id: 'p-lin-1',
        user_id: 'user-lin',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        order_index: 0,
        is_primary: true,
      },
      {
        id: 'p-lin-2',
        user_id: 'user-lin',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
        order_index: 1,
        is_primary: false,
      },
    ],
    interests: [
      MASTER_INTERESTS[19], // Astronomy
      MASTER_INTERESTS[12], // Board Games
      MASTER_INTERESTS[7], // Guitar & Piano
      MASTER_INTERESTS[18], // Novels
    ],
    preferences: {
      preferred_gender: 'all',
      min_age: 16,
      max_age: 19,
      campus_filter: 'all',
      notifications_enabled: true,
      discovery_active: true,
    },
    created_at: '2026-10-03T11:00:00Z',
    updated_at: '2026-10-03T11:00:00Z',
  },
  {
    id: 'user-tar',
    email: 'tar@nmrtup.ac.th',
    display_name: 'Tar (ต้าร์)',
    birthdate: '2007-11-05',
    age: 18,
    gender: 'male',
    bio: 'ม.6 ชมรมนักดนตรีสากล กีตาร์ลีดวง Indie Rock 🎸 ใครชอบฟัง Dept, Safeplanet, Television off มาคุยกันนะ!',
    school_department: 'ศิลป์-คำนวณ',
    mode: 'CAMPUS_FRIENDS',
    is_verified: true,
    is_hidden: false,
    is_suspended: false,
    is_banned: false,
    is_admin: false,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    photos: [
      {
        id: 'p-tar-1',
        user_id: 'user-tar',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        order_index: 0,
        is_primary: true,
      },
    ],
    interests: [
      MASTER_INTERESTS[5], // Indie Rock
      MASTER_INTERESTS[7], // Guitar
      MASTER_INTERESTS[15], // Street food
      MASTER_INTERESTS[8], // Film Photo
    ],
    preferences: {
      preferred_gender: 'all',
      min_age: 16,
      max_age: 19,
      campus_filter: 'all',
      notifications_enabled: true,
      discovery_active: true,
    },
    created_at: '2026-10-04T12:00:00Z',
    updated_at: '2026-10-04T12:00:00Z',
  },
  {
    id: 'user-ploy',
    email: 'ploy@nmrtup.ac.th',
    display_name: 'Ploy (พลอยไพลิน)',
    birthdate: '2008-07-22',
    age: 17,
    gender: 'female',
    bio: 'ม.5 ศิลปกรรมและกราฟิก 🎨 ชอบวาดรูป Digital Art และอ่านการ์ตูน หาเพื่อนไปงานอีเวนต์คอสเพลย์/การ์ตูนด้วยกันจ้า ✨',
    school_department: 'ศิลปกรรมศาสตร์ (Art & Design)',
    mode: 'CAMPUS_FRIENDS',
    is_verified: true,
    is_hidden: false,
    is_suspended: false,
    is_banned: false,
    is_admin: false,
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    photos: [
      {
        id: 'p-ploy-1',
        user_id: 'user-ploy',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        order_index: 0,
        is_primary: true,
      },
    ],
    interests: [
      MASTER_INTERESTS[9], // Digital Art
      MASTER_INTERESTS[11], // Anime
      MASTER_INTERESTS[14], // Coffee
      MASTER_INTERESTS[6], // T-Pop
    ],
    preferences: {
      preferred_gender: 'all',
      min_age: 16,
      max_age: 19,
      campus_filter: 'all',
      notifications_enabled: true,
      discovery_active: true,
    },
    created_at: '2026-10-05T14:30:00Z',
    updated_at: '2026-10-05T14:30:00Z',
  },
];

// Current logged in demo student user
export const DEMO_CURRENT_USER: UserProfile = {
  id: 'current-user-phukao',
  email: 'phukao@nmrtup.ac.th',
  display_name: 'Phukao (ภูเขา)',
  birthdate: '2008-02-18',
  age: 17,
  gender: 'male',
  bio: 'ม.5 วิทย์-คอมพิวเตอร์ NMR TUP ชอบเขียนโปรแกรม เล่นบาสเกตบอล และฟังเพลง Indie rock 🚀',
  school_department: 'วิทย์-คอมพิวเตอร์ (CS)',
  mode: 'CAMPUS_FRIENDS',
  is_verified: true,
  is_hidden: false,
  is_suspended: false,
  is_banned: false,
  is_admin: true, // Also granted moderator/admin for testing the moderation dashboard!
  avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  photos: [
    {
      id: 'p-phukao-1',
      user_id: 'current-user-phukao',
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      order_index: 0,
      is_primary: true,
    },
    {
      id: 'p-phukao-2',
      user_id: 'current-user-phukao',
      url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
      order_index: 1,
      is_primary: false,
    },
  ],
  interests: [
    MASTER_INTERESTS[0], // Coding & Tech
    MASTER_INTERESTS[3], // Basketball
    MASTER_INTERESTS[5], // Indie Rock
    MASTER_INTERESTS[14], // Specialty Coffee
  ],
  preferences: {
    preferred_gender: 'all',
    min_age: 16,
    max_age: 19,
    campus_filter: 'all',
    notifications_enabled: true,
    discovery_active: true,
  },
  created_at: '2026-09-01T10:00:00Z',
  updated_at: '2026-09-01T10:00:00Z',
};

// Admin user for safety/moderation test
export const DEMO_ADMIN_USER: UserProfile = {
  id: 'admin-officer-kru',
  email: 'admin.safety@nmrtup.ac.th',
  display_name: 'Kru Wittaya (ครูวิทยา)',
  birthdate: '1995-05-12',
  age: 31,
  gender: 'male',
  bio: 'อาจารย์ฝ่ายดูแลความปลอดภัยและกิจกรรมนักเรียน NMR TUP',
  school_department: 'Student Affairs & Safety Council',
  mode: 'CAMPUS_FRIENDS',
  is_verified: true,
  is_hidden: false,
  is_suspended: false,
  is_banned: false,
  is_admin: true,
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
  photos: [
    {
      id: 'p-admin-1',
      user_id: 'admin-officer-kru',
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
      order_index: 0,
      is_primary: true,
    },
  ],
  interests: [
    MASTER_INTERESTS[0],
    MASTER_INTERESTS[4],
    MASTER_INTERESTS[18],
  ],
  preferences: {
    preferred_gender: 'all',
    min_age: 18,
    max_age: 50,
    campus_filter: 'all',
    notifications_enabled: true,
    discovery_active: true,
  },
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};
