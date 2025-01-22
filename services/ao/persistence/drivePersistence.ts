import { AO } from '../types';
import {
  AOPersistenceData,
  DriveFolder,
  DriveFile,
  FOLDER_STRUCTURE,
  getFolderPathForStatus
} from './types';
import { DriveConfig } from '../../drive/driveConfig';

export class AODrivePersistence {
  private driveConfig: DriveConfig;

  constructor() {
    this.driveConfig = DriveConfig.getInstance();
  }

  private get driveAPI() {
    return this.driveConfig.getDriveAPI();
  }

  async initializeFolderStructure(): Promise<void> {
    const rootFolder = await this.createFolderIfNotExists(FOLDER_STRUCTURE.ROOT);
    const activeFolder = await this.createFolderIfNotExists(FOLDER_STRUCTURE.ACTIVE, rootFolder.id);
    const completedFolder = await this.createFolderIfNotExists(FOLDER_STRUCTURE.COMPLETED, rootFolder.id);
    const archivedFolder = await this.createFolderIfNotExists(FOLDER_STRUCTURE.ARCHIVED, rootFolder.id);

    for (const status of ['NEW', 'ANALYZING', 'IN_PROGRESS']) {
      await this.createFolderIfNotExists(
        FOLDER_STRUCTURE.STATUS_FOLDERS[status],
        activeFolder.id
      );
    }

    for (const status of ['SUBMITTED', 'WON', 'LOST']) {
      await this.createFolderIfNotExists(
        FOLDER_STRUCTURE.STATUS_FOLDERS[status],
        completedFolder.id
      );
    }
  }

  async saveAO(ao: AO): Promise<void> {
    const folderPath = getFolderPathForStatus(ao.status);
    const targetFolder = await this.navigateFolderPath(folderPath);

    const persistenceData: AOPersistenceData = {
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: 1,
        driveId: '',
        parentFolder: targetFolder.id
      },
      data: ao
    };

    const fileName = `ao_${ao.id}.json`;
    const existingFile = await this.findFile(fileName, targetFolder.id);

    if (existingFile) {
      // Mise à jour du fichier existant
      const currentData = await this.readFile(existingFile.id) as AOPersistenceData;
      persistenceData.metadata.version = currentData.metadata.version + 1;
      persistenceData.metadata.driveId = existingFile.id;
      await this.updateFile(existingFile.id, persistenceData);
    } else {
      // Création d'un nouveau fichier
      const file = await this.createFile(fileName, persistenceData, targetFolder.id);
      persistenceData.metadata.driveId = file.id;
      await this.updateFile(file.id, persistenceData);
    }
  }

  async getAO(id: string): Promise<AO | null> {
    const fileName = `ao_${id}.json`;
    const file = await this.searchFileInAllFolders(fileName);
    
    if (!file) return null;

    const data = await this.readFile(file.id) as AOPersistenceData;
    return data.data;
  }

  private async createFolderIfNotExists(name: string, parentId?: string): Promise<DriveFolder> {
    const existingFolder = await this.findFolder(name, parentId);
    if (existingFolder) return existingFolder;

    const folderMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : undefined
    };

    const response = await this.driveAPI.files.create({
      resource: folderMetadata,
      fields: 'id, name'
    });

    return response.data;
  }

  private async findFolder(name: string, parentId?: string): Promise<DriveFolder | null> {
    const query = parentId
      ? `name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and '${parentId}' in parents`
      : `name = '${name}' and mimeType = 'application/vnd.google-apps.folder'`;

    const response = await this.driveAPI.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    return response.data.files[0] || null;
  }

  private async navigateFolderPath(path: string[]): Promise<DriveFolder> {
    let currentParentId: string | undefined;
    let targetFolder: DriveFolder | null = null;

    for (const folderName of path) {
      targetFolder = await this.findFolder(folderName, currentParentId);
      if (!targetFolder) {
        targetFolder = await this.createFolderIfNotExists(folderName, currentParentId);
      }
      currentParentId = targetFolder.id;
    }

    if (!targetFolder) {
      throw new Error('Chemin de dossier invalide');
    }

    return targetFolder;
  }

  private async searchFileInAllFolders(fileName: string): Promise<DriveFile | null> {
    const query = `name = '${fileName}' and mimeType != 'application/vnd.google-apps.folder'`;
    
    const response = await this.driveAPI.files.list({
      q: query,
      fields: 'files(id, name, parents)',
      spaces: 'drive'
    });

    return response.data.files[0] || null;
  }

  private async findFile(name: string, parentId: string): Promise<DriveFile | null> {
    const query = `name = '${name}' and '${parentId}' in parents`;
    
    const response = await this.driveAPI.files.list({
      q: query,
      fields: 'files(id, name, parents)',
      spaces: 'drive'
    });

    return response.data.files[0] || null;
  }

  private async readFile(fileId: string): Promise<any> {
    const response = await this.driveAPI.files.get({
      fileId,
      alt: 'media'
    });

    return response.data;
  }

  private async createFile(name: string, content: any, parentId: string): Promise<DriveFile> {
    const fileMetadata = {
      name,
      parents: [parentId],
      mimeType: 'application/json'
    };

    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(content, null, 2)
    };

    const response = await this.driveAPI.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, name, parents'
    });

    return response.data;
  }

  private async updateFile(fileId: string, content: any): Promise<void> {
    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(content, null, 2)
    };

    await this.driveAPI.files.update({
      fileId,
      media,
      fields: 'id'
    });
  }
}

// Instance singleton
export const aoDrivePersistence = new AODrivePersistence();