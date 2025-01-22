import React, { useState, useEffect } from 'react';
import { Calculator, TrendingDown, PieChart, Calendar } from 'lucide-react';

const SavingsCalculator = ({ selectedEquipment, duration, packageSelected }) => {
  const [savingsAnalysis, setSavingsAnalysis] = useState(null);

  const calculateSavings = () => {
    // Structure pour stocker les différents types d'économies
    const analysis = {
      durationSavings: 0,
      packageSavings: 0,
      promotionalSavings: 0,
      totalSavings: 0,
      recommendations: []
    };

    // Calcul des économies basées sur la durée
    const durationRates = {
      weekly: 0.15,  // 15% de réduction pour location à la semaine
      biweekly: 0.25, // 25% pour deux semaines
      monthly: 0.35   // 35% pour un mois
    };

    const weeks = Math.floor(duration / 7);
    if (weeks >= 4) {
      analysis.durationSavings = calculateBaseCost() * durationRates.monthly;
    } else if (weeks >= 2) {
      analysis.durationSavings = calculateBaseCost() * durationRates.biweekly;
    } else if (weeks >= 1) {
      analysis.durationSavings = calculateBaseCost() * durationRates.weekly;
    }

    // Calcul des économies de package
    if (packageSelected) {
      analysis.packageSavings = calculatePackageSavings();
    }

    // Vérification des promotions saisonnières
    const promotionalSavings = checkPromotionalPeriods();
    analysis.promotionalSavings = promotionalSavings;

    // Calcul du total des économies
    analysis.totalSavings = analysis.durationSavings + 
                           analysis.packageSavings + 
                           analysis.promotionalSavings;

    // Génération des recommandations
    analysis.recommendations = generateRecommendations(analysis);

    return analysis;
  };

  const calculateBaseCost = () => {
    return Object.values(selectedEquipment).reduce((total, item) => {
      return total + (item.dayRate * duration);
    }, 0);
  };

  const calculatePackageSavings = () => {
    const packageDiscount = 0.2; // 20% de réduction sur les packages
    return calculateBaseCost() * packageDiscount;
  };

  const checkPromotionalPeriods = () => {
    // Simulation de périodes promotionnelles
    const promotionalPeriods = [
      { start: '2024-01-01', end: '2024-02-28', discount: 0.1 },
      { start: '2024-07-01', end: '2024-08-31', discount: 0.15 }
    ];

    const currentDate = new Date();
    let promotionalSavings = 0;

    promotionalPeriods.forEach(period => {
      const startDate = new Date(period.start);
      const endDate = new Date(period.end);
      
      if (currentDate >= startDate && currentDate <= endDate) {
        promotionalSavings = calculateBaseCost() * period.discount;
      }
    });

    return promotionalSavings;
  };

  const generateRecommendations = (analysis) => {
    const recommendations = [];

    // Recommandations basées sur la durée
    if (duration < 7 && duration >= 5) {
      recommendations.push({
        type: 'duration',
        message: 'Prolongez de 2 jours pour bénéficier du tarif semaine',
        potentialSavings: calculateBaseCost() * 0.15
      });
    }

    // Recommandations de packages
    if (!packageSelected && Object.keys(selectedEquipment).length >= 3) {
      recommendations.push({
        type: 'package',
        message: 'Optez pour un package pour économiser sur l\'ensemble',
        potentialSavings: calculateBaseCost() * 0.2
      });
    }

    return recommendations;
  };

  useEffect(() => {
    if (selectedEquipment && duration) {
      const analysis = calculateSavings();
      setSavingsAnalysis(analysis);
    }
  }, [selectedEquipment, duration, packageSelected]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold flex items-center mb-6">
        <Calculator className="mr-2 h-6 w-6" />
        Analyse des économies
      </h3>

      {savingsAnalysis && (
        <div className="space-y-6">
          {/* Résumé des économies */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600">Économies totales</div>
              <div className="text-2xl font-bold">{savingsAnalysis.totalSavings}€</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">Sur la durée</div>
              <div className="text-2xl font-bold">{savingsAnalysis.durationSavings}€</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600">Package</div>
              <div className="text-2xl font-bold">{savingsAnalysis.packageSavings}€</div>
            </div>
          </div>

          {/* Répartition détaillée */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4 flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Répartition des économies
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Économies durée</span>
                <span className="font-medium">{savingsAnalysis.durationSavings}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Économies package</span>
                <span className="font-medium">{savingsAnalysis.packageSavings}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Promotions</span>
                <span className="font-medium">{savingsAnalysis.promotionalSavings}€</span>
              </div>
            </div>
          </div>

          {/* Recommandations */}
          {savingsAnalysis.recommendations.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4 flex items-center">
                <TrendingDown className="mr-2 h-5 w-5" />
                Optimisations possibles
              </h4>
              <div className="space-y-3">
                {savingsAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{rec.message}</span>
                    <span className="text-sm font-medium text-green-600">
                      +{rec.potentialSavings}€
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Périodes promotionnelles */}
          <div className="mt-4">
            <h4 className="font-medium mb-2 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Périodes promotionnelles
            </h4>
            <div className="text-sm text-gray-600">
              <p>Basse saison (Janvier-Février): -10%</p>
              <p>Été (Juillet-Août): -15%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsCalculator;
