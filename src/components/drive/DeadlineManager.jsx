import React, { useState } from 'react';
import { Calendar, Clock, Bell, CheckCircle2, AlertTriangle, Filter, Plus } from 'lucide-react';

const DeadlineManager = () => {
  const [deadlines, setDeadlines] = useState([
    {
      id: 1,
      title: "Validation scénario final",
      date: "2024-02-15",
      time: "18:00",
      assignedTo: "Marie Laurent",
      status: "pending",
      priority: "high",
      notifications: [
        { type: "email", timing: "24h" },
        { type: "dashboard", timing: "1h" }
      ]
    },
    {
      id: 2,
      title: "Révision montage v2",
      date: "2024-02-10",
      time: "12:00",
      assignedTo: "Thomas Dubois",
      status: "completed",
      priority: "medium",
      notifications: [
        { type: "email", timing: "12h" }
      ]
    },
    {
      id: 3,
      title: "Validation audio mix",
      date: "2024-02-20",
      time: "15:00",
      assignedTo: "Sophie Martin",
      status: "at-risk",
      priority: "high",
      notifications: [
        { type: "email", timing: "48h" },
        { type: "dashboard", timing: "24h" }
      ]
    }
  ]);

  const [filter, setFilter] = useState('all');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* En-tête avec actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestion des Deadlines</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouvelle deadline</span>
        </button>
      </div>

      {/* Filtres rapides */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <button
            className={`px-3 py-1 rounded-full ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'}`}
            onClick={() => setFilter('all')}
          >
            Toutes
          </button>
          <button
            className={`px-3 py-1 rounded-full ${filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-600'}`}
            onClick={() => setFilter('pending')}
          >
            En cours
          </button>
          <button
            className={`px-3 py-1 rounded-full ${filter === 'at-risk' ? 'bg-red-100 text-red-800' : 'text-gray-600'}`}
            onClick={() => setFilter('at-risk')}
          >
            À risque
          </button>
          <button
            className={`px-3 py-1 rounded-full ${filter === 'completed' ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}
            onClick={() => setFilter('completed')}
          >
            Terminées
          </button>
        </div>
      </div>

      {/* Liste des deadlines */}
      <div className="space-y-4">
        {deadlines.map(deadline => (
          <div key={deadline.id} className="bg-white rounded-lg shadow">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {deadline.status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : deadline.status === 'at-risk' ? (
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                ) : (
                  <Clock className="w-6 h-6 text-yellow-500" />
                )}
                <div>
                  <h3 className="font-medium">{deadline.title}</h3>
                  <p className="text-sm text-gray-500">Assigné à : {deadline.assignedTo}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{deadline.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{deadline.time}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {deadline.notifications.map((notif, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center space-x-1"
                    >
                      <Bell className="w-3 h-3" />
                      <span>{notif.timing}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Actions rapides */}
            <div className="border-t px-4 py-3 bg-gray-50 text-sm flex justify-between items-center">
              <div className="space-x-3">
                <button className="text-blue-600 hover:text-blue-800">Modifier</button>
                <button className="text-blue-600 hover:text-blue-800">Rappels</button>
              </div>
              {deadline.status !== 'completed' && (
                <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                  Marquer comme terminé
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Légende et aide */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-600">À risque</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">En cours</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">Terminé</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeadlineManager;
