import { AliveEquipment, AliveCategory } from '../../../types/equipment/providers/alive';

export const aliveCategories: AliveCategory[] = [
  {
    id: 'cameras-grands-capteurs',
    name: 'Caméras Grands Capteurs',
    path: ['Caméras Grands Capteurs'],
    displayOrder: 1,
    specifications: [
      'sensor',
      'resolution',
      'mount',
      'dynamicRange',
      'recordingMedia'
    ]
  },
  {
    id: 'dslr',
    name: 'DSLR',
    path: ['DSLR'],
    displayOrder: 2,
    specifications: [
      'sensor',
      'resolution',
      'mount',
      'iso'
    ]
  },
  {
    id: 'optiques',
    name: 'Optiques',
    path: ['Optiques'],
    displayOrder: 3,
    specifications: [
      'mount',
      'focalLength',
      'maxAperture',
      'minAperture'
    ]
  }
  // Autres catégories à ajouter
];

export const aliveEquipment: AliveEquipment[] = [
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
        weekRate: undefined, // À calculer selon le coefficient
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
    includedItems: [
      'Body',
      'Media 480GB',
      'Batteries x4',
      'Chargeur'
    ]
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
      resolution: '8K',
      dynamicRange: '16.5+ stops'
    },
    pricing: {
      'standard': {
        dayRate: 750.00,
        weekRate: undefined,
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
    includedItems: [
      'Body',
      'Media',
      'Batteries',
      'Chargeur'
    ]
  }
  // Autres équipements à ajouter
];

export const aliveRentalCoefficients = {
  days: {
    1: 1,
    2: 1.5,
    3: 2,
    4: 2.5,
    5: 3,
    6: 3.5,
    7: 4,
    8: 4.5,
    9: 4.7,
    10: 5,
    11: 5.2,
    12: 5.5,
    13: 5.7,
    14: 6
  }
};