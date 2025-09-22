import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { i18n } from '../services/i18n';

const STORAGE_KEY = 'memoria-language';

export const SUPPORTED_LANGUAGES = ['en', 'de', 'tr'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function useLanguage() {
  const [language, setLanguage] = useState<SupportedLanguage>((i18n.language as SupportedLanguage) ?? 'en');

  useEffect(() => {
    const loadPreference = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
        await i18n.changeLanguage(stored);
      }
    };

    loadPreference().catch(error => {
      console.error('Dil tercihi yüklenemedi', error);
    });

    const handleLanguageChange = (lng: string) => {
      if (SUPPORTED_LANGUAGES.includes(lng as SupportedLanguage)) {
        setLanguage(lng as SupportedLanguage);
      }
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const changeLanguage = useCallback(async (lng: SupportedLanguage) => {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem(STORAGE_KEY, lng);
  }, []);

  return {
    language,
    changeLanguage
  };
}
