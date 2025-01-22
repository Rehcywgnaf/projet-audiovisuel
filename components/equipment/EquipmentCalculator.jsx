import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const EquipmentCalculator = () => {
  const [projectDetails, setProjectDetails] = useState({
    duration: 0, // en minutes
    shootingDays: 0,
    postProdDays: 0
  });

  const [rentalPeriod, setRentalPeriod] = useState({
    startDate: '',
    endDate: '',
    totalDays: 0
  });

  const [selectedEquipment, setSelectedEquipment] = useState({});

  // Base de données Pictanovo
  const equipmentCategories = {
    "Caméras & Accessoires": {
      items: {
        "SONY VENICE 2": {
          dayRate: 450,
          weekRate: 1800,
          description: "Caméra Cinéma SONY VENICE 2",
          includes: ["Body", "2x Cartes", "V-Mount plate", "6x Batteries", "Chargeur"],
          specs: { sensor: "Full Frame 8.6K", mount: "PL", dynamicRange: "16 stops" }
        },
        "SONY FX9": {
          dayRate: 200,
          weekRate: 800,
          description: "Caméra SONY FX9",
          includes: ["Body", "2x XQD 120Go", "4x Batteries", "Chargeur", "Extension Unit"],
          specs: { sensor: "Full Frame 6K", mount: "E-Mount", iso: "800-12800" }
        },
        "SONY FX6": {
          dayRate: 180,
          weekRate: 720,
          description: "Caméra SONY FX6",
          includes: ["Body", "2x CFexpress Type A", "4x Batteries", "Chargeur"],
          specs: { sensor: "Full Frame 4K", mount: "E-Mount", iso: "800-12800" }
        },
        "SONY FS7 MII": {
          dayRate: 160,
          weekRate: 640,
          description: "Caméra SONY FS7 Mark II",
          includes: ["Body", "2x XQD", "Extension arm", "Viewfinder", "4x Batteries"],
          specs: { sensor: "Super 35mm 4K", mount: "E-Mount", iso: "2000" }
        },
        "RED V-RAPTOR": {
          dayRate: 400,
          weekRate: 1600,
          description: "Caméra RED V-RAPTOR 8K VV",
          includes: ["Body", "Media 660GB", "V-Mount plate", "Batteries", "Chargeur"],
          specs: { sensor: "Vista Vision 8K", mount: "RF", dynamicRange: "17 stops" }
        }
      }
    },
    "Optiques": {
      items: {
        "ZEISS CP3 Set": {
          dayRate: 150,
          weekRate: 600,
          description: "Set optiques Zeiss CP3",
          includes: ["21mm", "35mm", "50mm", "85mm"],
          specs: { mount: "PL", maxAperture: "T2.1" }
        },
        "CANON K35": {
          dayRate: 250,
          weekRate: 1000,
          description: "Set Canon K35 Vintage",
          includes: ["24mm", "35mm", "55mm", "85mm"],
          specs: { mount: "PL", maxAperture: "T1.4" }
        }
      }
    },
    "Audio": {
      items: {
        "SOUND DEVICES 888": {
          dayRate: 100,
          weekRate: 400,
          description: "Mixette Sound Devices 888",
          includes: ["Mixette", "Batteries", "Carte SD", "Sac"],
          specs: { channels: "8 entrées", recording: "32-bit float" }
        },
        "SENNHEISER MKH-416": {
          dayRate: 40,
          weekRate: 160,
          description: "Micro canon Sennheiser MKH-416",
          includes: ["Suspension", "Bonnette", "Câble XLR"],
          specs: { type: "Super-cardioïde/Lobe", phantom: "48V" }
        }
      }
    }
  };

  const calculateRentalCost = () => {
    let totalCost = 0;
    const itemizedCosts = {};
    const days = rentalPeriod.totalDays;

    Object.entries(selectedEquipment).forEach(([itemId, isSelected]) => {
      if (isSelected) {
        for (const category of Object.values(equipmentCategories)) {
          if (itemId in category.items) {
            const item = category.items[itemId];
            const weeks = Math.floor(days / 7);
            const remainingDays = days % 7;
            const cost = (weeks * item.weekRate) + (remainingDays * item.dayRate);
            
            itemizedCosts[itemId] = {
              cost,
              details: {
                weeks,
                remainingDays,
                weekRate: item.weekRate,
                dayRate: item.dayRate
              }
            };
            
            totalCost += cost;
            break;
          }
        }
      }
    });

    return {
      itemized: itemizedCosts,
      total: totalCost
    };
  };

  const updateRentalPeriod = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    setRentalPeriod({
      startDate: start,
      endDate: end,
      totalDays: diffDays
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculateur de Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Période de location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date de début</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={rentalPeriod.startDate}
                  onChange={(e) => updateRentalPeriod(e.target.value, rentalPeriod.endDate)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date de fin</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={rentalPeriod.endDate}
                  onChange={(e) => updateRentalPeriod(rentalPeriod.startDate, e.target.value)}
                />
              </div>
            </div>

            {/* Liste des équipements */}
            {Object.entries(equipmentCategories).map(([categoryName, category]) => (
              <div key={categoryName} className="space-y-4">
                <h3 className="font-bold text-lg">{categoryName}</h3>
                <div className="grid gap-4">
                  {Object.entries(category.items).map(([itemId, item]) => (
                    <div key={itemId} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedEquipment[itemId] || false}
                            onChange={(e) => setSelectedEquipment({
                              ...selectedEquipment,
                              [itemId]: e.target.checked
                            })}
                            className="mt-1"
                          />
                          <div>
                            <h4 className="font-medium">{itemId}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            <div className="mt-1">
                              <p className="text-sm text-gray-500">
                                Inclus : {item.includes.join(", ")}
                              </p>
                              {item.specs && (
                                <div className="mt-1 text-sm text-gray-500">
                                  Specs : {Object.entries(item.specs).map(([key, value]) => 
                                    `${key}: ${value}`
                                  ).join(", ")}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{item.dayRate}€/jour</div>
                          <div className="text-sm text-gray-600">{item.weekRate}€/semaine</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Résultat */}
            {rentalPeriod.totalDays > 0 && Object.keys(selectedEquipment).length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-bold text-lg mb-4">
                  Devis location : {rentalPeriod.totalDays} jours
                </h3>
                <div className="space-y-4">
                  {Object.entries(calculateRentalCost().itemized).map(([itemId, details]) => (
                    <div key={itemId} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{itemId}</span>
                        <div className="text-sm text-gray-600">
                          {details.details.weeks > 0 && `${details.details.weeks} semaines`}
                          {details.details.weeks > 0 && details.details.remainingDays > 0 && ' + '}
                          {details.details.remainingDays > 0 && `${details.details.remainingDays} jours`}
                        </div>
                      </div>
                      <span className="font-medium">{details.cost}€</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold text-lg">
                    <span>TOTAL</span>
                    <span>{calculateRentalCost().total}€</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentCalculator;
