import { render, screen } from '@testing-library/react';
import { GestionDeadlines } from '@/components';

describe('Tests intégration Deadlines', () => {
  test('Affichage des deadlines', async () => {
    const mockDeadlines = [{
      id: 1,
      projet: 'Test Projet',
      date: '2024-02-15',
      priorite: 'haute'
    }];

    render(<GestionDeadlines deadlines={mockDeadlines} />);

    expect(screen.getByText('Test Projet')).toBeInTheDocument();
    expect(screen.getByText('15/02/2024')).toBeInTheDocument();
  });

  test('Filtrage par priorité', () => {
    const mockDeadlines = [
      { id: 1, projet: 'Urgent', date: '2024-02-15', priorite: 'haute' },
      { id: 2, projet: 'Normal', date: '2024-02-20', priorite: 'moyenne' }
    ];

    render(<GestionDeadlines deadlines={mockDeadlines} />);

    const hautePriorite = screen.getByText('Haute');
    expect(hautePriorite).toHaveClass('bg-red-100');
  });
});
