import { Equipment, PriceInfo, ItemAvailability } from '../common';

export interface PictanovoFundingInfo {
  eligible: boolean;
  criteria?: string[];
  maxFundingPercentage?: number;
  requiredDocuments?: string[];
  restrictions?: string[];
  deadline?: Date;
}

export interface PictanovoEquipment extends Equipment {
  pictanovoReference: string;
  fundingInfo?: PictanovoFundingInfo;
  regionRestrictions?: string[];
  supportingDocuments?: {
    type: string;
    required: boolean;
    description: string;
    template?: string;
  }[];
  technicalRequirements?: {
    certification?: string[];
    experience?: string[];
    insurance?: string[];
  };
}

export interface PictanovoPricing extends PriceInfo {
  subsidizedRate?: number;
  studentRate?: number;
  nonprofitRate?: number;
  regionalRate?: number;
  depositRequired?: {
    amount: number;
    type: 'percentage' | 'fixed';
    conditions: string[];
  };
}

export interface PictanovoAvailability extends ItemAvailability {
  regionalPriority?: {
    region: string;
    priority: number;
  }[];
  projectTypes?: {
    type: string;
    available: boolean;
    conditions?: string[];
  }[];
  seasonalAvailability?: {
    startDate: Date;
    endDate: Date;
    availability: 'full' | 'limited' | 'unavailable';
    notes?: string;
  }[];
}

export interface PictanovoCategory {
  id: string;
  name: string;
  fundingCategory?: string;
  requirements?: {
    technical?: string[];
    administrative?: string[];
    insurance?: string[];
  };
  restrictions?: {
    regional?: string[];
    projectType?: string[];
    seasonal?: {
      period: string;
      restrictions: string[];
    }[];
  };
}

// Types pour la gestion des projets Pictanovo
export interface PictanovoProject {
  id: string;
  name: string;
  type: string;
  region: string;
  fundingStatus?: {
    applied: boolean;
    approved?: boolean;
    amount?: number;
    conditions?: string[];
  };
  equipment: {
    item: PictanovoEquipment;
    duration: number;
    startDate: Date;
    specialRequirements?: string[];
  }[];
}

// Types pour le système de tarification Pictanovo
export interface PictanovoPricingRules {
  standardRates: {
    daily: number;
    weekly: number;
    monthly?: number;
  };
  discounts: {
    regional?: {
      region: string;
      percentage: number;
    }[];
    nonprofit?: number;
    student?: number;
    longTerm?: {
      duration: number;
      percentage: number;
    }[];
  };
  fundingAdjustments?: {
    category: string;
    adjustment: number;
    conditions: string[];
  }[];
}

// Types pour la gestion des documents et certifications
export interface PictanovoDocumentation {
  technical: {
    type: string;
    required: boolean;
    validityPeriod?: number;
    template?: string;
  }[];
  administrative: {
    type: string;
    required: boolean;
    validityPeriod?: number;
    template?: string;
  }[];
  insurance: {
    type: string;
    required: boolean;
    minimumCoverage?: number;
    validityPeriod?: number;
  }[];
}