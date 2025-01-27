import React from 'react';
import { Bell, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';

const AvailabilityAlerts = ({ equipment, selectedDates, onSetAlert }) => {
  const checkAvailability = (item, dates) => {
    // Simuler la vérification de disponibilité
    const availability = {
      status: item.available ? 'available' : 'unavailable',
      nextAvailable: '2024-01-15',
      conflictingDates: ['2024-01-10', '2024-01-11'],
      maintenanceDates: ['2024-01-20']
    };
    return availability;
  };

  const getAlertLevel = (availability) => {
    switch(availability.status) {
      case 'available':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'unavailable':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Alertes de disponibilité
        </h3>
      </div>

      {Object.entries(equipment).map(([itemId, item]) => {
        const availability = checkAvailability(item, selectedDates);
        const alertLevel = getAlertLevel(availability);

        return (
          <div 
            key={itemId}
            className={`p-4 rounded-lg border ${
              alertLevel === 'error' ? 'bg-red-50 border-red-200' :
              alertLevel === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              alertLevel === 'success' ? 'bg-green-50 border-green-200' :
              'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {alertLevel === 'error' && (
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-1" />
                )}
                {alertLevel === 'warning' && (
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                )}
                {alertLevel === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                )}
                
                <div>
                  <h4 className="font-medium">{itemId}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  
                  {availability.status === 'unavailable' && (
                    <div className="mt-2">
                      <p className="text-sm text-red-600">
                        Non disponible aux dates sélectionnées
                      </p>
                      <p className="text-sm text-gray-600">
                        Prochaine disponibilité: {availability.nextAvailable}
                      </p>
                    </div>
                  )}
                  
                  {availability.status === 'maintenance' && (
                    <p className="text-sm text-yellow-600 mt-2">
                      Maintenance prévue le {availability.maintenanceDates[0]}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onSetAlert(itemId)}
                className="text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center"
              >
                <Bell className="h-4 w-4 mr-1" />
                M'alerter
              </button>
            </div>

            {availability.conflictingDates && availability.conflictingDates.length > 0 && (
              <div className="mt-3 pl-8">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Dates indisponibles:
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {availability.conflictingDates.map((date) => (
                    <span 
                      key={date}
                      className="text-xs px-2 py-1 bg-gray-100 rounded"
                    >
                      {date}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AvailabilityAlerts;
