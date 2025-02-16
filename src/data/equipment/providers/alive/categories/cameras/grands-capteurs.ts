import { AliveEquipment } from '../../../../../../types/equipment/providers/alive';

export const grandsCapteurs: AliveEquipment[] = [
  {
    id: 'alexamini',
    aliveReference: 'ALEXAMINI',
    name: 'Caméra ALEXA Mini 4K/2K/HD ARRI',
    category: 'cameras-grands-capteurs',
    description: 'Caméra ALEXA Mini 4K/2K/HD',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'ARRI',
      model: 'ALEXA Mini',
      sensorSize: '35 mm format ARRI ALEV III CMOS',
      resolution: '4K UHD',
      dynamicRange: '14+ stops'
    },
    pricing: {
      'standard': {
        dayRate: 950.00,
        minimumDays: 1
      }
    },
    availability: {
      'standard': {
        isAvailable: true
      }
    },
    provider: {
      id: 'ALIVE',
      name: 'ALIVE',
      location: 'Lille'
    },
    includedItems: ['Body', 'Media 480GB', 'Batteries x4', 'Chargeur']
  },
  {
    id: 'red-epic-w',
    aliveReference: 'RED',
    name: 'Caméra EPIC-W capteur HELIUM 8K Super35 RED',
    category: 'cameras-grands-capteurs',
    description: 'Caméra RED EPIC-W HELIUM 8K',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'RED',
      model: 'EPIC-W HELIUM',
      sensorSize: 'Super 35mm',
      resolution: '8K 2.4:1 à plus de 75 fps',
      dynamicRange: '16.5+ stops'
    },
    pricing: {
      'standard': {
        dayRate: 750.00,
        minimumDays: 1
      }
    },
    availability: {
      'standard': {
        isAvailable: true
      }
    },
    provider: {
      id: 'ALIVE',
      name: 'ALIVE',
      location: 'Lille'
    }
  },
  // Autres caméras grands capteurs...
];