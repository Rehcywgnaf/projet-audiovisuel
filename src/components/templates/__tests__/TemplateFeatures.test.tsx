import React from 'react';
import { render, screen } from '@testing-library/react';
import TemplateFeatures from '../features/TemplateFeatures';

describe('TemplateFeatures Component', () => {
  const mockPhases = [
    {
      name: 'Phase 1',
      features: [
        { name: 'Analyse mots-clés', status: 'À implémenter' },
        { name: 'Catégorisation AAP/AO', status: 'À implémenter' }
      ]
    },
    {
      name: 'Phase 2',
      features: [
        { name: 'Scoring avancé', status: 'Future mise à jour' }
      ]
    }
  ];

  describe('Access Control', () => {
    it('should not render anything when canAccess is false', () => {
      const { container } = render(
        <TemplateFeatures phases={mockPhases} canAccess={false} />
      );
      expect(container).toBeEmptyDOMElement();
    });

    it('should render content when canAccess is true', () => {
      render(<TemplateFeatures phases={mockPhases} canAccess={true} />);
      expect(screen.getByText('Fonctionnalités IA')).toBeInTheDocument();
    });

    it('should render content by default (canAccess not provided)', () => {
      render(<TemplateFeatures phases={mockPhases} />);
      expect(screen.getByText('Fonctionnalités IA')).toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    beforeEach(() => {
      render(<TemplateFeatures phases={mockPhases} />);
    });

    it('should render all phases', () => {
      expect(screen.getByText('Phase 1')).toBeInTheDocument();
      expect(screen.getByText('Phase 2')).toBeInTheDocument();
    });

    it('should render all features', () => {
      expect(screen.getByText('Analyse mots-clés')).toBeInTheDocument();
      expect(screen.getByText('Catégorisation AAP/AO')).toBeInTheDocument();
      expect(screen.getByText('Scoring avancé')).toBeInTheDocument();
    });

    it('should render feature statuses', () => {
      expect(screen.getAllByText('À implémenter')).toHaveLength(2);
      expect(screen.getByText('Future mise à jour')).toBeInTheDocument();
    });
  });
});