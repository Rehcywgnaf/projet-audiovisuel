import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectMetricsView from '../ProjectMetricsView';

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

describe('ProjectMetricsView', () => {
  beforeEach(() => {
    mockOpen.mockClear();
  });

  it('renders title and progress correctly', () => {
    render(<ProjectMetricsView />);
    
    expect(screen.getByText('Suivi des Documents')).toBeInTheDocument();
    expect(screen.getByText('50% complet')).toBeInTheDocument();
  });

  it('displays all document items', () => {
    render(<ProjectMetricsView />);
    
    expect(screen.getByText('Formulaire de candidature')).toBeInTheDocument();
    expect(screen.getByText('Budget prévisionnel')).toBeInTheDocument();
    expect(screen.getByText('Plan d\'action')).toBeInTheDocument();
    expect(screen.getByText('Lettres de soutien')).toBeInTheDocument();
  });

  it('shows correct status icons', () => {
    render(<ProjectMetricsView />);
    
    const greenIcons = document.querySelectorAll('.text-green-500');
    const redIcons = document.querySelectorAll('.text-red-500');
    const yellowIcons = document.querySelectorAll('.text-yellow-500');

    expect(greenIcons).toHaveLength(2); // 2 'present' documents
    expect(redIcons).toHaveLength(1);   // 1 'missing' document
    expect(yellowIcons).toHaveLength(1); // 1 'outdated' document
  });

  it('calculates progress correctly', () => {
    render(<ProjectMetricsView />);
    
    // 2 documents sur 4 sont 'present', donc 50%
    expect(screen.getByText('50% complet')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<ProjectMetricsView />);
    
    // Les dates doivent être au format français
    expect(screen.getByText(/Échéance: 01\/02\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/Échéance: 15\/02\/2024/)).toBeInTheDocument();
  });

  it('opens drive links when clicking button', () => {
    render(<ProjectMetricsView />);
    
    const driveButtons = screen.getAllByText('Voir sur Drive');
    fireEvent.click(driveButtons[0]);
    
    expect(mockOpen).toHaveBeenCalledWith('https://drive.google.com/...', '_blank');
  });

  it('only shows drive buttons for documents with links', () => {
    render(<ProjectMetricsView />);
    
    const driveButtons = screen.getAllByText('Voir sur Drive');
    expect(driveButtons).toHaveLength(3); // 3 documents ont des liens Drive
  });

  it('maintains correct order of documents', () => {
    render(<ProjectMetricsView />);
    
    const documentNames = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
    expect(documentNames).toEqual([
      'Formulaire de candidature',
      'Budget prévisionnel',
      'Plan d\'action',
      'Lettres de soutien'
    ]);
  });
});