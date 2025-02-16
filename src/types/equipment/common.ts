// Types de base pour le système d'équipement
export interface EquipmentProvider {
  id: string;
  name: string;
  location: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
}

export interface PriceInfo {
  dayRate: number;
  weekRate?: number;
  monthRate?: number;
  minimumDays?: number;
  specialConditions?: string[];
}

export interface ItemAvailability {
  isAvailable: boolean;
  nextAvailableDate?: Date;
  availabilityNotes?: string;
}

export interface Equipment {
  id: string;
  reference: string;
  name: string;
  category: string;
  subCategory?: string;
  description?: string;
  specifications?: Record<string, string | number>;
  pricing: Record<string, PriceInfo>;
  availability: Record<string, ItemAvailability>;
  provider: EquipmentProvider;
  imageUrl?: string;
  manufacturer?: string;
  model?: string;
  includedItems?: string[];
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent?: string;
  children?: string[];
  order?: number;
}

export interface SearchFilters {
  query?: string;
  categories?: string[];
  providers?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  availability?: boolean;
  location?: string;
  specifications?: Record<string, string | number>;
}

// Types spécifiques pour les composants
export interface EquipmentCardProps {
  equipment: Equipment;
  onSelect?: (id: string) => void;
  className?: string;
}

export interface EquipmentDetailProps {
  equipment: Equipment;
  onClose?: () => void;
  onBook?: (equipment: Equipment) => void;
}

export interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  className?: string;
}

// Types pour le calcul de prix
export interface RentalPeriod {
  startDate: Date;
  endDate: Date;
  provider?: string;
}

export interface RentalCalculation {
  equipment: Equipment;
  period: RentalPeriod;
  basePrice: number;
  discounts: {
    type: string;
    amount: number;
    description: string;
  }[];
  finalPrice: number;
  breakdown: {
    description: string;
    amount: number;
  }[];
}