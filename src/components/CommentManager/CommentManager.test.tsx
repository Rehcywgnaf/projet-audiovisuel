import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import CommentManager from './index';

// Mock de WebSocket
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onmessage = null;
    this.onclose = null;
    this.onopen = null;
  }

  send(data) {
    // Simuler l'envoi de données
    if (this.onmessage) {
      this.onmessage({ data });
    }
  }

  close() {
    if (this.onclose) {
      this.onclose();
    }
  }
}

global.WebSocket = MockWebSocket;

describe('CommentManager Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window.postMessage mock
    window.postMessage = jest.fn();
  });

  test('intégration - cycle de vie complet d\'un commentaire', async () => {
    render(<CommentManager />);

    // 1. Vérifier l'affichage initial
    expect(screen.getByText('Gestionnaire de Commentaires')).toBeInTheDocument();
    expect(screen.getByText('budget')).toBeInTheDocument();

    // 2. Test du filtre par catégorie
    const categoryButton = screen.getByText('budget');
    fireEvent.click(categoryButton);
    expect(screen.getByText('Mise à jour nécessaire de la section budget')).toBeInTheDocument();

    // 3. Test de l'interaction avec les suggestions IA
    const aiButton = screen.getByText('Voir suggestion IA');
    fireEvent.click(aiButton);
    expect(window.postMessage).toHaveBeenCalledWith({
      type: 'OPEN_AI_SUGGESTION',
      suggestionId: 'sugg_123'
    }, expect.any(String));
  });

  test('intégration - WebSocket connection et réception de messages', async () => {
    let mockWs;
    
    render(<CommentManager />);

    await act(async () => {
      // Simuler la connexion WebSocket
      mockWs = new MockWebSocket('wss://votre-serveur-websocket.com');
      mockWs.onopen();
    });

    // Simuler la réception d'un nouveau commentaire
    const newComment = {
      id: 2,
      text: "Nouveau commentaire test",
      user: "Test User",
      timestamp: new Date().toISOString(),
      version: "v1.2",
      category: "technique",
      resolved: false
    };

    await act(async () => {
      mockWs.onmessage({ data: JSON.stringify(newComment) });
    });

    // Vérifier que le nouveau commentaire est affiché
    expect(screen.getByText('Nouveau commentaire test')).toBeInTheDocument();
    expect(screen.getByText('technique')).toBeInTheDocument();
  });

  test('intégration - gestion des catégories et filtres', async () => {
    render(<CommentManager />);

    // 1. Vérifier que toutes les catégories sont affichées
    expect(screen.getByText('budget')).toBeInTheDocument();

    // 2. Tester le filtrage
    const budgetButton = screen.getByText('budget');
    
    // Activer le filtre
    fireEvent.click(budgetButton);
    expect(screen.getByText('Mise à jour nécessaire de la section budget')).toBeInTheDocument();
    
    // Désactiver le filtre
    fireEvent.click(budgetButton);
    expect(screen.getByText('Mise à jour nécessaire de la section budget')).toBeInTheDocument();
  });

  test('intégration - système de réponses aux commentaires', () => {
    render(<CommentManager />);

    // Vérifier l'affichage des réponses
    const mainComment = screen.getByText('Mise à jour nécessaire de la section budget');
    const reply = screen.getByText('Modifications effectuées selon les nouveaux critères');
    
    expect(mainComment).toBeInTheDocument();
    expect(reply).toBeInTheDocument();
    
    // Vérifier que la réponse est bien imbriquée
    const replyContainer = reply.closest('.border-l-2');
    expect(replyContainer).toHaveClass('ml-6');
  });
});