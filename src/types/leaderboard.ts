export type LeaderboardTimeWindow = 'daily' | 'weekly' | 'all_time';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  score: number;
  accuracyPercentage: number;
  totalTestsTaken: number;
  timeSpentSeconds: number;
  isCurrentUser: boolean;
}

export interface LeaderboardFilter {
  examSlug: string;
  timeWindow: LeaderboardTimeWindow;
  page: number;
  limit: number;
}

export interface LeaderboardPaginatedResponse {
  data: LeaderboardEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  examSlug: string;
  timeWindow: LeaderboardTimeWindow;
  currentUserRank: number | null;
}

export interface LeaderboardExamOption {
  slug: string;
  title: string;
}
