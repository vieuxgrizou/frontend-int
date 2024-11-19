import { testAIProvider, testTextGeneration } from './providerTesting';
import { AI_PROVIDERS } from '../constants';
import toast from 'react-hot-toast';

interface TestResult {
  providerId: string;
  success: boolean;
  response?: string;
  error?: string;
  timestamp: string;
}

export async function runAutoTests(apiKeys: Record<string, string>): Promise<TestResult[]> {
  const results: TestResult[] = [];

  for (const provider of AI_PROVIDERS) {
    const apiKey = apiKeys[provider.id];
    if (!apiKey) continue;

    try {
      // Test de connexion
      const isValid = await testAIProvider(provider.id, apiKey);
      
      if (!isValid) {
        results.push({
          providerId: provider.id,
          success: false,
          error: 'Échec de la connexion',
          timestamp: new Date().toISOString()
        });
        continue;
      }

      // Test de génération
      const response = await testTextGeneration(provider.id, apiKey);
      
      results.push({
        providerId: provider.id,
        success: true,
        response,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      results.push({
        providerId: provider.id,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  return results;
}

export function scheduleAutoTests(apiKeys: Record<string, string>, interval: number = 3600000) { // Par défaut toutes les heures
  return setInterval(async () => {
    const results = await runAutoTests(apiKeys);
    
    // Notifier des résultats
    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      toast.error(`${failures.length} API(s) en échec. Vérifiez les paramètres.`);
    }
    
    // Sauvegarder l'historique des tests
    saveTestHistory(results);
  }, interval);
}

function saveTestHistory(results: TestResult[]) {
  const history = JSON.parse(localStorage.getItem('apiTestHistory') || '[]');
  history.push({
    timestamp: new Date().toISOString(),
    results
  });
  // Garder uniquement les 100 derniers tests
  if (history.length > 100) {
    history.shift();
  }
  localStorage.setItem('apiTestHistory', JSON.stringify(history));
}