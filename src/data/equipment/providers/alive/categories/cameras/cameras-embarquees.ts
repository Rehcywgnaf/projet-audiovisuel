import { AliveEquipment } from '../../../../../../types/equipment/providers/alive';

export const camerasEmbarquees: AliveEquipment[] = [
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
      type: 'Stabilisateur giroscopique',
      mount: 'Micro 4/3'
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
    subCategory: 'optiques',
    unitType: 'lens',
    rentalUnit: 'day',
    specifications: {
      brand: 'OLYMPUS',
      focalLength: '12mm',
      maxAperture: 'f/2.0',
      mount: 'Micro 4/3'
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
    subCategory: 'optiques',
    unitType: 'lens',
    rentalUnit: 'day',
    specifications: {
      brand: 'OLYMPUS',
      focalLength: '15mm',
      maxAperture: 'f/2.0',
      mount: 'Micro 4/3'
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
    id: 'djiosmo14-42',
    aliveReference: 'DJiOSMO14-42',
    name: 'Optique OLYMPUS 14-42mm f 3.5/5,6 II R SILVER',
    category: 'cameras-embarquees',
    subCategory: 'optiques',
    unitType: 'lens',
    rentalUnit: 'day',
    specifications: {
      brand: 'OLYMPUS',
      focalLength: '14-42mm',
      maxAperture: 'f/3.5-5.6',
      mount: 'Micro 4/3'
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
    id: 'gopro3kit',
    aliveReference: 'GOPRO3KIT',
    name: 'KIT GOPRO HERO3',
    category: 'cameras-embarquees',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'GoPro',
      model: 'HERO3',
      type: 'Action camera'
    },
    pricing: {
      'standard': {
        dayRate: 43.00,
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
    id: 'goprohero3',
    aliveReference: 'GOPROHERO3',
    name: 'GoPro HERO 3 BLACK EDITION',
    category: 'cameras-embarquees',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'GoPro',
      model: 'HERO3 Black Edition',
      type: 'Action camera',
      resolution: '4K30, 2.7K60, 1080p120'
    },
    pricing: {
      'standard': {
        dayRate: 40.00,
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
];

export const accessoiresCamerasEmbarquees: AliveEquipment[] = [
  {
    id: 'goprofixharn',
    aliveReference: 'GOPROFIXHARN',
    name: 'Fixation Harnais pour GOPRO HERO2 et HERO3',
    category: 'cameras-embarquees',
    subCategory: 'accessoires',
    unitType: 'accessory',
    rentalUnit: 'day',
    specifications: {
      brand: 'GoPro',
      type: 'Harnais',
      compatibility: 'HERO2, HERO3'
    },
    pricing: {
      'standard': {
        dayRate: 4.00,
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
    id: 'goprofixsuc',
    aliveReference: 'GOPROFIXSUC',
    name: 'Ventouse de fixation pour GOPRO HERO2 et HERO3',
    category: 'cameras-embarquees',
    subCategory: 'accessoires',
    unitType: 'accessory',
    rentalUnit: 'day',
    specifications: {
      brand: 'GoPro',
      type: 'Ventouse',
      compatibility: 'HERO2, HERO3'
    },
    pricing: {
      'standard': {
        dayRate: 4.00,
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
    id: 'goprofixharn',
    aliveReference: 'GOPROFIXHARN',
    name: 'Fixation Serre Tête pour GOPRO HERO2 et HERO3',
    category: 'cameras-embarquees',
    subCategory: 'accessoires',
    unitType: 'accessory',
    rentalUnit: 'day',
    specifications: {
      brand: 'GoPro',
      type: 'Fixation tête',
      compatibility: 'HERO2, HERO3'
    },
    pricing: {
      'standard': {
        dayRate: 2.00,
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
    id: 'goprofixtrip',
    aliveReference: 'GOPROFIXTRIP',
    name: 'Adaptateur de Trépied pour GOPRO HERO2 et HERO3',
    category: 'cameras-embarquees',
    subCategory: 'accessoires',
    unitType: 'accessory',
    rentalUnit: 'day',
    specifications: {
      brand: 'GoPro',
      type: 'Adaptateur trépied',
      compatibility: 'HERO2, HERO3'
    },
    pricing: {
      'standard': {
        dayRate: 1.00,
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
];