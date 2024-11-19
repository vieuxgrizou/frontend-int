import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from './useTranslation';
import { useStore } from '../store';

vi.mock('../store');

describe('useTranslation', () => {
  beforeEach(() => {
    (useStore as any).mockReturnValue({
      language: 'fr'
    });
  });

  it('returns translation for existing key', () => {
    const { result } = renderHook(() => useTranslation());
    
    expect(result.current.t('common.save')).toBe('Sauvegarder');
    expect(result.current.t('common.cancel')).toBe('Annuler');
  });

  it('returns key for non-existing translation', () => {
    const { result } = renderHook(() => useTranslation());
    
    expect(result.current.t('non.existing.key')).toBe('non.existing.key');
  });

  it('handles parameters in translations', () => {
    const { result } = renderHook(() => useTranslation());
    
    expect(result.current.t('welcome.user', { name: 'John' }))
      .toContain('John');
  });

  it('falls back to English for unsupported language', () => {
    (useStore as any).mockReturnValue({
      language: 'xx'
    });

    const { result } = renderHook(() => useTranslation());
    
    expect(result.current.t('common.save')).toBe('Save');
  });
});