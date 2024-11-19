import { aiApi } from '../api/routes';

export async function testAIProvider(providerId: string, apiKey: string): Promise<boolean> {
  try {
    const result = await aiApi.testKey(apiKey);
    return result.success;
  } catch (error) {
    console.error('API test error:', error);
    return false;
  }
}

export async function testTextGeneration(providerId: string, apiKey: string): Promise<string> {
  try {
    const result = await aiApi.generate({
      prompt: 'Generate a test response.',
      maxTokens: 50
    });
    return result.content;
  } catch (error) {
    throw new Error(error?.response?.data?.error || 'Generation error');
  }
}