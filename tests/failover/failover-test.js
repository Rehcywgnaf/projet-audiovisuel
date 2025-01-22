import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failureRate = new Rate('failures');

export const options = {
  scenarios: {
    normal_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },  // Montée normale
        { duration: '3m', target: 50 },  // Charge stable
      ],
    },
    failover_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      startTime: '5m',  // Démarre après la charge normale
      stages: [
        { duration: '1m', target: 100 },  // Charge élevée pendant failover
        { duration: '2m', target: 100 },  // Maintien charge élevée
      ],
    },
  },
  thresholds: {
    failures: ['rate<0.05'],  // Max 5% d'erreurs pendant le failover
    http_req_duration: ['p(95)<2000'],  // 95% des requêtes sous 2s
  },
};

const BASE_URL = 'http://sapav.local';

export function setup() {
  // Vérification initiale des serveurs
  const health = http.get(`${BASE_URL}/health`);
  check(health, {
    'initial health check passed': (r) => r.status === 200,
  });
}

export default function () {
  // Test des points d'accès critiques
  const responses = http.batch([
    ['GET', `${BASE_URL}/api/projects`],
    ['GET', `${BASE_URL}/static/bundle.js`],
    ['GET', `${BASE_URL}/health`]
  ]);

  // Vérification des réponses
  responses.forEach((res, index) => {
    const path = index === 0 ? 'API' : index === 1 ? 'Static' : 'Health';
    check(res, {
      [`${path} status 2xx`]: (r) => r.status >= 200 && r.status < 300,
      [`${path} response time OK`]: (r) => r.timings.duration < 2000,
    });

    // Vérification du cache pour les ressources statiques
    if (index === 1) {
      check(res, {
        'Static content cached': (r) => r.headers['X-Cache'] !== undefined,
      });
    }

    failureRate.add(res.status >= 400);
  });

  sleep(1);
}

export function teardown(data) {
  // Vérification finale des serveurs
  const health = http.get(`${BASE_URL}/health`);
  check(health, {
    'final health check passed': (r) => r.status === 200,
  });
}