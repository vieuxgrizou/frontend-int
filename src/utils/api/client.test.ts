import { describe, it, expect, vi } from 'vitest';
import { apiClient } from './client';
import { auth } from '../../config/firebase';

vi.mock('../../config/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('test-token')
    }
  }
}));

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('adds auth token to requests', async () => {
    const mockResponse = { data: { test: true } };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    await apiClient.get('/test');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
  });

  it('handles unauthorized errors', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401
    });

    await expect(apiClient.get('/test')).rejects.toThrow();
  });
});