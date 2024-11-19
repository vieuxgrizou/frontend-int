import { describe, it, expect, vi } from 'vitest';
import { apiClient } from '../api/client';
import { sitesApi, aiApi, authApi } from '../api/routes';

vi.mock('../api/client');

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('adds auth token to requests', async () => {
    const mockToken = 'test-token';
    localStorage.setItem('auth_token', mockToken);

    await apiClient.get('/test');

    expect(apiClient.get).toHaveBeenCalledWith('/test');
    expect(apiClient.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
  });

  it('adds API key to requests when available', async () => {
    const mockApiKey = 'sk-test-key';
    localStorage.setItem('openai_api_key', mockApiKey);

    await aiApi.generate({
      provider: 'openai',
      prompt: 'test'
    });

    expect(apiClient.post).toHaveBeenCalledWith('/api/ai/generate', {
      provider: 'openai',
      prompt: 'test'
    });
    expect(apiClient.defaults.headers.common['x-api-key']).toBe(mockApiKey);
  });

  it('handles API errors correctly', async () => {
    (apiClient.get as any).mockRejectedValueOnce({
      response: {
        status: 401,
        data: { error: 'Unauthorized' }
      }
    });

    await expect(sitesApi.list()).rejects.toThrow('Unauthorized');
  });

  it('handles rate limiting', async () => {
    (apiClient.post as any).mockRejectedValueOnce({
      response: {
        status: 429,
        data: { error: 'Too many requests' }
      }
    });

    await expect(
      aiApi.generate({
        provider: 'openai',
        prompt: 'test'
      })
    ).rejects.toThrow('Too many requests');
  });

  it('refreshes auth token on 401 errors', async () => {
    const mockRefresh = vi.fn().mockResolvedValueOnce({ token: 'new-token' });
    (authApi as any).refreshToken = mockRefresh;

    (apiClient.get as any)
      .mockRejectedValueOnce({
        response: { status: 401 }
      })
      .mockResolvedValueOnce({ data: 'success' });

    await apiClient.get('/test');

    expect(mockRefresh).toHaveBeenCalled();
    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});