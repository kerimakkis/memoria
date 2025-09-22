import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from './ThemeProvider';
import type { ThemeMode } from '../../styles/theme';

type ThemePreference = ThemeMode | 'system';

const OPTIONS: Array<{ value: ThemePreference }> = [
  { value: 'system' },
  { value: 'light' },
  { value: 'dark' }
];

export function ThemeToggle() {
  const { preference, setPreference, theme } = useThemeContext();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {OPTIONS.map(option => {
        const active = option.value === preference;
        const translationKey = option.value === 'system' ? 'theme.system' : `theme.${option.value}`;
        return (
          <Pressable
            key={option.value}
            onPress={() => setPreference(option.value)}
            style={[styles.button, active && { backgroundColor: theme.colors.primary }]}
          >
            <Text style={[styles.text, { color: active ? '#fff' : theme.colors.text }]}>
              {t(translationKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 8
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8
  },
  text: {
    fontSize: 14,
    fontWeight: '600'
  }
});
