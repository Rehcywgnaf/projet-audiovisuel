import { grandsCapteurs } from './grands-capteurs';
import { dslr } from './dslr';
import { camerasEmbarquees } from './cameras-embarquees';
import { AliveEquipment } from '../../../../../../types/equipment/providers/alive';

export const cameraCategories = {
  grandsCapteurs,
  dslr,
  camerasEmbarquees
};

// Export tous les équipements de caméras combinés
export const allCameras: AliveEquipment[] = [
  ...grandsCapteurs,
  ...dslr,
  ...camerasEmbarquees
];

// Export des utilitaires pour filtrer les caméras
export const filterCamerasByType = (type: string): AliveEquipment[] => {
  return allCameras.filter(camera => camera.specifications?.type === type);
};

export const filterCamerasByPriceRange = (min: number, max: number): AliveEquipment[] => {
  return allCameras.filter(camera => {
    const price = camera.pricing?.standard?.dayRate;
    return price && price >= min && price <= max;
  });
};

export const getCamerasByCategory = (category: string): AliveEquipment[] => {
  return allCameras.filter(camera => camera.category === category);
};