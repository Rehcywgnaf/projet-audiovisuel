import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DashboardPrincipal from './DashboardPrincipal';

// Mock des composants recharts pour les tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
}));

describe('DashboardPrincipal', () => {
  // Test du rendu initial
  it('affiche les sections principales', () => {
    render(<DashboardPrincipal />);
    
    expect(screen.getByText('Nouvelles Opportunités')).toBeInTheDocument();
    expect(screen.getByText('Activité Projets & Performance')).toBeInTheDocument();
    expect(screen.getByText('Points d\'Attention')).toBeInTheDocument();
  });

  // Test des opportunités
  it('affiche correctement les opportunités', () => {
    render(<DashboardPrincipal />);
    
    expect(screen.getByText('Production Documentaire Innovation')).toBeInTheDocument();
    expect(screen.getByText('Match 92%')).toBeInTheDocument();
  });

  // Test des métriques
  it('affiche les métriques clés', () => {
    render(<DashboardPrincipal />);
    
    expect(screen.getByText('12')).toBeInTheDocument(); // Projets Actifs
    expect(screen.getByText('78%')).toBeInTheDocument(); // Taux de Succès
    expect(screen.getByText('8')).toBeInTheDocument(); // Équipes Mobilisées
  });

  // Test des alertes
  it('affiche les points d\'attention', () => {
    render(<DashboardPrincipal />);
    
    expect(screen.getByText('3 deadlines approchent dans les 7 prochains jours')).toBeInTheDocument();
    expect(screen.getByText('2 revues de projet planifiées cette semaine')).toBeInTheDocument();
    expect(screen.getByText('5 documents en attente de validation')).toBeInTheDocument();
  });
});