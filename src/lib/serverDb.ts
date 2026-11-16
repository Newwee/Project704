import fs from 'node:fs';
import path from 'node:path';
import type {
  UserProfile,
  SwipeAction,
  MatchItem,
  ConversationItem,
  MessageItem,
  BlockItem,
  ReportItem,
  ReportCategory,
} from '../types/index.ts';

export interface DbData {
  users: UserProfile[];
  swipes: Record<string, SwipeAction>;
  matches: MatchItem[];
  conversations: ConversationItem[];
  messages: Record<string, MessageItem[]>;
  blocks: BlockItem[];
  reports: ReportItem[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const defaultDb: DbData = {
  users: [],
  swipes: {},
  matches: [],
  conversations: [],
  messages: {},
  blocks: [],
  reports: [],
};

// Ensure data folder and db.json exist
function ensureDb(): DbData {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    if (!raw.trim()) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      swipes: parsed.swipes && typeof parsed.swipes === 'object' ? parsed.swipes : {},
      matches: Array.isArray(parsed.matches) ? parsed.matches : [],
      conversations: Array.isArray(parsed.conversations) ? parsed.conversations : [],
      messages: parsed.messages && typeof parsed.messages === 'object' ? parsed.messages : {},
      blocks: Array.isArray(parsed.blocks) ? parsed.blocks : [],
      reports: Array.isArray(parsed.reports) ? parsed.reports : [],
    };
  } catch (err) {
    console.error('[serverDb] Error reading db:', err);
    return defaultDb;
  }
}

// Write to DB atomically
function saveDb(data: DbData): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[serverDb] Error writing db:', err);
    // fallback direct write if rename fails
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[serverDb] Fallback write error:', e);
    }
  }
}

export const serverDb = {
  // Read entire state
  getData(): DbData {
    return ensureDb();
  },

  // USERS
  getUsers(): UserProfile[] {
    return ensureDb().users;
  },

  getUserById(id: string): UserProfile | undefined {
    return ensureDb().users.find((u) => u.id === id);
  },

  getUserByEmail(email: string): UserProfile | undefined {
    const clean = email.trim().toLowerCase();
    return ensureDb().users.find((u) => u.email?.trim().toLowerCase() === clean);
  },

  saveUser(user: UserProfile): UserProfile {
    const db = ensureDb();
    const index = db.users.findIndex(
      (u) => u.id === user.id || (user.email && u.email?.trim().toLowerCase() === user.email.trim().toLowerCase())
    );
    if (index >= 0) {
      db.users[index] = { ...db.users[index], ...user, updated_at: new Date().toISOString() };
    } else {
      db.users.push(user);
    }
    saveDb(db);
    return user;
  },

  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const db = ensureDb();
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    db.users[index] = { ...db.users[index], ...updates, updated_at: new Date().toISOString() };
    saveDb(db);
    return db.users[index];
  },

  // SWIPES & MATCHES
  recordSwipe(
    fromUserId: string,
    toUserId: string,
    action: SwipeAction
  ): { isMatch: boolean; match?: MatchItem; conversation?: ConversationItem } {
    const db = ensureDb();
    const swipeKey = `${fromUserId}->${toUserId}`;
    db.swipes[swipeKey] = action;

    const fromUser = db.users.find((u) => u.id === fromUserId);
    const toUser = db.users.find((u) => u.id === toUserId);

    let isMatch = false;
    let newMatch: MatchItem | undefined;
    let newConvo: ConversationItem | undefined;

    if (fromUser && toUser && (action === 'like' || action === 'superlike')) {
      const reciprocalKey = `${toUserId}->${fromUserId}`;
      const reciprocalAction = db.swipes[reciprocalKey];

      if (reciprocalAction === 'like' || reciprocalAction === 'superlike') {
        // Mutual like found!
        const existingMatch = db.matches.find(
          (m) =>
            (m.user1_id === fromUserId && m.user2_id === toUserId) ||
            (m.user1_id === toUserId && m.user2_id === fromUserId)
        );

        if (!existingMatch) {
          isMatch = true;
          const matchId = `match-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          const now = new Date().toISOString();

          newMatch = {
            id: matchId,
            user1_id: fromUserId,
            user2_id: toUserId,
            matched_at: now,
            is_active: true,
            other_user: toUser,
          };
          db.matches.unshift(newMatch);

          const convoId = `convo-${matchId}`;
          newConvo = {
            id: convoId,
            match_id: matchId,
            other_user: toUser,
            unread_count: 0,
            last_message_text: action === 'superlike' ? '🌟 Super Like match!' : '🎉 You matched! Start a chat.',
            last_message_at: now,
          };
          db.conversations.unshift(newConvo);

          // Initial system match greeting
          db.messages[convoId] = [
            {
              id: `msg-welcome-${Date.now()}`,
              conversation_id: convoId,
              sender_id: 'system',
              text: 'ยินดีด้วย! คุณทั้งคู่กดถูกใจกันและกัน เริ่มพูดคุยและทำความรู้จักกันได้เลย 👋',
              created_at: now,
              is_read: true,
            },
          ];
        }
      }
    }

    saveDb(db);
    return { isMatch, match: newMatch, conversation: newConvo };
  },

  getMatches(userId: string): MatchItem[] {
    const db = ensureDb();
    return db.matches
      .filter((m) => m.is_active && (m.user1_id === userId || m.user2_id === userId))
      .map((m) => {
        const otherId = m.user1_id === userId ? m.user2_id : m.user1_id;
        const otherUser = db.users.find((u) => u.id === otherId);
        return {
          ...m,
          other_user: otherUser || m.other_user,
        };
      });
  },

  getConversations(userId: string): ConversationItem[] {
    const db = ensureDb();
    const userMatches = db.matches.filter(
      (m) => m.is_active && (m.user1_id === userId || m.user2_id === userId)
    );
    const matchIds = new Set(userMatches.map((m) => m.id));

    return db.conversations
      .filter((c) => matchIds.has(c.match_id))
      .map((c) => {
        const match = userMatches.find((m) => m.id === c.match_id);
        const otherId = match ? (match.user1_id === userId ? match.user2_id : match.user1_id) : '';
        const otherUser = db.users.find((u) => u.id === otherId);
        return {
          ...c,
          other_user: otherUser || c.other_user,
        };
      });
  },

  // MESSAGES
  getMessages(conversationId: string): MessageItem[] {
    const db = ensureDb();
    return db.messages[conversationId] || [];
  },

  sendMessage(
    conversationId: string,
    senderId: string,
    text: string,
    imageUrl?: string
  ): MessageItem {
    const db = ensureDb();
    if (!db.messages[conversationId]) {
      db.messages[conversationId] = [];
    }
    const now = new Date().toISOString();
    const newMessage: MessageItem = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      conversation_id: conversationId,
      sender_id: senderId,
      text,
      image_url: imageUrl,
      created_at: now,
      is_read: false,
    };
    db.messages[conversationId].push(newMessage);

    // Update conversation last_message_text
    const convoIndex = db.conversations.findIndex((c) => c.id === conversationId);
    if (convoIndex >= 0) {
      db.conversations[convoIndex].last_message_text = text || 'Sent an image';
      db.conversations[convoIndex].last_message_at = now;
    }

    saveDb(db);
    return newMessage;
  },

  // UNMATCH
  unmatch(matchId: string): void {
    const db = ensureDb();
    const match = db.matches.find((m) => m.id === matchId);
    if (match) {
      match.is_active = false;
    }
    db.conversations = db.conversations.filter((c) => c.match_id !== matchId);
    const convoId = `convo-${matchId}`;
    delete db.messages[convoId];
    saveDb(db);
  },

  // BLOCK
  blockUser(fromUserId: string, targetUserId: string, reason?: string): void {
    const db = ensureDb();
    db.blocks.push({
      id: `block-${Date.now()}`,
      blocker_id: fromUserId,
      blocked_id: targetUserId,
      reason: reason || 'Blocked by user',
      created_at: new Date().toISOString(),
    });

    // Deactivate matches between them
    db.matches.forEach((m) => {
      if (
        (m.user1_id === fromUserId && m.user2_id === targetUserId) ||
        (m.user1_id === targetUserId && m.user2_id === fromUserId)
      ) {
        m.is_active = false;
        db.conversations = db.conversations.filter((c) => c.match_id !== m.id);
        delete db.messages[`convo-${m.id}`];
      }
    });

    saveDb(db);
  },

  // REPORT
  reportUser(reporterId: string, reportedId: string, category: string, details: string): void {
    const db = ensureDb();
    db.reports.push({
      id: `rep-${Date.now()}`,
      reporter_id: reporterId,
      reported_id: reportedId,
      category: category as ReportCategory,
      details,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
    saveDb(db);
  },
};
