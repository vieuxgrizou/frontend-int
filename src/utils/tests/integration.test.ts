import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { apiClient } from '../api/client';
import { authApi, aiApi, sitesApi } from '../api/routes';
import ApiKeyTester from '../../components/ApiKeyTester';
import LoginForm from '../../components/auth/LoginForm';

// Mocks
vi.mock('../auth/useAuth');
vi.mock('../api/client');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0
    }
  }
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </QueryClientProvider>
);

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Authentication', () => {
    it('handles login flow correctly', async () => {
      const mockLogin = vi.fn().mockResolvedValue(true);
      (useAuth as any).mockReturnValue({ login: mockLogin });
      (apiClient.post as any).mockResolvedValueOnce({ data: { success: true } });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      // Remplir le formulaire
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/mot de passe/i), {
        target: { value: 'password123' }
      });

      // Soumettre le formulaire
      fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', {
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });

    it('handles login errors correctly', async () => {
      (apiClient.post as any).mockRejectedValueOnce(new Error('Invalid credentials'));

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/mot de passe/i), {
        target: { value: 'wrongpass' }
      });

      fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('API Key Testing', () => {
    it('validates OpenAI API key correctly', async () => {
      const mockOnTest = vi.fn();
      (apiClient.post as any).mockResolvedValueOnce({ data: { success: true } });

      render(
        <TestWrapper>
          <ApiKeyTester providerId="openai" onTest={mockOnTest} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /tester la clé/i }));

      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledWith('/api/ai/test-key', {
          provider: 'openai'
        });
        expect(mockOnTest).toHaveBeenCalledWith(true);
      });
    });

    it('handles invalid API key format', async () => {
      const mockOnTest = vi.fn();
      (apiClient.post as any).mockRejectedValueOnce({
        response: {
          data: { error: 'Invalid API key format' }
        }
      });

      render(
        <TestWrapper>
          <ApiKeyTester providerId="openai" onTest={mockOnTest} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /tester la clé/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid api key format/i)).toBeInTheDocument();
        expect(mockOnTest).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('WordPress Integration', () => {
    it('validates WordPress connection successfully', async () => {
      const mockValidateResponse = {
        success: true,
        siteInfo: {
          name: 'Test Site',
          url: 'https://example.com'
        }
      };

      (apiClient.post as any).mockResolvedValueOnce({ data: mockValidateResponse });

      const result = await sitesApi.validate(
        'https://example.com',
        'username:password'
      );

      expect(result).toEqual(mockValidateResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/api/sites/validate', {
        url: 'https://example.com',
        applicationPassword: 'username:password'
      });
    });

    it('handles WordPress connection errors', async () => {
      (apiClient.post as any).mockRejectedValueOnce({
        response: {
          data: { error: 'Invalid WordPress credentials' }
        }
      });

      await expect(
        sitesApi.validate('https://example.com', 'invalid:password')
      ).rejects.toThrow();
    });
  });

  describe('AI Integration', () => {
    it('generates text successfully', async () => {
      const mockResponse = {
        content: 'Generated text',
        metadata: {
          model: 'gpt-4',
          tokens: 50
        }
      };

      (apiClient.post as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await aiApi.generate({
        provider: 'openai',
        prompt: 'Test prompt',
        maxTokens: 50
      });

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/api/ai/generate', {
        provider: 'openai',
        prompt: 'Test prompt',
        maxTokens: 50
      });
    });

    it('handles AI generation errors', async () => {
      (apiClient.post as any).mockRejectedValueOnce({
        response: {
          data: { error: 'API rate limit exceeded' }
        }
      });

      await expect(
        aiApi.generate({
          provider: 'openai',
          prompt: 'Test prompt'
        })
      ).rejects.toThrow();
    });
  });
});