import type { UserProfile } from '../types/index.ts';

/**
 * Matching Recommendation Algorithm
 * Computes a weighted compatibility score between the current user and candidates.
 * 
 * Factors:
 * 1. Shared Interests: 50% weight
 * 2. Profile Preferences / Department match: 25% weight
 * 3. Activity Recency: 15% weight
 * 4. Discovery Rotation (jitter): 10% weight
 * 
 * Ethical safety rules enforced:
 * - NO race, religion, appearance, or Elo attractiveness ratings.
 * - Transparent and positive community connection scoring.
 */
export function calculateCompatibilityScore(
  user: UserProfile,
  candidate: UserProfile,
  referenceNow: number = 1763251200000 // Stable fallback for prerender
): { score: number; sharedInterests: string[]; sharedCount: number } {
  // 1. Shared Interests (50%)
  const userInterestIds = new Set(user.interests.map((i) => i.id));
  const shared = candidate.interests.filter((i) => userInterestIds.has(i.id));
  const sharedCount = shared.length;
  
  // Normalized shared interest score (4 or more shared = 100% of this bucket)
  const interestScore = Math.min(sharedCount / 3, 1) * 50;

  // 2. Preferences & Department compatibility (25%)
  let preferenceScore = 15; // baseline mutual campus goodwill
  if (
    user.school_department &&
    candidate.school_department &&
    user.school_department === candidate.school_department
  ) {
    preferenceScore += 10; // shared department bonus
  } else {
    preferenceScore += 5; // inter-department cross-learning bonus
  }

  // 3. Activity Recency (15%)
  const candidateTimestamp = new Date(candidate.updated_at || candidate.created_at).getTime();
  const daysDiff = (referenceNow - candidateTimestamp) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(0, 15 - Math.min(Math.max(0, daysDiff), 15));

  // 4. Discovery Rotation Jitter (10%)
  // Deterministic pseudo-random rotation per user pair so discovery remains fresh
  const hash = (user.id + candidate.id)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const jitterScore = (hash % 10);

  const totalScore = Math.min(99, Math.round(interestScore + preferenceScore + recencyScore + jitterScore));

  return {
    score: Math.max(65, totalScore), // baseline 65% up to 99%
    sharedInterests: shared.map((i) => i.name),
    sharedCount,
  };
}

/**
 * Filter and Rank Discovery Profiles
 */
export function filterAndRankDiscovery(
  currentUser: UserProfile,
  candidates: UserProfile[],
  swipedUserIds: Set<string>,
  blockedUserIds: Set<string>
): UserProfile[] {
  return candidates
    .filter((candidate) => {
      // Hard filters
      if (candidate.id === currentUser.id) return false;
      if (candidate.is_banned || candidate.is_suspended || candidate.is_hidden) return false;
      if (swipedUserIds.has(candidate.id)) return false;
      if (blockedUserIds.has(candidate.id)) return false;
      
      // Mode and age gate filters
      if (currentUser.mode === 'CAMPUS_FRIENDS' && candidate.mode !== 'CAMPUS_FRIENDS') {
        return false;
      }
      if (currentUser.mode === 'ADULT_DATING' && candidate.age < 18) {
        return false;
      }

      // Gender preference filter
      if (
        currentUser.preferences.preferred_gender !== 'all' &&
        candidate.gender !== currentUser.preferences.preferred_gender
      ) {
        return false;
      }

      return true;
    })
    .map((candidate) => {
      const { score, sharedCount } = calculateCompatibilityScore(currentUser, candidate);
      return {
        ...candidate,
        compatibility_score: score,
        shared_interests_count: sharedCount,
      };
    })
    .sort((a, b) => (b.compatibility_score || 0) - (a.compatibility_score || 0));
}
