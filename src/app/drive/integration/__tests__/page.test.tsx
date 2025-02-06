import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DriveIntegrationPage from '../page';

// Mock le hook useDrive
jest.mock('../../provider/page', () => ({
  useDrive: () => ({
    isAuthenticated: true,
    isInitializing: false,
    error: null
  })
}));

// Mock fetch
global.fetch = jest.fn();

describe('DriveIntegrationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches status and metrics on mount when authenticated', async () => {
    const mockStatus = {
      status: 'success',
      lastSync: new Date().toISOString(),
      message: 'Sync successful'
    };

    const mockMetrics = {
      hitRate: 95.5,
      size: 100,
      lastCleared: new Date().toISOString()
    };

    // Mock les appels API
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ // Status
        ok: true,
        json: async () => mockStatus
      })
      .mockResolvedValueOnce({ // Metrics
        ok: true,
        json: async () => mockMetrics
      });

    render(<DriveIntegrationPage />);

    // Vérifie que les appels API ont été faits
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/drive/sync/status');
      expect(global.fetch).toHaveBeenCalledWith('/api/drive/metrics');
    });

    // Vérifie que les données sont affichées
    await waitFor(() => {
      expect(screen.getByText('95.5%')).toBeInTheDocument();
      expect(screen.getByText('100 items')).toBeInTheDocument();
    });
  });

  it('handles sync status error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false
    });

    render(<DriveIntegrationPage />);

    await waitFor(() => {
      expect(screen.getByText('Erreur de récupération du statut')).toBeInTheDocument();
    });
  });

  it('displays metrics error gracefully', async () => {
    // Mock status success mais metrics failure
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'success' })
      })
      .mockRejectedValueOnce(new Error('Metrics error'));

    render(<DriveIntegrationPage />);

    // Les métriques par défaut devraient être affichées
    await waitFor(() => {
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('0 items')).toBeInTheDocument();
    });
  });

  it('shows syncing state correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'syncing',
        message: 'Synchronisation en cours'
      })
    });

    render(<DriveIntegrationPage />);

    await waitFor(() => {
      expect(screen.getByText('Synchronisation en cours...')).toBeInTheDocument();
    });
  });

  it('updates status periodically', async () => {
    jest.useFakeTimers();

    const mockStatus = {
      status: 'success',
      lastSync: new Date().toISOString()
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockStatus
    });

    render(<DriveIntegrationPage />);

    // Premier appel
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // Status + Metrics
    });

    // Avance le temps de 5 secondes (intervalle de refresh du status)
    jest.advanceTimersByTime(5000);

    // Deuxième appel
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3); // +1 Status
    });

    jest.useRealTimers();
  });

  it('cleans up intervals on unmount', () => {
    jest.useFakeTimers();
    
    const { unmount } = render(<DriveIntegrationPage />);
    
    // Spy sur clearInterval
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    
    clearIntervalSpy.mockRestore();
    jest.useRealTimers();
  });

  it('shows not authenticated message when not authenticated', () => {
    // Override le mock de useDrive pour ce test
    jest.spyOn(require('../../provider/page'), 'useDrive').mockImplementation(() => ({
      isAuthenticated: false,
      isInitializing: false,
      error: null
    }));

    render(<DriveIntegrationPage />);

    expect(screen.getByText('Veuillez vous connecter pour accéder à l'intégration Drive')).toBeInTheDocument();
  });
});