import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from '../locales/en/common.json';
import de from '../locales/de/common.json';
import tr from '../locales/tr/common.json';

const resources = {
  en: { translation: en },
  de: { translation: de },
  tr: { translation: tr }
};

const supportedLngs = Object.keys(resources);
const fallbackLng = 'en';

function resolveInitialLanguage() {
  const locales = Localization.getLocales();
  const primary = locales[0]?.languageCode?.toLowerCase();
  if (primary && supportedLngs.includes(primary)) {
    return primary;
  }
  return fallbackLng;
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: resolveInitialLanguage(),
      fallbackLng,
      supportedLngs,
      compatibilityJSON: 'v4',
      interpolation: {
        escapeValue: false
      }
    })
    .catch(error => {
      console.error('i18n init error', error);
    });
}

export { i18n };
