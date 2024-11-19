import React from 'react';
import DataPrivacySettings from '../components/DataPrivacySettings';
import BackupManager from '../components/BackupManager';
import { useAuth } from '../utils/auth/useAuth';

export default function Security() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="container-card">
        <DataPrivacySettings
          userId={user?.id || ''}
          onDataDeleted={() => {/* Handle account deletion */}}
        />
      </div>

      <div className="container-card">
        <BackupManager />
      </div>
    </div>
  );
}