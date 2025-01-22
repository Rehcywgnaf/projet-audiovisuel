import React from 'react';
import { render, screen } from '@testing-library/react';
import TemplateUI from '../ui/TemplateUI';

describe('TemplateUI Component', () => {
  describe('Rendering', () => {
    it('should render with default title', () => {
      render(<TemplateUI />);
      expect(screen.getByText('Gestionnaire de Templates')).toBeInTheDocument();
    });

    it('should render flux de données section', () => {
      render(<TemplateUI />);
      expect(screen.getByText('Flux de Données')).toBeInTheDocument();
      expect(screen.getByText('Veille RSS')).toBeInTheDocument();
      expect(screen.getByText('Analyse & Catégorisation')).toBeInTheDocument();
      expect(screen.getByText('Génération Template')).toBeInTheDocument();
    });

    it('should not show admin badge by default', () => {
      render(<TemplateUI />);
      expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should show admin badge when isAdmin is true', () => {
      render(<TemplateUI isAdmin={true} />);
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('should render custom title when provided', () => {
      const customTitle = 'Custom Template Manager';
      render(<TemplateUI title={customTitle} />);
      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    it('should render children content', () => {
      const childContent = 'Child Component Content';
      render(
        <TemplateUI>
          <div>{childContent}</div>
        </TemplateUI>
      );
      expect(screen.getByText(childContent)).toBeInTheDocument();
    });
  });
});