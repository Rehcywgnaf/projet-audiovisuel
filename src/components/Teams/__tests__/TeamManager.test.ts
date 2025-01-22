import { TeamManager } from '../TeamManager';
import { TeamMember } from '../types';

describe('TeamManager', () => {
  let teamManager: TeamManager;

  beforeEach(() => {
    teamManager = new TeamManager();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockMember: TeamMember = {
    id: '1',
    name: 'John Doe',
    role: 'Developer',
    availability: 80,
    currentProjects: ['Project A'],
    nextAvailable: '2024-02-01'
  };

  describe('fetchTeams', () => {
    it('should fetch and update teams', async () => {
      const mockTeams = [{
        id: '1',
        name: 'Team A',
        members: [mockMember],
        projects: ['Project A']
      }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTeams)
      });

      const listener = jest.fn();
      teamManager.subscribe(listener);
      await teamManager.fetchTeams();

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          teams: mockTeams,
          loading: false,
          error: null
        })
      );
    });

    it('should handle fetch errors', async () => {
      const errorMessage = 'Network error';
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const listener = jest.fn();
      teamManager.subscribe(listener);
      await teamManager.fetchTeams();

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          teams: [],
          error: errorMessage
        })
      );
    });
  });

  describe('addMember', () => {
    it('should add member to team', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      const listener = jest.fn();
      teamManager.subscribe(listener);
      await teamManager.addMember('team-1', mockMember);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/teams/team-1/members',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockMember)
        })
      );
    });
  });

  describe('updateMemberAvailability', () => {
    it('should update member availability', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      const listener = jest.fn();
      teamManager.subscribe(listener);
      await teamManager.updateMemberAvailability('member-1', 90);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/members/member-1/availability',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ availability: 90 })
        })
      );
    });
  });
});