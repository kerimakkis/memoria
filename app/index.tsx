import { Redirect, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GameCard } from '../components/games/GameCard';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import { useThemeContext } from '../components/theme/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import { GAMES } from '../constants/games';

export default function HomeScreen() {
  const { theme } = useThemeContext();
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  const subtitle = user?.email
    ? t('home.subtitleSignedIn', { email: user.email })
    : t('home.subtitleSignedOut');

  if (!loading && !user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.colors.text }]}>{t('app.name')}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{subtitle}</Text>
        </View>
        <ThemeToggle />
      </View>
      <View style={styles.quickLinks}>
        <Link href="/leaderboard" style={[styles.quickLink, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.quickLinkText, { color: theme.colors.text }]}>{t('home.quickLinks.leaderboard')}</Text>
        </Link>
        <Link href="/profile" style={[styles.quickLink, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.quickLinkText, { color: theme.colors.text }]}>{t('home.quickLinks.profile')}</Text>
        </Link>
        <Link href="/settings" style={[styles.quickLink, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.quickLinkText, { color: theme.colors.text }]}>{t('home.quickLinks.settings')}</Text>
        </Link>
      </View>
      <View>
        {GAMES.map(game => (
          <GameCard key={game.slug} game={game} />
        ))}
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
    paddingBottom: 40
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4
  },
  quickLinks: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  quickLink: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  quickLinkText: {
    fontSize: 14,
    fontWeight: '600'
  }
});
