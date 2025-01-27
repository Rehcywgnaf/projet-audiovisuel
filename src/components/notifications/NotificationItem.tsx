import { Card, CardContent } from '@/components/ui/card';
import { MatchScore } from '../shared/scores/MatchScore';
import { CriteriaList } from '../shared/criteria/CriteriaList';

interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const renderContent = () => {
    switch (notification.type) {
      case 'opportunity':
        return (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{notification.title}</h3>
              <MatchScore score={notification.matchScore} />
            </div>
            <p className="my-4 text-gray-600">{notification.description}</p>
            <CriteriaList criteria={notification.criteria} />
            <a 
              href={notification.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              Voir l'appel à projet
            </a>
          </>
        );
      case 'team':
        return (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{notification.title}</h3>
              <span className="text-sm text-gray-500">
                {notification.timestamp.toLocaleDateString()}
              </span>
            </div>
            <p className="my-4 text-gray-600">{notification.description}</p>
            <button
              onClick={() => onRead?.(notification.id)}
              className="text-blue-600 hover:text-blue-800"
            >
              Marquer comme lu
            </button>
          </>
        );
    }
  };

  return (
    <Card className={`mb-4 hover:shadow-lg transition-all ${notification.read ? 'opacity-75' : ''}}`}>
      <CardContent className="pt-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
}