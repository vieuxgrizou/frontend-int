import { describe, it, expect, vi } from 'vitest';
import { syncComments, validateConnection } from '../wordpress/sync';
import type { WordPressSite } from '../../types';

describe('WordPress Synchronization', () => {
  const mockSite: WordPressSite = {
    id: '1',
    name: 'Test Site',
    url: 'https://example.com',
    applicationPassword: 'test:pass',
    // ... autres propriétés
  } as WordPressSite;

  it('validates WordPress connection', async () => {
    const result = await validateConnection(mockSite);
    expect(result.success).toBe(true);
    expect(result.siteInfo).toBeDefined();
  });

  it('syncs comments successfully', async () => {
    const comments = [
      { content: 'Test comment 1', postId: '123' },
      { content: 'Test comment 2', postId: '456' }
    ];

    const result = await syncComments(mockSite, comments);
    expect(result.success).toBe(true);
    expect(result.syncedCount).toBe(comments.length);
  });

  it('handles WordPress API errors gracefully', async () => {
    const invalidSite = {
      ...mockSite,
      applicationPassword: 'invalid'
    };

    await expect(validateConnection(invalidSite))
      .rejects.toThrow(/Authentication failed/);
  });

  it('respects WordPress API rate limits', async () => {
    const comments = Array(20).fill(null).map((_, i) => ({
      content: `Comment ${i}`,
      postId: `${i}`
    }));

    const result = await syncComments(mockSite, comments);
    expect(result.success).toBe(true);
    expect(result.rateLimited).toBe(false);
  });
});