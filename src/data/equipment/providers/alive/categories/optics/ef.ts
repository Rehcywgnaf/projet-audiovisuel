import { Category } from '../../../../types';

export const OPTIQUES_EF: Category = {
  id: 'optiques-ef',
  name: 'Optiques Monture EF',
  description: 'Optiques professionnelles en monture Canon EF',
  products: [
    {
      id: 'sigma-18-35',
      name: 'Sigma 18-35mm f/1.8 DC',
      description: 'Optique SIGMA 18-35mm F1,8 DC Monture EF',
      brand: 'Sigma',
      model: '18-35mm F1.8 DC',
      technicalDetails: {
        focalLength: '18-35mm',
        aperture: 'f/1.8',
        mount: 'EF',
        coverage: 'APS-C'
      },
      price: {
        amount: 30.00,
        unit: 'EUR',
        period: 'day'
      }
    },
    {
      id: 'ef-24mm',
      name: 'Canon EF 24mm f/1.4L II USM',
      description: 'Optique grand angle Canon série L',
      brand: 'Canon',
      model: 'EF 24mm f/1.4L II USM',
      technicalDetails: {
        focalLength: '24mm',
        aperture: 'f/1.4',
        mount: 'EF',
        coverage: 'Full Frame',
        features: ['USM']
      },
      price: {
        amount: 40.00,
        unit: 'EUR',
        period: 'day'
      }
    },
    {
      id: 'ef-35mm',
      name: 'Canon EF 35mm f/1.4L II USM',
      description: 'Optique grand angle Canon série L',
      brand: 'Canon',
      model: 'EF 35mm f/1.4L II USM',
      technicalDetails: {
        focalLength: '35mm',
        aperture: 'f/1.4',
        mount: 'EF',
        coverage: 'Full Frame',
        features: ['USM']
      },
      price: {
        amount: 40.00,
        unit: 'EUR',
        period: 'day'
      }
    },
    {
      id: 'ef-50mm',
      name: 'Canon EF 50mm f/1.2L USM',
      description: 'Optique standard Canon série L',
      brand: 'Canon',
      model: 'EF 50mm f/1.2L USM',
      technicalDetails: {
        focalLength: '50mm',
        aperture: 'f/1.2',
        mount: 'EF',
        coverage: 'Full Frame',
        features: ['USM']
      },
      price: {
        amount: 40.00,
        unit: 'EUR',
        period: 'day'
      }
    },
    {
      id: 'ef-100mm-macro',
      name: 'Canon EF 100mm f/2.8L Macro',
      description: 'Optique macro Canon série L',
      brand: 'Canon',
      model: 'EF 100mm f/2.8L Macro IS USM',
      technicalDetails: {
        focalLength: '100mm',
        aperture: 'f/2.8',
        mount: 'EF',
        coverage: 'Full Frame',
        features: ['Macro', 'IS', 'USM']
      },
      price: {
        amount: 44.00,
        unit: 'EUR',
        period: 'day'
      }
    }
  ]
};