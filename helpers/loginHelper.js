
import http from 'k6/http';
import { pegarBaseUrl } from '../utils/variaveis.js';

const email = __ENV.K6_USER_EMAIL || 'ana@example.com';
const password = __ENV.K6_USER_PASSWORD || 'Leitura123!';

export function obterToken() {
  const baseUrl = pegarBaseUrl().replace(/\/$/, '');
  const response = http.post(
    `${baseUrl}/api/auth/login`,
    JSON.stringify({ email, password }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  if (response.status !== 200) {
    throw new Error(`Falha no login para o teste k6: HTTP ${response.status}.`);
  }

  const token = response.json('token');
  if (typeof token !== 'string' || !token) {
    throw new Error('O login para o teste k6 não retornou um token válido.');
  }

  return token;
}