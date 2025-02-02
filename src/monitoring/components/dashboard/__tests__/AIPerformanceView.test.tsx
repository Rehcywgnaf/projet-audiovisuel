import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AIPerformanceView from '../AIPerformanceView';

describe('AIPerformanceView', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders initial performance metrics correctly', () => {
    render(<AIPerformanceView />);
    
    // Vérification des sections principales
    expect(screen.getByText('Performance IA - Optimisations en Cours')).toBeInTheDocument();
    expect(screen.getByText('RSS-IA Cache')).toBeInTheDocument();
    expect(screen.getByText('Doc Validation')).toBeInTheDocument();
    expect(screen.getByText('Cost Optimization')).toBeInTheDocument();
  });

  it('updates RSS metrics over time', async () => {
    render(<AIPerformanceView />);
    
    // Valeurs initiales
    expect(screen.getByText('95.0%')).toBeInTheDocument();
    expect(screen.getByText('200ms')).toBeInTheDocument();

    // Après une mise à jour
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(screen.getByText('95.1%')).toBeInTheDocument();
      expect(screen.getByText('199ms')).toBeInTheDocument();
    });
  });

  it('displays cost metrics correctly', () => {
    render(<AIPerformanceView />);
    
    // Test des coûts calculés
    expect(screen.getByText('$0.75/h')).toBeInTheDocument(); // RSS: 0.0015 * 500
    expect(screen.getByText('$4.00/h')).toBeInTheDocument(); // Editor: 0.002 * 2000
    expect(screen.getByText('$0.10/h')).toBeInTheDocument(); // Template: 0.001 * 100
  });

  it('maintains validation rate within bounds', async () => {
    render(<AIPerformanceView />);
    
    // Valeur initiale
    expect(screen.getByText('175ms')).toBeInTheDocument();

    // Après plusieurs mises à jour
    jest.advanceTimersByTime(10000);
    
    await waitFor(() => {
      const responseTime = parseFloat(screen.getByText(/ms/).textContent);
      expect(responseTime).toBeGreaterThanOrEqual(150);
      expect(responseTime).toBeLessThanOrEqual(175);
    });
  });

  it('handles component unmounting correctly', () => {
    const { unmount } = render(<AIPerformanceView />);
    unmount();
    // Vérifie que clearInterval a été appelé
    expect(jest.getTimerCount()).toBe(0);
  });

  it('displays correct validation success rate', () => {
    render(<AIPerformanceView />);
    expect(screen.getByText('99.5%')).toBeInTheDocument();
  });

  it('displays correct number of cache metrics', () => {
    render(<AIPerformanceView />);
    const hitRates = screen.getAllByText(/Hit Rate/);
    expect(hitRates).toHaveLength(1);
  });
});