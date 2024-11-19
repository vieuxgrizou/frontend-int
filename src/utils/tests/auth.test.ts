import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../auth/useAuth';
import { authApi } from '../api/routes';
import { apiClient } from '../api/client';

vi.mock('../api/client');

describe('Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('registers a new user successfully', async () => {
    const mockResponse = { data: { userId: 'test-uid' } };
    (apiClient.post as any).mockResolvedValueOnce(mockResponse);

    const result = await authApi.register({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });

    expect(result).toEqual(mockResponse.data);
    expect(apiClient.post).toHaveBeenCalledWith('/api/auth/register', {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });
  });

  it('handles registration errors', async () => {
    (apiClient.post as any).mockRejectedValueOnce(new Error('Email already exists'));

    await expect(
      authApi.register({
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User'
      })
    ).rejects.toThrow();
  });

  it('logs in user successfully', async () => {
    const mockResponse = { data: { token: 'test-token' } };
    (apiClient.post as any).mockResolvedValueOnce(mockResponse);

    const result = await authApi.login({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(result).toEqual(mockResponse.data);
    expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('handles login errors', async () => {
    (apiClient.post as any).mockRejectedValueOnce(new Error('Invalid credentials'));

    await expect(
      authApi.login({
        email: 'wrong@example.com',
        password: 'wrongpass'
      })
    ).rejects.toThrow();
  });

  it('maintains authentication state', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('test@example.com', 'password123');
    });

    expect(result.current.isAuthenticated()).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated()).toBe(false);
  });
});