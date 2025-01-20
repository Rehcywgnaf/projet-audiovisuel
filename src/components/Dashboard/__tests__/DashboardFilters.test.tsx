import { render, screen, fireEvent } from '@testing-library/react';
import DashboardFilters from '../Filters/DashboardFilters';

describe('DashboardFilters', () => {
  it('devrait rendre le titre correctement', () => {
    render(<DashboardFilters />);
    expect(screen.getByText('Filtres du Dashboard')).toBeInTheDocument();
  });

  // Ajouter d'autres tests selon les besoins
});