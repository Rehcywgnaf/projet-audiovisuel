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
    id: 'cameras-embarquees',
    name: 'Caméras Embarquées',
    path: ['Caméras Embarquées'],
    displayOrder: 3,
    specifications: [
      'type',
      'resolution',
      'stabilization'
    ]
  },
  {
    id: 'optiques',
    name: 'Optiques',
    displayOrder: 4,
    path: ['Optiques'],
    specifications: [
      'mount',
      'focalLength',
      'maxAperture',
      'coverage'
    ]
  }
];

export const aliveEquipment: AliveEquipment[] = [
  // SECTION: CAMÉRAS GRANDS CAPTEURS
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
  // [Reste des caméras grands capteurs...]

  // SECTION: DSLR
  {
    id: '5dmarkiv',
    aliveReference: '5DMARKIV',
    name: 'Reflexe numerique 5D MARK IV CANON',
    category: 'dslr',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'CANON',
      model: '5D MARK IV'
    },
    pricing: {
      'standard': {
        dayRate: 140.00,
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
  // [Reste des DSLR...]

  // SECTION: CAMÉRAS EMBARQUÉES
  {
    id: 'osmox5',
    aliveReference: 'OSMOX5',
    name: 'STAB. GIROSCOPIQUE DJI OSMO X5',
    category: 'cameras-embarquees',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'DJI',
      model: 'OSMO X5',
      type: 'Stabilisateur giroscopique'
    },
    pricing: {
      'standard': {
        dayRate: 120.00,
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
  {
    id: 'djiosmo12',
    aliveReference: 'DJiOSMO12',
    name: 'Optique OLYMPUS 12mm f/2.0 micro 4/3 pour OSMO',
    category: 'cameras-embarquees',
    subCategory: 'accessories',
    unitType: 'lens',
    rentalUnit: 'day',
    specifications: {
      brand: 'OLYMPUS',
      focalLength: '12mm',
      maxAperture: 'f/2.0',
      mount: 'micro 4/3'
    },
    pricing: {
      'standard': {
        dayRate: 20.00,
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
  {
    id: 'djiosmo15',
    aliveReference: 'DJiOSMO15',
    name: 'Optique OLYMPUS 15mm f/2.0 micro 4/3 pour OSMO',
    category: 'cameras-embarquees',
    subCategory: 'accessories',
    unitType: 'lens',
    rentalUnit: 'day',
    specifications: {
      brand: 'OLYMPUS',
      focalLength: '15mm',
      maxAperture: 'f/2.0',
      mount: 'micro 4/3'
    },
    pricing: {
      'standard': {
        dayRate: 20.00,
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
  }
  // Plus d'équipements à venir...
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