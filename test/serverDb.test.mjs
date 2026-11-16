import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { serverDb, SIMULATED_USER_JOHN } from '../src/lib/serverDb.ts';

describe('Server Database & Real-time Chat Persistence Suite', () => {
  const testUserA = {
    id: `test-user-a-${Date.now()}`,
    display_name: 'Ploy',
    birthdate: '2008-05-10',
    age: 17,
    gender: 'female',
    school_department: 'วิทย์-คณิต',
    bio: 'Love science and music',
    mode: 'CAMPUS_FRIENDS',
    is_verified: true,
    is_hidden: false,
    is_suspended: false,
    is_banned: false,
    is_admin: false,
    avatar_url: '/uploads/ploy.jpg',
    photos: [{ id: 'p1', user_id: 'test-user-a', url: '/uploads/ploy.jpg', order_index: 0, is_primary: true }],
    interests: [{ id: '1', name: 'Music', category: 'General', icon: '🎵' }],
    preferences: {
      preferred_gender: 'all',
      min_age: 16,
      max_age: 19,
      campus_filter: 'all',
      notifications_enabled: true,
      discovery_active: true,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const testUserB = {
    ...testUserA,
    id: `test-user-b-${Date.now()}`,
    display_name: 'Boss',
    gender: 'male',
    school_department: 'ศิลป์-คำนวณ',
    avatar_url: '/uploads/boss.jpg',
  };

  test('1. User Registration and Persistence in Server Database', () => {
    serverDb.saveUser(testUserA);
    serverDb.saveUser(testUserB);

    const fetchedA = serverDb.getUserById(testUserA.id);
    const fetchedB = serverDb.getUserById(testUserB.id);

    assert.ok(fetchedA, 'User A should exist in DB');
    assert.equal(fetchedA.display_name, 'Ploy');
    assert.ok(fetchedB, 'User B should exist in DB');
    assert.equal(fetchedB.display_name, 'Boss');
  });

  test('2. Multi-user Mutual Swiping creates Match & Conversation', () => {
    // User A likes User B
    const swipeA = serverDb.recordSwipe(testUserA.id, testUserB.id, 'like');
    assert.equal(swipeA.isMatch, false, 'First swipe should not trigger match alone');

    // User B likes User A (mutual!)
    const swipeB = serverDb.recordSwipe(testUserB.id, testUserA.id, 'like');
    assert.equal(swipeB.isMatch, true, 'Mutual swipe should trigger match');
    assert.ok(swipeB.match, 'Match object should be returned');
    assert.ok(swipeB.conversation, 'Conversation object should be created');

    // Verify conversation exists
    const convosA = serverDb.getConversations(testUserA.id);
    assert.ok(convosA.length > 0, 'User A should have conversation');
  });

  test('3. Real-time Message Exchange persists across devices', () => {
    const convosA = serverDb.getConversations(testUserA.id);
    const activeConvo = convosA[0];
    assert.ok(activeConvo, 'Active conversation must exist');

    // User A sends message to User B
    const msg1 = serverDb.sendMessage(activeConvo.id, testUserA.id, 'สวัสดี บอส!');
    assert.equal(msg1.text, 'สวัสดี บอส!');

    // User B sends message to User A
    const msg2 = serverDb.sendMessage(activeConvo.id, testUserB.id, 'สวัสดี พลอย ยินดีที่ได้รู้จักนะ');
    assert.equal(msg2.text, 'สวัสดี พลอย ยินดีที่ได้รู้จักนะ');

    // Fetch messages from conversation
    const messages = serverDb.getMessages(activeConvo.id);
    assert.ok(messages.length >= 3, 'Should contain greeting + both chat messages');
    assert.equal(messages[messages.length - 2].text, 'สวัสดี บอส!');
    assert.equal(messages[messages.length - 1].text, 'สวัสดี พลอย ยินดีที่ได้รู้จักนะ');
  });

  test('4. Unmatch removes conversation and revokes chat', () => {
    const convosA = serverDb.getConversations(testUserA.id);
    const activeConvo = convosA[0];
    assert.ok(activeConvo);

    serverDb.unmatch(activeConvo.match_id);

    const convosAfter = serverDb.getConversations(testUserA.id);
    assert.equal(convosAfter.some((c) => c.match_id === activeConvo.match_id), false);
  });

  test('5. Simulated User "John" (จอน) auto-matches and auto-replies in chat', () => {
    const john = serverDb.getUserById('user-simulated-john');
    assert.ok(john, 'Simulated John must exist in DB');
    assert.equal(john.display_name, 'จอน');
    assert.equal(john.is_simulated, true);

    // Any user swiping like on John gets instant mutual match
    const swipeOnJohn = serverDb.recordSwipe(testUserA.id, 'user-simulated-john', 'like');
    assert.equal(swipeOnJohn.isMatch, true, 'Swiping on John should create immediate match');
    assert.ok(swipeOnJohn.match);
    assert.ok(swipeOnJohn.conversation);

    // Sending a message to John automatically triggers John reply
    const sentMsg = serverDb.sendMessage(swipeOnJohn.conversation.id, testUserA.id, 'สวัสดีจอน!');
    assert.equal(sentMsg.text, 'สวัสดีจอน!');

    const chatMsgs = serverDb.getMessages(swipeOnJohn.conversation.id);
    const lastMsg = chatMsgs[chatMsgs.length - 1];
    assert.ok(lastMsg.text.includes('จอน'), 'John auto-reply must mention จอน');
    assert.equal(lastMsg.sender_id, 'user-simulated-john');
  });

  test('6. Reset DB to pristine state with ONLY John', () => {
    serverDb.saveRaw({
      users: [SIMULATED_USER_JOHN],
      swipes: {},
      matches: [],
      conversations: [],
      messages: {},
      blocks: [],
      reports: [],
    });
    const users = serverDb.getUsers();
    assert.equal(users.length, 1);
    assert.equal(users[0].id, 'user-simulated-john');
  });
});
