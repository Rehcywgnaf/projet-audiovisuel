import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DriveIntegration from '../DriveIntegration';

// Mocks
const mockDriveCore = {
  sync: jest.fn(),
  getCacheMetrics: jest.fn()
};

const mockAIServiceManager = {
  getContextualSuggestions: jest.fn()
};

// Setup global mocks
global.window.DriveCore = mockDriveCore;
global.window.AIServiceManager = mockAIServiceManager;

describe('DriveIntegration Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementations
    mockDriveCore.getCacheMetrics.mockResolvedValue({
      hitRate: 98,
      size: 100,
      lastCleared: new Date()
    });
    mockAIServiceManager.getContextualSuggestions.mockResolvedValue([
      'Suggestion 1',
      'Suggestion 2'
    ]);
  });

  it('renders correctly in initial state', () => {
    render(<DriveIntegration />);
    expect(screen.getByText('Intégration Google Drive')).toBeInTheDocument();
    expect(screen.getByText('En attente de synchronisation')).toBeInTheDocument();
  });

  it('displays cache metrics correctly', async () => {
    render(<DriveIntegration />);
    
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText('98.0%')).toBeInTheDocument();
    expect(screen.getByText('100 items')).toBeInTheDocument();
  });

  it('handles sync process correctly', async () => {
    const onSyncComplete = jest.fn();
    render(<DriveIntegration onSyncComplete={onSyncComplete} />);

    mockDriveCore.sync.mockResolvedValueOnce();

    await act(async () => {
      await fireEvent.click(screen.getByRole('button', { name: /sync/i }));
    });

    expect(mockDriveCore.sync).toHaveBeenCalled();
    expect(onSyncComplete).toHaveBeenCalled();
    expect(screen.getByText(/Synchronisation terminée/i)).toBeInTheDocument();
  });

  it('handles sync errors correctly', async () => {
    const onError = jest.fn();
    const errorMessage = 'Test error message';
    
    mockDriveCore.sync.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<DriveIntegration onError={onError} />);

    await act(async () => {
      await fireEvent.click(screen.getByRole('button', { name: /sync/i }));
    });

    expect(onError).toHaveBeenCalled();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('displays AI suggestions correctly', async () => {
    render(<DriveIntegration />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText('Suggestion 1')).toBeInTheDocument();
    expect(screen.getByText('Suggestion 2')).toBeInTheDocument();
  });

  it('updates cache metrics periodically', async () => {
    jest.useFakeTimers();

    const metrics1 = { hitRate: 98, size: 100, lastCleared: new Date() };
    const metrics2 = { hitRate: 99, size: 110, lastCleared: new Date() };

    mockDriveCore.getCacheMetrics
      .mockResolvedValueOnce(metrics1)
      .mockResolvedValueOnce(metrics2);

    render(<DriveIntegration />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText('98.0%')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(60000);
      await Promise.resolve();
    });

    expect(screen.getByText('99.0%')).toBeInTheDocument();

    jest.useRealTimers();
  });
});

// Test des performances
describe('DriveIntegration Performance', () => {
  it('maintains performance targets', async () => {
    const start = performance.now();
    
    render(<DriveIntegration />);
    
    const renderTime = performance.now() - start;
    expect(renderTime).toBeLessThan(200); // Cible de performance : 200ms
  });
});