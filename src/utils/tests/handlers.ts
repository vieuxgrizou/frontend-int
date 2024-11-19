import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth handlers
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        },
        token: 'fake-jwt-token'
      });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  // API handlers
  http.get('/test', () => {
    return HttpResponse.json({ test: true });
  }),

  http.post('/ai/generate', () => {
    return HttpResponse.json({
      content: 'Test generated content',
      success: true
    });
  })
];