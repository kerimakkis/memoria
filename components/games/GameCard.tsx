import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { GameDefinition } from '../../types';
import { useThemeContext } from '../theme/ThemeProvider';

export function GameCard({ game }: { game: GameDefinition }) {
  const router = useRouter();
  const { theme } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/games/[slug]', params: { slug: game.slug } })}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: pressed ? theme.colors.primary : theme.colors.surface
        }
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.icon, { color: theme.colors.primary }]}>{game.icon}</Text>
        <View>
          <Text style={[styles.title, { color: theme.colors.text }]}>{t(game.titleKey)}</Text>
          <Text style={[styles.summary, { color: theme.colors.muted }]}>{t(game.summaryKey)}</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <Text style={[styles.meta, { color: theme.colors.muted }]}>
          {t(`games.categories.${game.category}`)}
        </Text>
        <Text style={[styles.meta, { color: theme.colors.muted }]}>
          {t(`games.difficulties.${game.difficulty}`)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 2
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  icon: {
    fontSize: 32
  },
  title: {
    fontSize: 18,
    fontWeight: '700'
  },
  summary: {
    fontSize: 14,
    marginTop: 4
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  meta: {
    fontSize: 12,
    fontWeight: '600'
  }
});
