import React, { useState, useEffect } from 'react';
import { Lightbulb, History, Star, TrendingUp } from 'lucide-react';

const SmartSuggestions = ({ projectType, budget, duration }) => {
  // Simulation d'historique de projets
  const projectHistory = [
    {
      type: "Documentaire",
      equipment: {
        camera: "SONY FX6",
        optics: ["SIGMA 24-70mm F2.8"],
        success: true,
        rating: 4.5
      }
    },
    {
      type: "Interview",
      equipment: {
        camera: "SONY FX9",
        optics: ["CANON CNE 24-105MM"],
        success: true,
        rating: 5
      }
    }
  ];

  const [suggestions, setSuggestions] = useState([]);

  const generateSuggestions = () => {
    return [
      {
        type: "Basé sur vos projets précédents",
        icon: <History className="h-5 w-5 text-blue-500" />,
        items: getHistoryBasedSuggestions()
      },
      {
        type: "Choix populaires",
        icon: <TrendingUp className="h-5 w-5 text-green-500" />,
        items: getPopularCombinations()
      },
      {
        type: "Alternatives recommandées",
        icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
        items: getAlternatives()
      }
    ];
  };

  const getHistoryBasedSuggestions = () => {
    // Analyse de l'historique pour des suggestions personnalisées
    const similarProjects = projectHistory.filter(p => p.type === projectType);
    return similarProjects.map(p => ({
      title: `Configuration ${p.type}`,
      equipment: p.equipment,
      confidence: p.rating * 20,
      reason: "Utilisé avec succès dans vos projets précédents"
    }));
  };

  const getPopularCombinations = () => {
    // Combinaisons populaires basées sur le type de projet
    return [
      {
        title: "Pack Documentary Pro",
        equipment: {
          camera: "SONY FX9",
          optics: ["ZEISS CP3 Set"],
          audio: ["SOUND DEVICES 888"]
        },
        confidence: 85,
        reason: "Choix populaire pour les documentaires"
      }
    ];
  };

  const getAlternatives = () => {
    // Suggestions d'alternatives quand le matériel préféré n'est pas disponible
    return [
      {
        title: "Alternative Premium",
        equipment: {
          camera: "RED V-RAPTOR",
          optics: ["CANON K35"]
        },
        confidence: 75,
        reason: "Alternative haut de gamme disponible"
      }
    ];
  };

  useEffect(() => {
    setSuggestions(generateSuggestions());
  }, [projectType, budget, duration]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center">
        <Lightbulb className="mr-2 h-6 w-6" />
        Suggestions Personnalisées
      </h3>

      {suggestions.map((category, idx) => (
        <div key={idx} className="space-y-4">
          <div className="flex items-center space-x-2">
            {category.icon}
            <h4 className="font-medium">{category.type}</h4>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {category.items.map((suggestion, index) => (
              <div 
                key={index}
                className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium flex items-center">
                      {suggestion.title}
                      {suggestion.confidence >= 80 && (
                        <Star className="h-4 w-4 text-yellow-400 ml-2 fill-current" />
                      )}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.reason}</p>
                  </div>
                  <div className="text-sm">
                    <div 
                      className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold"
                      style={{
                        borderColor: `hsl(${suggestion.confidence}, 70%, 50%)`
                      }}
                    >
                      {suggestion.confidence}%
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {Object.entries(suggestion.equipment).map(([type, items]) => (
                    <div key={type} className="bg-gray-50 p-2 rounded">
                      <span className="text-sm font-medium capitalize">{type}:</span>
                      <div className="text-sm text-gray-600">
                        {Array.isArray(items) ? items.join(", ") : items}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartSuggestions;
