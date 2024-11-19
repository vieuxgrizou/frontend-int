import { describe, it, expect, vi } from 'vitest';
import { auth } from '../../config/firebase';
import { mockAuth } from './mocks/firebase';

// Mock Firebase
vi.mock('../../config/firebase', () => ({
  auth: mockAuth
}));

describe('Authentication Function Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.currentUser = null;
  });

  it('should successfully login with valid credentials', async () => {
    const mockUser = {
      email: 'test@example.com',
      uid: 'test-uid',
      getIdToken: vi.fn().mockResolvedValue('test-token')
    };

    mockAuth.signInWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUser
    });

    const userCredential = await auth.signInWithEmailAndPassword(
      auth,
      'test@example.com',
      'password123'
    );

    expect(userCredential.user).toBeDefined();
    expect(userCredential.user.email).toBe('test@example.com');
    expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'test@example.com',
      'password123'
    );

    // Vérifier que getIdToken est appelé
    const token = await userCredential.user.getIdToken();
    expect(token).toBe('test-token');
  });

  it('should fail login with invalid credentials', async () => {
    mockAuth.signInWithEmailAndPassword.mockRejectedValueOnce(
      new Error('auth/invalid-credentials')
    );

    await expect(
      auth.signInWithEmailAndPassword(auth, 'test@example.com', 'wrongpassword')
    ).rejects.toThrow('auth/invalid-credentials');
  });
});