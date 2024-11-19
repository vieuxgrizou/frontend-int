import { useState, useEffect } from 'react';
import { useApiKeys } from '../store/apiKeys';
import toast from 'react-hot-toast';

export function useOpenAI() {
  const { getApiKey, hasValidKey, isLoading: isLoadingKey } = useApiKeys();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadApiKey = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Vérifier si nous avons une clé valide
        const isValid = await hasValidKey('openai');
        if (!isValid) {
          const key = await getApiKey('openai');
          if (!key) {
            setError('OpenAI API key not configured');
            return;
          }
        }

        const key = await getApiKey('openai');
        if (mounted) {
          if (!key) {
            setError('OpenAI API key not configured');
            return;
          }
          
          // Valider le format de la clé
          if (!key.startsWith('sk-')) {
            setError('Invalid OpenAI API key format');
            return;
          }
          
          setApiKey(key);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load OpenAI API key');
          toast.error('Failed to load OpenAI API key');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    if (!isLoadingKey) {
      loadApiKey();
    }

    return () => {
      mounted = false;
    };
  }, [getApiKey, hasValidKey, isLoadingKey]);

  return {
    apiKey,
    isLoading: isLoading || isLoadingKey,
    error,
    isConfigured: !!apiKey && apiKey.startsWith('sk-')
  };
}