-- ====================================================================
-- Tinder NMR TUP - Database Architecture & Schema
-- Complete Postgres / Supabase Migration
-- ====================================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  birthdate date not null,
  gender text not null check (gender in ('male', 'female', 'non-binary', 'other')),
  bio text default '',
  school_department text default 'NMR TUP',
  mode text not null default 'CAMPUS_FRIENDS' check (mode in ('CAMPUS_FRIENDS', 'ADULT_DATING')),
  is_verified boolean default false,
  is_hidden boolean default false,
  is_suspended boolean default false,
  is_banned boolean default false,
  is_admin boolean default false,
  avatar_url text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for discovery queries
create index if not exists idx_profiles_discovery 
  on public.profiles(mode, is_hidden, is_suspended, is_banned);

-- 2. PROFILE PHOTOS TABLE
create table if not exists public.profile_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  url text not null,
  order_index int default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_profile_photos_user_id 
  on public.profile_photos(user_id, order_index);

-- 3. INTERESTS MASTER TABLE
create table if not exists public.interests (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  category text not null,
  icon text default ''
);

create index if not exists idx_interests_category 
  on public.interests(category);

-- 4. USER INTERESTS JUNCTION TABLE
create table if not exists public.user_interests (
  user_id uuid not null references public.profiles(id) on delete cascade,
  interest_id uuid not null references public.interests(id) on delete cascade,
  primary key (user_id, interest_id)
);

create index if not exists idx_user_interests_user 
  on public.user_interests(user_id);
create index if not exists idx_user_interests_interest 
  on public.user_interests(interest_id);

-- 5. USER PREFERENCES TABLE
create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  preferred_gender text default 'all',
  min_age int default 16,
  max_age int default 30,
  campus_filter text default 'all',
  notifications_enabled boolean default true,
  discovery_active boolean default true,
  updated_at timestamptz default now()
);

-- 6. SWIPES TABLE
create table if not exists public.swipes (
  id uuid primary key default gen_random_uuid(),
  swiper_id uuid not null references public.profiles(id) on delete cascade,
  swiped_id uuid not null references public.profiles(id) on delete cascade,
  action text not null check (action in ('like', 'pass', 'superlike')),
  created_at timestamptz default now(),
  constraint swipes_unique_pair unique (swiper_id, swiped_id)
);

create index if not exists idx_swipes_swiper 
  on public.swipes(swiper_id, action);
create index if not exists idx_swipes_swiped 
  on public.swipes(swiped_id, action);

-- 7. MATCHES TABLE
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid not null references public.profiles(id) on delete cascade,
  user2_id uuid not null references public.profiles(id) on delete cascade,
  matched_at timestamptz default now(),
  is_active boolean default true,
  unmatched_by uuid references public.profiles(id) on delete set null,
  unmatched_at timestamptz,
  constraint matches_ordered_users check (user1_id < user2_id),
  constraint matches_unique_pair unique (user1_id, user2_id)
);

create index if not exists idx_matches_user1 on public.matches(user1_id, is_active);
create index if not exists idx_matches_user2 on public.matches(user2_id, is_active);

-- 8. CONVERSATIONS TABLE
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  match_id uuid unique not null references public.matches(id) on delete cascade,
  last_message_text text default '',
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_conversations_match on public.conversations(match_id);

-- 9. MESSAGES TABLE
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  image_url text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_messages_convo_created 
  on public.messages(conversation_id, created_at asc);

-- 10. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  type text not null check (type in ('like', 'match', 'message', 'system', 'verification')),
  title text not null,
  body text not null,
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_notifications_user_read 
  on public.notifications(user_id, is_read, created_at desc);

-- 11. BLOCKS TABLE
create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  reason text default '',
  created_at timestamptz default now(),
  constraint blocks_unique_pair unique (blocker_id, blocked_id)
);

create index if not exists idx_blocks_blocker on public.blocks(blocker_id);
create index if not exists idx_blocks_blocked on public.blocks(blocked_id);

-- 12. REPORTS TABLE
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('Fake Profile', 'Harassment', 'Spam', 'Inappropriate Content', 'Impersonation', 'Other')),
  details text default '',
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'action_taken', 'dismissed')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_reports_status on public.reports(status, created_at desc);

-- 13. VERIFICATIONS TABLE
create table if not exists public.verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  photo_url text not null,
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_verifications_status on public.verifications(status);

-- 14. ADMIN ROLES TABLE
create table if not exists public.admin_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null default 'moderator' check (role in ('admin', 'moderator', 'superadmin')),
  assigned_at timestamptz default now()
);

-- 15. AUDIT LOGS TABLE
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  target_type text not null,
  target_id uuid,
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_audit_logs_admin_created 
  on public.audit_logs(admin_id, created_at desc);

-- ====================================================================
-- ATOMIC SWIPE & MATCH RPC FUNCTION
-- ====================================================================
create or replace function public.record_swipe_and_match(
  p_swiper_id uuid,
  p_swiped_id uuid,
  p_action text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_rec reciprocal_record%rowtype;
  v_u1 uuid;
  v_u2 uuid;
  v_match_id uuid;
  v_conversation_id uuid;
  v_is_reciprocal boolean := false;
  v_swiper_name text;
begin
  -- Validate not swiping self
  if p_swiper_id = p_swiped_id then
    return jsonb_build_object('success', false, 'error', 'Cannot swipe self');
  end if;

  -- Ensure not blocked
  if exists (
    select 1 from public.blocks 
    where (blocker_id = p_swiper_id and blocked_id = p_swiped_id)
       or (blocker_id = p_swiped_id and blocked_id = p_swiper_id)
  ) then
    return jsonb_build_object('success', false, 'error', 'Action blocked by security policy');
  end if;

  -- Insert or update swipe
  insert into public.swipes (swiper_id, swiped_id, action)
  values (p_swiper_id, p_swiped_id, p_action)
  on conflict (swiper_id, swiped_id) 
  do update set action = excluded.action, created_at = now();

  -- If action is pass, return immediately
  if p_action = 'pass' then
    return jsonb_build_object('success', true, 'action', 'pass', 'is_match', false);
  end if;

  -- Check if other user swiped with like or superlike
  select true into v_is_reciprocal
  from public.swipes
  where swiper_id = p_swiped_id 
    and swiped_id = p_swiper_id 
    and action in ('like', 'superlike');

  if v_is_reciprocal is true then
    -- Order IDs consistently for unique constraint
    v_u1 := least(p_swiper_id, p_swiped_id);
    v_u2 := greatest(p_swiper_id, p_swiped_id);

    -- Insert match record
    insert into public.matches (user1_id, user2_id, is_active)
    values (v_u1, v_u2, true)
    on conflict (user1_id, user2_id) 
    do update set is_active = true, unmatched_by = null, unmatched_at = null
    returning id into v_match_id;

    -- Create conversation record if not exists
    insert into public.conversations (match_id)
    values (v_match_id)
    on conflict (match_id) do nothing
    returning id into v_conversation_id;

    if v_conversation_id is null then
      select id into v_conversation_id from public.conversations where match_id = v_match_id;
    end if;

    -- Fetch swiper display name for notifications
    select display_name into v_swiper_name from public.profiles where id = p_swiper_id;

    -- Push in-app notifications
    insert into public.notifications (user_id, sender_id, type, title, body, link)
    values 
      (p_swiped_id, p_swiper_id, 'match', 'It''s a Match! 🎉', 'You and ' || coalesce(v_swiper_name, 'someone') || ' liked each other!', '/chat?match=' || v_match_id),
      (p_swiper_id, p_swiped_id, 'match', 'It''s a Match! 🎉', 'You have a new match!', '/chat?match=' || v_match_id);

    return jsonb_build_object(
      'success', true,
      'action', p_action,
      'is_match', true,
      'match_id', v_match_id,
      'conversation_id', v_conversation_id
    );
  end if;

  -- Single like notification for receiver
  select display_name into v_swiper_name from public.profiles where id = p_swiper_id;
  insert into public.notifications (user_id, sender_id, type, title, body, link)
  values (p_swiped_id, p_swiper_id, 'like', 'Someone liked your profile! ✨', 'Check your Likes to see who connects with you.', '/likes');

  return jsonb_build_object(
    'success', true,
    'action', p_action,
    'is_match', false
  );
end;
$$;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
alter table public.profiles enable row level security;
alter table public.profile_photos enable row level security;
alter table public.interests enable row level security;
alter table public.user_interests enable row level security;
alter table public.user_preferences enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;
alter table public.verifications enable row level security;
alter table public.admin_roles enable row level security;
alter table public.audit_logs enable row level security;

-- Read profiles: public for active non-blocked users
create policy "Profiles visible to authenticated users"
  on public.profiles for select
  to authenticated
  using (
    not is_banned
    and (
      id = (select auth.uid())
      or not is_hidden
    )
  );

-- Update profile: owner only
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()));

-- Insert profile: owner only
create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (id = (select auth.uid()));

-- Swipes: swiper can create & read own swipes
create policy "Users can insert own swipe"
  on public.swipes for insert
  to authenticated
  with check (swiper_id = (select auth.uid()));

create policy "Users can view own swipes"
  on public.swipes for select
  to authenticated
  using (swiper_id = (select auth.uid()));

-- Matches: users can see matches they are part of
create policy "Users can view own matches"
  on public.matches for select
  to authenticated
  using ((user1_id = (select auth.uid()) or user2_id = (select auth.uid())) and is_active = true);

-- Messages: users can view messages of their conversations
create policy "Users can view conversation messages"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.conversations c
      join public.matches m on m.id = c.match_id
      where c.id = messages.conversation_id
        and (m.user1_id = (select auth.uid()) or m.user2_id = (select auth.uid()))
        and m.is_active = true
    )
  );

-- Messages: users can insert messages into their active conversations
create policy "Users can send messages"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = (select auth.uid())
    and exists (
      select 1 from public.conversations c
      join public.matches m on m.id = c.match_id
      where c.id = conversation_id
        and (m.user1_id = (select auth.uid()) or m.user2_id = (select auth.uid()))
        and m.is_active = true
    )
  );

-- Notifications: owner only
create policy "Users can view own notifications"
  on public.notifications for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can update own notifications"
  on public.notifications for update
  to authenticated
  using (user_id = (select auth.uid()));

-- Admin roles: viewable by admins only
create policy "Admins can view admin roles"
  on public.admin_roles for select
  to authenticated
  using (exists (select 1 from public.admin_roles where user_id = (select auth.uid()) and role in ('admin', 'superadmin')));
