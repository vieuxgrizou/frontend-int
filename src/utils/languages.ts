export const SUPPORTED_LANGUAGES = [
  { code: 'fr', name: 'Français', flag: 'fr' },
  { code: 'en', name: 'English', flag: 'gb' },
  { code: 'es', name: 'Español', flag: 'es' },
  { code: 'de', name: 'Deutsch', flag: 'de' },
  { code: 'it', name: 'Italiano', flag: 'it' },
  { code: 'pt', name: 'Português', flag: 'pt' },
  { code: 'nl', name: 'Nederlands', flag: 'nl' },
  { code: 'pl', name: 'Polski', flag: 'pl' },
  { code: 'ru', name: 'Русский', flag: 'ru' },
  { code: 'uk', name: 'Українська', flag: 'ua' },
  { code: 'ar', name: 'العربية', flag: 'sa' },
  { code: 'hi', name: 'हिन्दी', flag: 'in' },
  { code: 'bn', name: 'বাংলা', flag: 'bd' },
  { code: 'zh', name: '中文', flag: 'cn' },
  { code: 'ja', name: '日本語', flag: 'jp' },
  { code: 'ko', name: '한국어', flag: 'kr' }
];

export function getLanguageName(code: string): string {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code)?.name || code.toUpperCase();
}