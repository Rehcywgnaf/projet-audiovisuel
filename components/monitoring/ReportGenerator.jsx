import React from 'react';
import { FileText, Download, Calendar, Check } from 'lucide-react';

const ReportGenerator = () => {
  const reports = [
    {
      id: 1,
      type: 'Hebdomadaire',
      date: '2024-01-26',
      status: 'generated',
      stats: {
        users: 156,
        uptime: '99.8%',
        issues: 2
      }
    },
    {
      id: 2,
      type: 'Mensuel',
      date: '2024-01-01',
      status: 'pending',
      stats: {
        users: 623,
        uptime: '99.5%',
        issues: 8
      }
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Rapports</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Calendar className="w-5 h-5" />
          <span>Planifier un rapport</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
        {reports.map(report => (
          <div key={report.id} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-medium">Rapport {report.type}</h3>
                  <p className="text-sm text-gray-500">{report.date}</p>
                </div>
              </div>
              <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                <Download className="w-4 h-4" />
                <span>Télécharger</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Utilisateurs</p>
                <p className="font-medium">{report.stats.users}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Disponibilité</p>
                <p className="font-medium">{report.stats.uptime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Problèmes</p>
                <p className="font-medium">{report.stats.issues}</p>
              </div>
            </div>

            {report.status === 'generated' && (
              <div className="mt-4 flex items-center text-sm text-green-600">
                <Check className="w-4 h-4 mr-2" />
                <span>Rapport généré</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportGenerator;