import { AOService } from '../aoService';
import { aoDrivePersistence } from '../persistence/drivePersistence';
import { AO, AOStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../persistence/drivePersistence', () => ({
  aoDrivePersistence: {
    saveAO: jest.fn(),
    getAO: jest.fn()
  }
}));

describe('AOService', () => {
  let service: AOService;
  
  const mockRSSItem = {
    title: 'Test AO from RSS',
    description: 'Deadline: 01/02/2024\nPour le compte de: Test Client\nBudget: 100k€',
    link: 'http://test.com',
    pubDate: '2024-01-01T10:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AOService();
  });

  describe('Création depuis RSS avec persistance', () => {
    it('devrait créer et persister un AO depuis un flux RSS', async () => {
      const ao = await service.createFromRSS(mockRSSItem);
      
      expect(aoDrivePersistence.saveAO).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          title: mockRSSItem.title,
          source: 'RSS'
        })
      );

      expect(ao).toMatchObject({
        title: mockRSSItem.title,
        source: 'RSS',
        status: 'NEW'
      });
    });

    it('devrait extraire correctement les informations du RSS', async () => {
      const ao = await service.createFromRSS(mockRSSItem);
      
      expect(ao.client.name).toBe('Test Client');
      expect(ao.client.type).toBe('PUBLIC');
      expect(ao.tags).toContain('budget-moyen');
    });

    it('devrait gérer les erreurs de persistance', async () => {
      (aoDrivePersistence.saveAO as jest.Mock).mockRejectedValueOnce(
        new Error('Save failed')
      );

      await expect(service.createFromRSS(mockRSSItem))
        .rejects.toThrow('Échec de la sauvegarde sur Drive');
    });
  });

  describe('Création manuelle avec persistance', () => {
    const mockAOData = {
      title: 'Test Manual AO',
      description: 'Test description',
      client: {
        name: 'Test Client',
        type: 'PUBLIC' as const
      }
    };

    it('devrait créer et persister un AO manuellement', async () => {
      const ao = await service.create(mockAOData);

      expect(aoDrivePersistence.saveAO).toHaveBeenCalledWith(
        expect.objectContaining({
          title: mockAOData.title,
          source: 'MANUAL'
        })
      );

      expect(ao).toMatchObject(mockAOData);
    });

    it('devrait générer un ID unique', async () => {
      const ao1 = await service.create(mockAOData);
      const ao2 = await service.create(mockAOData);

      expect(ao1.id).not.toBe(ao2.id);
    });
  });

  describe('Mise à jour avec persistance', () => {
    it('devrait mettre à jour et persister les modifications', async () => {
      const mockAO: AO = {
        id: uuidv4(),
        title: 'Original Title',
        reference: 'AO-TEST',
        source: 'MANUAL',
        status: 'NEW' as AOStatus,
        publishedAt: new Date(),
        submissionDeadline: new Date(),
        description: '',
        client: {
          name: '',
          type: 'PUBLIC'
        },
        documents: [],
        milestones: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'test',
        tags: []
      };

      await service.create(mockAO);

      const updates = {
        title: 'Updated Title',
        status: 'IN_PROGRESS' as AOStatus
      };

      const updatedAO = await service.update(mockAO.id, updates);

      expect(aoDrivePersistence.saveAO).toHaveBeenLastCalledWith(
        expect.objectContaining({
          id: mockAO.id,
          title: updates.title,
          status: updates.status
        })
      );

      expect(updatedAO).toMatchObject(updates);
    });

    it('devrait gérer les erreurs de mise à jour', async () => {
      const mockId = uuidv4();
      (aoDrivePersistence.saveAO as jest.Mock).mockRejectedValueOnce(
        new Error('Update failed')
      );

      await expect(
        service.update(mockId, { title: 'New Title' })
      ).rejects.toThrow();
    });
  });

  describe('Extraction de données', () => {
    const testCases = [
      {
        desc: 'devrait détecter un client public',
        text: 'Pour le ministère de la Culture',
        expectedType: 'PUBLIC'
      },
      {
        desc: 'devrait détecter la deadline',
        text: 'Date limite: 15/03/2024',
        expectedDate: new Date(2024, 2, 15)
      },
      {
        desc: 'devrait détecter le budget',
        text: 'Budget estimé: 150k€',
        expectedTags: ['budget-moyen']
      }
    ];

    testCases.forEach(({ desc, text, ...expected }) => {
      it(desc, async () => {
        const ao = await service.createFromRSS({
          ...mockRSSItem,
          description: text
        });

        if (expected.expectedType) {
          expect(ao.client.type).toBe(expected.expectedType);
        }
        if (expected.expectedDate) {
          expect(ao.submissionDeadline).toEqual(expected.expectedDate);
        }
        if (expected.expectedTags) {
          expect(ao.tags).toEqual(expect.arrayContaining(expected.expectedTags));
        }
      });
    });
  });
});