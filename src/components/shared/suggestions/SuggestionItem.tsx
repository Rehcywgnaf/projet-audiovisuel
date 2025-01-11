import { Plus, X } from 'lucide-react';

interface SuggestionItemProps {
  title: string;
  subtitle?: string;
  onAccept?: () => void;
  onReject?: () => void;
  acceptTooltip?: string;
  rejectTooltip?: string;
}

export function SuggestionItem({
  title,
  subtitle,
  onAccept,
  onReject,
  acceptTooltip = "Accepter",
  rejectTooltip = "Rejeter"
}: SuggestionItemProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
      <div>
        <span className="font-medium">{title}</span>
        {subtitle && (
          <span className="ml-2 text-sm text-gray-500">{subtitle}</span>
        )}
      </div>
      <div className="flex gap-2">
        {onAccept && (
          <button
            onClick={onAccept}
            className="p-1 hover:bg-green-100 rounded-full text-green-600"
            title={acceptTooltip}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
        {onReject && (
          <button
            onClick={onReject}
            className="p-1 hover:bg-red-100 rounded-full text-red-600"
            title={rejectTooltip}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}