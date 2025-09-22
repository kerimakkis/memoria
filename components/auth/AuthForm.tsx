import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../theme/ThemeProvider';

type AuthMode = 'login' | 'register';

interface AuthFormProps {
  mode: AuthMode;
  onSuccess?: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const { signIn, signUp } = useAuth();
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName);
        Alert.alert(t('auth.successTitle'), t('auth.successDescription'));
      }
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('auth.genericError');
      Alert.alert(t('auth.errorTitle'), message);
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle');

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {mode === 'register' && (
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
          placeholder={t('auth.namePlaceholder')}
          placeholderTextColor={theme.colors.muted}
          autoCapitalize="words"
          value={displayName}
          onChangeText={setDisplayName}
        />
      )}
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
        placeholder={t('auth.emailPlaceholder')}
        placeholderTextColor={theme.colors.muted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
        placeholder={t('auth.passwordPlaceholder')}
        placeholderTextColor={theme.colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.colors.primary,
            opacity: pressed || submitting ? 0.7 : 1
          }
        ]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
