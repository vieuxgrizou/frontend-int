import { describe, it, expect } from 'vitest';
import { generateRandomPersona } from './personaGenerator';

describe('personaGenerator', () => {
  it('generates valid persona', () => {
    const persona = generateRandomPersona();
    
    expect(persona).toHaveProperty('id');
    expect(persona).toHaveProperty('name');
    expect(['male', 'female', 'other']).toContain(persona.gender);
    expect(persona.age).toBeGreaterThanOrEqual(18);
    expect(persona.age).toBeLessThanOrEqual(65);
    expect(persona.languages.length).toBeGreaterThanOrEqual(1);
  });

  it('generates unique personas', () => {
    const persona1 = generateRandomPersona();
    const persona2 = generateRandomPersona();
    
    expect(persona1.id).not.toBe(persona2.id);
    expect(persona1.name).not.toBe(persona2.name);
  });

  it('includes writing style and tone', () => {
    const persona = generateRandomPersona();
    
    expect(persona.writingStyle).toBeDefined();
    expect(persona.writingStyleDescription).toBeDefined();
    expect(persona.tone).toBeDefined();
    expect(persona.toneDescription).toBeDefined();
  });

  it('generates valid error rate', () => {
    const persona = generateRandomPersona();
    
    expect(persona.errorRate).toBeGreaterThanOrEqual(0);
    expect(persona.errorRate).toBeLessThanOrEqual(0.1);
  });
});