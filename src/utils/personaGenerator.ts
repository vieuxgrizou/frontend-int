import { WRITING_STYLES, TONES } from './constants';
import { getRandomName } from './names';
import type { Persona } from '../types';

export function generateRandomPersona(languages: string[] = ['fr']): Persona {
  // Utilise la première langue comme culture principale pour le nom
  const primaryLanguage = languages[0];
  const { firstName, lastName } = getRandomName(primaryLanguage);
  
  const randomStyle = WRITING_STYLES[Math.floor(Math.random() * WRITING_STYLES.length)];
  const randomTone = TONES[Math.floor(Math.random() * TONES.length)];
  
  return {
    id: crypto.randomUUID(),
    name: `${firstName} ${lastName}`,
    gender: Math.random() > 0.5 ? 'male' : 'female',
    age: Math.floor(Math.random() * (65 - 18) + 18),
    writingStyle: randomStyle.name,
    writingStyleDescription: randomStyle.description,
    tone: randomTone.name,
    toneDescription: randomTone.description,
    languages: [...languages], // Utilise toutes les langues sélectionnées
    errorRate: Math.random() * 0.1,
    topics: [],
    emoji: Math.random() > 0.5,
    useHashtags: Math.random() > 0.7,
    mentionOthers: Math.random() > 0.8,
    includeMedia: Math.random() > 0.9
  };
}