type StatusConfig = {
  color: string;
  label?: string;
}

const STATUS_STYLES: Record<string, StatusConfig> = {
  active: { color: 'bg-green-100 text-green-800', label: 'Actif' },
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
  completed: { color: 'bg-blue-100 text-blue-800', label: 'Terminé' }
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_STYLES[status] || { 
    color: 'bg-gray-100 text-gray-800',
    label: status 
  };

  return (
    <div className={`px-3 py-1 rounded-full text-sm ${config.color}`}>
      {config.label || status}
    </div>
  );
}