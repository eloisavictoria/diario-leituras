import http from 'k6/http';
import { check, sleep } from 'k6';
import { obterToken } from '../helpers/loginHelper.js';
import { pegarBaseUrl } from '../utils/variaveis.js';

export const options = {
  //vus: 1,
  //iterations: 1,
  stages: [
   { duration: '10s', target: 10 },
   { duration: '20s', target: 10 },
   { duration: '10s', target: 30 }
],
vus: 10, // número de usuários virtuais
//duration: '30s',
//   thresholds: {
//     checks: ['rate>0.99'],
//     http_req_failed: ['rate<0.01'],
//   },
};

export function setup() {
  return { token: obterToken() };
}

export default function ({ token }) {
  const baseUrl = pegarBaseUrl().replace(/\/$/, '');
  const url = `${baseUrl}/api/readings`;
  const payload = JSON.stringify({
    title: 'Duna',
    author: 'Frank Herbert',
    genre: 'Ficção científica',
    opinion: 'Uma aventura complexa e envolvente.',
    rating: 5,
    recommend: true,
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  const response = http.post(url, payload, params);

  check(response, {
    'cadastro responde 201': (result) => result.status === 201,
    'resposta inclui o título cadastrado': (result) => result.json('title') === 'Duna',
  });

  sleep(1);
}

