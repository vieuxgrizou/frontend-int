import React from 'react';
import { Clock } from 'lucide-react';
import type { TimeZoneConfig } from '../types/scheduling';

interface TimeZoneSettingsProps {
  config: TimeZoneConfig;
  onChange: (config: TimeZoneConfig) => void;
}

export default function TimeZoneSettings({ config, onChange }: TimeZoneSettingsProps) {
  const timeZones = Intl.supportedValuesOf('timeZone');

  const handleDayToggle = (day: number) => {
    const newDays = config.businessHours.daysOfWeek.includes(day)
      ? config.businessHours.daysOfWeek.filter(d => d !== day)
      : [...config.businessHours.daysOfWeek, day].sort();

    onChange({
      ...config,
      businessHours: {
        ...config.businessHours,
        daysOfWeek: newDays
      }
    });
  };

  const addBlackoutPeriod = () => {
    onChange({
      ...config,
      blackoutPeriods: [
        ...config.blackoutPeriods,
        {
          start: new Date().toISOString(),
          end: new Date().toISOString(),
          reason: ''
        }
      ]
    });
  };

  const updateBlackoutPeriod = (index: number, updates: Partial<typeof config.blackoutPeriods[0]>) => {
    const newPeriods = [...config.blackoutPeriods];
    newPeriods[index] = { ...newPeriods[index], ...updates };
    onChange({
      ...config,
      blackoutPeriods: newPeriods
    });
  };

  const removeBlackoutPeriod = (index: number) => {
    onChange({
      ...config,
      blackoutPeriods: config.blackoutPeriods.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Configuration du fuseau horaire</h3>
        <p className="mt-1 text-sm text-gray-500">
          Définissez les paramètres horaires pour la planification des commentaires
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fuseau horaire
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Clock className="h-4 w-4" />
            </span>
            <select
              value={config.timeZone}
              onChange={(e) => onChange({ ...config, timeZone: e.target.value })}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {timeZones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={config.adjustForDST}
            onChange={(e) => onChange({ ...config, adjustForDST: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Ajuster automatiquement pour l'heure d'été
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Heures de travail</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Début
            </label>
            <input
              type="time"
              value={config.businessHours.start}
              onChange={(e) => onChange({
                ...config,
                businessHours: {
                  ...config.businessHours,
                  start: e.target.value
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fin
            </label>
            <input
              type="time"
              value={config.businessHours.end}
              onChange={(e) => onChange({
                ...config,
                businessHours: {
                  ...config.businessHours,
                  end: e.target.value
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jours de travail
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 1, name: 'Lun' },
              { id: 2, name: 'Mar' },
              { id: 3, name: 'Mer' },
              { id: 4, name: 'Jeu' },
              { id: 5, name: 'Ven' },
              { id: 6, name: 'Sam' },
              { id: 7, name: 'Dim' }
            ].map(day => (
              <button
                key={day.id}
                type="button"
                onClick={() => handleDayToggle(day.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  config.businessHours.daysOfWeek.includes(day.id)
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {day.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-900">Périodes d'arrêt</h4>
          <button
            type="button"
            onClick={addBlackoutPeriod}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Ajouter une période
          </button>
        </div>

        <div className="space-y-4">
          {config.blackoutPeriods.map((period, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="datetime-local"
                value={period.start.split('.')[0]}
                onChange={(e) => updateBlackoutPeriod(index, { start: e.target.value })}
                className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <span>à</span>
              <input
                type="datetime-local"
                value={period.end.split('.')[0]}
                onChange={(e) => updateBlackoutPeriod(index, { end: e.target.value })}
                className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <input
                type="text"
                value={period.reason}
                onChange={(e) => updateBlackoutPeriod(index, { reason: e.target.value })}
                placeholder="Raison"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => removeBlackoutPeriod(index)}
                className="text-red-600 hover:text-red-700"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}