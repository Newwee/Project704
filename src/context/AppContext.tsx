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
import {
  INITIAL_PROFILES,
  DEMO_CURRENT_USER,
} from '@/data/seedData';
import { filterAndRankDiscovery } from '@/lib/recommendation';
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
  CURRENT_USER: 'nmr_current_user',
  ALL_PROFILES: 'nmr_all_profiles',
  SWIPES: 'nmr_swipes',
  MATCHES: 'nmr_matches',
  CONVERSATIONS: 'nmr_conversations',
  MESSAGES: 'nmr_messages',
  NOTIFICATIONS: 'nmr_notifications',
  BLOCKS: 'nmr_blocks',
  REPORTS: 'nmr_reports',
  DARK_MODE: 'nmr_dark_mode',
  MODE: 'nmr_app_mode',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mode, setMode] = useState<AppMode>('CAMPUS_FRIENDS');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_CURRENT_USER);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [swipes, setSwipes] = useState<Record<string, SwipeAction>>({});
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [messages, setMessages] = useState<Record<string, MessageItem[]>>({});
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [latestMatchCelebration, setLatestMatchCelebration] = useState<MatchItem | null>(null);

  // Initialize data on mount
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

      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedProfiles = localStorage.getItem(STORAGE_KEYS.ALL_PROFILES);
      if (savedProfiles) setAllProfiles(JSON.parse(savedProfiles));

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

      // If no matches yet, initialize an active initial match with Linnie
      if (!savedMatches || JSON.parse(savedMatches).length === 0) {
        const linnie = INITIAL_PROFILES.find((p) => p.id === 'user-lin');
        if (linnie) {
          const initMatchId = 'match-linnie-phukao';
          const initConvoId = 'convo-linnie-phukao';
          const initMatch: MatchItem = {
            id: initMatchId,
            user1_id: DEMO_CURRENT_USER.id,
            user2_id: linnie.id,
            matched_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            is_active: true,
            other_user: linnie,
            last_message: 'สวัสดีจ้าภูเขา บ่ายนี้มีสรุปชีวะไหม?',
            last_message_at: new Date(Date.now() - 3600000).toISOString(),
          };

          const initConvo: ConversationItem = {
            id: initConvoId,
            match_id: initMatchId,
            other_user: linnie,
            last_message_text: 'สวัสดีจ้าภูเขา บ่ายนี้มีสรุปชีวะไหม?',
            last_message_at: new Date(Date.now() - 3600000).toISOString(),
            unread_count: 1,
          };

          const initMsgList: MessageItem[] = [
            {
              id: 'msg-1',
              conversation_id: initConvoId,
              sender_id: linnie.id,
              text: 'ยินดีที่ได้รู้จักนะภูเขา! สนใจบอร์ดเกมเหมือนกันเลย 😊',
              is_read: true,
              created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            },
            {
              id: 'msg-2',
              conversation_id: initConvoId,
              sender_id: DEMO_CURRENT_USER.id,
              text: 'ยินดีที่ได้รู้จักครับหลิน! ปกติเล่นเกมไหนบ่อยสุดเหรอครับ?',
              is_read: true,
              created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
            },
            {
              id: 'msg-3',
              conversation_id: initConvoId,
              sender_id: linnie.id,
              text: 'สวัสดีจ้าภูเขา บ่ายนี้มีสรุปชีวะไหม?',
              is_read: false,
              created_at: new Date(Date.now() - 3600000).toISOString(),
            },
          ];

          const initNotifs: NotificationItem[] = [
            {
              id: 'notif-1',
              user_id: DEMO_CURRENT_USER.id,
              sender_id: linnie.id,
              sender_profile: linnie,
              type: 'match',
              title: "It's a Match! 🎉",
              body: 'คุณและ Linnie แมตช์กันแล้ว เริ่มคุยกันได้เลย',
              link: `/chat?convo=${initConvoId}`,
              is_read: false,
              created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            },
            {
              id: 'notif-2',
              user_id: DEMO_CURRENT_USER.id,
              sender_id: 'user-mina',
              sender_profile: INITIAL_PROFILES.find((p) => p.id === 'user-mina'),
              type: 'like',
              title: 'มีคนกด Like โปรไฟล์คุณ! ✨',
              body: 'Mina กดถูกใจคุณ เข้าไปดูในแท็บ Likes ได้เลย',
              link: '/likes',
              is_read: false,
              created_at: new Date(Date.now() - 1800000).toISOString(),
            },
          ];

          setMatches([initMatch]);
          setConversations([initConvo]);
          setMessages({ [initConvoId]: initMsgList });
          setNotifications(initNotifs);
        }
      }
    } catch (err) {
      console.error('Storage init error:', err);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDarkMode));
      if (currentUser) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
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
    }
  };

  const loginAs = (user: UserProfile) => {
    setCurrentUser(user);
    setMode(user.mode);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Swiped set for fast lookup
  const swipedUserIds = new Set(Object.keys(swipes));
  const blockedUserIds = new Set(blocks.map((b) => b.blocked_id));

  // Compute filtered & ranked discovery profiles
  const discoveryProfiles = currentUser
    ? filterAndRankDiscovery(currentUser, allProfiles, swipedUserIds, blockedUserIds)
    : [];

  // Users who liked the current user (e.g. Mina pre-likes Phukao!)
  const likedByUsers = allProfiles.filter((p) => {
    if (p.id === currentUser?.id) return false;
    if (swipes[p.id]) return false; // already resolved by current user
    if (blockedUserIds.has(p.id)) return false;
    // Mina and Ploy have liked Phukao by default
    return p.id === 'user-mina' || p.id === 'user-ploy';
  });

  // Swipe Action with atomic matching
  const swipe = async (targetUserId: string, action: SwipeAction) => {
    if (!currentUser) return { isMatch: false };

    // Record swipe
    setSwipes((prev) => ({ ...prev, [targetUserId]: action }));

    const targetUser = allProfiles.find((p) => p.id === targetUserId);
    if (!targetUser) return { isMatch: false };

    // Check if targetUser liked currentUser
    // (Mina and Ploy like Phukao)
    const isTargetLikingCurrent =
      targetUserId === 'user-mina' ||
      targetUserId === 'user-ploy' ||
      targetUser.id.startsWith('like-back-');

    if ((action === 'like' || action === 'superlike') && isTargetLikingCurrent) {
      // It's a MATCH!
      const matchId = `match-${currentUser.id}-${targetUserId}-${Date.now()}`;
      const convoId = `convo-${matchId}`;

      const newMatch: MatchItem = {
        id: matchId,
        user1_id: currentUser.id,
        user2_id: targetUserId,
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
        text: `เย้! แมตช์กันแล้วนะ ${currentUser.display_name} ยินดีที่ได้รู้จักครับ/ค่ะ! 🎉`,
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

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF416C', '#FF526B', '#FF7A85', '#FFD166'],
        });
      } catch {
        // gracefully handle SSR / non-canvas
      }

      return { isMatch: true, match: newMatch };
    }

    return { isMatch: false };
  };

  const dismissMatchCelebration = () => {
    setLatestMatchCelebration(null);
  };

  // Real-time Chat: Send message with simulated typing reply
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

    // Update conversation last message
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

    // Realistic reply simulation after 2.5 seconds
    const convo = conversations.find((c) => c.id === conversationId);
    if (convo) {
      setTimeout(() => {
        const replies = [
          'จริงด้วย เห็นด้วยเลย!',
          'ว้าว สุดยอดเลย ไว้มาคุยกันต่อนะ',
          'ยินดีมาก ๆ เลยครับ/ค่ะ 😊',
          'วันนี้เลิกเรียนแล้วทำอะไรต่อเหรอ?',
          'ชอบมากเลย!',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const replyMsg: MessageItem = {
          id: `msg-reply-${Date.now()}`,
          conversation_id: conversationId,
          sender_id: convo.other_user.id,
          text: randomReply,
          is_read: false,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), replyMsg],
        }));

        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  last_message_text: randomReply,
                  last_message_at: new Date().toISOString(),
                  unread_count: c.unread_count + 1,
                }
              : c
          )
        );
      }, 2500);
    }
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
    // Also remove matches and convos
    setMatches((prev) =>
      prev.filter((m) => m.user1_id !== targetUserId && m.user2_id !== targetUserId)
    );
    setConversations((prev) =>
      prev.filter((c) => c.other_user.id !== targetUserId)
    );
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
    localStorage.clear();
    setCurrentUser(DEMO_CURRENT_USER);
    setAllProfiles(INITIAL_PROFILES);
    setSwipes({});
    setMatches([]);
    setConversations([]);
    setMessages({});
    setNotifications([]);
    setBlocks([]);
    setReports([]);
    window.location.reload();
  };

  const refreshDiscovery = () => {
    // Clears pass swipes to re-explore
    setSwipes((prev) => {
      const next: Record<string, SwipeAction> = {};
      Object.entries(prev).forEach(([key, val]) => {
        if (val === 'like' || val === 'superlike') {
          next[key] = val;
        }
      });
      return next;
    });
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
