import { supabase } from './supabaseClient';
import { GameSessionPayload, LeaderboardEntry } from '../types';

async function resolveGameId(gameSlug: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('games')
    .select('id')
    .eq('slug', gameSlug)
    .single();

  if (error) {
    console.warn('Oyun kimliği getirilemedi:', error.message);
    return null;
  }

  return data?.id ?? null;
}

export async function saveGameSession(payload: GameSessionPayload) {
  const gameId = payload.gameId ?? (await resolveGameId(payload.gameSlug));

  const insertPayload = {
    game_id: gameId,
    score: payload.score,
    duration_seconds: payload.durationSeconds,
    accuracy: payload.accuracy,
    metadata: payload.metadata
  };

  const { error } = await supabase.from('game_sessions').insert(insertPayload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchLeaderboard(gameSlug?: string, limit = 10): Promise<LeaderboardEntry[]> {
  let query = supabase
    .from('game_sessions')
    .select('score, user_id, profiles(display_name), games(slug)')
    .order('score', { ascending: false })
    .limit(limit);

  if (gameSlug) {
    const gameId = await resolveGameId(gameSlug);
    if (gameId) {
      query = query.eq('game_id', gameId);
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (
    data ?? []
  ).map(item => ({
    userId: item.user_id,
    displayName: item.profiles?.display_name ?? 'Anonim',
    totalScore: item.score,
    bestScore: item.score
  }));
}

export async function fetchUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('game_sessions')
    .select('score, played_at, duration_seconds, games(slug, title)')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
