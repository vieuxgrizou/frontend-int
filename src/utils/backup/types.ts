export interface BackupJob {
  id: string;
  type: 'auto' | 'manual';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  size?: number;
  error?: string;
  items?: {
    sites: number;
    personas: number;
    templates: number;
    comments: number;
  };
}

export interface BackupSettings {
  autoBackup: boolean;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  time: string;
  retentionDays: number;
  includeComments: boolean;
  compressBackups: boolean;
}

export interface BackupData {
  version: string;
  timestamp: string;
  settings: BackupSettings;
  data: {
    sites: any[];
    personas: any[];
    templates: any[];
    comments?: any[];
  };
}