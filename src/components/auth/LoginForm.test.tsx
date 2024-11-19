import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../utils/tests/test-utils';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';
import { useAuth } from '../../utils/auth/useAuth';

vi.mock('../../utils/auth/useAuth');

describe('LoginForm', () => {
  it('renders login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    const mockLogin = vi.fn().mockResolvedValue(true);
    (useAuth as any).mockReturnValue({ login: mockLogin });

    render(<LoginForm />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/mot de passe/i), 'password');
    
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      });
    });
  });

  it('displays error message when login fails', async () => {
    const mockLogin = vi.fn().mockResolvedValue(false);
    (useAuth as any).mockReturnValue({ 
      login: mockLogin,
      error: 'Invalid credentials'
    });

    render(<LoginForm />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await userEvent.type(screen.getByLabelText(/mot de passe/i), 'wrongpass');
    
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});