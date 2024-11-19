import React from 'react';
import { X } from 'lucide-react';
import type { CommentSchedule, WordPressSite } from '../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: CommentSchedule) => void;
  schedule?: CommentSchedule | null;
  sites: WordPressSite[];
}

export default function ScheduleModal({ isOpen, onClose, onSave, schedule, sites }: ScheduleModalProps) {
  const [formData, setFormData] = React.useState<CommentSchedule>(schedule || {
    id: crypto.randomUUID(),
    siteId: sites[0]?.id || '',
    personaId: '',
    frequency: 3,
    startTime: '09:00',
    endTime: '17:00',
    daysOfWeek: [1, 2, 3, 4, 5],
    replyProbability: 0.3,
    maxCommentsPerDay: 5
  });

  const daysOfWeek = [
    { id: 1, name: 'Lundi' },
    { id: 2, name: 'Mardi' },
    { id: 3, name: 'Mercredi' },
    { id: 4, name: 'Jeudi' },
    { id: 5, name: 'Vendredi' },
    { id: 6, name: 'Samedi' },
    { id: 7, name: 'Dimanche' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="container-card max-w-2xl w-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-dark">
          <h2 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
            {schedule ? 'Modifier la planification' : 'Nouvelle planification'}
          </h2>
          <button onClick={onClose} className="text-gray-400 dark:text-dark-secondary hover:text-gray-500 dark:hover:text-dark-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">Site</label>
            <select
              value={formData.siteId}
              onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
              className="mt-1 input-standard w-full"
            >
              {sites.map(site => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                Heure de début
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="mt-1 input-standard w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                Heure de fin
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="mt-1 input-standard w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary mb-2">
              Jours de la semaine
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => {
                    const newDays = formData.daysOfWeek.includes(day.id)
                      ? formData.daysOfWeek.filter(d => d !== day.id)
                      : [...formData.daysOfWeek, day.id].sort();
                    setFormData({ ...formData, daysOfWeek: newDays });
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    formData.daysOfWeek.includes(day.id)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
                      : 'bg-gray-100 dark:bg-dark-hover text-gray-800 dark:text-dark-secondary'
                  }`}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                Commentaires par jour
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: parseInt(e.target.value) })}
                className="mt-1 input-standard w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                Probabilité de réponse (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round(formData.replyProbability * 100)}
                onChange={(e) => setFormData({ ...formData, replyProbability: parseInt(e.target.value) / 100 })}
                className="mt-1 input-standard w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-dark">
          <button
            onClick={onClose}
            className="button-secondary"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(formData)}
            className="button-primary"
          >
            {schedule ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}