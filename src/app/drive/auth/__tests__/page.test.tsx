import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import DriveAuthPage from '../page';

// Mock fetch globally
global.fetch = jest.fn();
// Mock window.location
const mockLocation = new URL('http://localhost:3000');
Object.defineProperty(window, 'location', {
  value: {
    ...window.location,
    href: mockLocation.href,
    search: '',
    pathname: '/',
    replace: jest.fn(),
  },
  writable: true,
});

describe('DriveAuthPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login button when not authenticated', () => {
    render(<DriveAuthPage />);
    expect(screen.getByText('Se connecter à Google Drive')).toBeInTheDocument();
  });

  it('handles login click correctly', async () => {
    const mockResponse = { url: 'https://google.com/auth' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<DriveAuthPage />);
    
    const loginButton = screen.getByText('Se connecter à Google Drive');
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/drive/operation/auth-url');
    expect(window.location.href).toBe(mockResponse.url);
  });

  it('displays error message when auth-url fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(<DriveAuthPage />);
    
    const loginButton = screen.getByText('Se connecter à Google Drive');
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(await screen.findByText("Erreur lors de la récupération de l'URL d'authentification"))
      .toBeInTheDocument();
  });

  it('processes auth code from URL correctly', async () => {
    const searchParams = new URLSearchParams({ code: 'test-auth-code' });
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        search: `?${searchParams.toString()}`,
      },
      writable: true,
    });

    const mockAuthResponse = { isAuthenticated: true };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthResponse,
    });

    render(<DriveAuthPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/drive/operation/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: 'test-auth-code' }),
      });
    });
  });

  it('handles logout correctly', async () => {
    // Simulate authenticated state
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: true }),
    });

    const { rerender } = render(<DriveAuthPage />);
    
    // Wait for component to update with authenticated state
    await waitFor(() => {
      rerender(<DriveAuthPage />);
    });

    // Mock logout API call
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    const logoutButton = screen.getByText('Se déconnecter');
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/drive/operation/logout', {
      method: 'POST',
    });
  });

  it('displays loading state during API calls', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<DriveAuthPage />);
    
    const loginButton = screen.getByText('Se connecter à Google Drive');
    fireEvent.click(loginButton);

    expect(await screen.findByText('Chargement...')).toBeInTheDocument();
  });
});