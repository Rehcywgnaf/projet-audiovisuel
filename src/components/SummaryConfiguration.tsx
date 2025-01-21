import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Settings, Bell, Filter, Sliders, Tag, Euro } from 'lucide-react';

const SummaryConfiguration = () => {
  const [config, setConfig] = useState({
    notifications: {
      email: true,
      push: true,
      digest: 'daily'
    },
    filters: {
      minBudget: 50000,
      maxBudget: 500000,
      sectors: ['audiovisuel', 'digital'],
      types: ['AAP', 'AO']
    },
    summaryPreferences: {
      showBudget: true,
      showDeadline: true,
      showKeywords: true,
      showFeedback: true
    }
  });

  const sectors = [
    'audiovisuel', 'digital', 'production', 'postproduction',
    'animation', 'documentaire', 'fiction', 'innovation'
  ];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold mb-6">Configuration des Résumés</h2>
      
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Notifications par email</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={config.notifications.email} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span>Notifications push</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={config.notifications.push} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span>Fréquence du digest</span>
            <select className="rounded-lg border p-2">
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres par Défaut
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium">Budget (en €)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Minimum</span>
                <input 
                  type="number" 
                  value={config.filters.minBudget}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <span className="text-sm text-gray-500">Maximum</span>
                <input 
                  type="number" 
                  value={config.filters.maxBudget}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Secteurs d'intérêt</label>
            <div className="flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <button
                  key={sector}
                  className={`px-3 py-1 rounded-full text-sm ${
                    config.filters.sectors.includes(sector)
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Types de projets</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={config.filters.types.includes('AAP')}
                  className="rounded text-blue-600"
                />
                AAP
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={config.filters.types.includes('AO')}
                  className="rounded text-blue-600"
                />
                AO
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Préférences d'affichage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            Préférences d'affichage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(config.summaryPreferences).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={value} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          Annuler
        </button>
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default SummaryConfiguration;