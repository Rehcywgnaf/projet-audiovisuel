import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import VersionManager from './VersionManager';

// Mock du timing pour les tests
jest.useFakeTimers();

describe('VersionManager Component', () => {
  beforeEach(() => {
    // Reset tous les mocks avant chaque test
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

    it('devrait afficher l\'indicateur de synchronisation', async () => {
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

    it('devrait gérer les erreurs de chargement', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<VersionManager />);
      
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText('Erreur de synchronisation avec Google Drive')).toBeInTheDocument();
    });
  });

  // ... reste des tests comme défini précédemment ...
});