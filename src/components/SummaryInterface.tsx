import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, Bell, Settings, Filter, MessageSquare } from 'lucide-react';

const SummaryInterface = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [expandedId, setExpandedId] = useState(null);
  
  const sampleSummaries = [
    {
      id: 1,
      title: "Appel à Projet - Innovation Audiovisuelle 2024",
      type: "AAP",
      date: "2024-02-15",
      summary: {
        exec: "Financement de projets innovants dans l'audiovisuel",
        budget: "50k€ - 150k€",
        deadline: "15 Mars 2024",
        keywords: ["innovation", "audiovisuel", "digital"]
      },
      detailed_summary: "Ce programme vise à soutenir les projets innovants dans le secteur audiovisuel, avec un accent particulier sur l'intégration des nouvelles technologies et la transformation digitale. L'objectif est de favoriser l'émergence de nouvelles formes de narration et de production audiovisuelle, tout en renforçant la compétitivité du secteur.",
      key_points: [
        "Focus sur l'innovation technologique",
        "Ouvert aux structures de toutes tailles",
        "Possibilité de partenariats internationaux",
        "Accompagnement technique disponible"
      ],
      evaluation_criteria: [
        "Caractère innovant du projet",
        "Viabilité économique",
        "Impact sur le secteur",
        "Qualité de l'équipe"
      ],
      ai_suggestions: "Ce projet correspond particulièrement à votre expertise en production audiovisuelle innovante. Considérez de mettre en avant vos précédentes réalisations en matière d'innovation technologique et vos collaborations internationales.",
      feedback: { useful: 12, notUseful: 2 },
      priority: "high"
    },
    {
      id: 2,
      type: "AO",
      title: "Production Série Documentaire - Région IDF",
      date: "2024-02-10",
      summary: {
        exec: "Production d'une série documentaire de 6 épisodes",
        budget: "200k€",
        deadline: "1 Avril 2024",
        keywords: ["documentaire", "série", "régional"]
      },
      detailed_summary: "La région Île-de-France recherche un producteur pour la réalisation d'une série documentaire de 6 épisodes mettant en valeur le patrimoine culturel et industriel de la région. Le projet nécessite une approche narrative innovante et une expertise en production documentaire.",
      key_points: [
        "6 épisodes de 26 minutes",
        "Focus sur le patrimoine régional",
        "Diffusion sur les chaînes régionales",
        "Droits d'exploitation négociables"
      ],
      evaluation_criteria: [
        "Expérience en production documentaire",
        "Qualité de l'approche narrative",
        "Faisabilité du planning",
        "Maîtrise du budget"
      ],
      ai_suggestions: "Votre expérience en production documentaire régionale est un atout majeur. Mettez en avant vos précédentes collaborations avec les institutions culturelles locales et votre connaissance du territoire.",
      feedback: { useful: 8, notUseful: 1 },
      priority: "medium"
    }
  ];

  const alertSettings = [
    { keyword: "audiovisuel", active: true },
    { keyword: "innovation", active: true },
    { keyword: "documentaire", active: false }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* En-tête avec filtres */}
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <button 
            className={`px-4 py-2 rounded-lg ${activeTab === 'recent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('recent')}
          >
            Récents
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeTab === 'saved' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('saved')}
          >
            Sauvegardés
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Paramètres d'alertes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Mots-clés surveillés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {alertSettings.map((alert, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                  alert.active ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                }`}
              >
                {alert.keyword}
                <button className="hover:text-blue-600">
                  {alert.active ? '✓' : '+'}
                </button>
              </span>
            ))}
            <button className="px-3 py-1 rounded-full text-sm border border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-500">
              + Ajouter
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des résumés */}
      <div className="space-y-4">
        {sampleSummaries.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.type === 'AAP' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.priority === 'high' ? 'Prioritaire' : 'Standard'}
                    </span>
                  </div>
                  <h3 className="font-medium">{item.title}</h3>
                </div>
                <div className="text-sm text-gray-500">{item.date}</div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Résumé: </span>
                    {item.summary.exec}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Budget: </span>
                    {item.summary.budget}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Deadline: </span>
                  <span className="text-red-600 font-medium">{item.summary.deadline}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.summary.keywords.map((keyword, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{item.feedback.useful}</span>
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600">
                    <ThumbsDown className="w-4 h-4" />
                    <span>{item.feedback.notUseful}</span>
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>Commenter</span>
                  </button>
                </div>
                <button 
                  onClick={() => setExpandedId(item.id === expandedId ? null : item.id)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {item.id === expandedId ? 'Réduire ←' : 'Voir les détails →'}
                </button>
              </div>

              {item.id === expandedId && (
                <div className="mt-4 pt-4 border-t">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Résumé Détaillé</h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700">
                        {item.detailed_summary}
                      </p>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Points Clés</h5>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {item.key_points?.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2">Critères d'Évaluation</h5>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {item.evaluation_criteria?.map((criterion, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                              {criterion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Suggestions IA</h5>
                      <div className="bg-blue-50 rounded p-3 text-sm text-blue-700">
                        {item.ai_suggestions}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SummaryInterface;
