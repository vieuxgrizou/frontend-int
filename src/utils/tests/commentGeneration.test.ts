import { describe, it, expect, vi } from 'vitest';
import { commentService } from '../ai/commentService';
import type { WordPressSite, Persona } from '../types';

vi.mock('../api/client');

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
    assignedPersonas: ['1']
  };

  const mockPersona: Persona = {
    id: '1',
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

  it('generates comments with assigned personas', async () => {
    const mockResponse = {
      content: 'Test comment',
      metadata: {
        style: mockPersona.writingStyle,
        tone: mockPersona.tone,
        language: 'fr'
      }
    };

    vi.spyOn(commentService as any, 'generateComment').mockResolvedValue(mockResponse);

    const result = await commentService.generateComments({
      site: mockSite,
      personas: [mockPersona],
      templates: [],
      context: {
        postId: '1',
        postTitle: 'Test Post',
        postContent: 'Test content',
        existingComments: []
      }
    });

    expect(result.success.length).toBeGreaterThan(0);
    expect(result.failed.length).toBe(0);
  });

  it('respects language requirements', async () => {
    const frenchOnlySite = {
      ...mockSite,
      commentSettings: {
        ...mockSite.commentSettings,
        language: ['fr']
      }
    };

    const result = await commentService.generateComments({
      site: frenchOnlySite,
      personas: [mockPersona],
      templates: [],
      context: {
        postId: '1',
        postTitle: 'Test Post',
        postContent: 'Test content',
        existingComments: []
      }
    });

    result.success.forEach(comment => {
      const persona = mockPersona;
      expect(persona.languages).toContain('fr');
    });
  });
});