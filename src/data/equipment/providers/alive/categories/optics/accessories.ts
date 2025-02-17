import { Category } from '../../../../types';

export const OPTICS_ACCESSORIES: Category = {
  id: 'optics-accessories',
  name: 'Accessoires Optiques',
  description: 'Accessoires pour optiques: bonnettes, reports de zoom, commandes et supports',
  products: [
    {
      id: 'bonnettes-group',
      name: 'Bonnettes Grand Angle',
      description: 'Bonnettes grand angle pour différents modèles de caméras',
      products: [
        {
          id: 'hd75cvex3',
          name: 'Century Grand Angle PMW & EX',
          description: 'Bonnette CENTURY Grand Angle pour PMW & EX',
          brand: 'Century',
          technicalDetails: {
            compatibility: ['Sony PMW', 'Sony EX']
          },
          price: {
            amount: 20.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'hd75cvz57',
          name: 'Grand Angle HD Z5',
          description: 'Bonnette Grand Angle HD 75 pour Z5',
          brand: 'Century',
          technicalDetails: {
            compatibility: ['Sony Z5']
          },
          price: {
            amount: 20.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'vcl-ex0877',
          name: 'Sony Grand Angle PMW',
          description: 'Bonnette SONY Grand Angle pour PMW200&300',
          brand: 'Sony',
          technicalDetails: {
            compatibility: ['Sony PMW200', 'Sony PMW300']
          },
          price: {
            amount: 20.00,
            unit: 'EUR',
            period: 'day'
          }
        }
      ]
    },
    {
      id: 'zoom-controls-group',
      name: 'Reports de Zoom et Commandes',
      description: 'Contrôles déportés pour zoom et mise au point',
      products: [
        {
          id: 'ss400',
          name: 'Report Canon HD',
          description: 'Reports de Zoom et Point optique HD CANON',
          brand: 'Canon',
          technicalDetails: {
            compatibility: ['Optiques Canon HD']
          },
          price: {
            amount: 56.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'erdt22',
          name: 'Report Fujinon',
          description: 'Report de zoom optique Broadcast FUJINON',
          brand: 'Fujinon',
          technicalDetails: {
            compatibility: ['Optiques Fujinon Broadcast']
          },
          price: {
            amount: 50.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'zsd300d',
          name: 'Report Zoom Canon ZSD-300D',
          description: 'Report commande ZOOM ZSD-300D CANON',
          brand: 'Canon',
          model: 'ZSD-300D',
          price: {
            amount: 30.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'fdp400d',
          name: 'Report Focus Canon FDP-400D',
          description: 'Report commande FOCUS FDP-400D CANON',
          brand: 'Canon',
          model: 'FDP-400D',
          price: {
            amount: 30.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'epd1ca',
          name: 'Report Focus Fujinon',
          description: 'Report de focus optique Broadcast FUJINON',
          brand: 'Fujinon',
          technicalDetails: {
            compatibility: ['Optiques Fujinon Broadcast']
          },
          price: {
            amount: 50.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'zoeex',
          name: 'Report PMW/EX',
          description: 'Report de zoom pour caméscope PMW & EX',
          brand: 'Sony',
          technicalDetails: {
            compatibility: ['Sony PMW', 'Sony EX']
          },
          price: {
            amount: 10.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'ss13d',
          name: 'Reports Full Servo Fujinon',
          description: 'Jeu de reports FULL SERVO FUJINON',
          brand: 'Fujinon',
          technicalDetails: {
            compatibility: ['Optiques Fujinon Broadcast'],
            features: ['Full Servo']
          },
          price: {
            amount: 100.00,
            unit: 'EUR',
            period: 'day'
          }
        }
      ]
    },
    {
      id: 'wireless-controls-group',
      name: 'Commandes Sans Fil',
      description: 'Systèmes de contrôle HF pour zoom et mise au point',
      products: [
        {
          id: 'wb10tr',
          name: 'Report HF Canon',
          description: 'Liaison HF pour report zoom/point sur optique CANON',
          brand: 'Canon',
          technicalDetails: {
            compatibility: ['Optiques Canon'],
            features: ['HF']
          },
          price: {
            amount: 120.00,
            unit: 'EUR',
            period: 'day'
          }
        }
      ]
    }
  ]
};