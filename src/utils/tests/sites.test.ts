import { describe, it, expect, vi } from 'vitest';
import { sitesApi } from '../api/sites';
import { apiClient } from '../api/client';
import { server } from './setup';
import { http, HttpResponse } from 'msw';

vi.mock('../api/client');

describe('Sites API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts a comment successfully', async () => {
    const mockComment = {
      siteId: 'abc123',
      postId: 456,
      content: 'Super article !',
      authorName: 'Jean Dupont'
    };

    const mockResponse = {
      id: 789,
      post: 456,
      content: {
        rendered: '<p>Super article !</p>',
        raw: 'Super article !'
      },
      author_name: 'Jean Dupont',
      status: 'publish',
      parent: 0
    };

    server.use(
      http.post('/api/sites/comment', async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({
          ...mockComment,
          parentId: 0
        });
        return HttpResponse.json(mockResponse, { status: 201 });
      })
    );

    const response = await sitesApi.postComment(mockComment);
    expect(response).toEqual(mockResponse);
  });

  it('handles comment posting errors', async () => {
    server.use(
      http.post('/api/sites/comment', () => {
        return new HttpResponse(
          JSON.stringify({ error: 'Failed to post comment' }), 
          { status: 400 }
        );
      })
    );

    await expect(sitesApi.postComment({
      siteId: 'abc123',
      postId: 456,
      content: 'Test',
      authorName: 'Test'
    })).rejects.toThrow();
  });
});