'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  registerUser: (newUser: UserProfile) => Promise<void>;
  loginUser: (email: string) => boolean;
  loginAs: (user: UserProfile) => void;
  logout: () => void;
  swipe: (targetUserId: string, action: SwipeAction) => Promise<{ isMatch: boolean; match?: MatchItem }>;
  sendMessage: (conversationId: string, text: string, imageUrl?: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
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
  
  // State
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

  // Ref to prevent stale closures in polling
  const currentUserRef = useRef<UserProfile | null>(null);
  currentUserRef.current = currentUser;

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

      // 1. Load Current User first and independently (prevents wiping user on refresh!)
      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) {
        try {
          const parsedUser: UserProfile = JSON.parse(savedUser);
          if (parsedUser && parsedUser.id) {
            setCurrentUser(parsedUser);
            setMode(parsedUser.mode || 'CAMPUS_FRIENDS');
          }
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }

      // 2. Load Profiles
      const savedProfiles = localStorage.getItem(STORAGE_KEYS.ALL_PROFILES);
      if (savedProfiles) {
        try {
          const parsedProfiles: UserProfile[] = JSON.parse(savedProfiles);
          if (Array.isArray(parsedProfiles)) {
            setAllProfiles(parsedProfiles);
          }
        } catch (e) {
          console.error('Error parsing stored profiles:', e);
        }
      }

      const savedSwipes = localStorage.getItem(STORAGE_KEYS.SWIPES);
      if (savedSwipes) {
        try { setSwipes(JSON.parse(savedSwipes)); } catch {}
      }

      const savedMatches = localStorage.getItem(STORAGE_KEYS.MATCHES);
      if (savedMatches) {
        try { setMatches(JSON.parse(savedMatches)); } catch {}
      }

      const savedConvos = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (savedConvos) {
        try { setConversations(JSON.parse(savedConvos)); } catch {}
      }

      const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (savedMessages) {
        try { setMessages(JSON.parse(savedMessages)); } catch {}
      }

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifs) {
        try { setNotifications(JSON.parse(savedNotifs)); } catch {}
      }

      const savedBlocks = localStorage.getItem(STORAGE_KEYS.BLOCKS);
      if (savedBlocks) {
        try { setBlocks(JSON.parse(savedBlocks)); } catch {}
      }

      const savedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (savedReports) {
        try { setReports(JSON.parse(savedReports)); } catch {}
      }
    } catch (err) {
      console.error('Storage init error:', err);
    }
  }, []);

  // Sync state to localStorage safely
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
      console.warn('Sync to localStorage warning:', err);
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

  // Sync with central Server Database (ensures friends and all devices see each other and chat works!)
  const syncWithServer = useCallback(async () => {
    try {
      // 1. Fetch all registered users
      const usersRes = await fetch('/api/users');
      if (usersRes.ok) {
        const { users } = await usersRes.json();
        if (Array.isArray(users)) {
          setAllProfiles((prev) => {
            const map = new Map<string, UserProfile>();
            prev.forEach((u) => map.set(u.id, u));
            users.forEach((u: UserProfile) => map.set(u.id, u));
            return Array.from(map.values());
          });

          // Sync current logged in user from server if present
          const activeMe = currentUserRef.current;
          if (activeMe?.id) {
            const serverUser = users.find((u: UserProfile) => u.id === activeMe.id);
            if (serverUser) {
              setCurrentUser((prev) => (prev ? { ...prev, ...serverUser } : serverUser));
            }
          }
        }
      }

      // 2. If logged in, sync matches, conversations & messages
      const activeMe = currentUserRef.current;
      if (activeMe?.id) {
        const [matchesRes, convosRes] = await Promise.all([
          fetch(`/api/matches?userId=${activeMe.id}`),
          fetch(`/api/conversations?userId=${activeMe.id}`),
        ]);

        if (matchesRes.ok) {
          const { matches: serverMatches } = await matchesRes.json();
          if (Array.isArray(serverMatches) && serverMatches.length > 0) {
            setMatches((prev) => {
              const map = new Map<string, MatchItem>();
              prev.forEach((m) => map.set(m.id, m));
              serverMatches.forEach((m: MatchItem) => map.set(m.id, m));
              return Array.from(map.values());
            });
          }
        }

        if (convosRes.ok) {
          const { conversations: serverConvos } = await convosRes.json();
          if (Array.isArray(serverConvos) && serverConvos.length > 0) {
            setConversations((prev) => {
              const map = new Map<string, ConversationItem>();
              prev.forEach((c) => map.set(c.id, c));
              serverConvos.forEach((c: ConversationItem) => map.set(c.id, c));
              return Array.from(map.values());
            });

            // Fetch messages for all active conversations in real-time
            serverConvos.forEach(async (c: ConversationItem) => {
              try {
                const msgRes = await fetch(`/api/messages?conversationId=${c.id}`);
                if (msgRes.ok) {
                  const { messages: serverMsgs } = await msgRes.json();
                  if (Array.isArray(serverMsgs)) {
                    setMessages((prev) => ({
                      ...prev,
                      [c.id]: serverMsgs,
                    }));
                  }
                }
              } catch {
                // non-blocking
              }
            });
          }
        }
      }
    } catch (err) {
      console.warn('Background server sync warning:', err);
    }
  }, []);

  // Background polling: keep Discovery Queue & Chat Messages in real-time sync across devices
  useEffect(() => {
    if (!isClient) return;
    syncWithServer();

    const interval = setInterval(() => {
      syncWithServer();
    }, 2500);

    return () => clearInterval(interval);
  }, [isClient, syncWithServer]);

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

  // Register User with immediate synchronous persistence AND server DB sync
  const registerUser = async (newUser: UserProfile) => {
    // 1. Immediately update local state
    setAllProfiles((prev) => {
      const exists = prev.some((p) => p.id === newUser.id || (newUser.email && p.email === newUser.email));
      if (exists) {
        return prev.map((p) => (p.id === newUser.id ? newUser : p));
      }
      return [...prev, newUser];
    });
    setCurrentUser(newUser);
    setMode(newUser.mode);

    // 2. Direct synchronous localStorage write (so refresh immediately works!)
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      const currentList = allProfiles.filter((p) => p.id !== newUser.id);
      localStorage.setItem(STORAGE_KEYS.ALL_PROFILES, JSON.stringify([...currentList, newUser]));
    } catch (err) {
      console.warn('Local storage write warning:', err);
    }

    // 3. Persist to server DB
    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      syncWithServer();
    } catch (err) {
      console.warn('Server registration sync warning:', err);
    }
  };

  const loginUser = (email: string): boolean => {
    const clean = email.toLowerCase().trim();
    const found = allProfiles.find((p) => p.email?.toLowerCase().trim() === clean);
    if (found) {
      setCurrentUser(found);
      setMode(found.mode);
      try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(found));
      } catch {}
      syncWithServer();
      return true;
    }

    // Also attempt server login
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          setMode(data.user.mode);
          try {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
          } catch {}
          syncWithServer();
        }
      })
      .catch(() => {});

    return false;
  };

  const loginAs = (user: UserProfile) => {
    setCurrentUser(user);
    setMode(user.mode);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch {}
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch {}
  };

  // Who liked current user:
  const likedByUsers = currentUser
    ? allProfiles.filter((p) => {
        if (p.id === currentUser.id) return false;
        const key = `${p.id}->${currentUser.id}`;
        const hasLikedMe = swipes[key] === 'like' || swipes[key] === 'superlike';
        if (!hasLikedMe) return false;
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

    // 1. Check local reciprocal like for instant feedback
    const reciprocalKey = `${targetUserId}->${currentUser.id}`;
    const isSimulatedTarget =
      Boolean(targetUser.is_simulated) ||
      targetUserId === 'user-simulated-john' ||
      targetUser.display_name === 'จอน';

    if (isSimulatedTarget) {
      setSwipes((prev) => ({ ...prev, [reciprocalKey]: 'like' }));
    }

    const reciprocalAction = isSimulatedTarget ? 'like' : swipes[reciprocalKey];
    let isMatch = false;
    let matchObj: MatchItem | undefined;

    if (action === 'like' || action === 'superlike') {
      if (reciprocalAction === 'like' || reciprocalAction === 'superlike') {
        isMatch = true;
        const matchId = `match-${Date.now()}`;
        const convoId = `convo-${matchId}`;
        const now = new Date().toISOString();

        matchObj = {
          id: matchId,
          user1_id: currentUser.id,
          user2_id: targetUserId,
          matched_at: now,
          is_active: true,
          other_user: targetUser,
        };

        const newConvo: ConversationItem = {
          id: convoId,
          match_id: matchId,
          other_user: targetUser,
          last_message_text: action === 'superlike' ? '🌟 Super Like match!' : '🎉 You matched! Start a chat.',
          last_message_at: now,
          unread_count: 0,
        };

        const welcomeMsg: MessageItem = {
          id: `msg-${Date.now()}`,
          conversation_id: convoId,
          sender_id: 'system',
          text: 'ยินดีด้วย! คุณทั้งคู่กดถูกใจกันและกัน เริ่มพูดคุยและทำความรู้จักกันได้เลย 👋',
          is_read: true,
          created_at: now,
        };

        setMatches((prev) => [matchObj!, ...prev]);
        setConversations((prev) => [newConvo, ...prev]);
        setMessages((prev) => ({ ...prev, [convoId]: [welcomeMsg] }));
        setLatestMatchCelebration(matchObj);

        // Confetti Celebration!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF416C', '#FF526B', '#FF7A85', '#FFD166'],
          });
        } catch {}
      }
    }

    // 2. Also send swipe to server to check server-side match
    try {
      const res = await fetch('/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: currentUser.id,
          toUserId: targetUserId,
          action,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isMatch && data.match) {
          isMatch = true;
          matchObj = data.match;
          setMatches((prev) => {
            const exists = prev.some((m) => m.id === data.match.id);
            return exists ? prev : [data.match, ...prev];
          });
          if (data.conversation) {
            setConversations((prev) => {
              const exists = prev.some((c) => c.id === data.conversation.id);
              return exists ? prev : [data.conversation, ...prev];
            });
          }
          setLatestMatchCelebration(data.match);

          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#FF416C', '#FF526B', '#FF7A85', '#FFD166'],
            });
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Server swipe error:', err);
    }

    return { isMatch, match: matchObj };
  };

  const dismissMatchCelebration = () => {
    setLatestMatchCelebration(null);
  };

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return;
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setMessages((prev) => ({
            ...prev,
            [conversationId]: data.messages,
          }));
        }
      }
    } catch (err) {
      console.warn('Fetch messages error:', err);
    }
  }, []);

  // Real Chat message saving & history persistence
  const sendMessage = useCallback(
    async (conversationId: string, text: string, imageUrl?: string) => {
      if (!currentUser || (!text.trim() && !imageUrl)) return;

      const tempId = `msg-${Date.now()}`;
      const now = new Date().toISOString();
      const newMsg: MessageItem = {
        id: tempId,
        conversation_id: conversationId,
        sender_id: currentUser.id,
        text: text.trim(),
        image_url: imageUrl,
        is_read: true,
        created_at: now,
      };

      // Optimistic local update
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
                last_message_text: text.trim() || 'Sent an image',
                last_message_at: now,
              }
            : c
        )
      );

      // Save to server database
      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            senderId: currentUser.id,
            text: text.trim(),
            imageUrl,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.message) {
            setMessages((prev) => ({
              ...prev,
              [conversationId]: (prev[conversationId] || []).map((m) =>
                m.id === tempId ? data.message : m
              ),
            }));
          }
          // Fetch to immediately pick up automated reply from simulated John
          setTimeout(() => {
            fetchMessages(conversationId);
          }, 600);
        }
      } catch (err) {
        console.warn('Send message server error:', err);
      }
    },
    [currentUser, fetchMessages]
  );

  const unmatch = async (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
    setConversations((prev) => prev.filter((c) => c.match_id !== matchId));
    const convoId = `convo-${matchId}`;
    setMessages((prev) => {
      const copy = { ...prev };
      delete copy[convoId];
      return copy;
    });

    try {
      await fetch(`/api/matches?matchId=${matchId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Unmatch server error:', err);
    }
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
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newProfile));
    } catch {}
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
    syncWithServer();
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
        fetchMessages,
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
