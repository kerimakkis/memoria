export type GameCategory = 'memory' | 'attention' | 'logic';

export interface GameDefinition {
  slug: string;
  titleKey: string;
  summaryKey: string;
  goalKey: string;
  hintKey: string;
  category: GameCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
}

export interface GameSessionPayload {
  gameId?: string;
  gameSlug: string;
  score: number;
  durationSeconds: number;
  accuracy?: number;
  metadata?: Record<string, unknown>;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  totalScore: number;
  bestScore: number;
}

export interface Achievement {
  code: string;
  title: string;
  description: string;
  requirement: Record<string, unknown>;
}
