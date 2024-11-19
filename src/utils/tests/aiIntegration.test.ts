import { describe, it, expect, vi } from 'vitest';
import { generateComment, analyzeComment } from '../ai/commentGeneration';
import type { WordPressSite, Persona } from '../../types';

describe('AI Integration', () => {
  const mockSite: WordPressSite = {
    id: '1',
    name: 'Test Site',
    url: 'https://example.com',
    aiProvider: 'openai',
    aiModel: 'gpt-4',
    apiKey: 'test-key',
    // ... autres propriétés
  } as WordPressSite;

  const mockPersona: Persona = {
    id: '1',
    name: 'Test Persona',
    writingStyle: 'Informel',
    tone: 'Amical',
    // ... autres propriétés
  } as Persona;

  it('generates comment with correct style and tone', async () => {
    const context = {
      postTitle: 'Test Post',
      postContent: 'This is a test post content.',
      existingComments: []
    };

    const comment = await generateComment(mockSite, mockPersona, context);

    expect(comment.content).toBeDefined();
    expect(comment.content.length).toBeGreaterThan(0);
    // Vérifier que le style et le ton correspondent
    expect(comment.metadata.style).toBe(mockPersona.writingStyle);
    expect(comment.metadata.tone).toBe(mockPersona.tone);
  });

  it('analyzes comment sentiment and engagement potential', async () => {
    const comment = 'This is a great article! Very informative.';
    
    const analysis = await analyzeComment(comment, mockSite);

    expect(analysis.sentiment).toBeDefined();
    expect(analysis.engagementScore).toBeGreaterThanOrEqual(0);
    expect(analysis.engagementScore).toBeLessThanOrEqual(1);
  });

  it('handles API rate limits', async () => {
    const promises = Array(10).fill(null).map(() => 
      generateComment(mockSite, mockPersona, {
        postTitle: 'Test',
        postContent: 'Content',
        existingComments: []
      })
    );

    const results = await Promise.allSettled(promises);
    const fulfilled = results.filter(r => r.status === 'fulfilled');
    
    expect(fulfilled.length).toBeGreaterThan(0);
  });
});