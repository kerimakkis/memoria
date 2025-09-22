import { Redirect } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import { useThemeContext } from '../components/theme/ThemeProvider';
import { SUPPORTED_LANGUAGES, useLanguage } from '../hooks/useLanguage';

export default function SettingsScreen() {
  const { user, loading, signOut } = useAuth();
  const { theme, preference, mode } = useThemeContext();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  if (!loading && !user) {
    return <Redirect href="/auth/login" />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('auth.genericError');
      Alert.alert(t('settings.signOutError'), message);
    }
  };

  const currentThemeLabel = t(preference === 'system' ? 'theme.system' : `theme.${mode}`);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{t('settings.title')}</Text>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('settings.theme')}</Text>
        <Text style={{ color: theme.colors.muted }}>
          {t('settings.currentTheme', { mode: currentThemeLabel })}
        </Text>
        <ThemeToggle />
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('settings.language.title')}</Text>
        <Text style={{ color: theme.colors.muted }}>{t('settings.language.description')}</Text>
        <View style={styles.languageRow}>
          {SUPPORTED_LANGUAGES.map(code => {
            const active = language === code;
            return (
              <Pressable
                key={code}
                onPress={() => changeLanguage(code)}
                style={[
                  styles.languageChip,
                  {
                    backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.primary
                  }
                ]}
              >
                <Text style={{ color: active ? '#fff' : theme.colors.text }}>
                  {t(`settings.languages.${code}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('settings.account')}</Text>
        <Pressable style={[styles.button, { backgroundColor: theme.colors.danger }]} onPress={handleSignOut}>
          <Text style={styles.buttonText}>{t('buttons.signOut')}</Text>
        </Pressable>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  languageChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700'
  }
});
