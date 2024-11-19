import React from 'react';
import { Plus, X } from 'lucide-react';
import type { ScheduleRule } from '../types/scheduling';

interface ScheduleRuleEditorProps {
  rules: ScheduleRule[];
  onChange: (rules: ScheduleRule[]) => void;
}

export default function ScheduleRuleEditor({ rules, onChange }: ScheduleRuleEditorProps) {
  const addRule = () => {
    const newRule: ScheduleRule = {
      id: crypto.randomUUID(),
      name: 'Nouvelle règle',
      condition: {
        type: 'time',
        operator: 'between',
        value: '09:00',
        secondaryValue: '17:00'
      },
      action: {
        type: 'adjust_frequency',
        value: 1.5
      },
      priority: rules.length + 1,
      enabled: true
    };
    onChange([...rules, newRule]);
  };

  const updateRule = (index: number, updates: Partial<ScheduleRule>) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], ...updates };
    onChange(newRules);
  };

  const deleteRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    onChange(newRules);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Règles de planification</h3>
        <button
          onClick={addRule}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une règle
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div
            key={rule.id}
            className="bg-white shadow sm:rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={rule.name}
                  onChange={(e) => updateRule(index, { name: e.target.value })}
                  className="block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Nom de la règle"
                />
              </div>
              <div className="ml-4 flex items-center">
                <button
                  onClick={() => deleteRule(index)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type de condition
                </label>
                <select
                  value={rule.condition.type}
                  onChange={(e) => updateRule(index, {
                    condition: { ...rule.condition, type: e.target.value as any }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="time">Horaire</option>
                  <option value="engagement">Engagement</option>
                  <option value="traffic">Trafic</option>
                  <option value="custom">Personnalisé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Opérateur
                </label>
                <select
                  value={rule.condition.operator}
                  onChange={(e) => updateRule(index, {
                    condition: { ...rule.condition, operator: e.target.value as any }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="equals">Égal à</option>
                  <option value="greater">Supérieur à</option>
                  <option value="less">Inférieur à</option>
                  <option value="between">Entre</option>
                  <option value="not">N'est pas</option>
                </select>
              </div>

              {rule.condition.type === 'time' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {rule.condition.operator === 'between' ? 'Début' : 'Heure'}
                    </label>
                    <input
                      type="time"
                      value={rule.condition.value}
                      onChange={(e) => updateRule(index, {
                        condition: { ...rule.condition, value: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  {rule.condition.operator === 'between' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fin
                      </label>
                      <input
                        type="time"
                        value={rule.condition.secondaryValue}
                        onChange={(e) => updateRule(index, {
                          condition: { ...rule.condition, secondaryValue: e.target.value }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Action
                </label>
                <select
                  value={rule.action.type}
                  onChange={(e) => updateRule(index, {
                    action: { ...rule.action, type: e.target.value as any }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="adjust_frequency">Ajuster la fréquence</option>
                  <option value="change_persona">Changer de persona</option>
                  <option value="pause">Mettre en pause</option>
                  <option value="resume">Reprendre</option>
                </select>
              </div>

              {rule.action.type === 'adjust_frequency' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Multiplicateur
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={rule.action.value}
                    onChange={(e) => updateRule(index, {
                      action: { ...rule.action, value: parseFloat(e.target.value) }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={(e) => updateRule(index, { enabled: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-600">
                  Règle active
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Priorité</label>
                <input
                  type="number"
                  min="1"
                  value={rule.priority}
                  onChange={(e) => updateRule(index, { priority: parseInt(e.target.value) })}
                  className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}