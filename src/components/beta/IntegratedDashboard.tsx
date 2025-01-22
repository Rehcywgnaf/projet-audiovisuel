import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Bell, Rss, Settings, Timer, Folder, FileText, Check, Upload, AlertTriangle, Bug, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('rss');

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4 justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('rss')}
            className={`px-4 py-2 rounded ${activeTab === 'rss' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            RSS & Alertes
          </button>
          <button 
            onClick={() => setActiveTab('drive')}
            className={`px-4 py-2 rounded ${activeTab === 'drive' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Documents
          </button>
        </div>
        <button 
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2 rounded ${activeTab === 'tests' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Tests Utilisateur
        </button>
      </div>

      {activeTab === 'rss' && <RSSComponent />}
      {activeTab === 'drive' && <DriveComponent />}
      {activeTab === 'tests' && <UserTestSystem />}
    </div>
  );
}