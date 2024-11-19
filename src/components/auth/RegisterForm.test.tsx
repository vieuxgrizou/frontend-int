import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../utils/auth/useAuth';

vi.mock('../../utils/auth/useAuth');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    (useAuth as any).mockReturnValue({
      register: vi.fn().mockResolvedValue(true),
      error: null
    });
  });

  it('renders registration form correctly', () => {
    render(<RegisterForm />);
    
    expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument();
  });

  it('validates matching passwords', async () => {
    const register = vi.fn().mockResolvedValue(true);
    (useAuth as any).mockReturnValue({ register, error: null });

    render(<RegisterForm />);
    
    await userEvent.type(screen.getByLabelText(/nom complet/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/mot de passe/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirmer le mot de passe/i), 'password123');
    
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
    });
  });

  it('displays error message when registration fails', async () => {
    const errorMessage = 'Registration failed';
    (useAuth as any).mockReturnValue({
      register: vi.fn().mockResolvedValue(false),
      error: errorMessage
    });

    render(<RegisterForm />);
    
    await userEvent.type(screen.getByLabelText(/nom complet/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/mot de passe/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirmer le mot de passe/i), 'password123');
    
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});