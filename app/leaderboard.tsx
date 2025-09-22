import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../components/theme/ThemeProvider';
import { fetchLeaderboard } from '../services/gameSessionService';
import { GAMES } from '../constants/games';

export default function LeaderboardScreen() {
  const { user, loading } = useAuth();
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const [selectedGame, setSelectedGame] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', selectedGame],
    queryFn: () => fetchLeaderboard(selectedGame)
  });

  if (!loading && !user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>{t('leaderboard.title')}</Text>
      <View style={styles.pills}>
        <Pressable
          onPress={() => setSelectedGame(undefined)}
          style={[styles.pill, {
            backgroundColor: !selectedGame ? theme.colors.primary : theme.colors.surface,
            borderColor: theme.colors.primary
          }]}
        >
          <Text style={[styles.pillText, { color: !selectedGame ? '#fff' : theme.colors.text }]}>{t('leaderboard.all')}</Text>
        </Pressable>
        {GAMES.map(game => (
          <Pressable
            key={game.slug}
            onPress={() => setSelectedGame(game.slug)}
            style={[styles.pill, {
              backgroundColor: selectedGame === game.slug ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.primary
            }]}
          >
            <Text style={[styles.pillText, { color: selectedGame === game.slug ? '#fff' : theme.colors.text }]}>
              {game.icon} {t(game.titleKey)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.leaderboard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.leaderboardHeader}>
          <Text style={[styles.headerText, { color: theme.colors.muted }]}>{t('leaderboard.rank')}</Text>
          <Text style={[styles.headerText, { color: theme.colors.muted }]}>{t('leaderboard.user')}</Text>
          <Text style={[styles.headerText, { color: theme.colors.muted }]}>{t('leaderboard.score')}</Text>
        </View>
        {isLoading ? (
          <Text style={{ color: theme.colors.muted }}>{t('leaderboard.loading')}</Text>
        ) : (
          (data ?? []).map((entry, index) => (
            <View key={`${entry.userId}-${index}`} style={styles.row}>
              <Text style={[styles.rank, { color: theme.colors.text }]}>{index + 1}</Text>
              <Text style={[styles.name, { color: theme.colors.text }]}>{entry.displayName}</Text>
              <Text style={[styles.score, { color: theme.colors.text }]}>{entry.bestScore}</Text>
            </View>
          ))
        )}
        {(data?.length ?? 0) === 0 && !isLoading ? (
          <Text style={{ color: theme.colors.muted }}>{t('leaderboard.empty')}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 20,
    gap: 20
  },
  title: {
    fontSize: 26,
    fontWeight: '800'
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600'
  },
  leaderboard: {
    borderRadius: 16,
    padding: 20,
    gap: 12
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  rank: {
    width: 40,
    fontWeight: '700'
  },
  name: {
    flex: 1
  },
  score: {
    width: 80,
    textAlign: 'right',
    fontWeight: '700'
  }
});
