import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { TeamManager } from '../../Teams/TeamManager';

jest.mock('../../Teams/TeamManager');

describe('Dashboard', () => {
  const mockTeams = [
    {
      id: '1',
      name: 'Team A',
      members: [{
        id: 'm1',
        name: 'John',
        role: 'Dev',
        availability: 80,
        currentProjects: ['P1'],
        nextAvailable: '2024-02-01'
      }],
      projects: ['P1']
    },
    {
      id: '2',
      name: 'Team B',
      members: [],
      projects: []
    }
  ];

  beforeEach(() => {
    (TeamManager as jest.Mock).mockImplementation(() => ({
      subscribe: jest.fn(cb => {
        cb({
          teams: mockTeams,
          loading: false,
          error: null
        });
        return () => {};
      }),
      fetchTeams: jest.fn()
    }));
  });

  it('renders navigation and KPIs', () => {
    render(<Dashboard teamManager={new TeamManager()} />);
    
    expect(screen.getByText('Team A')).toBeInTheDocument();
    expect(screen.getByText('Team B')).toBeInTheDocument();
    expect(screen.getByText('Équipes')).toBeInTheDocument();
    expect(screen.getByText('Projets')).toBeInTheDocument();
  });

  it('filters teams on selection', () => {
    render(<Dashboard teamManager={new TeamManager()} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });
    
    expect(screen.getByText('1')).toBeInTheDocument(); // Member count in KPIs
    expect(screen.getByText('80%')).toBeInTheDocument(); // Availability in KPIs
  });

  it('handles loading state', () => {
    (TeamManager as jest.Mock).mockImplementation(() => ({
      subscribe: jest.fn(cb => {
        cb({ teams: [], loading: true, error: null });
        return () => {};
      }),
      fetchTeams: jest.fn()
    }));

    render(<Dashboard teamManager={new TeamManager()} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles error state', () => {
    const error = 'Failed to load dashboard';
    (TeamManager as jest.Mock).mockImplementation(() => ({
      subscribe: jest.fn(cb => {
        cb({ teams: [], loading: false, error });
        return () => {};
      }),
      fetchTeams: jest.fn()
    }));

    render(<Dashboard teamManager={new TeamManager()} />);
    expect(screen.getByText(error)).toBeInTheDocument();
  });
});