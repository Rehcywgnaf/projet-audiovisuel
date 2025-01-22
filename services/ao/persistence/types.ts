import { AO, AOStatus } from '../types';

export interface AOPersistenceMetadata {
  lastUpdated: string;
  version: number;
  driveId: string;
  parentFolder: string;
}

export interface AOPersistenceData {
  metadata: AOPersistenceMetadata;
  data: AO;
}

export interface DriveFolder {
  id: string;
  name: string;
  parentId?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  parents: string[];
}

export const FOLDER_STRUCTURE = {
  ROOT: 'SAAOP_Data',
  ACTIVE: 'active_aos',
  COMPLETED: 'completed_aos',
  ARCHIVED: 'archived_aos',
  STATUS_FOLDERS: {
    NEW: 'new',
    ANALYZING: 'analyzing',
    IN_PROGRESS: 'in_progress',
    SUBMITTED: 'submitted',
    WON: 'won',
    LOST: 'lost',
    ARCHIVED: 'archived'
  }
};

export function getFolderPathForStatus(status: AOStatus): string[] {
  switch (status) {
    case 'NEW':
    case 'ANALYZING':
    case 'IN_PROGRESS':
      return [FOLDER_STRUCTURE.ROOT, FOLDER_STRUCTURE.ACTIVE, FOLDER_STRUCTURE.STATUS_FOLDERS[status]];
    case 'SUBMITTED':
    case 'WON':
    case 'LOST':
      return [FOLDER_STRUCTURE.ROOT, FOLDER_STRUCTURE.COMPLETED, FOLDER_STRUCTURE.STATUS_FOLDERS[status]];
    case 'ARCHIVED':
      return [FOLDER_STRUCTURE.ROOT, FOLDER_STRUCTURE.ARCHIVED];
    case 'CANCELLED':
      return [FOLDER_STRUCTURE.ROOT, FOLDER_STRUCTURE.ARCHIVED, 'cancelled'];
    default:
      throw new Error(`Status non géré: ${status}`);
  }
}