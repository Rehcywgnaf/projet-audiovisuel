import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeamTracking from '../TeamTracking';
import { TeamManager } from '../../Teams/TeamManager';

jest.mock('../../Teams/TeamManager');

describe('TeamTracking', () => {
  const mockTeam = {
    id: '1',
    name: 'Team A',
    members: [
      {
        id: 'm1',
        name: 'John Doe',
        role: 'Developer',
        availability: 80,
        currentProjects: ['Project X'],
        nextAvailable: '2024-02-01'
      }
    ],
    projects: ['Project X']
  };

  beforeEach(() => {
    (TeamManager as jest.Mock).mockImplementation(() => ({
      subscribe: jest.fn(cb => {
        cb({
          teams: [mockTeam],
          loading: false,
          error: null
        });
        return () => {};
      }),
      fetchTeams: jest.fn(),
      updateMemberAvailability: jest.fn()
    }));
  });

  it('renders team information', () => {
    render(<TeamTracking teamManager={new TeamManager()} />);
    
    expect(screen.getByText('Team A')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Project X')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    (TeamManager as jest.Mock).mockImplementation(() => ({
      subscribe: jest.fn(cb => {
        cb({ teams: [], loading: true, error: null });
        return () => {};
      }),
      fetchTeams: jest.fn()
    }));

    render(<TeamTracking teamManager={new TeamManager()} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles error state', () => {
    const error = 'Failed to load teams';
    (TeamManager as jest.Mock).mockImplementation(() => ({
      subscribe: jest.fn(cb => {
        cb({ teams: [], loading: false, error });
        return () => {};
      }),
      fetchTeams: jest.fn()
    }));

    render(<TeamTracking teamManager={new TeamManager()} />);
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('updates member availability', () => {
    const mockTeamManager = new TeamManager();
    render(<TeamTracking teamManager={mockTeamManager} />);

    const availabilityInput = screen.getByRole('slider');
    fireEvent.change(availabilityInput, { target: { value: '90' } });

    expect(mockTeamManager.updateMemberAvailability)
      .toHaveBeenCalledWith('m1', 90);
  });
});