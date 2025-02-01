import { TeamMember } from './types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export function validateMember(data: Partial<TeamMember>): ValidationResult {
  const errors: Record<string, string[]> = {};

  if (!data.name || data.name.length < 2) {
    errors.name = ['Le nom doit contenir au moins 2 caractères'];
  } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(data.name)) {
    errors.name = ['Le nom ne doit contenir que des lettres'];
  }

  if (!data.role || data.role.length === 0) {
    errors.role = ['Le rôle est requis'];
  }

  const availability = parseInt(String(data.availability));
  if (isNaN(availability) || availability < 0 || availability > 100) {
    errors.availability = ['La disponibilité doit être entre 0 et 100%'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}