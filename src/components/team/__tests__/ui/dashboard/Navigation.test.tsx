import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navigation } from '../../../ui/dashboard/Navigation';

describe('Navigation', () => {
  const mockTeams = [
    { id: '1', name: 'Team A', members: [], projects: [] },
    { id: '2', name: 'Team B', members: [], projects: [] }
  ];

  const mockOnTeamSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders teams list', () => {
    render(
      <Navigation 
        teams={mockTeams}
        onTeamSelect={mockOnTeamSelect}
      />
    );
    
    expect(screen.getByText('Team A')).toBeInTheDocument();
    expect(screen.getByText('Team B')).toBeInTheDocument();
  });

  it('calls onTeamSelect when team is selected', () => {
    render(
      <Navigation 
        teams={mockTeams}
        onTeamSelect={mockOnTeamSelect}
        selectedTeamId="1"
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2' } });
    
    expect(mockOnTeamSelect).toHaveBeenCalledWith('2');
  });

  it('shows "Toutes les équipes" as default option', () => {
    render(
      <Navigation 
        teams={mockTeams}
        onTeamSelect={mockOnTeamSelect}
      />
    );
    
    expect(screen.getByText('Toutes les équipes')).toBeInTheDocument();
  });

  it('sets correct selected value', () => {
    render(
      <Navigation 
        teams={mockTeams}
        onTeamSelect={mockOnTeamSelect}
        selectedTeamId="2"
      />
    );
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('2');
  });
});