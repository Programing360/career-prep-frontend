import api from '@/lib/axios';
import type {
  LeaderboardEntry,
  LeaderboardExamOption,
  LeaderboardFilter,
  LeaderboardPaginatedResponse,
} from '@/types/leaderboard';

const DEFAULT_LIMIT = 20;

export const MOCK_LEADERBOARD_EXAMS: LeaderboardExamOption[] = [
  { slug: 'fpsc-css-2025', title: 'CSS (Central Superior Services)' },
  { slug: 'fpsc-assistant-director', title: 'FPSC Assistant Director' },
  { slug: 'ppsc-inspector-2025', title: 'PPSC Inspector Police' },
  { slug: 'ppsc-english-lecturer', title: 'PPSC Lecturer English' },
  { slug: 'nts-gat-general-2025', title: 'NTS GAT General' },
  { slug: 'fpsc-css-pms-preliminary', title: 'CSS/PMS Preliminary Screening' },
];

const MOCK_PLAYER_NAMES = [
  'Ayesha Khan',
  'Hamza Ali',
  'Fatima Noor',
  'Bilal Ahmed',
  'Zainab Raza',
  'Usman Tariq',
  'Maryam Shah',
  'Hassan Javed',
  'Areeba Siddiqui',
  'Danish Iqbal',
  'Noor Fatima',
  'Salman Butt',
  'Khadija Anwar',
  'Imran Malik',
  'Rabia Sheikh',
  'Omar Farooq',
  'Sana Qureshi',
  'Fahad Mehmood',
  'Hina Yousaf',
  'Asad Rahim',
  'Mahnoor Akhtar',
  'Taimoor Saeed',
  'Nida Baig',
  'Rashid Mahmood',
  'Aiman Zafar',
  'Shahzaib Khan',
  'Iqra Naseem',
  'Zeeshan Haider',
  'Anum Bukhari',
  'Raza Hussain',
  'Bushra Karim',
  'Naveed Ashraf',
  'Sadia Rehman',
  'Waleed Anwar',
  'Hira Malik',
  'Kamran Shahid',
  'Saba Jamil',
  'Ahmed Nawaz',
  'Ayesha Rana',
  'Mubashir Ali',
  'Farah Naz',
  'Saad Ullah',
  'Laiba Chaudhry',
  'Tariq Mehmood',
  'Rimsha Saleem',
];

const CURRENT_USER_ID = 'current-user-demo';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildMockLeaderboard(
  filters: LeaderboardFilter
): LeaderboardPaginatedResponse {
  const seed = hashString(`${filters.examSlug}|${filters.timeWindow}`);
  const rand = mulberry32(seed);
  const windowMultiplier =
    filters.timeWindow === 'daily'
      ? 0.4
      : filters.timeWindow === 'weekly'
        ? 0.75
        : 1;

  const players = MOCK_PLAYER_NAMES.map((name) => {
    const score = Math.round((150 + rand() * 840) * windowMultiplier);
    return {
      name,
      score,
      accuracyPercentage: Math.round(35 + rand() * 63),
      totalTestsTaken: Math.max(1, Math.round(1 + rand() * 24)),
      timeSpentSeconds: Math.round(1800 + rand() * 82800),
    };
  });

  players.sort((a, b) => b.score - a.score);

  const currentUserIndex = 8 + (seed % 12);

  const entries: LeaderboardEntry[] = players.map((player, index) => {
    const isCurrentUser = index === currentUserIndex;
    return {
      rank: index + 1,
      userId: isCurrentUser
        ? CURRENT_USER_ID
        : `user-${hashString(player.name) % 100000}`,
      displayName: isCurrentUser ? 'You' : player.name,
      avatarUrl: null,
      score: player.score,
      accuracyPercentage: player.accuracyPercentage,
      totalTestsTaken: player.totalTestsTaken,
      timeSpentSeconds: player.timeSpentSeconds,
      isCurrentUser,
    };
  });

  const page = filters.page ?? 1;
  const limit = filters.limit ?? DEFAULT_LIMIT;
  const start = (page - 1) * limit;
  const total = entries.length;

  return {
    data: entries.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    examSlug: filters.examSlug,
    timeWindow: filters.timeWindow,
    currentUserRank: currentUserIndex + 1,
  };
}

/**
 * Fetch the leaderboard for a given exam and time window.
 * Maps to: GET /api/v1/leaderboard/:examSlug?timeWindow=&page=&limit=
 * Falls back to mock data when the backend endpoint is unavailable.
 */
export async function getLeaderboard(
  filters: LeaderboardFilter
): Promise<LeaderboardPaginatedResponse> {
  try {
    const { data } = await api.get<{
      success: boolean;
      data: LeaderboardPaginatedResponse;
    }>(`/leaderboard/${encodeURIComponent(filters.examSlug)}`, {
      params: {
        timeWindow: filters.timeWindow,
        page: filters.page ?? 1,
        limit: filters.limit ?? DEFAULT_LIMIT,
      },
    });
    return data.data;
  } catch {
    await delay(500);
    return buildMockLeaderboard(filters);
  }
}
