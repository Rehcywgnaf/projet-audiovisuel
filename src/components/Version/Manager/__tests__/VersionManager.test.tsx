import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import VersionManager from '../index';

jest.useFakeTimers();

describe('VersionManager Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu initial', () => {
    it('devrait afficher le titre correct', () => {
      render(<VersionManager />);
      expect(screen.getByText('Gestionnaire de Versions')).toBeInTheDocument();
    });

    it('devrait afficher le bouton de création de version', () => {
      render(<VersionManager />);
      expect(screen.getByText('Créer nouvelle version')).toBeInTheDocument();
    });

    it('devrait afficher l\'indicateur de synchronisation', () => {
      render(<VersionManager />);
      expect(screen.getByText(/Les versions sont automatiquement synchronisées/)).toBeInTheDocument();
    });
  });

  describe('Chargement des versions', () => {
    it('devrait afficher un indicateur de chargement pendant l\'initialisation', () => {
      render(<VersionManager />);
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('devrait charger et afficher les versions initiales', async () => {
      render(<VersionManager />);
      
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText('Dossier_AO_2024.docx')).toBeInTheDocument();
      expect(screen.getByText(/Version 1.2/)).toBeInTheDocument();
    });
  });

  describe('Gestion des versions', () => {
    it('devrait permettre la création d\'une nouvelle version', async () => {
      render(<VersionManager />);
      
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      const createButton = screen.getByText('Créer nouvelle version');
      fireEvent.click(createButton);

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText(/Version 1.3/)).toBeInTheDocument();
    });

    it('devrait permettre la restauration d\'une version précédente', async () => {
      render(<VersionManager />);
      
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      const restoreButton = screen.getAllByTitle('Restaurer cette version')[0];
      fireEvent.click(restoreButton);

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getAllByText('Version courante').length).toBe(1);
    });
  });
});