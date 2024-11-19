import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW
export const server = setupServer(...handlers);

beforeAll(() => {
  // Start MSW server
  server.listen({ onUnhandledRequest: 'error' });

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  // Mock fetch
  global.fetch = vi.fn();

  // Mock console methods to reduce noise
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// Configuration QueryClient globale pour les tests
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0
    },
    mutations: {
      retry: false
    }
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {}
  }
});