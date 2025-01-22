import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatSpaceManager from '../ChatSpaceManager';

// Mock de l'API Google
const mockGapi = {
  load: jest.fn((api, callback) => callback()),
  client: {
    init: jest.fn().mockResolvedValue(undefined),
    chat: {
      spaces: {
        list: jest.fn().mockResolvedValue({
          result: {
            spaces: [
              {
                name: 'spaces/123',
                displayName: 'Test Space',
                memberCount: 2
              }
            ]
          }
        }),
        create: jest.fn().mockResolvedValue({
          result: {
            name: 'spaces/456',
            displayName: 'New Space',
            memberCount: 1
          }
        }),
        members: {
          list: jest.fn().mockResolvedValue({
            result: {
              members: [
                {
                  name: 'users/123',
                  displayName: 'Test User',
                  email: 'test@example.com'
                }
              ]
            }
          }),
          create: jest.fn().mockResolvedValue({}),
          delete: jest.fn().mockResolvedValue({})
        }
      }
    }
  },
  auth2: {
    getAuthInstance: jest.fn().mockReturnValue({
      isSignedIn: {
        get: jest.fn().mockReturnValue(true)
      }
    })
  }
};

global.window.gapi = mockGapi;

describe('ChatSpaceManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes and loads spaces correctly', async () => {
    render(<ChatSpaceManager projectData={{ id: 'test-project' }} />);

    // Vérifie l'initialisation de l'API
    expect(mockGapi.load).toHaveBeenCalledWith('client:auth2', expect.any(Function));
    
    // Attendre que les espaces soient chargés
    await waitFor(() => {
      expect(mockGapi.client.chat.spaces.list).toHaveBeenCalled();
    });

    // Vérifier l'affichage des espaces
    expect(screen.getByText('Test Space')).toBeInTheDocument();
  });

  it('creates a new space successfully', async () => {
    render(<ChatSpaceManager projectData={{ id: 'test-project' }} />);

    // Cliquer sur le bouton Nouvel espace
    fireEvent.click(screen.getByText('Nouvel espace'));

    // Remplir le formulaire
    const input = screen.getByPlaceholderText('Ex: Projet documentaire nature');
    fireEvent.change(input, { target: { value: 'New Space' } });

    // Soumettre le formulaire
    const submitButton = screen.getByText('Créer');
    fireEvent.click(submitButton);

    // Vérifier l'appel à l'API
    await waitFor(() => {
      expect(mockGapi.client.chat.spaces.create).toHaveBeenCalledWith(
        expect.objectContaining({
          requestBody: expect.objectContaining({
            displayName: 'New Space'
          })
        })
      );
    });
  });

  it('manages members correctly', async () => {
    render(<ChatSpaceManager projectData={{ id: 'test-project' }} />);

    await waitFor(() => {
      expect(screen.getByText('Test Space')).toBeInTheDocument();
    });

    // Cliquer sur le bouton d'ajout de membre
    const addButton = screen.getAllByRole('button')[2]; // Le bouton Plus
    fireEvent.click(addButton);

    // Vérifier que la liste des membres est chargée
    await waitFor(() => {
      expect(mockGapi.client.chat.spaces.members.list).toHaveBeenCalled();
    });

    // Vérifier l'affichage du membre existant
    expect(screen.getByText('Test User')).toBeInTheDocument();

    // Ajouter un nouveau membre
    const emailInput = screen.getByPlaceholderText('email@exemple.com');
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });

    const addMemberButton = screen.getByText('Ajouter');
    fireEvent.click(addMemberButton);

    // Vérifier l'appel à l'API
    await waitFor(() => {
      expect(mockGapi.client.chat.spaces.members.create).toHaveBeenCalled();
    });
  });

  it('handles errors appropriately', async () => {
    // Simuler une erreur lors du chargement des espaces
    mockGapi.client.chat.spaces.list.mockRejectedValueOnce(new Error('API Error'));

    render(<ChatSpaceManager projectData={{ id: 'test-project' }} />);

    // Vérifier l'affichage de l'erreur
    await waitFor(() => {
      expect(screen.getByText('Erreur lors du chargement des espaces de discussion')).toBeInTheDocument();
    });
  });
});
