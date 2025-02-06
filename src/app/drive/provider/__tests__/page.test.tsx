import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { DriveProvider, useDrive } from '../page';

// Mock fetch
global.fetch = jest.fn();

// Test component qui utilise le hook useDrive
const TestComponent = () => {
  const { isAuthenticated, isInitializing, error } = useDrive();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="init-status">{isInitializing ? 'initializing' : 'ready'}</div>
      {error && <div data-testid="error">{error}</div>}
    </div>
  );
};

describe('DriveProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial state correctly', () => {
    const { getByTestId } = render(
      <DriveProvider>
        <TestComponent />
      </DriveProvider>
    );

    expect(getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    expect(getByTestId('init-status')).toHaveTextContent('initializing');
  });

  it('checks auth status on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: true }),
    });

    const { getByTestId } = render(
      <DriveProvider>
        <TestComponent />
      </DriveProvider>
    );

    await waitFor(() => {
      expect(getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(getByTestId('init-status')).toHaveTextContent('ready');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/drive/operation/status');
  });

  it('handles auth check failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const { getByTestId } = render(
      <DriveProvider>
        <TestComponent />
      </DriveProvider>
    );

    await waitFor(() => {
      expect(getByTestId('error')).toHaveTextContent('Erreur lors de la vérification du statut');
      expect(getByTestId('init-status')).toHaveTextContent('ready');
    });
  });

  it('handles network error during auth check', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { getByTestId } = render(
      <DriveProvider>
        <TestComponent />
      </DriveProvider>
    );

    await waitFor(() => {
      expect(getByTestId('error')).toHaveTextContent('Network error');
      expect(getByTestId('init-status')).toHaveTextContent('ready');
    });
  });

  it('throws error when useDrive is used outside provider', () => {
    // Spy on console.error to prevent error from being logged in test output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useDrive doit être utilisé dans un DriveProvider');

    (console.error as jest.Mock).mockRestore();
  });

  it('updates state when auth status changes', async () => {
    // Initial auth check
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: false }),
    });

    const { getByTestId, rerender } = render(
      <DriveProvider>
        <TestComponent />
      </DriveProvider>
    );

    await waitFor(() => {
      expect(getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    });

    // Simulate auth status change
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: true }),
    });

    rerender(
      <DriveProvider>
        <TestComponent />
      </DriveProvider>
    );

    await waitFor(() => {
      expect(getByTestId('auth-status')).toHaveTextContent('authenticated');
    });
  });
});