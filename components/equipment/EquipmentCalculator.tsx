import React, { useState } from 'react';

const EquipmentCalculator = () => {
  // Configuration des prestataires et équipements
  const equipmentDatabase = {
    providers: {
      ALIVE: { name: "ALIVE", location: "Bordeaux", minRentalDays: 1, weekDiscount: true },
      NEXT: { name: "Next Shot", location: "Bordeaux", minRentalDays: 1, weekDiscount: true },
      PICTANOVO: { name: "Pictanovo", location: "Hauts-de-France", minRentalDays: 1, weekDiscount: true }
    },
    categories: {
      "Caméras & Accessoires": {
        items: {
          "RED KOMODO 6K": {
            providers: {
              ALIVE: { dayRate: 250, weekRate: 1000, available: true },
              NEXT: { dayRate: 240, weekRate: 960, available: true }
            },
            description: "Caméra RED KOMODO 6K",
            includes: ["Body", "Media 480GB", "Batteries x4", "Chargeur"],
            specs: { sensor: "Super 35mm", resolution: "6K", mount: "Canon RF" }
          },
          "SONY FX9": {
            providers: {
              PICTANOVO: { dayRate: 200, weekRate: 800, available: true },
              NEXT: { dayRate: 220, weekRate: 880, available: true }
            },
            description: "Caméra SONY FX9",
            includes: ["Body", "2x Cartes XQD 120Go", "4x Batteries", "Chargeur"],
            specs: { sensor: "Full Frame", resolution: "4K", mount: "E-Mount" }
          },
          "SONY F55": {
            providers: {
              PICTANOVO: { dayRate: 220, weekRate: 880, available: true }
            },
            description: "Caméra SONY F55",
            includes: ["Body", "Cartes SxS", "4x Batteries", "Chargeur", "EVF"],
            specs: { sensor: "Super 35mm", resolution: "4K", mount: "PL/FZ" }
          },
          "CANON C300 MARK III": {
            providers: {
              PICTANOVO: { dayRate: 180, weekRate: 720, available: true }
            },
            description: "Caméra CANON C300 MARK III",
            includes: ["Body", "2x Cartes CFexpress", "Batteries", "Moniteur LCD"],
            specs: { sensor: "Super 35mm", resolution: "4K", mount: "EF" }
          },
          "SONY FS7 II": {
            providers: {
              PICTANOVO: { dayRate: 150, weekRate: 600, available: true }
            },
            description: "Caméra SONY FS7 II",
            includes: ["Body", "Cartes XQD", "Extension arm", "Viewfinder"],
            specs: { sensor: "Super 35mm", resolution: "4K", mount: "E-Mount" }
          },
          "BLACKMAGIC URSA MINI PRO 12K": {
            providers: {
              PICTANOVO: { dayRate: 190, weekRate: 760, available: true }
            },
            description: "Caméra BLACKMAGIC URSA MINI PRO 12K",
            includes: ["Body", "Cartes CFast", "V-Mount plate", "Viewfinder"],
            specs: { sensor: "Super 35mm", resolution: "12K", mount: "PL" }
          }
        }
      },
      "Optiques": {
        items: {
          "ZEISS CP3 Set": {
            providers: {
              PICTANOVO: { dayRate: 150, weekRate: 600, available: true }
            },
            description: "Set optiques Zeiss CP3",
            includes: ["21mm", "35mm", "50mm", "85mm"],
            specs: { mount: "PL", maxAperture: "T2.1" }
          },
          "CANON K35": {
            providers: {
              PICTANOVO: { dayRate: 250, weekRate: 1000, available: true }
            },
            description: "Set Canon K35 Vintage",
            includes: ["24mm", "35mm", "55mm", "85mm"],
            specs: { mount: "PL", maxAperture: "T1.4" }
          },
          "SIGMA FF HIGH SPEED": {
            providers: {
              PICTANOVO: { dayRate: 120, weekRate: 480, available: true }
            },
            description: "Set Sigma FF High Speed",
            includes: ["20mm", "24mm", "35mm", "50mm", "85mm"],
            specs: { mount: "PL/EF", maxAperture: "T1.5" }
          },
          "ANGÉNIEUX EZ-1 45-135mm": {
            providers: {
              PICTANOVO: { dayRate: 130, weekRate: 520, available: true }
            },
            description: "Zoom Angénieux EZ-1",
            includes: ["Pare-soleil", "Support", "Commande de zoom"],
            specs: { mount: "PL/EF", maxAperture: "T3" }
          },
          "ANGÉNIEUX EZ-2 15-40mm": {
            providers: {
              PICTANOVO: { dayRate: 130, weekRate: 520, available: true }
            },
            description: "Zoom Angénieux EZ-2",
            includes: ["Pare-soleil", "Support", "Commande de zoom"],
            specs: { mount: "PL/EF", maxAperture: "T2" }
          },
          "FUJINON ZK4.7x19": {
            providers: {
              PICTANOVO: { dayRate: 180, weekRate: 720, available: true }
            },
            description: "Zoom Fujinon Cabrio 19-90mm",
            includes: ["Servo", "Support", "Commande de zoom"],
            specs: { mount: "PL", maxAperture: "T2.9" }
          }
        }
      },
      "Audio": {
        items: {
          "SENNHEISER MKH-416": {
            providers: {
              ALIVE: { dayRate: 45, weekRate: 180, available: true },
              PICTANOVO: { dayRate: 40, weekRate: 160, available: true }
            },
            description: "Micro canon Sennheiser MKH-416",
            includes: ["Suspension", "Bonnette", "Câble XLR"],
            specs: { type: "Super-cardioïde/Lobe", phantom: "48V" }
          },
          "SOUND DEVICES 888": {
            providers: {
              PICTANOVO: { dayRate: 150, weekRate: 600, available: true }
            },
            description: "Enregistreur Sound Devices 888",
            includes: ["Mixette", "Batteries", "Sac de transport", "Cartes SD"],
            specs: { channels: "8 entrées", recording: "32-bit float" }
          },
          "CANTAR MINI": {
            providers: {
              PICTANOVO: { dayRate: 180, weekRate: 720, available: true }
            },
            description: "Enregistreur Cantar Mini",
            includes: ["Mixette", "Batteries", "Sac", "SSD"],
            specs: { channels: "16 entrées", recording: "32-bit float" }
          },
          "HF WISYCOM KIT": {
            providers: {
              PICTANOVO: { dayRate: 80, weekRate: 320, available: true }
            },
            description: "Kit HF Wisycom double",
            includes: ["2x Émetteurs", "1x Récepteur double", "2x Lavaliers DPA"],
            specs: { frequency: "470-798 MHz", range: "100m" }
          }
        }
      },
      "Lumière": {
        items: {
          "ARRI SKYPANEL S60-C": {
            providers: {
              PICTANOVO: { dayRate: 120, weekRate: 480, available: true }
            },
            description: "LED ARRI Skypanel S60-C",
            includes: ["Diffuseur", "Volets", "Pieds", "Câbles"],
            specs: { power: "450W", temperature: "2800K-10000K" }
          },
          "ARRI M18": {
            providers: {
              PICTANOVO: { dayRate: 180, weekRate: 720, available: true }
            },
            description: "Projecteur ARRI M18 HMI",
            includes: ["Ballast", "Câbles", "Coupe-flux"],
            specs: { power: "1800W", temperature: "5600K" }
          },
          "ASTERA TITAN KIT": {
            providers: {
              PICTANOVO: { dayRate: 150, weekRate: 600, available: true }
            },
            description: "Kit 8x tubes LED Astera Titan",
            includes: ["Flight case", "Chargeur", "Télécommande", "Support"],
            specs: { power: "72W/tube", temperature: "RGB+CCT" }
          },
          "KINO FLO CÉLEB 250": {
            providers: {
              PICTANOVO: { dayRate: 90, weekRate: 360, available: true }
            },
            description: "LED Kino Flo Céleb 250",
            includes: ["Diffuseur", "Grille", "Pied", "Câbles"],
            specs: { power: "250W", temperature: "2700K-6500K" }
          },
          "ARRI L7-C": {
            providers: {
              PICTANOVO: { dayRate: 85, weekRate: 340, available: true }
            },
            description: "Fresnel LED ARRI L7-C",
            includes: ["Volets", "Pied", "Câbles"],
            specs: { power: "220W", temperature: "2800K-10000K", angle: "15°-50°" }
          },
          "PACK QUASAR SCIENCE": {
            providers: {
              PICTANOVO: { dayRate: 60, weekRate: 240, available: true }
            },
            description: "Kit 4x tubes LED Quasar Science",
            includes: ["Supports", "Câbles", "Sac"],
            specs: { power: "50W/tube", temperature: "3200K/5600K" }
          }
        }
      }
    }
  };

  // États
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    category: 'all',
    provider: 'all',
    availability: true,
    location: 'all'
  });

  // Fonction de filtrage
  const filterEquipment = (categories) => {
    const filteredCategories = {};
    
    Object.entries(categories).forEach(([categoryName, category]) => {
      if (filters.category === 'all' || filters.category === categoryName) {
        const filteredItems = {};
        
        Object.entries(category.items).forEach(([itemId, item]) => {
          const hasValidProvider = Object.entries(item.providers).some(([providerId, providerData]) => {
            const provider = equipmentDatabase.providers[providerId];
            return (
              providerData.dayRate >= filters.priceRange.min &&
              providerData.dayRate <= filters.priceRange.max &&
              (filters.provider === 'all' || providerId === filters.provider) &&
              (filters.location === 'all' || provider.location === filters.location) &&
              (!filters.availability || providerData.available)
            );
          });

          if (hasValidProvider) {
            filteredItems[itemId] = item;
          }
        });
        
        if (Object.keys(filteredItems).length > 0) {
          filteredCategories[categoryName] = { ...category, items: filteredItems };
        }
      }
    });
    
    return filteredCategories;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Calculateur de Location</h2>

          {/* Filtres */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-lg mb-4">Filtres</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="all">Toutes les catégories</option>
                  {Object.keys(equipmentDatabase.categories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Région</label>
                <select
                  className="w-full p-2 border rounded"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                >
                  <option value="all">Toutes les régions</option>
                  {Array.from(new Set(Object.values(equipmentDatabase.providers).map(p => p.location))).map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prix max/jour</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={filters.priceRange.max}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: {...filters.priceRange, max: parseInt(e.target.value)}
                  })}
                  className="w-full"
                />
                <div className="text-sm text-gray-600">{filters.priceRange.max}€</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Disponibilité</label>
                <select
                  className="w-full p-2 border rounded"
                  value={filters.availability.toString()}
                  onChange={(e) => setFilters({...filters, availability: e.target.value === 'true'})}
                >
                  <option value="true">Disponible uniquement</option>
                  <option value="false">Tous les équipements</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sélecteur de packages */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Packages recommandés</h3>
            <PackageSelector />
          </div>

          {/* Alertes de disponibilité */}
          <div className="mb-8">
            <AvailabilityAlerts 
              equipment={filterEquipment(equipmentDatabase.categories)}
              selectedDates={{
                start: rentalPeriod.startDate,
                end: rentalPeriod.endDate
              }}
              onSetAlert={(itemId) => {
                // TODO: Implémenter la logique de notification
                console.log(`Alert set for ${itemId}`);
              }}
            />
          </div>

          {/* Tableau de comparaison */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left border">Équipement</th>
                  {Object.values(equipmentDatabase.providers).map(provider => (
                    <th key={provider.name} className="px-4 py-2 text-center border" colSpan="2">
                      <div>{provider.name}</div>
                      <div className="text-xs text-gray-500">{provider.location}</div>
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <th className="border"></th>
                  {Object.values(equipmentDatabase.providers).map(provider => (
                    <React.Fragment key={provider.name}>
                      <th className="px-2 py-1 text-sm border">Jour</th>
                      <th className="px-2 py-1 text-sm border">Semaine</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(filterEquipment(equipmentDatabase.categories)).map(([categoryName, category]) => (
                  <React.Fragment key={categoryName}>
                    <tr>
                      <td 
                        colSpan={Object.keys(equipmentDatabase.providers).length * 2 + 1} 
                        className="px-4 py-2 font-bold bg-gray-50 border"
                      >
                        {categoryName}
                      </td>
                    </tr>
                    {Object.entries(category.items).map(([itemId, item]) => (
                      <tr key={itemId} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">
                          <div className="font-medium">{itemId}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                          <div className="text-xs text-gray-500">
                            {item.includes && `Inclus: ${item.includes.join(', ')}`}
                          </div>
                        </td>
                        {Object.entries(equipmentDatabase.providers).map(([providerId, provider]) => {
                          const providerData = item.providers[providerId];
                          return (
                            <React.Fragment key={providerId}>
                              <td className="px-2 py-2 text-center border">
                                {providerData ? (
                                  <div className="relative">
                                    {providerData.dayRate}€
                                    {!providerData.available && (
                                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" 
                                            title="Non disponible">
                                      </span>
                                    )}
                                  </div>
                                ) : '-'}
                              </td>
                              <td className="px-2 py-2 text-center border">
                                {providerData ? providerData.weekRate + '€' : '-'}
                              </td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCalculator;
