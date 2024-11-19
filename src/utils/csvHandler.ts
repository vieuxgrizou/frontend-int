import { z } from 'zod';
import type { Persona } from '../types';
import { WRITING_STYLES, TONES } from './constants';
import { getRandomName } from './names';

const personaCSVSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  age: z.string().transform(val => parseInt(val)).pipe(z.number().min(18).max(100)).optional(),
  writingStyle: z.string().optional(),
  tone: z.string().optional(),
  languages: z.string().transform(val => val.split(',')).optional(),
  errorRate: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0).max(1)).optional()
});

export async function parseCSV(content: string): Promise<any[]> {
  // Parse CSV string manually
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',').map(v => v.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {} as any);
    });
}

export function validatePersonaCSV(data: any[]): Persona[] {
  return data.map((row) => {
    const validated = personaCSVSchema.parse(row);
    
    // Générer les valeurs manquantes
    const { firstName, lastName } = validated.firstName && validated.lastName 
      ? { firstName: validated.firstName, lastName: validated.lastName }
      : getRandomName(validated.languages?.[0] || 'en');
    
    const writingStyle = validated.writingStyle 
      ? WRITING_STYLES.find(s => s.name === validated.writingStyle) 
      : WRITING_STYLES[Math.floor(Math.random() * WRITING_STYLES.length)];

    const tone = validated.tone
      ? TONES.find(t => t.name === validated.tone)
      : TONES[Math.floor(Math.random() * TONES.length)];
    
    if (!writingStyle || !tone) {
      throw new Error('Style d\'écriture ou ton invalide');
    }
    
    return {
      id: crypto.randomUUID(),
      name: `${firstName} ${lastName}`,
      gender: validated.gender || (Math.random() > 0.5 ? 'male' : 'female'),
      age: validated.age || Math.floor(Math.random() * (65 - 18) + 18),
      writingStyle: writingStyle.name,
      writingStyleDescription: writingStyle.description,
      tone: tone.name,
      toneDescription: tone.description,
      languages: validated.languages || ['en'],
      errorRate: validated.errorRate || Math.random() * 0.1,
      topics: [],
      emoji: Math.random() > 0.5,
      useHashtags: Math.random() > 0.7,
      mentionOthers: Math.random() > 0.8,
      includeMedia: Math.random() > 0.9
    };
  });
}