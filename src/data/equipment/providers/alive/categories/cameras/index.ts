import { grandsCapteurs } from './grands-capteurs';
import { dslr } from './dslr';
import { camerasEmbarquees, accessoiresCamerasEmbarquees } from './cameras-embarquees';
import { AliveEquipment } from '../../../../../../types/equipment/providers/alive';

// Export direct de toutes les sous-catégories
export { grandsCapteurs, dslr, camerasEmbarquees, accessoiresCamerasEmbarquees };

// Export des groupements logiques
export const cameraCategories = {
  grandsCapteurs,
  dslr,
  camerasEmbarquees,
  accessoiresCamerasEmbarquees
};

// Export de toutes les caméras combinées (sans les accessoires)
export const allCameras: AliveEquipment[] = [
  ...grandsCapteurs,
  ...dslr,
  ...camerasEmbarquees
];

// Export de tous les équipements caméras (y compris accessoires)
export const allCameraEquipment: AliveEquipment[] = [
  ...allCameras,
  ...accessoiresCamerasEmbarquees
];

// Utilitaires de filtrage
export const filterByBrand = (brand: string): AliveEquipment[] => {
  return allCameraEquipment.filter(item => 
    item.specifications?.brand?.toLowerCase() === brand.toLowerCase()
  );
};

export const filterByPriceRange = (min: number, max: number): AliveEquipment[] => {
  return allCameraEquipment.filter(item => {
    const price = item.pricing?.standard?.dayRate;
    return price !== undefined && price >= min && price <= max;
  });
};

export const filterByMount = (mount: string): AliveEquipment[] => {
  return allCameraEquipment.filter(item => 
    item.specifications?.mount?.toLowerCase() === mount.toLowerCase()
  );
};

export const filterByCategory = (category: string): AliveEquipment[] => {
  return allCameraEquipment.filter(item => 
    item.category === category || item.subCategory === category
  );
};

// Statistiques
export const getCategoryStats = () => {
  return {
    grandsCapteurs: grandsCapteurs.length,
    dslr: dslr.length,
    camerasEmbarquees: camerasEmbarquees.length,
    accessoires: accessoiresCamerasEmbarquees.length,
    total: allCameraEquipment.length
  };
};

export const getPriceStats = () => {
  const prices = allCameraEquipment.map(item => item.pricing?.standard?.dayRate).filter(Boolean);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    average: prices.reduce((acc, val) => acc + val, 0) / prices.length,
    totalItems: prices.length
  };
};

// Recherche
export const searchEquipment = (query: string): AliveEquipment[] => {
  const searchTerm = query.toLowerCase();
  return allCameraEquipment.filter(item => {
    const searchableFields = [
      item.name,
      item.description,
      item.specifications?.brand,
      item.specifications?.model,
      item.specifications?.mount,
      item.category,
      item.subCategory
    ].filter(Boolean).map(field => field.toLowerCase());

    return searchableFields.some(field => field.includes(searchTerm));
  });
};