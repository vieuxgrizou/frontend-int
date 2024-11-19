import { z } from 'zod';
import type { BackupData } from './types';

// Schéma de validation pour les sauvegardes
const backupSchema = z.object({
  version: z.string(),
  timestamp: z.string().datetime(),
  settings: z.object({
    autoBackup: z.boolean(),
    frequency: z.enum(['hourly', 'daily', 'weekly', 'monthly']),
    time: z.string().regex(/^\d{2}:\d{2}$/),
    retentionDays: z.number().int().positive(),
    includeComments: z.boolean(),
    compressBackups: z.boolean()
  }),
  data: z.object({
    sites: z.array(z.any()),
    personas: z.array(z.any()),
    templates: z.array(z.any()),
    comments: z.array(z.any()).optional()
  })
});

export function validateBackup(data: BackupData): void {
  try {
    backupSchema.parse(data);
  } catch (error) {
    throw new Error(`Invalid backup format: ${error.message}`);
  }
}