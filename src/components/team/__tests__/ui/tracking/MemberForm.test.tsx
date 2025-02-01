import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemberForm } from '../../../ui/tracking/MemberForm';

describe('MemberForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<MemberForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rôle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/disponibilité/i)).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<MemberForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.change(screen.getByLabelText(/nom/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/rôle/i), {
      target: { value: 'Developer' }
    });
    fireEvent.change(screen.getByLabelText(/disponibilité/i), {
      target: { value: '90' }
    });

    fireEvent.click(screen.getByText(/ajouter le membre/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        role: 'Developer',
        availability: '90',
        currentProjects: []
      });
    });
  });

  it('displays validation errors', () => {
    render(<MemberForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.click(screen.getByText(/ajouter le membre/i));

    expect(screen.getByText(/le nom doit contenir au moins 2 caractères/i)).toBeInTheDocument();
    expect(screen.getByText(/le rôle est requis/i)).toBeInTheDocument();
  });

  it('calls onCancel when cancel button clicked', () => {
    render(<MemberForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.click(screen.getByText(/annuler/i));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables submit button when isSubmitting is true', () => {
    render(
      <MemberForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        isSubmitting={true}
      />
    );
    
    expect(screen.getByText(/ajout en cours/i)).toBeDisabled();
  });
});