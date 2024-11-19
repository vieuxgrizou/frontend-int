import { useStore } from '../store';

export function useLanguage() {
  const { language, setLanguage } = useStore();
  return { language, setLanguage };
}