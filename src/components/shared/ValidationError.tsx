import React from 'react';
import { AlertTriangle } from 'lucide-react';

type ValidationErrorProps = {
  errors?: string | string[];
  className?: string;
};

export const ValidationError: React.FC<ValidationErrorProps> = ({ errors, className = '' }) => {
  if (!errors || (Array.isArray(errors) && errors.length === 0)) {
    return null;
  }

  const errorMessages = Array.isArray(errors) ? errors : [errors];

  return (
    <div className={`flex items-start gap-2 mt-1 ${className}`}>
      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
      <div className="flex-1">
        {errorMessages.map((error, index) => (
          <p key={index} className="text-sm text-red-500">
            {error}
          </p>
        ))}
      </div>
    </div>
  );
};