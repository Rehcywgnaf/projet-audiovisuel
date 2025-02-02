import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import VersionManager from '../Manager/VersionManager';
import DriveCore from '@/components/Drive/Core/DriveCore';
import DriveSync from '@/components/Drive/Core/DriveSync';
import { PermissionManager } from '@/core/permissions/PermissionManager';
import { CacheManager } from '@/cache/CacheManager';

// Mock des dépendances
vi.mock('@/components/Drive/Core/DriveCore');
vi.mock('@/components/Drive/Core/DriveSync');
vi.mock('@/core/permissions/PermissionManager');
vi.mock('@/cache/CacheManager');

describe('VersionManager', () => {
  const mockVersions = [
    {
      id: 'v1',
      filename: "Test.docx",
      version: "1.0",
      lastModified: "2024-02-02 10:00",
      author: "Test User",
      status: "archived"
    }
  ];

  beforeEach(() => {
    // Reset des mocks
    vi.clearAllMocks();

    // Configuration des mocks par défaut
    vi.mocked(PermissionManager.checkPermission).mockResolvedValue(true);
    vi.mocked(DriveCore.listVersions).mockResolvedValue(mockVersions);
    vi.mocked(DriveCore.getCurrentUser).mockResolvedValue("Test User");
    vi.mocked(CacheManager.get).mockResolvedValue(null);
    vi.mocked(CacheManager.set).mockResolvedValue(undefined);
    vi.mocked(DriveSync.addToQueue).mockResolvedValue(undefined);
  });

  describe('Initialisation', () => {
    it('vérifie les permissions au chargement', async () => {
      render(<VersionManager />);
      
      await waitFor(() => {
        expect(PermissionManager.checkPermission).toHaveBeenCalledWith('version.read');
      });
    });

    it('charge les versions depuis le cache si disponible', async () => {
      vi.mocked(CacheManager.get).mockResolvedValueOnce(mockVersions);
      
      render(<VersionManager />);
      
      await waitFor(() => {
        expect(DriveCore.listVersions).not.toHaveBeenCalled();
        expect(screen.getByText('Test.docx')).toBeInTheDocument();
      });
    });

    it('charge les versions depuis Drive si pas en cache', async () => {
      render(<VersionManager />);
      
      await waitFor(() => {
        expect(DriveCore.listVersions).toHaveBeenCalled();
        expect(screen.getByText('Test.docx')).toBeInTheDocument();
      });
    });
  });

  describe('Gestion des Versions', () => {
    it('crée une nouvelle version', async () => {
      render(<VersionManager />);
      
      const createButton = await screen.findByText('Créer nouvelle version');
      fireEvent.click(createButton);
      
      await waitFor(() => {
        expect(PermissionManager.checkPermission).toHaveBeenCalledWith('version.create');
        expect(DriveSync.addToQueue).toHaveBeenCalledWith({
          type: 'VERSION_CREATE',
          data: expect.any(Object)
        });
      });
    });

    it('restaure une version archivée', async () => {
      render(<VersionManager />);
      
      const restoreButton = await screen.findByTitle('Restaurer cette version');
      fireEvent.click(restoreButton);
      
      await waitFor(() => {
        expect(PermissionManager.checkPermission).toHaveBeenCalledWith('version.restore');
        expect(DriveSync.addToQueue).toHaveBeenCalledWith({
          type: 'VERSION_RESTORE',
          data: expect.any(Object)
        });
      });
    });
  });

  describe('Gestion des Erreurs', () => {
    it('affiche une erreur si pas de permission', async () => {
      vi.mocked(PermissionManager.checkPermission).mockResolvedValueOnce(false);
      
      render(<VersionManager />);
      
      await waitFor(() => {
        expect(screen.getByText('Permissions insuffisantes')).toBeInTheDocument();
      });
    });

    it('affiche une erreur si problème Drive', async () => {
      vi.mocked(DriveCore.listVersions).mockRejectedValueOnce(new Error('Erreur Drive'));
      
      render(<VersionManager />);
      
      await waitFor(() => {
        expect(screen.getByText(/Erreur de synchronisation/)).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('respecte les temps de réponse cibles', async () => {
      const start = performance.now();
      
      render(<VersionManager />);
      const createButton = await screen.findByText('Créer nouvelle version');
      fireEvent.click(createButton);
      
      await waitFor(() => {
        expect(DriveSync.addToQueue).toHaveBeenCalled();
      });
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(200); // 200ms max
    });
  });

  describe('UI et Status', () => {
    it('affiche correctement le statut de synchronisation', async () => {
      render(<VersionManager />);
      
      // État initial
      expect(screen.getByTestId('sync-status')).toHaveTextContent('synced');
      
      // Pendant une opération
      const createButton = await screen.findByText('Créer nouvelle version');
      fireEvent.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('sync-status')).toHaveTextContent('syncing');
      });
      
      // Après l'opération
      await waitFor(() => {
        expect(screen.getByTestId('sync-status')).toHaveTextContent('synced');
      });
    });

    it('met à jour correctement la liste des versions', async () => {
      render(<VersionManager />);
      
      const createButton = await screen.findByText('Créer nouvelle version');
      fireEvent.click(createButton);
      
      await waitFor(() => {
        const versions = screen.getAllByRole('listitem');
        expect(versions).toHaveLength(mockVersions.length + 1);
      });
    });
  });
});