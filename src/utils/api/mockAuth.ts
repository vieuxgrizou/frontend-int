import { User, LoginCredentials, RegisterCredentials } from '../../types/auth';

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
    settings: {
      language: 'en',
      timezone: 'UTC',
      emailNotifications: true,
      twoFactorEnabled: false,
      darkMode: false,
      subscription: {
        plan: 'pro',
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  }
];

export async function mockLogin(credentials: LoginCredentials): Promise<User> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // For demo purposes, accept any email/password combination
  const user = mockUsers.find(u => u.email === credentials.email) || {
    ...mockUsers[0],
    email: credentials.email,
    name: credentials.email.split('@')[0]
  };

  return user;
}

export async function mockRegister(data: RegisterCredentials): Promise<User> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const newUser: User = {
    id: crypto.randomUUID(),
    email: data.email,
    name: data.name,
    createdAt: new Date().toISOString(),
    settings: {
      language: 'en',
      timezone: 'UTC',
      emailNotifications: true,
      twoFactorEnabled: false,
      darkMode: false,
      subscription: {
        plan: 'basic',
        status: 'active',
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  };

  mockUsers.push(newUser);
  return newUser;
}