import { AODrivePersistence } from '../drivePersistence';
import { DriveConfig } from '../../../drive/driveConfig';
import { AO, AOStatus } from '../../types';
import { v4 as uuidv4 } from 'uuid';

// Mock de DriveConfig
jest.mock('../../../drive/driveConfig', () => ({
  DriveConfig: {
    getInstance: jest.fn(() => ({
      getDriveAPI: () => mockDriveAPI
    }))
  }
}));

// Mock de l'API Drive
const mockDriveAPI = {
  files: {
    create: jest.fn(),
    list: jest.fn(),
    get: jest.fn(),
    update: jest.fn()
  }
};

describe('AODrivePersistence', () => {
  let persistence: AODrivePersistence;
  
  const mockAO: AO = {
    id: uuidv4(),
    title: 'Test AO',
    reference: 'AO-TEST-001',
    source: 'MANUAL',
    status: 'NEW' as AOStatus,
    publishedAt: new Date(),
    submissionDeadline: new Date(),
    description: 'Test description',
    client: {
      name: 'Test Client',
      type: 'PUBLIC'
    },
    documents: [],
    milestones: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'test-user',
    tags: ['test']
  };

  beforeEach(() => {
    jest.clearAllMocks();
    persistence = new AODrivePersistence();
  });

  describe('Structure des dossiers', () => {
    it('devrait initialiser la structure des dossiers', async () => {
      mockDriveAPI.files.list.mockResolvedValueOnce({ data: { files: [] } });
      mockDriveAPI.files.create.mockImplementation((params) => ({
        data: {
          id: 'mock-folder-id',
          name: params.resource.name
        }
      }));

      await expect(persistence.initializeFolderStructure())
        .resolves.not.toThrow();

      expect(mockDriveAPI.files.create).toHaveBeenCalledWith(
        expect.objectContaining({
          resource: expect.objectContaining({
            mimeType: 'application/vnd.google-apps.folder'
          })
        })
      );
    });

    it('ne devrait pas recréer les dossiers existants', async () => {
      mockDriveAPI.files.list.mockResolvedValue({
        data: {
          files: [{
            id: 'existing-folder',
            name: 'SAAOP_Data'
          }]
        }
      });

      await persistence.initializeFolderStructure();
      expect(mockDriveAPI.files.create).not.toHaveBeenCalled();
    });
  });

  describe('Sauvegarde d\'AO', () => {
    beforeEach(() => {
      mockDriveAPI.files.list.mockResolvedValue({
        data: {
          files: [{
            id: 'mock-folder-id',
            name: 'new'
          }]
        }
      });
    });

    it('devrait créer un nouveau fichier pour un nouvel AO', async () => {
      mockDriveAPI.files.list.mockResolvedValueOnce({ data: { files: [] } });
      mockDriveAPI.files.create.mockResolvedValueOnce({
        data: {
          id: 'new-file-id',
          name: `ao_${mockAO.id}.json`
        }
      });

      await expect(persistence.saveAO(mockAO))
        .resolves.not.toThrow();

      expect(mockDriveAPI.files.create).toHaveBeenCalledWith(
        expect.objectContaining({
          resource: expect.objectContaining({
            mimeType: 'application/json'
          })
        })
      );
    });

    it('devrait mettre à jour un fichier existant', async () => {
      const existingFileId = 'existing-file-id';
      mockDriveAPI.files.list.mockResolvedValueOnce({
        data: {
          files: [{
            id: existingFileId,
            name: `ao_${mockAO.id}.json`
          }]
        }
      });

      mockDriveAPI.files.get.mockResolvedValueOnce({
        data: {
          metadata: {
            version: 1
          },
          data: mockAO
        }
      });

      await expect(persistence.saveAO(mockAO))
        .resolves.not.toThrow();

      expect(mockDriveAPI.files.update).toHaveBeenCalledWith(
        expect.objectContaining({
          fileId: existingFileId
        })
      );
    });
  });

  describe('Récupération d\'AO', () => {
    it('devrait retourner null si l\'AO n\'existe pas', async () => {
      mockDriveAPI.files.list.mockResolvedValueOnce({
        data: { files: [] }
      });

      const result = await persistence.getAO('non-existent-id');
      expect(result).toBeNull();
    });

    it('devrait retourner l\'AO s\'il existe', async () => {
      mockDriveAPI.files.list.mockResolvedValueOnce({
        data: {
          files: [{
            id: 'existing-file-id',
            name: `ao_${mockAO.id}.json`
          }]
        }
      });

      mockDriveAPI.files.get.mockResolvedValueOnce({
        data: {
          metadata: {
            version: 1
          },
          data: mockAO
        }
      });

      const result = await persistence.getAO(mockAO.id);
      expect(result).toEqual(mockAO);
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs d\'API Drive', async () => {
      mockDriveAPI.files.list.mockRejectedValueOnce(
        new Error('Drive API Error')
      );

      await expect(persistence.saveAO(mockAO))
        .rejects.toThrow();
    });

    it('devrait gérer les erreurs de parsing JSON', async () => {
      mockDriveAPI.files.list.mockResolvedValueOnce({
        data: {
          files: [{
            id: 'existing-file-id',
            name: `ao_${mockAO.id}.json`
          }]
        }
      });

      mockDriveAPI.files.get.mockResolvedValueOnce({
        data: 'Invalid JSON'
      });

      await expect(persistence.getAO(mockAO.id))
        .rejects.toThrow();
    });
  });
});