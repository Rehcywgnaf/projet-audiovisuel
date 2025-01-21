import React, { useState } from 'react';

const PackageSelector = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [rentalDuration, setRentalDuration] = useState(1);

  // Référence aux packages optimisés
  const packages = {
    "Pack Documentaire Léger": {
      description: "Configuration légère pour documentaire en mouvement",
      recommended: "Projets documentaires, reportages",
      equipment: {
        camera: "SONY FX6",
        optics: ["SIGMA 24-70mm F2.8"],
        audio: ["SENNHEISER MKH-416", "HF WISYCOM KIT"],
        lighting: ["ASTERA TITAN KIT"],
        accessories: ["SHAPE RIG COMPLET", "SMALLHD 502"],
        stabilization: ["RONIN 2 COMPLETE"]
      },
      dailyEstimate: 580,
      weeklyEstimate: 2320,
      savings: "20% par rapport à la location à l'unité"
    },
    // ... autres packages
  };

  const calculateCost = (pack, days) => {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    return (weeks * pack.weeklyEstimate) + (remainingDays * pack.dailyEstimate);
  };

  const calculateSavings = (pack, days) => {
    const packageCost = calculateCost(pack, days);
    const individualCost = days * (pack.dailyEstimate * 1.25); // Estimation du coût à l'unité
    return individualCost - packageCost;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Packages Optimisés</h2>

        {/* Sélection de la durée */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Durée de location (jours)</label>
          <input
            type="number"
            min="1"
            value={rentalDuration}
            onChange={(e) => setRentalDuration(parseInt(e.target.value))}
            className="w-32 p-2 border rounded"
          />
        </div>

        {/* Liste des packages */}
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(packages).map(([name, pack]) => (
            <div
              key={name}
              className={`border rounded-lg p-4 cursor-pointer transition hover:bg-blue-50 ${
                selectedPackage === name ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedPackage(name)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{name}</h3>
                  <p className="text-gray-600">{pack.description}</p>
                  <p className="text-sm text-gray-500 mt-1">Recommandé pour: {pack.recommended}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl">{calculateCost(pack, rentalDuration)}€</div>
                  <div className="text-sm text-green-600">
                    Économie: {calculateSavings(pack, rentalDuration)}€
                  </div>
                </div>
              </div>

              {/* Détail de l'équipement */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                {Object.entries(pack.equipment).map(([category, items]) => (
                  <div key={category} className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium capitalize">{category}</h4>
                    <ul className="text-sm text-gray-600">
                      {Array.isArray(items) ? (
                        items.map((item, i) => <li key={i}>{item}</li>)
                      ) : (
                        <li>{items}</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Infos supplémentaires */}
              {selectedPackage === name && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Tarif journalier:</span>
                      <br />{pack.dailyEstimate}€/jour
                    </div>
                    <div>
                      <span className="font-medium">Tarif hebdomadaire:</span>
                      <br />{pack.weeklyEstimate}€/semaine
                    </div>
                    <div>
                      <span className="font-medium">Économie totale:</span>
                      <br />{pack.savings}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageSelector;
