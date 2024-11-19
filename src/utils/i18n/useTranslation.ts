import { useCallback } from 'react';
import { useStore } from '../store';
import translations from './locales';

type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

export function useTranslation() {
  const { language } = useStore();

  const t = useCallback((key: TranslationKey, params?: TranslationParams) => {
    try {
      const keys = key.split('.');
      let value = translations[language as keyof typeof translations] || translations.en;

      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k as keyof typeof value];
        } else {
          // Fallback à l'anglais si la traduction n'existe pas
          const enValue = translations.en;
          for (const enKey of keys) {
            if (enValue && typeof enValue === 'object') {
              value = enValue[enKey as keyof typeof enValue];
            }
          }
          return value || key;
        }
      }

      if (typeof value === 'string') {
        if (params) {
          return Object.entries(params).reduce(
            (str, [key, val]) => str.replace(new RegExp(`{{${key}}}`, 'g'), String(val)),
            value
          );
        }
        return value;
      }

      return key;
    } catch (error) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }
  }, [language]);

  return { t, language };
}