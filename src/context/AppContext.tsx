'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  UserProfile,
  AppMode,
  SwipeAction,
  MatchItem,
  ConversationItem,
  MessageItem,
  NotificationItem,
  ReportCategory,
  ReportItem,
  BlockItem,
} from '@/types';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: UserProfile | null;
  mode: AppMode;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  switchMode: (mode: AppMode) => void;
  discoveryProfiles: UserProfile[];
  swipes: Record<string, SwipeAction>;
  matches: MatchItem[];
  conversations: ConversationItem[];
  messages: Record<string, MessageItem[]>;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  likedByUsers: UserProfile[];
  blocks: BlockItem[];
  reports: ReportItem[];
  allProfiles: UserProfile[];
  latestMatchCelebration: MatchItem | null;
  dismissMatchCelebration: () => void;
  
  // Actions
  registerUser: (newUser: UserProfile) => void;
  loginUser: (email: string) => boolean;
  loginAs: (user: UserProfile) => void;
  logout: () => void;
  swipe: (targetUserId: string, action: SwipeAction) => Promise<{ isMatch: boolean; match?: MatchItem }>;
  sendMessage: (conversationId: string, text: string, imageUrl?: string) => void;
  unmatch: (matchId: string) => void;
  blockUser: (targetUserId: string, reason?: string) => void;
  reportUser: (targetUserId: string, category: ReportCategory, details: string) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  markNotificationsRead: () => void;
  adminModerateUser: (userId: string, action: 'suspend' | 'ban' | 'activate' | 'verify') => void;
  adminResolveReport: (reportId: string, resolution: 'action_taken' | 'dismissed') => void;
  resetAllData: () => void;
  refreshDiscovery: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'nmr_current_user_v2',
  ALL_PROFILES: 'nmr_all_profiles_v2',
  SWIPES: 'nmr_swipes_v2',
  MATCHES: 'nmr_matches_v2',
  CONVERSATIONS: 'nmr_conversations_v2',
  MESSAGES: 'nmr_messages_v2',
  NOTIFICATIONS: 'nmr_notifications_v2',
  BLOCKS: 'nmr_blocks_v2',
  REPORTS: 'nmr_reports_v2',
  DARK_MODE: 'nmr_dark_mode_v2',
  MODE: 'nmr_app_mode_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mode, setMode] = useState<AppMode>('CAMPUS_FRIENDS');
  
  // Starts completely clean (0 users)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
  const [swipes, setSwipes] = useState<Record<string, SwipeAction>>({});
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [messages, setMessages] = useState<Record<string, MessageItem[]>>({});
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [latestMatchCelebration, setLatestMatchCelebration] = useState<MatchItem | null>(null);

  // Cycling Discovery Queue (re-circulates profiles in an infinite loop)
  const [discoveryQueue, setDiscoveryQueue] = useState<UserProfile[]>([]);

  // Initialize data on mount from localStorage (v2 clean keys)
  useEffect(() => {
    setIsClient(true);
    try {
      const savedDark = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      if (savedDark !== null) {
        const isDark = savedDark === 'true';
        setIsDarkMode(isDark);
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }

      const savedProfiles = localStorage.getItem(STORAGE_KEYS.ALL_PROFILES);
      if (savedProfiles) {
        const parsedProfiles: UserProfile[] = JSON.parse(savedProfiles);
        setAllProfiles(parsedProfiles);

        const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // verify user still exists in allProfiles
          const active = parsedProfiles.find((p) => p.id === parsedUser.id) || parsedUser;
          setCurrentUser(active);
        }
      }

      const savedSwipes = localStorage.getItem(STORAGE_KEYS.SWIPES);
      if (savedSwipes) setSwipes(JSON.parse(savedSwipes));

      const savedMatches = localStorage.getItem(STORAGE_KEYS.MATCHES);
      if (savedMatches) setMatches(JSON.parse(savedMatches));

      const savedConvos = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (savedConvos) setConversations(JSON.parse(savedConvos));

      const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (savedMessages) setMessages(JSON.parse(savedMessages));

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedBlocks = localStorage.getItem(STORAGE_KEYS.BLOCKS);
      if (savedBlocks) setBlocks(JSON.parse(savedBlocks));

      const savedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (savedReports) setReports(JSON.parse(savedReports));
    } catch (err) {
      console.error('Storage init error:', err);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDarkMode));
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
      localStorage.setItem(STORAGE_KEYS.ALL_PROFILES, JSON.stringify(allProfiles));
      localStorage.setItem(STORAGE_KEYS.SWIPES, JSON.stringify(swipes));
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    } catch (err) {
      console.error('Sync error:', err);
    }
  }, [
    isClient,
    isDarkMode,
    currentUser,
    allProfiles,
    swipes,
    matches,
    conversations,
    messages,
    notifications,
    blocks,
    reports,
  ]);

  // Keep Discovery Queue populated & synced with available candidates (excluding self and blocks)
  useEffect(() => {
    if (!currentUser) {
      setDiscoveryQueue([]);
      return;
    }

    const blockedUserIds = new Set(blocks.map((b) => b.blocked_id));
    const candidates = allProfiles.filter(
      (p) => p.id !== currentUser.id && !blockedUserIds.has(p.id) && !p.is_banned && !p.is_suspended && !p.is_hidden
    );

    if (candidates.length === 0) {
      setDiscoveryQueue([]);
      return;
    }

    // If queue is empty or has mismatched profiles, initialize it
    setDiscoveryQueue((prevQueue) => {
      if (prevQueue.length === 0) {
        return candidates;
      }
      // Keep existing ordering, ensure all valid candidates exist
      const existingIds = new Set(prevQueue.map((p) => p.id));
      const newAdditions = candidates.filter((c) => !existingIds.has(c.id));
      const stillValid = prevQueue.filter((p) => candidates.some((c) => c.id === p.id));
      return [...stillValid, ...newAdditions];
    });
  }, [currentUser, allProfiles, blocks]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  };

  const switchMode = (newMode: AppMode) => {
    setMode(newMode);
    if (currentUser) {
      const updated = { ...currentUser, mode: newMode };
      setCurrentUser(updated);
      setAllProfiles((prev) => prev.map((p) => (p.id === currentUser.id ? updated : p)));
    }
  };

  const registerUser = (newUser: UserProfile) => {
    setAllProfiles((prev) => {
      const exists = prev.some((p) => p.id === newUser.id || (newUser.email && p.email === newUser.email));
      if (exists) {
        return prev.map((p) => (p.id === newUser.id ? newUser : p));
      }
      return [...prev, newUser];
    });
    setCurrentUser(newUser);
    setMode(newUser.mode);
  };

  const loginUser = (email: string): boolean => {
    const found = allProfiles.find(
      (p) => p.email?.toLowerCase().trim() === email.toLowerCase().trim()
    );
    if (found) {
      setCurrentUser(found);
      setMode(found.mode);
      return true;
    }
    return false;
  };

  const loginAs = (user: UserProfile) => {
    setCurrentUser(user);
    setMode(user.mode);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Who liked current user:
  // Find profiles where swipes["${p.id}->${currentUser.id}"] === 'like' | 'superlike'
  // and current user hasn't matched with them yet
  const likedByUsers = currentUser
    ? allProfiles.filter((p) => {
        if (p.id === currentUser.id) return false;
        const key = `${p.id}->${currentUser.id}`;
        const hasLikedMe = swipes[key] === 'like' || swipes[key] === 'superlike';
        if (!hasLikedMe) return false;
        // Check if already matched
        const alreadyMatched = matches.some(
          (m) =>
            (m.user1_id === currentUser.id && m.user2_id === p.id) ||
            (m.user1_id === p.id && m.user2_id === currentUser.id)
        );
        return !alreadyMatched;
      })
    : [];

  // Discovery Profiles = the cycling discovery queue
  const discoveryProfiles = discoveryQueue;

  // Swipe Action with infinite loop and atomic mutual matching
  const swipe = async (targetUserId: string, action: SwipeAction) => {
    if (!currentUser) return { isMatch: false };

    const swipeKey = `${currentUser.id}->${targetUserId}`;
    setSwipes((prev) => ({ ...prev, [swipeKey]: action }));

    const targetUser = allProfiles.find((p) => p.id === targetUserId);
    if (!targetUser) return { isMatch: false };

    // Infinite loop: pop front card, put it at the end of the queue so it recycles forever!
    setDiscoveryQueue((prev) => {
      if (prev.length <= 1) return prev;
      const front = prev[0];
      const rest = prev.slice(1);
      return [...rest, front];
    });

    // Check if other user swiped like/superlike on current user
    const reciprocalKey = `${targetUserId}->${currentUser.id}`;
    const isTargetLikingCurrent =
      swipes[reciprocalKey] === 'like' || swipes[reciprocalKey] === 'superlike';

    if ((action === 'like' || action === 'superlike') && isTargetLikingCurrent) {
      // It's a REAL MATCH!
      const u1 = [currentUser.id, targetUserId].sort()[0];
      const u2 = [currentUser.id, targetUserId].sort()[1];
      const matchId = `match-${u1}-${u2}`;
      const convoId = `convo-${matchId}`;

      // Check if match already exists
      const existingMatch = matches.find((m) => m.id === matchId);
      if (!existingMatch) {
        const newMatch: MatchItem = {
          id: matchId,
          user1_id: u1,
          user2_id: u2,
          matched_at: new Date().toISOString(),
          is_active: true,
          other_user: targetUser,
          last_message: 'แมตช์ใหม่! ทักทายกันได้เลย ✨',
          last_message_at: new Date().toISOString(),
        };

        const newConvo: ConversationItem = {
          id: convoId,
          match_id: matchId,
          other_user: targetUser,
          last_message_text: 'แมตช์ใหม่! ทักทายกันได้เลย ✨',
          last_message_at: new Date().toISOString(),
          unread_count: 0,
        };

        const welcomeMsg: MessageItem = {
          id: `msg-${Date.now()}`,
          conversation_id: convoId,
          sender_id: targetUserId,
          text: `สวัสดีครับ/ค่ะ! ยินดีที่ได้แมตช์กันนะ 🎉`,
          is_read: false,
          created_at: new Date().toISOString(),
        };

        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          user_id: currentUser.id,
          sender_id: targetUserId,
          sender_profile: targetUser,
          type: 'match',
          title: "It's a Match! 🎉",
          body: `คุณและ ${targetUser.display_name} แมตช์กันแล้ว!`,
          link: `/chat?convo=${convoId}`,
          is_read: false,
          created_at: new Date().toISOString(),
        };

        setMatches((prev) => [newMatch, ...prev]);
        setConversations((prev) => [newConvo, ...prev]);
        setMessages((prev) => ({ ...prev, [convoId]: [welcomeMsg] }));
        setNotifications((prev) => [newNotif, ...prev]);
        setLatestMatchCelebration(newMatch);

        // Confetti Celebration!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF416C', '#FF526B', '#FF7A85', '#FFD166'],
          });
        } catch {
          // safe
        }

        return { isMatch: true, match: newMatch };
      }
    }

    return { isMatch: false };
  };

  const dismissMatchCelebration = () => {
    setLatestMatchCelebration(null);
  };

  // Real Chat message saving & history persistence
  const sendMessage = (conversationId: string, text: string, imageUrl?: string) => {
    if (!currentUser || !text.trim()) return;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUser.id,
      text: text.trim(),
      image_url: imageUrl,
      is_read: true,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    // Update conversation last message & timestamp
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              last_message_text: text.trim(),
              last_message_at: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const unmatch = (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
    setConversations((prev) => prev.filter((c) => c.match_id !== matchId));
  };

  const blockUser = (targetUserId: string, reason?: string) => {
    if (!currentUser) return;
    const newBlock: BlockItem = {
      id: `block-${Date.now()}`,
      blocker_id: currentUser.id,
      blocked_id: targetUserId,
      reason: reason || 'Blocked by user',
      created_at: new Date().toISOString(),
    };
    setBlocks((prev) => [...prev, newBlock]);
    setMatches((prev) =>
      prev.filter((m) => m.user1_id !== targetUserId && m.user2_id !== targetUserId)
    );
    setConversations((prev) =>
      prev.filter((c) => c.other_user.id !== targetUserId)
    );
    setDiscoveryQueue((prev) => prev.filter((p) => p.id !== targetUserId));
  };

  const reportUser = (targetUserId: string, category: ReportCategory, details: string) => {
    if (!currentUser) return;
    const target = allProfiles.find((p) => p.id === targetUserId);
    const newReport: ReportItem = {
      id: `report-${Date.now()}`,
      reporter_id: currentUser.id,
      reported_id: targetUserId,
      reporter_name: currentUser.display_name,
      reported_name: target?.display_name || 'Unknown',
      category,
      details,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const newProfile: UserProfile = {
      ...currentUser,
      ...updated,
      updated_at: new Date().toISOString(),
    };
    setCurrentUser(newProfile);
    setAllProfiles((prev) =>
      prev.map((p) => (p.id === currentUser.id ? newProfile : p))
    );
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const adminModerateUser = (
    userId: string,
    action: 'suspend' | 'ban' | 'activate' | 'verify'
  ) => {
    setAllProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== userId) return p;
        if (action === 'suspend') return { ...p, is_suspended: true };
        if (action === 'ban') return { ...p, is_banned: true };
        if (action === 'activate') return { ...p, is_suspended: false, is_banned: false };
        if (action === 'verify') return { ...p, is_verified: true };
        return p;
      })
    );
  };

  const adminResolveReport = (reportId: string, resolution: 'action_taken' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: resolution } : r))
    );
  };

  const resetAllData = () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    setCurrentUser(null);
    setAllProfiles([]);
    setSwipes({});
    setMatches([]);
    setConversations([]);
    setMessages({});
    setNotifications([]);
    setBlocks([]);
    setReports([]);
    setDiscoveryQueue([]);
    window.location.reload();
  };

  const refreshDiscovery = () => {
    if (!currentUser) return;
    const blockedUserIds = new Set(blocks.map((b) => b.blocked_id));
    const candidates = allProfiles.filter(
      (p) => p.id !== currentUser.id && !blockedUserIds.has(p.id)
    );
    setDiscoveryQueue(candidates);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        mode,
        isDarkMode,
        toggleDarkMode,
        switchMode,
        discoveryProfiles,
        swipes,
        matches,
        conversations,
        messages,
        notifications,
        unreadNotificationsCount,
        likedByUsers,
        blocks,
        reports,
        allProfiles,
        latestMatchCelebration,
        dismissMatchCelebration,
        registerUser,
        loginUser,
        loginAs,
        logout,
        swipe,
        sendMessage,
        unmatch,
        blockUser,
        reportUser,
        updateProfile,
        markNotificationsRead,
        adminModerateUser,
        adminResolveReport,
        resetAllData,
        refreshDiscovery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
