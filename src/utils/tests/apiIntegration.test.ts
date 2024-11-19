import { describe, it, expect, vi } from 'vitest';
import { apiClient } from '../api/client';
import { mockAuth } from './mocks/firebase';

vi.mock('../api/client');

describe('API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds auth token to requests', async () => {
    const mockResponse = { data: { test: true } };
    (apiClient.get as any).mockResolvedValueOnce(mockResponse);

    const response = await apiClient.get('/test');
    
    expect(response).toEqual(mockResponse);
    expect(apiClient.get).toHaveBeenCalledWith('/test');
  });

  it('handles API errors gracefully', async () => {
    const mockError = new Error('API Error');
    (apiClient.get as any).mockRejectedValueOnce(mockError);

    await expect(apiClient.get('/test')).rejects.toThrow('API Error');
  });

  it('includes OpenAI API key when available', async () => {
    localStorage.setItem('openai_api_key', 'test-key');
    const mockResponse = { data: { test: true } };
    (apiClient.post as any).mockResolvedValueOnce(mockResponse);

    await apiClient.post('/ai/generate', { prompt: 'test' });

    expect(apiClient.post).toHaveBeenCalledWith(
      '/ai/generate',
      { prompt: 'test' },
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-api-key': 'test-key'
        })
      })
    );
  });
});