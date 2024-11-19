import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../utils/i18n/useLanguage';

vi.mock('../utils/i18n/useLanguage');

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    (useLanguage as any).mockReturnValue({
      language: 'fr',
      setLanguage: vi.fn()
    });
  });

  it('renders current language flag', () => {
    render(<LanguageSwitcher />);
    const flagImage = screen.getByRole('img');
    expect(flagImage).toHaveAttribute('src', expect.stringContaining('fr.png'));
  });

  it('opens language menu on click', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Vérifie que le menu est ouvert avec plusieurs drapeaux
    const flags = screen.getAllByRole('img');
    expect(flags.length).toBeGreaterThan(1);
  });

  it('changes language when selecting a new one', () => {
    const setLanguage = vi.fn();
    (useLanguage as any).mockReturnValue({
      language: 'fr',
      setLanguage
    });

    render(<LanguageSwitcher />);
    
    // Ouvre le menu
    fireEvent.click(screen.getByRole('button'));
    
    // Sélectionne l'anglais
    const englishButton = screen.getAllByRole('button')[1];
    fireEvent.click(englishButton);

    expect(setLanguage).toHaveBeenCalled();
  });
});