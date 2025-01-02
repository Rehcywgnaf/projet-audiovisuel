import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DriveService } from '@/services';
import { IntegrationDrive } from '@/components';

describe('Tests intégration Drive', () => {
  const mockConfig = {
    clientId: 'test-client-id',
    apiKey: 'test-api-key',
    scope: ['https://www.googleapis.com/auth/drive.file']
  };

  test('Chargement initial des documents', async () => {
    const driveService = new DriveService(mockConfig);
    const mockDocs = [
      { id: '1', name: 'Doc1', type: 'document' },
      { id: '2', name: 'Doc2', type: 'spreadsheet' }
    ];

    jest.spyOn(driveService, 'chargerDocuments').mockResolvedValue(mockDocs);

    render(<IntegrationDrive config={mockConfig} />);

    await waitFor(() => {
      expect(screen.getByText('Doc1')).toBeInTheDocument();
      expect(screen.getByText('Doc2')).toBeInTheDocument();
    });
  });

  test('Gestion des erreurs', async () => {
    const driveService = new DriveService(mockConfig);
    jest.spyOn(driveService, 'chargerDocuments')
      .mockRejectedValue(new Error('Erreur test'));

    render(<IntegrationDrive config={mockConfig} />);

    await waitFor(() => {
      expect(screen.getByText('Erreur')).toBeInTheDocument();
    });
  });

  test('Mise à jour des permissions', async () => {
    const driveService = new DriveService(mockConfig);
    const mockUpdatePermissions = jest.spyOn(driveService, 'mettreAJourPermissions');

    render(<IntegrationDrive config={mockConfig} />);

    await waitFor(() => {
      const doc = screen.getByText('Doc1');
      fireEvent.click(doc);
      expect(mockUpdatePermissions).toHaveBeenCalled();
    });
  });
});
