import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import AIEnhancedEditor from '../DocumentGenerator/AIEnhancedEditor';

// Utilitaire pour mesurer le temps d'exécution
const measureExecutionTime = async (callback: () => Promise<void>): Promise<number> => {
  const start = performance.now();
  await callback();
  return performance.now() - start;
};

describe('AIEnhancedEditor - Tests de Performance', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Performance du Rendu', () => {
    it('temps de rendu initial sous 100ms', async () => {
      const renderTime = await measureExecutionTime(async () => {
        await act(async () => {
          render(<AIEnhancedEditor />);
        });
      });

      expect(renderTime).toBeLessThan(100);
    });

    it('temps de mise à jour sous 50ms', async () => {
      render(<AIEnhancedEditor />);
      const textarea = screen.getByPlaceholderText('Commencez à rédiger...');

      const updateTime = await measureExecutionTime(async () => {
        await act(async () => {
          fireEvent.change(textarea, { target: { value: 'Test de performance' } });
        });
      });

      expect(updateTime).toBeLessThan(50);
    });
  });

  describe('Performance des Suggestions', () => {
    it('génère les suggestions en moins de 200ms', async () => {
      render(<AIEnhancedEditor />);
      const textarea = screen.getByPlaceholderText('Commencez à rédiger...');

      const suggestionTime = await measureExecutionTime(async () => {
        await act(async () => {
          fireEvent.change(textarea, { target: { value: 'Contenu de test pour suggestions' } });
        });
        // Attendre que les suggestions soient générées
        await new Promise(resolve => setTimeout(resolve, 1500));
      });

      expect(suggestionTime).toBeLessThan(200);
    });
  });

  describe('Performance de la Mémoire', () => {
    it('maintient une utilisation mémoire stable', async () => {
      const memorySnapshots: number[] = [];
      
      // Fonction pour capturer l'utilisation mémoire
      const captureMemory = () => {
        const memory = (performance as any).memory;
        return memory ? memory.usedJSHeapSize : 0;
      };

      render(<AIEnhancedEditor />);
      const textarea = screen.getByPlaceholderText('Commencez à rédiger...');

      // Capture initiale
      memorySnapshots.push(captureMemory());

      // Simuler plusieurs modifications
      for (let i = 0; i < 10; i++) {
        await act(async () => {
          fireEvent.change(textarea, { 
            target: { value: `Test de performance itération ${i}` } 
          });
        });
        memorySnapshots.push(captureMemory());
      }

      // Vérifier que l'utilisation mémoire ne croît pas de manière excessive
      const maxIncrease = Math.max(
        ...memorySnapshots.slice(1).map((mem, i) => mem - memorySnapshots[i])
      );
      expect(maxIncrease).toBeLessThan(1024 * 1024); // Moins de 1MB d'augmentation
    });
  });

  describe('Tests de Charge', () => {
    it('gère efficacement un grand volume de texte', async () => {
      render(<AIEnhancedEditor />);
      const textarea = screen.getByPlaceholderText('Commencez à rédiger...');

      const largeText = 'A'.repeat(10000); // 10KB de texte
      
      const updateTime = await measureExecutionTime(async () => {
        await act(async () => {
          fireEvent.change(textarea, { target: { value: largeText } });
        });
      });

      expect(updateTime).toBeLessThan(100); // Moins de 100ms pour traiter 10KB
    });

    it('maintient les performances avec beaucoup de suggestions', async () => {
      const mockSuggestions = Array(50).fill(null).map((_, i) => ({
        type: 'suggestion',
        content: `Suggestion de test ${i}`,
        importance: i % 2 === 0 ? 'high' : 'medium'
      }));

      // Mock du hook useState pour forcer beaucoup de suggestions
      jest.spyOn(React, 'useState').mockImplementationOnce(() => [
        mockSuggestions,
        jest.fn()
      ]);

      const renderTime = await measureExecutionTime(async () => {
        await act(async () => {
          render(<AIEnhancedEditor />);
        });
      });

      expect(renderTime).toBeLessThan(150); // Moins de 150ms avec 50 suggestions
    });
  });
});
