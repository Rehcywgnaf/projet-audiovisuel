import { Category } from '../../../../types';

export const OPTIQUES_CINEMA: Category = {
  id: 'optiques-cinema',
  name: 'Optiques Ciné PL & EF',
  description: 'Optiques professionnelles pour le cinéma en monture PL et EF',
  products: [
    {
      id: 'leica-summicron',
      name: 'Série Leica Summicron-C',
      description: 'Série complète d\'optiques Leica Summicron-C couvrant le plein format',
      brand: 'Leica',
      model: 'Summicron-C',
      price: {
        amount: 1080.00,
        unit: 'EUR',
        period: 'day'
      },
      variants: [
        {
          id: 'sum-c-18mm',
          name: 'Summicron-C 18mm',
          description: 'Optique LEICA SUMMICRON-C - 18mm T2,0 - PL',
          technicalDetails: {
            focalLength: '18mm',
            aperture: 'T2.0',
            mount: 'PL',
            coverage: 'Full Frame'
          },
          price: {
            amount: 200.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'sum-c-25mm',
          name: 'Summicron-C 25mm',
          description: 'Optique LEICA SUMMICRON-C - 25mm T2,0 - PL',
          technicalDetails: {
            focalLength: '25mm',
            aperture: 'T2.0',
            mount: 'PL',
            coverage: 'Full Frame'
          },
          price: {
            amount: 200.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'sum-c-35mm',
          name: 'Summicron-C 35mm',
          description: 'Optique LEICA SUMMICRON-C - 35mm T2,0 - PL',
          technicalDetails: {
            focalLength: '35mm',
            aperture: 'T2.0',
            mount: 'PL',
            coverage: 'Full Frame'
          },
          price: {
            amount: 200.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'sum-c-50mm',
          name: 'Summicron-C 50mm',
          description: 'Optique LEICA SUMMICRON-C - 50mm T2,0 - PL',
          technicalDetails: {
            focalLength: '50mm',
            aperture: 'T2.0',
            mount: 'PL',
            coverage: 'Full Frame'
          },
          price: {
            amount: 200.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'sum-c-75mm',
          name: 'Summicron-C 75mm',
          description: 'Optique LEICA SUMMICRON-C - 75mm T2,0 - PL',
          technicalDetails: {
            focalLength: '75mm',
            aperture: 'T2.0',
            mount: 'PL',
            coverage: 'Full Frame'
          },
          price: {
            amount: 200.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'sum-c-100mm',
          name: 'Summicron-C 100mm',
          description: 'Optique LEICA SUMMICRON-C - 100mm T2,0 - PL',
          technicalDetails: {
            focalLength: '100mm',
            aperture: 'T2.0',
            mount: 'PL',
            coverage: 'Full Frame'
          },
          price: {
            amount: 200.00,
            unit: 'EUR',
            period: 'day'
          }
        }
      ]
    }
  ]
};