-- ====================================================================
-- Tinder NMR TUP - Master Interests & Initial Seed Data
-- ====================================================================

-- 1. INSERT DEFAULT CATEGORIZED INTERESTS
insert into public.interests (name, category, icon) values
  ('Coding', 'Technology', '💻'),
  ('AI & Robotics', 'Technology', '🤖'),
  ('Cybersecurity', 'Technology', '🛡️'),
  ('Indie Rock', 'Music', '🎸'),
  ('K-Pop', 'Music', '🎤'),
  ('Classical Music', 'Music', '🎻'),
  ('T-Pop', 'Music', '🎶'),
  ('Sci-Fi Movies', 'Movies', '🚀'),
  ('Anime & Manga', 'Movies', '🎌'),
  ('Cinema Classics', 'Movies', '🎬'),
  ('Valorant', 'Gaming', '🎮'),
  ('Board Games', 'Gaming', '🎲'),
  ('League of Legends', 'Gaming', '⚔️'),
  ('Badminton', 'Sports', '🏸'),
  ('Basketball', 'Sports', '🏀'),
  ('Running & Marathons', 'Sports', '🏃'),
  ('Swimming', 'Sports', '🏊'),
  ('Digital Art', 'Art', '🎨'),
  ('Graphic Design', 'Art', '🖌️'),
  ('Film Photography', 'Art', '📷'),
  ('Street Food', 'Food', '🍜'),
  ('Specialty Coffee', 'Food', '☕'),
  ('Baking & Pastry', 'Food', '🥐'),
  ('Backpacking', 'Travel', '🎒'),
  ('Camping & Nature', 'Travel', '🏕️'),
  ('Psychology & Philosophy', 'Reading', '📚'),
  ('Novels & Literature', 'Reading', '📖'),
  ('Astronomy', 'Science', '🔭'),
  ('Physics & Math', 'Science', '📐'),
  ('Biology & Med', 'Science', '🧬')
on conflict (name) do nothing;
