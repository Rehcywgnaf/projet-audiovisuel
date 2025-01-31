import React from 'react';
import { render, screen } from '@testing-library/react';
import { KPIs } from '../../../ui/dashboard/KPIs';

describe('KPIs', () => {
  const mockTeams = [
    {
      id: '1',
      name: 'Team A',
      members: [
        {
          id: 'm1',
          name: 'John',
          role: 'Dev',
          availability: 80,
          currentProjects: ['P1', 'P2'],
          nextAvailable: '2024-02-01'
        },
        {
          id: 'm2',
          name: 'Jane',
          role: 'Designer',
          availability: 20,
          currentProjects: ['P1'],
          nextAvailable: '2024-02-15'
        }
      ],
      projects: ['P1', 'P2']
    }
  ];

  it('calculates and displays correct KPIs', () => {
    render(<KPIs teams={mockTeams} />);
    
    expect(screen.getByText('2')).toBeInTheDocument(); // Member count
    expect(screen.getByText('2')).toBeInTheDocument(); // Projects count
    expect(screen.getByText('50%')).toBeInTheDocument(); // Average availability
    expect(screen.getByText('1')).toBeInTheDocument(); // Low availability alerts
  });

  it('handles empty teams array', () => {
    render(<KPIs teams={[]} />);
    
    expect(screen.getByText('0')).toBeInTheDocument(); // Member count
    expect(screen.getByText('0')).toBeInTheDocument(); // Projects count
    expect(screen.getByText('0%')).toBeInTheDocument(); // Average availability
    expect(screen.getByText('0')).toBeInTheDocument(); // Alerts
  });

  it('displays warning style for low availability', () => {
    render(<KPIs teams={mockTeams} />);
    
    const alertCard = screen.getByText('1').closest('.bg-red-50');
    expect(alertCard).toBeInTheDocument();
  });
});