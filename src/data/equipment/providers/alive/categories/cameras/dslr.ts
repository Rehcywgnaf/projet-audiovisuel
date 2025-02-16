import { AliveEquipment } from '../../../../../../types/equipment/providers/alive';

export const dslr: AliveEquipment[] = [
  {
    id: '5dmarkiv',
    aliveReference: '5DMARKIV',
    name: 'Reflexe numerique 5D MARK IV CANON',
    category: 'dslr',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'CANON',
      model: '5D MARK IV',
      mount: 'EF',
      sensorSize: 'Full Frame',
      resolution: '30.4 Megapixels'
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
  {
    id: 'ut5dmarkiv',
    aliveReference: 'UT5DMARKIV',
    name: 'Unité réflexe num. 5D MARK IV Canon',
    category: 'dslr',
    unitType: 'camera',
    rentalUnit: 'day',
    description: 'Livrée avec chargeur/3 batteries + 1 carte CF 32gb + trépied + sac de transport',
    specifications: {
      brand: 'CANON',
      model: '5D MARK IV',
      mount: 'EF',
      sensorSize: 'Full Frame',
      resolution: '30.4 Megapixels'
    },
    pricing: {
      'standard': {
        dayRate: 175.00,
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
  },
  {
    id: '5dmarkiii',
    aliveReference: '5DMARKIII',
    name: 'Reflexe numerique 5D MARK III CANON',
    category: 'dslr',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'CANON',
      model: '5D MARK III',
      mount: 'EF',
      sensorSize: 'Full Frame',
      resolution: '22.3 Megapixels'
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
    id: 'ut5dmarkiii',
    aliveReference: 'UT5DMARKIII',
    name: 'Unité réflexe num. 5D MARK III Canon',
    category: 'dslr',
    unitType: 'camera',
    rentalUnit: 'day',
    description: 'Livrée avec chargeur/3 batteries + 1 carte CF 32gb + trépied + sac de transport',
    specifications: {
      brand: 'CANON',
      model: '5D MARK III',
      mount: 'EF',
      sensorSize: 'Full Frame',
      resolution: '22.3 Megapixels'
    },
    pricing: {
      'standard': {
        dayRate: 150.00,
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
  },
  {
    id: 'alpha7sii',
    aliveReference: 'ALPHA7SII',
    name: 'Boitier Nu Hybride Alpha 7S II MPX 4K SONY',
    category: 'dslr',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'SONY',
      model: 'Alpha 7S II',
      mount: 'E-Mount',
      sensorSize: 'Full Frame',
      resolution: '4K',
      iso: '100-102400'
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
  {
    id: 'utalpha7sii',
    aliveReference: 'UTALPHA7SII',
    name: 'Unité Alpha 7S II 4K SONY',
    category: 'dslr',
    unitType: 'camera',
    rentalUnit: 'day',
    description: 'Livrée avec chargeur/3 batteries + 1 carte SDXC 64gb + trépied + sac de transport',
    specifications: {
      brand: 'SONY',
      model: 'Alpha 7S II',
      mount: 'E-Mount',
      sensorSize: 'Full Frame',
      resolution: '4K',
      iso: '100-102400'
    },
    pricing: {
      'standard': {
        dayRate: 185.00,
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
      'Carte SDXC 64gb',
      'Trépied',
      'Sac de transport'
    ]
  },
  {
    id: 'gh4',
    aliveReference: 'GH4',
    name: 'Reflexe num. 4K LUMIX DMC-GH4 PANASONIC',
    category: 'dslr',
    unitType: 'camera',
    rentalUnit: 'day',
    specifications: {
      brand: 'PANASONIC',
      model: 'LUMIX DMC-GH4',
      mount: 'Micro 4/3',
      sensorSize: 'Micro 4/3',
      resolution: '4K'
    },
    pricing: {
      'standard': {
        dayRate: 100.00,
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
    id: 'utgh4',
    aliveReference: 'UTGH4',
    name: 'Unité Reflex num. 4K LUMIX GH4 PANASONIC',
    category: 'dslr',
    unitType: 'camera',
    rentalUnit: 'day',
    description: 'Livrée avec chargeur/3 batteries + 1 carte SD 32gb 280mb/s+ trépied + sac de transport',
    specifications: {
      brand: 'PANASONIC',
      model: 'LUMIX DMC-GH4',
      mount: 'Micro 4/3',
      sensorSize: 'Micro 4/3',
      resolution: '4K'
    },
    pricing: {
      'standard': {
        dayRate: 160.00,
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
      'Carte SD 32gb 280mb/s',
      'Trépied',
      'Sac de transport'
    ]
  }
];