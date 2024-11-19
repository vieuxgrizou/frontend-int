import { BackupJob, BackupData, BackupSettings } from './types';
import { compress, decompress } from './compression';
import { encrypt, decrypt } from './encryption';
import { validateBackup } from './validation';
import { AppError } from '../errorHandling';

export async function createBackup(settings: BackupSettings): Promise<BackupJob> {
  const backupJob: BackupJob = {
    id: crypto.randomUUID(),
    type: 'manual',
    status: 'running',
    startTime: new Date().toISOString(),
    items: {
      sites: 0,
      personas: 0,
      templates: 0,
      comments: 0
    }
  };

  try {
    // Collecter les données
    const data: BackupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      settings,
      data: {
        sites: [], // TODO: Get from store
        personas: [], // TODO: Get from store
        templates: [], // TODO: Get from store
        comments: settings.includeComments ? [] : undefined
      }
    };

    // Mettre à jour les statistiques
    backupJob.items = {
      sites: data.data.sites.length,
      personas: data.data.personas.length,
      templates: data.data.templates.length,
      comments: data.data.comments?.length || 0
    };

    // Compresser si nécessaire
    let processedData = JSON.stringify(data);
    if (settings.compressBackups) {
      processedData = await compress(processedData);
    }

    // Chiffrer les données
    const encryptedData = await encrypt(processedData);

    // Calculer la taille
    backupJob.size = new Blob([encryptedData]).size;

    // Sauvegarder
    localStorage.setItem(`backup_${backupJob.id}`, encryptedData);

    backupJob.status = 'completed';
    backupJob.endTime = new Date().toISOString();

    return backupJob;
  } catch (error) {
    console.error('Backup failed:', error);
    backupJob.status = 'failed';
    backupJob.error = error.message;
    throw new AppError('Failed to create backup', 'BACKUP_FAILED', 'error', error);
  }
}

export async function restoreBackup(backupId: string): Promise<void> {
  try {
    // Récupérer la sauvegarde
    const encryptedData = localStorage.getItem(`backup_${backupId}`);
    if (!encryptedData) {
      throw new Error('Backup not found');
    }

    // Déchiffrer
    const decryptedData = await decrypt(encryptedData);

    // Décompresser si nécessaire
    let dataStr = decryptedData;
    if (dataStr.startsWith('compressed:')) {
      dataStr = await decompress(dataStr.slice(11));
    }

    // Parser et valider
    const data: BackupData = JSON.parse(dataStr);
    validateBackup(data);

    // Restaurer les données
    // TODO: Implement restore logic

  } catch (error) {
    console.error('Restore failed:', error);
    throw new AppError('Failed to restore backup', 'RESTORE_FAILED', 'error', error);
  }
}

export function getBackupHistory(): BackupJob[] {
  const backups: BackupJob[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('backup_')) {
      const id = key.slice(7);
      const meta = localStorage.getItem(`backup_meta_${id}`);
      if (meta) {
        backups.push(JSON.parse(meta));
      }
    }
  }
  return backups.sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
}

export function scheduleBackups(settings: BackupSettings) {
  if (!settings.autoBackup) return;

  const [hours, minutes] = settings.time.split(':').map(Number);
  
  // Calculer le prochain horaire
  const now = new Date();
  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  // Planifier la prochaine sauvegarde
  const delay = next.getTime() - now.getTime();
  setTimeout(() => {
    createBackup(settings).catch(console.error);
    scheduleBackups(settings); // Re-planifier
  }, delay);
}