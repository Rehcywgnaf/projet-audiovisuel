import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, AlertTriangle, GitBranch, Clock, UserCircle, List } from 'lucide-react';

/*
TODO: Intégration Google Drive
- Implémenter l'authentification OAuth 2.0
- Ajouter la synchronisation des fichiers
- Gérer le versioning via l'API Drive
- Implémenter la gestion des permissions
- Mettre en place le système de backup automatique

TODO: Critères de Qualité Supplémentaires
1. Format du Document
  - Vérification des marges
  - Conformité des polices
  - Espacement et mise en page
  - Styles cohérents

2. Validation Structurelle
  - Structure des sections requises
  - Hiérarchie des titres
  - Pagination
  - En-têtes et pieds de page

3. Métadonnées
  - Informations du projet complètes
  - Tags et catégorisation
  - Numéro de version
  - Historique des modifications

4. Éléments Spécifiques AAP/AO
  - Budget détaillé
  - Planning respectant le format
  - Documents administratifs requis
  - Annexes techniques conformes

5. Validation Contextuelle
  - Cohérence des chiffres
  - Conformité aux exigences spécifiques
  - Vérification des références
  - Liens et renvois

6. Mise à jour des règles
  - Système de mise à jour des critères
  - Configuration par type d'AAP/AO
  - Règles personnalisables
  - Historique des validations
*/

const DocumentVersionManager = () => {
  const [activeDocument, setActiveDocument] = useState({
    id: 'doc-1',
    title: 'Appel à Projet - Production Documentaire',
    status: 'in_progress',
    lastModified: '2024-01-05T14:30:00Z',
  });

  // État pour la validation automatique
  const [validationResults] = useState({
    spelling: {
      status: 'warning',
      errors: [
        { type: 'spelling', word: 'developement', suggestion: 'development', line: 12 },
        { type: 'grammar', text: 'Ces données permet', suggestion: 'Ces données permettent', line: 15 }
      ]
    },
    completeness: {
      status: 'warning',
      missing: ['budget_details', 'technical_specs'],
      required: ['contact_info', 'project_summary', 'budget_details', 'technical_specs']
    }
  });

  // État pour les versions
  const [versions] = useState([
    {
      id: 'v1.2',
      timestamp: '2024-01-05 14:30',
      author: 'Marie Martin',
      changes: ['Mise à jour budget', 'Ajout annexes techniques'],
      status: 'current'
    },
    {
      id: 'v1.1',
      timestamp: '2024-01-05 11:15',
      author: 'Jean Dupont',
      changes: ['Corrections mineures', 'Mise à jour planning'],
      status: 'archived'
    }
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Document Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            {activeDocument.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Informations</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Statut: </span>
                  <span className="font-medium">{activeDocument.status}</span>
                </div>
                <div>
                  <span className="text-gray-600">Dernière modification: </span>
                  <span className="font-medium">
                    {new Date(activeDocument.lastModified).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Actions rapides</h3>
              <div className="space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Éditer
                </button>
                <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                  Valider
                </button>
                <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                  Exporter
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrôle Qualité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-6 h-6" />
            Contrôle Qualité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Documents requis */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Documents Requis</h3>
              <div className="space-y-2">
                {validationResults.completeness.required.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {validationResults.completeness.missing.includes(doc) ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-sm capitalize">
                      {doc.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vérification linguistique */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Vérification Linguistique</h3>
              <div className="space-y-2">
                {validationResults.spelling.errors.map((error, index) => (
                  <div key={index} className="p-2 bg-yellow-50 rounded">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">
                        {error.type === 'spelling' ? 'Orthographe' : 'Grammaire'}
                      </span>
                    </div>
                    <div className="mt-1 text-sm pl-6">
                      <p>Ligne {error.line}: {error.text || error.word}</p>
                      <p className="text-gray-600">Suggestion: {error.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestion des versions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-6 h-6" />
            Gestionnaire de Versions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {versions.map((version) => (
              <div 
                key={version.id} 
                className={`border rounded-lg p-4 ${
                  version.status === 'current' ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{version.id}</span>
                    {version.status === 'current' && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        Version actuelle
                      </span>
                    )}
                  </div>
                  {version.status !== 'current' && (
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Restaurer
                    </button>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    {version.timestamp}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <UserCircle className="w-4 h-4" />
                    {version.author}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Modifications :</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {version.changes.map((change, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{change}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validation Finale */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Finale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Commentaires</label>
              <textarea 
                className="w-full p-2 border rounded-lg"
                placeholder="Ajouter un commentaire..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Valider
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Rejeter
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentVersionManager;
