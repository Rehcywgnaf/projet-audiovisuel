import React, { useState, FormEvent } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ValidationError } from '../common/ValidationError';
import { Users } from 'lucide-react';
import { validateMember } from '../../core/validation';
import { TeamMember } from '../../core/types';

interface MemberFormProps {
  onSubmit: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const MemberForm = ({ onSubmit, onCancel, isSubmitting = false }: MemberFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    availability: '100',
    currentProjects: []
  });
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const { errors } = validateMember({
      ...formData,
      [name]: value
    });
    setFormErrors(prev => ({
      ...prev,
      [name]: errors[name]
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { isValid, errors } = validateMember(formData);
    
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h2 className="text-xl font-bold">Ajouter un membre</h2>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            <ValidationError errors={formErrors.name} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rôle</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              className={`w-full p-2 border rounded ${formErrors.role ? 'border-red-500' : 'border-gray-300'}`}
            />
            <ValidationError errors={formErrors.role} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Disponibilité (%)</label>
            <input
              type="number"
              name="availability"
              min="0"
              max="100"
              value={formData.availability}
              onChange={handleFormChange}
              className={`w-full p-2 border rounded ${formErrors.availability ? 'border-red-500' : 'border-gray-300'}`}
            />
            <ValidationError errors={formErrors.availability} />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter le membre'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>

          <ValidationError errors={formErrors.submit} />
        </form>
      </CardContent>
    </Card>
  );
};
