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
  // Caméras Grands Capteurs
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
  {
    id: 'pmw-f55',
    aliveReference: 'PMWF55',
    name: 'Caméscope S35MM CINEALTA 4K PMW-F55 SONY',
    category: 'cameras-grands-capteurs',
    description: 'Caméscope S35MM CINEALTA 4K',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'SONY',
      model: 'PMW-F55',
      sensorSize: '35 mm 11,6 Megapixel CMOS',
      resolution: '4K UHD',
      dynamicRange: '14+ stops'
    },
    pricing: {
      'standard': {
        dayRate: 450.00,
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
    id: 'pxw-fs7',
    aliveReference: 'PXW-FS7',
    name: 'Camescope XDCAM 4K PXW-FS7 SONY',
    category: 'cameras-grands-capteurs',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'SONY',
      model: 'PXW-FS7'
    },
    pricing: {
      'standard': {
        dayRate: 190.00,
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
    id: 'utpxw-fs7',
    aliveReference: 'UTPXW-FS7',
    name: 'Unité de tournage XDCAM 4K PXW-FS7',
    category: 'cameras-grands-capteurs',
    unitType: 'camera',
    rentalUnit: 'day',
    description: 'Livrée avec chargeur/3 batteries + 1 carte XQD 32gb + trépied + minette + sangle + sac de transport',
    specifications: {
      brand: 'SONY',
      model: 'PXW-FS7'
    },
    pricing: {
      'standard': {
        dayRate: 240.00,
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
      'Chargeur',
      '3 batteries',
      'Carte XQD 32gb',
      'Trépied',
      'Minette',
      'Sangle',
      'Sac de transport'
    ]
  },
  {
    id: 'eosc300mkii-ef',
    aliveReference: 'EOSC300MKII-EF',
    name: 'Caméra 4K EOS-C300MK II Monture EF CANON',
    category: 'cameras-grands-capteurs',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'CANON',
      model: 'EOS-C300 MK II',
      mount: 'EF'
    },
    pricing: {
      'standard': {
        dayRate: 245.00,
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
    id: 'uteosc300mkii',
    aliveReference: 'UTEOSC300MKII',
    name: 'Unité de tournage EOS-C300 MK II',
    category: 'cameras-grands-capteurs',
    unitType: 'camera',
    rentalUnit: 'day',
    description: 'Livrée avec chargeur/3 batteries + 1 carte CF 32gb + trépied + sac de transport',
    specifications: {
      brand: 'CANON',
      model: 'EOS-C300 MK II'
    },
    pricing: {
      'standard': {
        dayRate: 295.00,
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
      'Chargeur',
      '3 batteries',
      'Carte CF 32gb',
      'Trépied',
      'Sac de transport'
    ]
  }
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