import http from 'k6/http';
import { check, sleep } from 'k6';
import { pegarBaseUrl } from '../utils/variaveis.js';

const baseUrl = pegarBaseUrl().replace(/\/$/, '');
const email = __ENV.K6_USER_EMAIL || 'ana@example.com';
const password = __ENV.K6_USER_PASSWORD || 'Leitura123!';

export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    http_req_duration: ['p(90)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const response = http.post(
    `${baseUrl}/api/auth/login`,
    JSON.stringify({ email, password }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  check(response, {
    'login responde 200': (result) => result.status === 200,
    'login retorna token': (result) => typeof result.json('token') === 'string',
  });

  sleep(1);
}
