import React from 'react';
import { Bell, Mail, MessageSquare, AlertCircle, Check } from 'lucide-react';

const NotificationManager = () => {
  const notifications = [
    {
      id: 1,
      type: 'error',
      message: 'Erreur de synchronisation détectée',
      timestamp: '2024-01-26 10:35'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Délai de connexion anormal',
      timestamp: '2024-01-26 10:30'
    },
    {
      id: 3,
      type: 'success',
      message: 'Synchronisation terminée',
      timestamp: '2024-01-26 10:25'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
            <Mail className="w-5 h-5" />
            <span>Email</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
            <MessageSquare className="w-5 h-5" />
            <span>SMS</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
        {notifications.map(notification => (
          <div key={notification.id} className="p-4">
            <div className="flex items-center space-x-3">
              {notification.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              {notification.type === 'warning' && (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              {notification.type === 'success' && (
                <Check className="w-5 h-5 text-green-500" />
              )}
              <div className="flex-1">
                <p className="font-medium">{notification.message}</p>
                <p className="text-sm text-gray-500">{notification.timestamp}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Fermer</span>
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationManager;