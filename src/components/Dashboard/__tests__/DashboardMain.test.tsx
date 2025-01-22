import { render, screen, waitFor } from '@testing-library/react';
import DashboardMain from '../Main/DashboardMain';

describe('DashboardMain', () => {
  it('devrait afficher le loading au démarrage', () => {
    render(<DashboardMain />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('devrait afficher les données après le chargement', async () => {
    render(<DashboardMain />);
    await waitFor(() => {
      expect(screen.getByText('Vue d\'ensemble')).toBeInTheDocument();
    });
  });

  // Ajouter d'autres tests selon les besoins
});