import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import RSSManager from '../../components/RSSManager';
import { AIServiceManager } from '../../components/AIServiceManager';
import { TemplateManager } from '../../components/TemplateManager';

// Mock de l'AIServiceManager
jest.mock('../../components/AIServiceManager', () => ({
  AIServiceManager: {
    getInstance: jest.fn(() => ({
      processRequest: jest.fn(async (componentId, content) => ({
        success: true,
        data: {
          text: 'Appel à projets audiovisuel...',
          summary: 'AAP production documentaire',
          confidence: 0.95,
          keyElements: {
            deadline: '2025-03-01',
            budget: '50000',
            complexity: 'medium'
          }
        },
        cost: 0.05
      })),
      getComponentStats: jest.fn(() => ({
        usage: 0.15,
        cacheHits: 5,
        config: {
          maxTokens: 1000,
          cacheExpiry: 3600
        }
      }))
    }))
  }
}));

describe('Intégration RSS-IA avec AIServiceManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Workflow complet : RSS -> IA -> Template', async () => {
    const mockRSSContent = `
      <item>
        <title>Appel à Projets Production Documentaire 2025</title>
        <description>Budget: 50000€, Date limite: 1er Mars 2025</description>
      </item>
    `;

    // Simuler la récupération du contenu RSS
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockRSSContent)
      } as Response)
    );

    await act(async () => {
      render(<RSSManager />);
    });

    // Vérifier l'interaction avec AIServiceManager
    const aiManager = AIServiceManager.getInstance();
    expect(aiManager.processRequest).toHaveBeenCalledWith(
      'rss-analyzer',
      expect.stringContaining('Appel à Projets Production'),
      expect.any(Object)
    );

    // Vérifier les résultats de l'analyse
    await waitFor(() => {
      expect(screen.getByTestId('analysis-type')).toHaveTextContent('AAP');
      expect(screen.getByTestId('analysis-confidence')).toHaveTextContent('95%');
      expect(screen.getByTestId('deadline')).toHaveTextContent('2025-03-01');
      expect(screen.getByTestId('budget')).toHaveTextContent('50000');
    });
  });

  test('Performance et gestion du cache', async () => {
    const startTime = performance.now();
    
    await act(async () => {
      render(<RSSManager />);
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Vérifier le temps de rendu
    expect(renderTime).toBeLessThan(200);

    // Vérifier l'utilisation du cache
    const stats = AIServiceManager.getInstance().getComponentStats('rss-analyzer');
    expect(stats.cacheHits).toBeGreaterThan(0);
  });

  test('Gestion des erreurs et limites de coût', async () => {
    // Simuler une erreur de dépassement de budget
    const aiManager = AIServiceManager.getInstance();
    (aiManager.processRequest as jest.Mock).mockRejectedValueOnce(
      new Error('Budget limit exceeded')
    );

    await act(async () => {
      render(<RSSManager />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Budget');
    });
  });

  test('Intégration avec TemplateManager', async () => {
    await act(async () => {
      render(
        <>
          <RSSManager />
          <TemplateManager />
        </>
      );
    });

    // Vérifier la transmission des données analysées au TemplateManager
    await waitFor(() => {
      expect(screen.getByTestId('template-type')).toHaveTextContent('AAP');
      expect(screen.getByTestId('template-status')).toHaveTextContent('ready');
    });

    // Vérifier la synchronisation des métadonnées
    const templateMetadata = screen.getByTestId('template-metadata');
    expect(templateMetadata).toHaveTextContent('50000');
    expect(templateMetadata).toHaveTextContent('2025-03-01');
  });
});