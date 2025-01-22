import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIEnhancedEditor from '../DocumentGenerator/AIEnhancedEditor';

describe('AIEnhancedEditor Component', () => {
  // Test du rendu initial
  describe('Rendu Initial', () => {
    it('affiche correctement la zone de texte vide', () => {
      render(<AIEnhancedEditor />);
      const textarea = screen.getByPlaceholderText('Commencez à rédiger...');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveValue('');
    });

    it('affiche l\'indicateur "Assistant IA actif"', () => {
      render(<AIEnhancedEditor />);
      expect(screen.getByText('Assistant IA actif')).toBeInTheDocument();
    });

    it('affiche "Analyse en cours..." pendant le chargement initial', () => {
      render(<AIEnhancedEditor />);
      expect(screen.getByText('Analyse en cours...')).toBeInTheDocument();
    });
  });

  // Test des suggestions
  describe('Gestion des Suggestions', () => {
    it('affiche les suggestions après le délai initial', async () => {
      render(<AIEnhancedEditor />);
      await waitFor(() => {
        expect(screen.getByText(/Mentionner l'innovation technologique/)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('permet d\'appliquer une suggestion au texte', async () => {
      render(<AIEnhancedEditor />);
      await waitFor(() => {
        expect(screen.getByText(/Mentionner l'innovation technologique/)).toBeInTheDocument();
      });

      const applyButton = screen.getAllByText('Appliquer')[0];
      fireEvent.click(applyButton);

      const textarea = screen.getByPlaceholderText('Commencez à rédiger...');
      expect(textarea).toHaveValue(expect.stringContaining('Suggestion : Mentionner l\'innovation technologique'));
    });
  });

  // Test de la saisie utilisateur
  describe('Saisie Utilisateur', () => {
    it('met à jour le contenu lors de la saisie', () => {
      render(<AIEnhancedEditor />);
      const textarea = screen.getByPlaceholderText('Commencez à rédiger...');
      fireEvent.change(textarea, { target: { value: 'Nouveau contenu de test' } });
      expect(textarea).toHaveValue('Nouveau contenu de test');
    });
  });

  // Test des indicateurs visuels
  describe('Indicateurs Visuels', () => {
    it('applique le style correct pour les suggestions importantes', async () => {
      render(<AIEnhancedEditor />);
      await waitFor(() => {
        const highImportanceSuggestion = screen.getByText(/Mentionner l'innovation technologique/);
        const suggestionCard = highImportanceSuggestion.closest('.border-l-4');
        expect(suggestionCard).toHaveClass('border-l-yellow-500');
      });
    });

    it('applique le style correct pour les suggestions normales', async () => {
      render(<AIEnhancedEditor />);
      await waitFor(() => {
        const normalSuggestion = screen.getByText(/Référence suggérée/);
        const suggestionCard = normalSuggestion.closest('.border-l-4');
        expect(suggestionCard).toHaveClass('border-l-blue-500');
      });
    });
  });
});
