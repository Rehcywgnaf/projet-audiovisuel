import { Category } from '../../../../types';

export const LED_LIGHTING: Category = {
  id: 'led-lighting',
  name: 'Éclairage LED',
  description: 'Éclairages LED professionnels : panneaux, projecteurs souples, kits broadcast',
  products: [
    {
      id: 'litepanel-group',
      name: 'Litepanel',
      description: 'Panneaux LED Litepanel broadcast',
      products: [
        {
          id: 'litepanel-3x3',
          name: 'Litepanel 30x30',
          description: 'Éclairage LED 30x30 3200°/5600°K LITEPANEL',
          brand: 'Litepanel',
          technicalDetails: {
            dimensions: '30x30cm',
            colorTemperature: ['3200K', '5600K'],
            features: ['Variable']
          },
          price: {
            amount: 50.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'litepanelmini',
          name: 'Litepanel Mini',
          description: 'Éclairage LED 5x15 5600°K LITEPANEL',
          brand: 'Litepanel',
          technicalDetails: {
            dimensions: '5x15cm',
            colorTemperature: ['5600K']
          },
          price: {
            amount: 25.00,
            unit: 'EUR',
            period: 'day'
          }
        }
      ]
    },
    {
      id: 'cineroid-group',
      name: 'Cineroid',
      description: 'Éclairages LED Cineroid',
      products: [
        {
          id: 'lm4003k5k',
          name: 'Cineroid LM400',
          description: 'Éclairage LED 20X15 3000/5600°K CINEROID',
          brand: 'Cineroid',
          model: 'LM400',
          technicalDetails: {
            dimensions: '20x15cm',
            colorTemperature: ['3000K', '5600K'],
            features: ['Variable']
          },
          price: {
            amount: 50.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'lm800',
          name: 'Cineroid LM800',
          description: 'Éclairage LED 20x25 2700°/6500°K LM800 CINEROID',
          brand: 'Cineroid',
          model: 'LM800',
          technicalDetails: {
            dimensions: '20x25cm',
            colorTemperature: ['2700K', '6500K'],
            features: ['Variable']
          },
          price: {
            amount: 80.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'l10c-vce',
          name: 'Cineroid Minette LED',
          description: 'Minette à LED variable 2700°/6500°K CINEROID',
          brand: 'Cineroid',
          model: 'L10C-VCE',
          technicalDetails: {
            colorTemperature: ['2700K', '6500K'],
            features: ['Variable', 'Compact']
          },
          price: {
            amount: 25.00,
            unit: 'EUR',
            period: 'day'
          }
        }
      ]
    },
    {
      id: 'flexible-led-group',
      name: 'LED Souples',
      description: 'Panneaux LED flexibles',
      products: [
        {
          id: 'fl400',
          name: 'LED FL400',
          description: 'Éclairage LED souple 25x25 2700°/6500°K FL400',
          brand: 'FL',
          model: 'FL400',
          technicalDetails: {
            dimensions: '25x25cm',
            colorTemperature: ['2700K', '6500K'],
            features: ['Flexible', 'Variable']
          },
          price: {
            amount: 55.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'fl800sb',
          name: 'LED FL800',
          description: 'Éclairage LED souple 24x46 3200°/5600°K FL800',
          brand: 'FL',
          model: 'FL800',
          technicalDetails: {
            dimensions: '24x46cm',
            colorTemperature: ['3200K', '5600K'],
            features: ['Flexible', 'Variable']
          },
          price: {
            amount: 86.00,
            unit: 'EUR',
            period: 'day'
          }
        }
      ]
    },
    {
      id: 'panel-led-group',
      name: 'Panneaux LED',
      description: 'Grands panneaux LED',
      products: [
        {
          id: 'lbl5000',
          name: 'LightsByLed 120cm',
          description: 'Projecteur à LED 3200°/5600° 120cm Lights-by-led',
          brand: 'LightsByLed',
          model: 'LBL5000',
          technicalDetails: {
            dimensions: '120cm',
            colorTemperature: ['3200K', '5600K'],
            features: ['Variable']
          },
          price: {
            amount: 95.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'sl1-5600',
          name: 'SmartLight 120cm',
          description: 'Projecteur à LED 5600° 120cm SMARTHLIGHT',
          brand: 'SmartLight',
          model: 'SL1',
          technicalDetails: {
            dimensions: '120cm',
            colorTemperature: ['5600K']
          },
          price: {
            amount: 95.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'sl1bicolor',
          name: 'SmartLight TV Bicolor',
          description: 'Projecteur à LED TV 3200°/5600° SMARTHLIGHT',
          brand: 'SmartLight',
          model: 'SL1 Bicolor',
          technicalDetails: {
            colorTemperature: ['3200K', '5600K'],
            features: ['Variable', 'TV']
          },
          price: {
            amount: 92.00,
            unit: 'EUR',
            period: 'day'
          }
        }
      ]
    },
    {
      id: 'ringlight-group',
      name: 'Ring Light',
      description: 'Éclairages LED circulaires',
      products: [
        {
          id: 'ringlight',
          name: 'Rosco LitePad Loop',
          description: 'RINGLIGHT LitePad Loop Kit Pro 5600°K ROSCO',
          brand: 'Rosco',
          model: 'LitePad Loop Pro',
          technicalDetails: {
            colorTemperature: ['5600K'],
            features: ['Ring Light']
          },
          price: {
            amount: 90.00,
            unit: 'EUR',
            period: 'day'
          }
        }
      ]
    }
  ]
};