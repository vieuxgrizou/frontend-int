import { vi } from 'vitest';

export const mockAxiosResponse = {
  data: {},
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
};

export const mockAxios = {
  get: vi.fn().mockResolvedValue(mockAxiosResponse),
  post: vi.fn().mockResolvedValue(mockAxiosResponse),
  put: vi.fn().mockResolvedValue(mockAxiosResponse),
  delete: vi.fn().mockResolvedValue(mockAxiosResponse),
  create: vi.fn().mockReturnValue({
    get: vi.fn().mockResolvedValue(mockAxiosResponse),
    post: vi.fn().mockResolvedValue(mockAxiosResponse),
    put: vi.fn().mockResolvedValue(mockAxiosResponse),
    delete: vi.fn().mockResolvedValue(mockAxiosResponse),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() }
    }
  })
};

vi.mock('axios', () => mockAxios);