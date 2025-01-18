import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 100 }, // montée en charge normale
    { duration: '3m', target: 100 }, // test de stabilité
    { duration: '1m', target: 200 }, // test de surcharge
    { duration: '2m', target: 200 }, // maintien surcharge
    { duration: '1m', target: 0 },   // retour au calme
  ],
  thresholds: {
    errors: ['rate<0.1'], // 10% max d'erreurs
    http_req_duration: ['p(95)<2000'], // 95% des requêtes sous 2s
    http_req_failed: ['rate<0.1'], // 10% max d'échecs
  },
};

// URLs de test
const BASE_URL = 'http://sapav.local';
const ENDPOINTS = {
  static: '/static/bundle.js',
  api: '/api/projects',
  health: '/health'
};

export default function () {
  // Check du health endpoint
  const healthCheck = http.get(`${BASE_URL}${ENDPOINTS.health}`);
  check(healthCheck, {
    'health check returns 200': (r) => r.status === 200,
  });

  // Test des ressources statiques (doit utiliser le cache)
  const staticRes = http.get(`${BASE_URL}${ENDPOINTS.static}`);
  check(staticRes, {
    'static content cached': (r) => r.headers['X-Cache'] !== undefined,
    'static content returns 200': (r) => r.status === 200,
  });

  // Test de l'API (doit gérer le failover)
  const apiRes = http.get(`${BASE_URL}${ENDPOINTS.api}`);
  check(apiRes, {
    'api returns 200': (r) => r.status === 200,
    'api response time OK': (r) => r.timings.duration < 2000,
  });

  // Simulation de charge réelle
  sleep(1);
}