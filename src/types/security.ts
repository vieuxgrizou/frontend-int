export interface TwoFactorAuth {
  enabled: boolean;
  method: '2fa_app' | '2fa_sms' | '2fa_email';
  secret?: string;
  backupCodes: string[];
  lastVerified: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failure';
}

export interface DataProtection {
  gdprConsent: boolean;
  consentDate: string;
  marketingConsent: boolean;
  dataRetentionPeriod: number; // en jours
  dataExportRequests: DataExportRequest[];
  dataDeletionRequests: DataDeletionRequest[];
}

export interface DataExportRequest {
  id: string;
  userId: string;
  requestDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiryDate?: string;
}

export interface DataDeletionRequest {
  id: string;
  userId: string;
  requestDate: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  completionDate?: string;
  reason?: string;
}

export interface BackupConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retentionPeriod: number; // en jours
  lastBackup?: string;
  storageLocation: 's3' | 'gcs' | 'azure';
  encryptionEnabled: boolean;
}

export interface SecuritySettings {
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  passwordExpiryDays: number;
  maxLoginAttempts: number;
  sessionTimeout: number; // en minutes
  ipWhitelist: string[];
}