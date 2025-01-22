import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Plus, Settings, AlertCircle } from 'lucide-react';

const ChatSpaceManager = ({ projectData }) => {
  // États de base
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // États pour la gestion des espaces
  const [newSpaceName, setNewSpaceName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // États pour la gestion des membres
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [members, setMembers] = useState({});

  useEffect(() => {
    const initializeGoogleApi = async () => {
      try {
        if (!window.gapi) {
          setError("API Google non disponible");
          return;
        }

        await new Promise((resolve) => {
          window.gapi.load('client:auth2', async () => {
            try {
              await window.gapi.client.init({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
                clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                scope: process.env.NEXT_PUBLIC_GOOGLE_CHAT_SCOPE,
                discoveryDocs: ['https://chat.googleapis.com/$discovery/rest']
              });
              
              // Vérifie si l'utilisateur est déjà connecté
              if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
                setIsInitialized(true);
              } else {
                // Demande à l'utilisateur de se connecter
                await window.gapi.auth2.getAuthInstance().signIn();
                setIsInitialized(true);
              }
              resolve();
            } catch (err) {
              setError("Erreur d'initialisation de l'API Google");
              console.error('Erreur init Google API:', err);
            }
          });
        });
      } catch (err) {
        setError("Erreur lors du chargement de l'API Google");
        console.error('Erreur chargement Google API:', err);
      }
    };

    initializeGoogleApi();
  }, []);

  // Création d'un espace de discussion
  const createChatSpace = async (name, projectId) => {
    if (!isInitialized) return;

    try {
      const response = await window.gapi.client.chat.spaces.create({
        requestBody: {
          displayName: name,
          labels: {
            'project-id': projectId,
            'app-name': 'sapav'
          }
        }
      });
      
      setSpaces(prevSpaces => [...prevSpaces, response.result]);
      return response.result;
    } catch (err) {
      console.error('Erreur création espace:', err);
      setError('Erreur lors de la création de l\'espace de discussion');
    }
  };

  // Chargement des espaces de discussion
  useEffect(() => {
    const loadChatSpaces = async () => {
      if (!isInitialized) return;

      try {
        setIsLoading(true);
        const response = await window.gapi.client.chat.spaces.list({
          filter: 'labels.app-name=sapav'
        });
        
        setSpaces(response.result.spaces || []);
        setIsLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des espaces de discussion');
        console.error('Erreur chargement espaces:', err);
        setIsLoading(false);
      }
    };

    if (isInitialized) {
      loadChatSpaces();
    }
  }, [isInitialized]);

  // Charger les membres d'un espace
  const loadSpaceMembers = async (spaceId) => {
    try {
      const response = await window.gapi.client.chat.spaces.members.list({
        parent: spaceId
      });
      setMembers({
        ...members,
        [spaceId]: response.result.members || []
      });
    } catch (err) {
      console.error('Erreur chargement membres:', err);
      setError('Erreur lors du chargement des membres');
    }
  };

  // Ajouter un membre à un espace
  const addMemberToSpace = async (spaceId, email) => {
    try {
      await window.gapi.client.chat.spaces.members.create({
        parent: spaceId,
        requestBody: {
          member: {
            type: 'HUMAN',
            name: email
          }
        }
      });
    } catch (err) {
      console.error('Erreur ajout membre:', err);
      throw err; // Propage l'erreur pour gestion dans handleAddMember
    }
  };

  // Ajouter un membre
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedSpace || !newMemberEmail.trim()) return;

    try {
      await addMemberToSpace(selectedSpace, newMemberEmail);
      await loadSpaceMembers(selectedSpace);
      setNewMemberEmail('');
      setShowMemberForm(false);
    } catch (err) {
      setError('Erreur lors de l\'ajout du membre');
    }
  };

  // Supprimer un membre
  const removeMember = async (spaceId, memberId) => {
    try {
      await window.gapi.client.chat.spaces.members.delete({
        name: `${spaceId}/members/${memberId}`
      });
      await loadSpaceMembers(spaceId);
    } catch (err) {
      console.error('Erreur suppression membre:', err);
      setError('Erreur lors de la suppression du membre');
    }
  };

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gestion des espaces de discussion
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvel espace
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showCreateForm && (
          <form onSubmit={handleCreateSpace} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom de l'espace</label>
                <input
                  type="text"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Ex: Projet documentaire nature"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Créer
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {spaces.map((space) => (
            <div key={space.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{space.displayName}</h3>
                <p className="text-sm text-gray-500">{space.memberCount} membres</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => window.open(space.spaceUrl, '_blank')}
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => {
                    setSelectedSpace(space.name);
                    loadSpaceMembers(space.name);
                    setShowMemberForm(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Formulaire de gestion des membres */}
          {showMemberForm && selectedSpace && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-4">Gestion des membres</h3>
              
              {/* Liste des membres actuels */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Membres actuels</h4>
                <div className="space-y-2">
                  {members[selectedSpace]?.map((member) => (
                    <div key={member.name} className="flex justify-between items-center p-2 bg-white rounded">
                      <span>{member.displayName || member.name}</span>
                      <button
                        onClick={() => removeMember(selectedSpace, member.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Formulaire d'ajout */}
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email du nouveau membre</label>
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="email@exemple.com"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMemberForm(false);
                      setSelectedSpace(null);
                      setNewMemberEmail('');
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSpaceManager;