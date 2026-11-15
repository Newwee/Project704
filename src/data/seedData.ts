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

// Clean slate: 0 mock profiles as requested by user
export const INITIAL_PROFILES: UserProfile[] = [];
