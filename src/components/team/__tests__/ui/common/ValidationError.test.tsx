import React from 'react';
import { render, screen } from '@testing-library/react';
import { ValidationError } from '../../../ui/common/ValidationError';

describe('ValidationError', () => {
  it('renders error messages correctly', () => {
    render(<ValidationError errors={['Error message 1', 'Error message 2']} />);
    
    expect(screen.getByText('Error message 1')).toBeInTheDocument();
    expect(screen.getByText('Error message 2')).toBeInTheDocument();
  });

  it('renders single error message as string', () => {
    render(<ValidationError errors="Single error message" />);
    
    expect(screen.getByText('Single error message')).toBeInTheDocument();
  });

  it('does not render when no errors', () => {
    const { container } = render(<ValidationError />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render with empty array', () => {
    const { container } = render(<ValidationError errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders error icon', () => {
    render(<ValidationError errors={['Some error']} />);
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // Lucide icon
  });
});