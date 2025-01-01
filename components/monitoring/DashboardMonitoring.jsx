import React from 'react';
import { Activity, Wifi, Clock, AlertTriangle, CheckCircle2, Users } from 'lucide-react';

const DashboardMonitoring = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Surveillance Système</h2>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-500">Système actif</span>
        </div>
      </div>

      {/* Indicateurs principaux */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Utilisateurs</h3>
          </div>
          <div className="text-2xl font-bold">24</div>
          <div className="text-sm text-gray-500">Actuellement connectés</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">État Connexion</h3>
          </div>
          <div className="text-2xl font-bold text-green-500">98%</div>
          <div className="text-sm text-gray-500">Stabilité réseau</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Temps Réponse</h3>
          </div>
          <div className="text-2xl font-bold">1.2s</div>
          <div className="text-sm text-gray-500">Moyenne</div>
        </div>
      </div>

      {/* Alertes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-medium">Dernières Alertes</h3>
        </div>
        <div className="divide-y">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Reconnexion réussie</p>
                <p className="text-sm text-gray-500">Il y a 5 minutes</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">Durée : 2.3s</span>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-medium">Délai de connexion</p>
                <p className="text-sm text-gray-500">Il y a 15 minutes</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">Résolu automatiquement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMonitoring;