import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import AIEnhancedEditor from '../DocumentGenerator/AIEnhancedEditor';
import TemplateManager from '../TemplateManager';
import DocumentManager from '../DocumentManager';

// Mock des composants externes
jest.mock('../TemplateManager', () => ({
  __esModule: true,
  default: jest.fn(() => null),
  getTemplate: jest.fn(),
  validateStructure: jest.fn()
}));

jest.mock('../DocumentManager', () => ({
  __esModule: true,
  default: jest.fn(() => null),
  saveDocument: jest.fn(),
  loadDocument: jest.fn()
}));

describe('AIEnhancedEditor - Tests d\'Intégration', () => {
  beforeEach(() => {
    // Reset des mocks avant chaque test
    jest.clearAllMocks();
  });

  describe('Intégration avec TemplateManager', () => {
    it('charge correctement un template', async () => {
      const mockTemplate = {
        id: 'template-1',
        content: 'Contenu du template',
        structure: { sections: ['intro', 'main', 'conclusion'] }
      };

      TemplateManager.getTemplate.mockResolvedValue(mockTemplate);

      render(<AIEnhancedEditor />);
      
      await waitFor(() => {
        expect(TemplateManager.getTemplate).toHaveBeenCalled();
      });
    });

    it('valide la structure du document', async () => {
      TemplateManager.validateStructure.mockResolvedValue({ isValid: true });

      render(<AIEnhancedEditor />);
      const textarea = screen.getByPlaceholderText('Commencez à rédiger...');
      
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'Nouveau contenu' } });
      });

      await waitFor(() => {
        expect(TemplateManager.validateStructure).toHaveBeenCalledWith(
          expect.any(String)
        );
      });
    });
  });

  describe('Intégration avec DocumentManager', () => {
    it('sauvegarde automatiquement les modifications', async () => {
      DocumentManager.saveDocument.mockResolvedValue({ success: true });

      render(<AIEnhancedEditor />);
      const textarea = screen.getByPlaceholderText('Commencez à rédiger...');
      
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'Nouveau contenu' } });
      });

      // Vérifier que la sauvegarde est déclenchée après un délai
      await waitFor(() => {
        expect(DocumentManager.saveDocument).toHaveBeenCalledWith(
          expect.any(String)
        );
      }, { timeout: 2000 });
    });

    it('charge correctement un document existant', async () => {
      const mockDocument = {
        id: 'doc-1',
        content: 'Contenu existant',
        metadata: { lastModified: new Date() }
      };

      DocumentManager.loadDocument.mockResolvedValue(mockDocument);

      render(<AIEnhancedEditor documentId="doc-1" />);

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Commencez à rédiger...');
        expect(textarea).toHaveValue('Contenu existant');
      });
    });
  });

  // Tests de gestion d'erreurs d'intégration
  describe('Gestion des Erreurs d\'Intégration', () => {
    it('gère les erreurs de chargement de template', async () => {
      TemplateManager.getTemplate.mockRejectedValue(new Error('Erreur template'));

      render(<AIEnhancedEditor />);

      await waitFor(() => {
        expect(screen.getByText(/Erreur de chargement/)).toBeInTheDocument();
      });
    });

    it('gère les erreurs de sauvegarde', async () => {
      DocumentManager.saveDocument.mockRejectedValue(new Error('Erreur sauvegarde'));

      render(<AIEnhancedEditor />);
      const textarea = screen.getByPlaceholderText('Commencez à rédiger...');

      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'Test erreur' } });
      });

      await waitFor(() => {
        expect(screen.getByText(/Erreur de sauvegarde/)).toBeInTheDocument();
      });
    });
  });
});
