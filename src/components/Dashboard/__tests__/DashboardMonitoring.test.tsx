import { render, screen } from '@testing-library/react';
import DashboardMonitoring from '../Monitoring/DashboardMonitoring';

describe('DashboardMonitoring', () => {
  it('devrait rendre le titre correctement', () => {
    render(<DashboardMonitoring />);
    expect(screen.getByText('Monitoring Système')).toBeInTheDocument();
  });

  it('devrait afficher les métriques de monitoring', () => {
    render(<DashboardMonitoring />);
    expect(screen.getByText('Utilisateurs Actifs')).toBeInTheDocument();
    expect(screen.getByText('Temps de Réponse Moyen')).toBeInTheDocument();
  });

  // Ajouter d'autres tests selon les besoins
});