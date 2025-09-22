import { Link, Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AuthForm } from '../../components/auth/AuthForm';
import { useThemeContext } from '../../components/theme/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const { theme } = useThemeContext();
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <AuthForm mode="login" />
        <Text style={[styles.switchText, { color: theme.colors.muted }]}>{t('auth.noAccount')}</Text>
        <Link href="/auth/register" style={[styles.link, { color: theme.colors.primary }]}>{t('buttons.signUp')}</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  card: {
    padding: 24,
    borderRadius: 16,
    gap: 12
  },
  switchText: {
    textAlign: 'center'
  },
  link: {
    textAlign: 'center',
    fontWeight: '600'
  }
});
