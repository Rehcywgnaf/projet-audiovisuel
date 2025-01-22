// Types pour les sources des AO
export type AOSource = 'RSS' | 'MANUAL' | 'API';

// Statut d'un AO
export type AOStatus = 
  | 'NEW'          // Nouvel AO détecté
  | 'ANALYZING'    // En cours d'analyse
  | 'IN_PROGRESS'  // En cours de réponse
  | 'SUBMITTED'    // Réponse soumise
  | 'WON'          // AO remporté
  | 'LOST'         // AO perdu
  | 'CANCELLED'    // AO annulé
  | 'ARCHIVED';    // AO archivé

// Structure d'un document lié à l'AO
export interface AODocument {
  id: string;
  type: 'TECHNICAL' | 'COMMERCIAL' | 'ADMINISTRATIVE';
  title: string;
  url?: string;         // Pour les documents externes
  driveId?: string;     // Pour les documents Google Drive
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

// Structure d'un jalon/étape
export interface AOMilestone {
  id: string;
  title: string;
  dueDate: Date;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  notificationSent: boolean;
}

// Structure principale d'un AO
export interface AO {
  id: string;
  title: string;
  reference: string;    // Référence unique de l'AO
  source: AOSource;
  status: AOStatus;
  
  // Dates importantes
  publishedAt: Date;
  submissionDeadline: Date;
  startDate?: Date;     // Date de début du projet si l'AO est remporté
  
  // Détails
  description: string;
  budget?: number;
  client: {
    name: string;
    type: 'PUBLIC' | 'PRIVATE';
    contact?: string;
  };
  
  // Documents associés
  documents: AODocument[];
  
  // Jalons et étapes
  milestones: AOMilestone[];
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;    // ID utilisateur
  assignedTo?: string;  // ID utilisateur
  
  // Champs pour le suivi
  probability?: number;  // Probabilité estimée de gagner (0-100)
  notes?: string;       // Notes internes
  tags: string[];       // Tags pour catégorisation
}

// Interface pour les filtres de recherche
export interface AOSearchFilters {
  status?: AOStatus[];
  client?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  assignedTo?: string;
  tags?: string[];
}

// Réponse paginée pour les listes d'AO
export interface AOPaginatedResponse {
  data: AO[];
  total: number;
  page: number;
  pageSize: number;
}