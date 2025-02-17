import { Category } from '../../../../types';

export const OPTIQUES_AUTRES: Category = {
  id: 'optiques-autres',
  name: 'Optiques Micro 4/3 et Monture E',
  description: 'Optiques pour appareils Micro 4/3 et Sony monture E',
  products: [
    {
      id: '14mm-m43',
      name: 'Optique Micro 4/3 14mm f/2.8',
      description: 'Optique µ4/3 14mm f2.8 pour PANASONIC',
      brand: 'Panasonic',
      technicalDetails: {
        focalLength: '14mm',
        aperture: 'f/2.8',
        mount: 'Micro 4/3'
      },
      price: {
        amount: 18.00,
        unit: 'EUR',
        period: 'day'
      }
    },
    {
      id: '20mm-m43',
      name: 'Optique Pancake 20mm f/1.7',
      description: 'Optique pancake 20mm f1,7 LUMIX PANASONIC', 
      brand: 'Panasonic',
      model: 'Lumix 20mm f/1.7',
      technicalDetails: {
        focalLength: '20mm',
        aperture: 'f/1.7',
        mount: 'Micro 4/3',
        features: ['Pancake']
      },
      price: {
        amount: 20.00,
        unit: 'EUR',
        period: 'day'
      }
    },
    {
      id: '35-100mm-m43',
      name: 'Optique LUMIX 35-100mm',
      description: 'Optique LUMIX PANASONIC 35-100mm',
      brand: 'Panasonic',
      model: 'Lumix 35-100mm',
      technicalDetails: {
        focalLength: '35-100mm',
        mount: 'Micro 4/3'
      },
      price: {
        amount: 35.00,
        unit: 'EUR',
        period: 'day'
      }
    },
    {
      id: 'sel28-135kit',
      name: 'Sony 28-135mm f/4 G OSS PZ',
      description: 'Optique zoom motorisé pour sony FS7 - 28-135mm',
      brand: 'Sony',
      model: 'SEL28135G',
      technicalDetails: {
        focalLength: '28-135mm',
        aperture: 'f/4',
        mount: 'E',
        features: ['OSS', 'Power Zoom']
      },
      price: {
        amount: 55.00,
        unit: 'EUR',
        period: 'day'
      }
    }
  ]
};