import { describe, it, expect } from 'vitest';
import { generateComment } from './commentGeneration';
import type { WordPressSite, Persona } from '../types';

describe('Comment Generation', () => {
  const mockSite: WordPressSite = {
    id: '1',
    name: 'Test Site',
    url: 'https://example.com',
    username: 'admin',
    applicationPassword: 'test:pass',
    aiProvider: 'openai',
    aiModel: 'gpt-4',
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

  const mockPersona: Persona = {
    id: 'test',
    name: 'Test Persona',
    gender: 'other',
    age: 30,
    writingStyle: 'Informel',
    writingStyleDescription: 'Style décontracté',
    tone: 'Amical',
    toneDescription: 'Ton sympathique',
    languages: ['fr'],
    errorRate: 0,
    topics: [],
    emoji: true,
    useHashtags: false,
    mentionOthers: false,
    includeMedia: false
  };

  it('generates a comment successfully', async () => {
    const context = {
      postTitle: 'Test Article',
      postContent: 'This is a test article content.',
      existingComments: []
    };

    const result = await generateComment(mockSite, mockPersona, context);

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.metadata).toEqual({
      style: mockPersona.writingStyle,
      tone: mockPersona.tone,
      language: mockPersona.languages[0],
      timestamp: expect.any(String),
      isReply: undefined,
      templateId: undefined
    });
  });

  it('generates a reply comment', async () => {
    const context = {
      postTitle: 'Test Article',
      postContent: 'This is a test article content.',
      existingComments: [],
      isReply: true,
      parentComment: 'This is a parent comment'
    };

    const result = await generateComment(mockSite, mockPersona, context);

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.metadata.isReply).toBe(true);
  });

  it('handles errors gracefully', async () => {
    const invalidSite = { ...mockSite, aiProvider: 'invalid' };

    await expect(generateComment(invalidSite, mockPersona, {
      postTitle: 'Test',
      postContent: 'Test',
      existingComments: []
    })).rejects.toThrow('Fournisseur d\'IA non trouvé');
  });
});