import React from 'react';
import { NotificationItem } from './NotificationItem';
import { NotificationService } from '../../services/NotificationService';

export function NotificationCenter() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [filter, setFilter] = React.useState<NotificationType | 'all'>('all');
  const notificationService = NotificationService.getInstance();

  React.useEffect(() => {
    const unsubscribe = notificationService.subscribe('notification-center', 
      (notification) => {
        setNotifications(prev => [notification, ...prev]);
      }
    );
    return unsubscribe;
  }, []);

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const filteredNotifications = React.useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => n.type === filter);
  }, [notifications, filter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Tout
        </button>
        <button 
          onClick={() => setFilter('opportunity')}
          className={`px-3 py-1 rounded-full ${filter === 'opportunity' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Opportunités
        </button>
        <button 
          onClick={() => setFilter('team')}
          className={`px-3 py-1 rounded-full ${filter === 'team' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Équipes
        </button>
      </div>
      
      <div className="space-y-4">
        {filteredNotifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={handleMarkAsRead}
          />
        ))}
      </div>
    </div>
  );
}