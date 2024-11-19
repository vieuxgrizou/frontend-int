import type { WordPressSite, Persona, CommentTemplate } from '../types';

interface ExportData {
  version: string;
  timestamp: string;
  sites: WordPressSite[];
  personas: Persona[];
  templates: CommentTemplate[];
  settings: Record<string, any>;
}

export async function exportConfiguration(): Promise<Blob> {
  const exportData: ExportData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    sites: [], // TODO: Get from store
    personas: [], // TODO: Get from store
    templates: [], // TODO: Get from store
    settings: {} // TODO: Get from store
  };

  return new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });
}

export async function importConfiguration(file: File): Promise<ExportData> {
  const text = await file.text();
  const data: ExportData = JSON.parse(text);

  // TODO: Validate data structure
  // TODO: Merge with existing data
  // TODO: Update store

  return data;
}

export function downloadConfiguration(blob: Blob, filename: string = 'ai-comments-config.json') {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}