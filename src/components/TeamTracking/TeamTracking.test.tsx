import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamTracking from './TeamTracking';

// Mock des composants UI externes
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }) => <div data-testid="card-title">{children}</div>,
  CardContent: ({ children }) => <div data-testid="card-content">{children}</div>,
}));

// Mock des icônes Lucide
jest.mock('lucide-react', () => ({
  Users: () => <span data-testid="users-icon">Users</span>,
  Film: () => <span data-testid="film-icon">Film</span>,
  Calendar: () => <span data-testid="calendar-icon">Calendar</span>,
  AlertTriangle: () => <span data-testid="alert-icon">Alert</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
}));

describe('TeamTracking Component', () => {
  beforeEach(() => {
    // Reset du temps pour les tests de date
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-04'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('devrait afficher le loader au démarrage', () => {
    render(<TeamTracking />);
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
    expect(screen.getByText('Chargement des données...')).toBeInTheDocument();
  });

  it('devrait afficher les données des équipes après chargement', async () => {
    render(<TeamTracking />);
    
    // Attendre que les données soient chargées (1s de délai simulé)
    await waitFor(() => {
      expect(screen.queryByText('Chargement des données...')).not.toBeInTheDocument();
    }, { timeout: 2000 });

    // Vérifier les équipes
    expect(screen.getByText('Équipe Technique')).toBeInTheDocument();
    expect(screen.getByText('Production')).toBeInTheDocument();

    // Vérifier les membres
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('Marie Martin')).toBeInTheDocument();
    expect(screen.getByText('Pierre Dubois')).toBeInTheDocument();
  });

  it('devrait calculer correctement la charge de travail', async () => {
    render(<TeamTracking />);
    
    await waitFor(() => {
      expect(screen.queryByText('Chargement des données...')).not.toBeInTheDocument();
    }, { timeout: 2000 });

    // Jean Dupont: 40% + 30% = 70%
    expect(screen.getByText('70% charge')).toBeInTheDocument();
    
    // Marie Martin: 60%
    expect(screen.getByText('60% charge')).toBeInTheDocument();
    
    // Pierre Dubois: 25% + 25% + 30% = 80%
    expect(screen.getByText('80% charge')).toBeInTheDocument();
  });

  it('devrait appliquer les bonnes classes de couleur selon la charge', async () => {
    render(<TeamTracking />);
    
    await waitFor(() => {
      expect(screen.queryByText('Chargement des données...')).not.toBeInTheDocument();
    }, { timeout: 2000 });

    // Pierre Dubois (80%) - Doit être en rouge
    const chargeElevee = screen.getByText('80% charge');
    expect(chargeElevee.classList.contains('bg-red-100')).toBeTruthy();
    expect(chargeElevee.classList.contains('text-red-800')).toBeTruthy();

    // Jean Dupont (70%) - Doit être en jaune
    const chargeMoyenne = screen.getByText('70% charge');
    expect(chargeMoyenne.classList.contains('bg-yellow-100')).toBeTruthy();
    expect(chargeMoyenne.classList.contains('text-yellow-800')).toBeTruthy();

    // Marie Martin (60%) - Doit être en jaune aussi
    const chargeNormale = screen.getByText('60% charge');
    expect(chargeNormale.classList.contains('bg-yellow-100')).toBeTruthy();
    expect(chargeNormale.classList.contains('text-yellow-800')).toBeTruthy();
  });

  it('devrait formater correctement les dates de disponibilité', async () => {
    render(<TeamTracking />);
    
    await waitFor(() => {
      expect(screen.queryByText('Chargement des données...')).not.toBeInTheDocument();
    }, { timeout: 2000 });

    // Vérifier le formatage des dates
    expect(screen.getByText('15/02/2024')).toBeInTheDocument(); // Jean Dupont
    expect(screen.getByText('04/01/2024')).toBeInTheDocument(); // Marie Martin
    expect(screen.getByText('01/03/2024')).toBeInTheDocument(); // Pierre Dubois
  });

  it('devrait gérer correctement l\'état d\'erreur', async () => {
    // Simuler une erreur en modifiant l'effet
    jest.spyOn(React, 'useEffect').mockImplementationOnce((effect) => {
      effect();
    });
    
    // Forcer une erreur en modifiant l'état
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [
      true,
      jest.fn(),
    ]).mockImplementationOnce(() => [
      'Erreur lors du chargement des données équipes',
      jest.fn(),
    ]);

    render(<TeamTracking />);

    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    expect(screen.getByText('Erreur lors du chargement des données équipes')).toBeInTheDocument();
  });
});