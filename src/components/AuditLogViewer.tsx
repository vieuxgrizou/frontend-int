import React from 'react';
import { getAuditLogs } from '../utils/security/audit';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AuditLogViewerProps {
  userId: string;
}

export default function AuditLogViewer({ userId }: AuditLogViewerProps) {
  const [logs, setLogs] = React.useState([]);
  const [filters, setFilters] = React.useState({
    startDate: undefined,
    endDate: undefined,
    action: '',
    status: undefined
  });

  React.useEffect(() => {
    const fetchLogs = async () => {
      const auditLogs = await getAuditLogs(userId, filters);
      setLogs(auditLogs);
    };
    fetchLogs();
  }, [userId, filters]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Journal d'audit</h3>
        <div className="flex space-x-2">
          <input
            type="date"
            onChange={(e) => setFilters({ ...filters, startDate: new Date(e.target.value) })}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
          />
          <select
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">Tous les statuts</option>
            <option value="success">Succès</option>
            <option value="failure">Échec</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {logs.map((log: any) => (
            <li key={log.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-indigo-600 truncate">
                    {log.action}
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {log.details && JSON.stringify(log.details)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {format(new Date(log.timestamp), 'PPpp', { locale: fr })}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}