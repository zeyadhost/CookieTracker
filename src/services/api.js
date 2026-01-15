const FLAVORTOWN_BASE = '/flavortown-api';

const API_KEY = import.meta.env.VITE_FLAVORTOWN_API_KEY;

export async function fetchUserProfile(userId) {
  const response = await fetch(`${FLAVORTOWN_BASE}/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.status}`);
  }

  return response.json();
}

export async function fetchStoreItems() {
  const response = await fetch(`${FLAVORTOWN_BASE}/store`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch store items: ${response.status}`);
  }

  return response.json();
}

export async function fetchCookieStats(userId) {
  const profile = await fetchUserProfile(userId);

  return {
    totalCookies: profile.cookies || 0,
    userId,
    displayName: profile.display_name,
    avatar: profile.avatar,
    projectIds: profile.project_ids,
    voteCount: profile.vote_count,
    likeCount: profile.like_count,
    devlogSecondsTotal: profile.devlog_seconds_total,
    devlogSecondsToday: profile.devlog_seconds_today,
  };
}