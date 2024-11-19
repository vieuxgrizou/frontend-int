import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  Users, 
  Plug, 
  Shield, 
  Key,
  AlertTriangle
} from 'lucide-react';
import Profile from './Profile';
import Team from './Team';
import Integrations from './Integrations';
import Security from './Security';
import ApiSettings from './ApiSettings';
import ErrorLogs from './ErrorLogs';
import { useTranslation } from '../utils/i18n/useTranslation';

export default function Settings() {
  const { t } = useTranslation();
  const settingsTabs = [
    { path: 'profile', icon: SettingsIcon, label: t('nav.profile') },
    { path: 'team', icon: Users, label: t('nav.team') },
    { path: 'integrations', icon: Plug, label: t('nav.integrations') },
    { path: 'security', icon: Shield, label: t('nav.security') },
    { path: 'api', icon: Key, label: t('nav.api') },
    { path: 'logs', icon: AlertTriangle, label: 'Journaux d\'erreurs' }
  ];

  return (
    <div className="space-y-6">
      <div className="container-card">
        <div className="px-4 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-primary">
              {t('nav.settings')}
            </h1>
          </div>
          <div className="border-b border-gray-200 dark:border-dark">
            <nav className="-mb-px flex space-x-8">
              {settingsTabs.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                      isActive
                        ? 'border-primary-500 text-primary-600 dark:text-primary-500'
                        : 'border-transparent text-gray-500 dark:text-dark-secondary hover:text-gray-700 dark:hover:text-dark-primary hover:border-gray-300 dark:hover:border-dark'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="team" element={<Team />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="security" element={<Security />} />
          <Route path="api" element={<ApiSettings />} />
          <Route path="logs" element={<ErrorLogs />} />
        </Routes>
      </div>
    </div>
  );
}