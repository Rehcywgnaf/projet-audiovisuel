import React, { useState, useEffect } from 'react';
import { Bell, Clock, Check, X, AlertTriangle } from 'lucide-react';

const RealTimeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [subscribedItems, setSubscribedItems] = useState([]);

  // Simulation de websocket/temps réel
  useEffect(() => {
    const notificationTypes = {
      AVAILABILITY_CHANGE: 'availability_change',
      MAINTENANCE_ALERT: 'maintenance_alert',
      RETURN_SOON: 'return_soon',
      PRICE_CHANGE: 'price_change'
    };

    // Simulation de notifications entrantes
    const mockNotifications = [
      {
        id: 1,
        type: notificationTypes.AVAILABILITY_CHANGE,
        equipment: "SONY VENICE 2",
        message: "Disponible pour vos dates",
        timestamp: new Date(),
        priority: "high",
        status: "unread"
      },
      {
        id: 2,
        type: notificationTypes.MAINTENANCE_ALERT,
        equipment: "RED V-RAPTOR",
        message: "Maintenance prévue",
        timestamp: new Date(),
        priority: "medium",
        status: "unread"
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const subscribeToAlerts = (itemId) => {
    setSubscribedItems(prev => [...prev, itemId]);
    // Simulation d'une souscription
    console.log(`Subscribed to alerts for ${itemId}`);
  };

  const unsubscribeFromAlerts = (itemId) => {
    setSubscribedItems(prev => prev.filter(id => id !== itemId));
    // Simulation d'une désinscription
    console.log(`Unsubscribed from alerts for ${itemId}`);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'availability_change':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'maintenance_alert':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'return_soon':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center">
          <Bell className="mr-2 h-6 w-6" />
          Notifications en temps réel
        </h3>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {notifications.filter(n => n.status === 'unread').length} nouvelles
        </span>
      </div>

      {/* Centre de notifications */}
      <div className="border rounded-lg divide-y">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 ${notification.status === 'unread' ? 'bg-gray-50' : ''}`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{notification.equipment}</h4>
                  <span className="text-sm text-gray-500">
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span 
                    className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}
                  >
                    {notification.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Abonnements actifs */}
      <div className="mt-6">
        <h4 className="font-medium mb-2">Vos abonnements</h4>
        <div className="space-y-2">
          {subscribedItems.map((itemId) => (
            <div 
              key={itemId}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span>{itemId}</span>
              <button
                onClick={() => unsubscribeFromAlerts(itemId)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Préférences de notification */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Préférences de notification</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Notifications par email</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Notifications push</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Alertes de prix</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default RealTimeNotifications;