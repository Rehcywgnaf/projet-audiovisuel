import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';
import { projectService } from '@/services/ProjectService';

// Mock du service
jest.mock('@/services/ProjectService', () => ({
  projectService: {
    getProjects: jest.fn(),
    getProjectStats: jest.fn()
  }
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Reset des mocks avant chaque test
    jest.clearAllMocks();
  });

  it('affiche un loader pendant le chargement', () => {
    // Mock des retours du service
    (projectService.getProjects as jest.Mock).mockResolvedValue([]);
    (projectService.getProjectStats as jest.Mock).mockResolvedValue({
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0
    });

    render(<Dashboard />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('affiche les statistiques correctement', async () => {
    const mockStats = {
      totalProjects: 10,
      activeProjects: 5,
      completedProjects: 3
    };

    (projectService.getProjects as jest.Mock).mockResolvedValue([]);
    (projectService.getProjectStats as jest.Mock).mockResolvedValue(mockStats);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('gère les erreurs de chargement', async () => {
    // Simulation d'une erreur
    (projectService.getProjects as jest.Mock).mockRejectedValue(new Error('Erreur test'));
    (projectService.getProjectStats as jest.Mock).mockRejectedValue(new Error('Erreur test'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<Dashboard />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
