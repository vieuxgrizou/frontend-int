import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApiKeys } from '../store/apiKeys';

describe('API Keys Store', () => {
  beforeEach(() => {
    // Nettoie le localStorage avant chaque test
    localStorage.clear();
  });

  it('stores and retrieves API keys', () => {
    const { result } = renderHook(() => useApiKeys());

    act(() => {
      result.current.setApiKey('openai', 'test-key');
    });

    expect(result.current.getApiKey('openai')).toBe('test-key');
  });

  it('clears API keys', () => {
    const { result } = renderHook(() => useApiKeys());

    act(() => {
      result.current.setApiKey('openai', 'test-key');
      result.current.clearApiKey('openai');
    });

    expect(result.current.getApiKey('openai')).toBeNull();
  });

  it('persists API keys across reloads', () => {
    const { result, rerender } = renderHook(() => useApiKeys());

    act(() => {
      result.current.setApiKey('openai', 'test-key');
    });

    // Simule un rechargement
    rerender();

    expect(result.current.getApiKey('openai')).toBe('test-key');
  });

  it('handles multiple providers', () => {
    const { result } = renderHook(() => useApiKeys());

    act(() => {
      result.current.setApiKey('openai', 'openai-key');
      result.current.setApiKey('anthropic', 'anthropic-key');
    });

    expect(result.current.getApiKey('openai')).toBe('openai-key');
    expect(result.current.getApiKey('anthropic')).toBe('anthropic-key');
  });
});