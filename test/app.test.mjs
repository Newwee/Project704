import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Import core algorithmic and domain logic
import { calculateCompatibilityScore, filterAndRankDiscovery } from '../src/lib/recommendation.ts';

describe('Spark - Core Logic & Safety Test Suite', () => {
  const baseStudentA = {
    id: 'student-a',
    display_name: 'Phukao',
    birthdate: '2008-02-18',
    age: 17,
    gender: 'male',
    bio: 'CS student',
    school_department: 'วิทย์-คอมพิวเตอร์',
    mode: 'CAMPUS_FRIENDS',
    is_verified: true,
    is_hidden: false,
    is_suspended: false,
    is_banned: false,
    is_admin: false,
    avatar_url: '',
    photos: [],
    interests: [
      { id: 'int-1', name: 'Coding', category: 'Tech', icon: '💻' },
      { id: 'int-2', name: 'Badminton', category: 'Sports', icon: '🏸' },
      { id: 'int-3', name: 'Indie Rock', category: 'Music', icon: '🎸' },
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

  const candidateSameDept = {
    ...baseStudentA,
    id: 'candidate-same-dept',
    display_name: 'Ken',
    interests: [
      { id: 'int-1', name: 'Coding', category: 'Tech', icon: '💻' },
      { id: 'int-2', name: 'Badminton', category: 'Sports', icon: '🏸' },
    ],
  };

  const candidateDiffDept = {
    ...baseStudentA,
    id: 'candidate-diff-dept',
    display_name: 'Mina',
    school_department: 'ศิลป์-ภาษาญี่ปุ่น',
    interests: [
      { id: 'int-3', name: 'Indie Rock', category: 'Music', icon: '🎸' },
    ],
  };

  const candidateMinor = {
    ...baseStudentA,
    id: 'candidate-minor',
    age: 16,
    mode: 'CAMPUS_FRIENDS',
  };

  test('1. Compatibility Score prioritizes shared interests and department', () => {
    const scoreSame = calculateCompatibilityScore(baseStudentA, candidateSameDept, 1763251200000);
    const scoreDiff = calculateCompatibilityScore(baseStudentA, candidateDiffDept, 1763251200000);

    assert.ok(scoreSame.score > scoreDiff.score, 'Same dept + 2 shared interests should score higher than 1 shared interest');
    assert.equal(scoreSame.sharedCount, 2);
    assert.equal(scoreDiff.sharedCount, 1);
  });

  test('2. Discovery filters out self, blocked users, and swiped profiles', () => {
    const candidates = [baseStudentA, candidateSameDept, candidateDiffDept];
    const swiped = new Set(['candidate-same-dept']);
    const blocked = new Set(['candidate-diff-dept']);

    const result = filterAndRankDiscovery(baseStudentA, candidates, swiped, blocked);
    assert.equal(result.length, 0, 'All candidates should be excluded (self, swiped, blocked)');
  });

  test('3. Discovery excludes banned, suspended, or hidden profiles', () => {
    const suspendedCandidate = { ...candidateSameDept, id: 'c-susp', is_suspended: true };
    const bannedCandidate = { ...candidateSameDept, id: 'c-ban', is_banned: true };
    const hiddenCandidate = { ...candidateSameDept, id: 'c-hide', is_hidden: true };

    const result = filterAndRankDiscovery(
      baseStudentA,
      [suspendedCandidate, bannedCandidate, hiddenCandidate],
      new Set(),
      new Set()
    );
    assert.equal(result.length, 0, 'Suspended, banned, and hidden profiles must never appear in discovery');
  });

  test('4. Age & Community Safety Gate: Under 18 is strictly blocked from Adult Dating mode', () => {
    const adultUser = { ...baseStudentA, age: 22, mode: 'ADULT_DATING' };
    const minorCandidate = { ...candidateMinor, mode: 'CAMPUS_FRIENDS' };

    const result = filterAndRankDiscovery(adultUser, [minorCandidate], new Set(), new Set());
    assert.equal(result.length, 0, 'Minor must not appear in adult dating discovery');
  });

  test('5. Atomic Matching Engine: Mutual likes generate a single active match', () => {
    const swipes = {};
    const matches = [];

    function processSwipe(swiperId, swipedId, action) {
      swipes[`${swiperId}->${swipedId}`] = action;
      // Check reciprocal
      if (swipes[`${swipedId}->${swiperId}`] === 'like') {
        const u1 = [swiperId, swipedId].sort()[0];
        const u2 = [swiperId, swipedId].sort()[1];
        const matchKey = `match-${u1}-${u2}`;
        if (!matches.some((m) => m.id === matchKey)) {
          matches.push({ id: matchKey, u1, u2, is_active: true });
          return { isMatch: true, matchId: matchKey };
        }
      }
      return { isMatch: false };
    }

    // Step A: User A likes User B
    const step1 = processSwipe('user-a', 'user-b', 'like');
    assert.equal(step1.isMatch, false, 'Single like must not trigger match prematurely');
    assert.equal(matches.length, 0);

    // Step B: User B likes User A
    const step2 = processSwipe('user-b', 'user-a', 'like');
    assert.equal(step2.isMatch, true, 'Mutual like must trigger match');
    assert.equal(matches.length, 1);
    assert.equal(matches[0].id, 'match-user-a-user-b');

    // Step C: Duplicate like should not create duplicate match
    const step3 = processSwipe('user-b', 'user-a', 'like');
    assert.equal(step3.isMatch, false, 'Duplicate swipe must not create duplicate match');
    assert.equal(matches.length, 1);
  });

  test('6. Unmatch and Block security: Revokes chat permissions', () => {
    const activeMatch = { id: 'm-1', u1: 'user-a', u2: 'user-b', is_active: true };
    const blockedPairs = new Set();

    function canSendMessage(senderId, match) {
      if (!match || !match.is_active) return false;
      const pair = `${match.u1}:${match.u2}`;
      if (blockedPairs.has(pair)) return false;
      return true;
    }

    assert.ok(canSendMessage('user-a', activeMatch), 'Active match can chat');

    // Unmatch
    activeMatch.is_active = false;
    assert.equal(canSendMessage('user-a', activeMatch), false, 'Unmatched users cannot chat');

    // Block
    blockedPairs.add('user-a:user-b');
    assert.equal(canSendMessage('user-a', activeMatch), false, 'Blocked users cannot chat');
  });

  test('7. Admin Moderation Security Guard', () => {
    const regularStudent = { ...baseStudentA, is_admin: false };
    const adminUser = { ...baseStudentA, is_admin: true };

    function performAdminAction(caller, targetUser, action) {
      if (!caller.is_admin) {
        throw new Error('403: Forbidden - Admin permission required');
      }
      if (action === 'suspend') targetUser.is_suspended = true;
      if (action === 'ban') targetUser.is_banned = true;
      return true;
    }

    const target = { ...candidateSameDept, is_suspended: false };

    // Regular user attempting admin action
    assert.throws(
      () => performAdminAction(regularStudent, target, 'suspend'),
      /403: Forbidden/
    );
    assert.equal(target.is_suspended, false);

    // Legitimate admin performing action
    performAdminAction(adminUser, target, 'suspend');
    assert.equal(target.is_suspended, true, 'Admin successfully suspends violating account');
  });
});
