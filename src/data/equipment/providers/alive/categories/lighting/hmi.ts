import { Category } from '../../../../types';

export const HMI_LIGHTING: Category = {
  id: 'hmi-lighting',
  name: 'Éclairage HMI',
  description: 'Projecteurs HMI professionnels haute puissance',
  products: [
    {
      id: 'alpha-series',
      name: 'Série Alpha K5600',
      description: 'Projecteurs HMI série Alpha K5600',
      products: [
        {
          id: 'alpha4v2',
          name: 'Alpha 4 V2',
          description: 'Projecteur HMI ALPHA 4V2 2,5-4Kws K5600',
          brand: 'K5600',
          model: 'Alpha 4 V2',
          technicalDetails: {
            power: '2.5-4kW',
            type: 'HMI',
            features: ['Fresnel']
          },
          price: {
            amount: 250.00,
            unit: 'EUR',
            period: 'day'
          },
          accessories: [
            {
              id: 'alpha4shal',
              name: 'Chimera Alpha 4 Large',
              description: 'Chimera Shallow+ large CHIM8045k pour ALPHA4',
              price: {
                amount: 0.00,
                unit: 'EUR',
                period: 'day'
              }
            },
            {
              id: 'alpha4spac',
              name: 'Spacebeam Alpha 4',
              description: 'SPACEBEAM 4K pour ALPHA4 V2',
              price: {
                amount: 0.00,
                unit: 'EUR',
                period: 'day'
              }
            },
            {
              id: 'alpha4v2rin',
              name: 'Ring Alpha 4',
              description: 'Ring pour ALPHA4 V2 K5600',
              price: {
                amount: 15.00,
                unit: 'EUR',
                period: 'day'
              }
            }
          ]
        },
        {
          id: 'alpha1600',
          name: 'Alpha 1600',
          description: 'Projecteur HMI ALPHA1600 HMI K5600',
          brand: 'K5600',
          model: 'Alpha 1600',
          technicalDetails: {
            power: '1.6kW',
            type: 'HMI',
            features: ['Fresnel']
          },
          price: {
            amount: 150.00,
            unit: 'EUR',
            period: 'day'
          },
          accessories: [
            {
              id: 'alpha16shal',
              name: 'Chimera Alpha 1600 Medium',
              description: 'Chimera Shallow+ Medium CHIM8035 pour ALPHA16',
              price: {
                amount: 48.00,
                unit: 'EUR',
                period: 'day'
              }
            },
            {
              id: 'alpha16ring',
              name: 'Ring Alpha 1600',
              description: 'Ring pour ALPHA1600 K5600',
              price: {
                amount: 15.00,
                unit: 'EUR',
                period: 'day'
              }
            }
          ]
        }
      ]
    },
    {
      id: 'joker-series',
      name: 'Série Joker K5600',
      description: 'Projecteurs HMI série Joker Bug K5600',
      products: [
        {
          id: 'joker800',
          name: 'Joker 800',
          description: 'Projecteur HMI Joker BUG 800 K5600',
          brand: 'K5600',
          model: 'Joker Bug 800',
          technicalDetails: {
            power: '800W',
            type: 'HMI'
          },
          price: {
            amount: 90.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'joker400',
          name: 'Joker 400',
          description: 'Projecteur HMI Joker BUG 400 K5600',
          brand: 'K5600',
          model: 'Joker Bug 400',
          technicalDetails: {
            power: '400W',
            type: 'HMI'
          },
          price: {
            amount: 70.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'joker200',
          name: 'Joker 200',
          description: 'Projecteur HMI Joker BUG 200 K5600',
          brand: 'K5600',
          model: 'Joker Bug 200',
          technicalDetails: {
            power: '200W',
            type: 'HMI'
          },
          price: {
            amount: 50.00,
            unit: 'EUR',
            period: 'day'
          }
        }
      ],
      accessories: [
        {
          id: 'chimeram',
          name: 'Chimera Medium',
          description: 'Chimera medium 90x120cm CHIM8135 pour JOKER',
          price: {
            amount: 38.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'chimerapanc',
          name: 'Chimera Pancake',
          description: 'Chimera Pancake diam. 89cm pour JOKER',
          price: {
            amount: 35.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'chimeras',
          name: 'Chimera Small',
          description: 'Chimera Small 60x80cm pour JOKER',
          price: {
            amount: 21.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'chimeraxs',
          name: 'Chimera XS',
          description: 'Chimera XS pour JOKER400',
          price: {
            amount: 20.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'chimeraxxs',
          name: 'Chimera XXS',
          description: 'Chimera XXS pour JOKER400',
          price: {
            amount: 20.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'chimerasnap',
          name: 'Nid d\'abeille Chimera',
          description: 'Nid d\'abeille SNAPGRIP pour chimera S',
          price: {
            amount: 21.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'ballastjoke',
          name: 'Ballast Joker',
          description: 'Ballast autonome double puissance pour JOKER',
          price: {
            amount: 10.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'batjoker',
          name: 'Batterie Joker',
          description: 'Batterie dual 30V 15Ah pour JOKER',
          price: {
            amount: 20.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'charjoker',
          name: 'Chargeur Joker',
          description: 'Chargeur Batterie SuperSilver',
          price: {
            amount: 8.00,
            unit: 'EUR',
            period: 'day'
          }
        },
        {
          id: 'jokerextjb',
          name: 'Extension Joker',
          description: 'Cable extension 7,5m Joker Bug 200/400/800',
          price: {
            amount: 15.00,
            unit: 'EUR',
            period: 'day'
          }
        }
      ]
    }
  ]
};