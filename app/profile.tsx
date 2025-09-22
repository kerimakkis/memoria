import { useQuery } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../components/theme/ThemeProvider';
import { fetchUserProgress } from '../services/gameSessionService';
import { getGameBySlug } from '../constants/games';

export default function ProfileScreen() {
  const { user, loading } = useAuth();
  const { theme } = useThemeContext();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ['profile-progress', user?.id],
    queryFn: () => fetchUserProgress(user!.id)
  });

  if (!loading && !user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>{t('profile.title')}</Text>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.label, { color: theme.colors.muted }]}>{t('profile.email')}</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>{user?.email}</Text>
        <Text style={[styles.label, { color: theme.colors.muted }]}>{t('profile.userId')}</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>{user?.id}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}
        >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('profile.recentGames')}</Text>
        {isLoading ? (
          <Text style={{ color: theme.colors.muted }}>{t('leaderboard.loading')}</Text>
        ) : (
          data?.map(session => {
            const slug = session.games?.slug as string | undefined;
            const gameDef = slug ? getGameBySlug(slug) : undefined;
            const title = gameDef ? t(gameDef.titleKey) : t('profile.unknownGame');
            return (
              <View key={session.played_at} style={styles.sessionRow}>
                <Text style={[styles.sessionTitle, { color: theme.colors.text }]}>{title}</Text>
                <Text style={{ color: theme.colors.muted }}>{t('profile.score', { score: session.score })}</Text>
              </View>
            );
          })
        )}
        {(data?.length ?? 0) === 0 && !isLoading ? (
          <Text style={{ color: theme.colors.muted }}>Henüz oyun geçmişi bulunmuyor.</Text>
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
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 12
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  value: {
    fontSize: 16,
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  sessionRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb'
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600'
  }
});
