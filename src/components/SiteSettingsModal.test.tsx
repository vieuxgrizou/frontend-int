import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SiteSettingsModal from './SiteSettingsModal';
import type { WordPressSite } from '../types';

describe('SiteSettingsModal', () => {
  const mockSite: WordPressSite = {
    id: '1',
    name: 'Test Site',
    url: 'https://example.com',
    applicationPassword: 'test123',
    aiProvider: 'openai',
    aiModel: 'gpt-4',
    apiKey: 'sk-test',
    autoGenerate: true,
    commentSettings: {
      mode: 'auto',
      frequency: {
        commentsPerDay: 5,
        minDelay: 30,
        maxDelay: 120
      },
      schedule: {
        startTime: '09:00',
        endTime: '17:00',
        daysOfWeek: [1, 2, 3, 4, 5]
      },
      language: ['fr'],
      replyProbability: 0.3,
      maxCommentsPerPost: 3,
      autoCreatePersonas: true,
      personaCreationRate: 2,
      aiSettings: {
        temperature: 0.7,
        maxTokens: 1000,
        presencePenalty: 0,
        frequencyPenalty: 0
      }
    },
    assignedPersonas: []
  };

  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    site: mockSite
  };

  it('renders modal with site information', () => {
    render(<SiteSettingsModal {...mockProps} />);
    
    expect(screen.getByLabelText(/nom du site/i)).toHaveValue(mockSite.name);
    expect(screen.getByLabelText(/url du site/i)).toHaveValue(mockSite.url);
  });

  it('handles form submission', async () => {
    render(<SiteSettingsModal {...mockProps} />);
    
    await userEvent.clear(screen.getByLabelText(/nom du site/i));
    await userEvent.type(screen.getByLabelText(/nom du site/i), 'New Site Name');
    
    fireEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(mockProps.onSave).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Site Name'
      }));
    });
  });

  it('switches between tabs correctly', () => {
    render(<SiteSettingsModal {...mockProps} />);
    
    // Vérifie que l'onglet "Informations de base" est actif par défaut
    expect(screen.getByText('Informations de base')).toHaveClass('border-indigo-500');
    
    // Change d'onglet
    fireEvent.click(screen.getByText('Configuration IA'));
    expect(screen.getByText('Configuration IA')).toHaveClass('border-indigo-500');
  });

  it('validates required fields', async () => {
    render(<SiteSettingsModal {...mockProps} />);
    
    await userEvent.clear(screen.getByLabelText(/nom du site/i));
    await userEvent.clear(screen.getByLabelText(/url du site/i));
    
    fireEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(mockProps.onSave).not.toHaveBeenCalled();
    });
  });
});