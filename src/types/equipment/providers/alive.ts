import { Equipment, PriceInfo, ItemAvailability } from '../common';

export interface AlivePackage {
  reference: string;
  name: string;
  description?: string;
  includedItems: string[];
  dayRate: number;
  weekRate?: number;
  conditions?: string[];
}

export interface AliveEquipment extends Equipment {
  aliveReference: string;  // Référence spécifique ALIVE
  packageOptions?: AlivePackage[];
  unitType: 'camera' | 'lens' | 'accessory' | 'audio' | 'lighting' | 'grip';
  rentalUnit: 'day' | 'week' | 'custom';
  specifications: {
    brand?: string;
    model?: string;
    mountType?: string;
    sensorSize?: string;
    resolution?: string;
    weight?: string;
    dimensions?: string;
    powerRequirements?: string;
    [key: string]: string | undefined;
  };
}

export interface AlivePricing extends PriceInfo {
  packageRate?: number;
  packageIncludes?: string[];
  alternativeRate?: number;
  alternativeDescription?: string;
}

export interface AliveAvailability extends ItemAvailability {
  maintenanceSchedule?: {
    startDate: Date;
    endDate: Date;
    type: 'maintenance' | 'repair' | 'upgrade';
  }[];
  reservationQueue?: {
    startDate: Date;
    endDate: Date;
    priority: number;
  }[];
}

export interface AliveCategory {
  id: string;
  name: string;
  parentId?: string;
  path: string[];  // Chemin complet de la catégorie (pour la navigation)
  displayOrder: number;
  specifications: string[];  // Liste des spécifications disponibles pour cette catégorie
  customFields?: {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    options?: string[];  // Pour les champs de type 'select'
    required: boolean;
  }[];
}

// Types pour la gestion des packages et bundles ALIVE
export interface AlivePackageBuilder {
  baseEquipment: AliveEquipment;
  additionalItems: {
    equipment: AliveEquipment;
    quantity: number;
  }[];
  duration: number;  // en jours
  calculateTotal(): number;
  validatePackage(): boolean;
  getAvailability(): AliveAvailability;
}

// Types pour le système de tarification ALIVE
export interface AlivePricingRules {
  weekDiscountPercentage: number;
  monthDiscountPercentage: number;
  minRentalDays: number;
  maxRentalDays?: number;
  specialDates?: {
    startDate: Date;
    endDate: Date;
    multiplier: number;
    description: string;
  }[];
  volumeDiscounts?: {
    minAmount: number;
    discountPercentage: number;
  }[];
}