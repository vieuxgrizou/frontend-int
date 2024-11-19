import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { auth } from '../../config/firebase';
import { mockAuth } from '../tests/mocks/firebase';

vi.mock('../../config/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn()
  }
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('handles successful login', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com'
    };

    (auth.signInWithEmailAndPassword as any).mockResolvedValueOnce({
      user: mockUser
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.login('test@example.com', 'password');
      expect(success).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('handles login failure', async () => {
    (auth.signInWithEmailAndPassword as any).mockRejectedValueOnce(
      new Error('Invalid credentials')
    );

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.login('test@example.com', 'wrong');
      expect(success).toBe(false);
      expect(result.current.error).toBeDefined();
    });
  });

  it('handles logout', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
      expect(result.current.user).toBeNull();
      expect(auth.signOut).toHaveBeenCalled();
    });
  });
});