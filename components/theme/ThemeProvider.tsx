import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { darkTheme, lightTheme, type Theme, type ThemeMode } from '../../styles/theme';

type ThemePreference = ThemeMode | 'system';

type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
};

const STORAGE_KEY = 'memoria-theme-preference';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColor = Appearance.getColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [mode, setMode] = useState<ThemeMode>(systemColor === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    const loadPreference = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setPreference(saved);
      }
    };

    loadPreference().catch(error => console.error('Tema tercihi yüklenemedi', error));
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (preference === 'system' && colorScheme) {
        setMode(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    return () => subscription.remove();
  }, [preference]);

  useEffect(() => {
    if (preference === 'system') {
      setMode(systemColor === 'dark' ? 'dark' : 'light');
    } else {
      setMode(preference);
    }
  }, [preference, systemColor]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme: mode === 'dark' ? darkTheme : lightTheme,
    mode,
    preference,
    setPreference: next => {
      setPreference(next);
      AsyncStorage.setItem(STORAGE_KEY, next).catch(error => {
        console.error('Tema tercihi kaydedilemedi', error);
      });
    }
  }), [mode, preference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('ThemeProvider hiyerarşisi dışında tema kullanımı yapılamaz.');
  }
  return context;
}
