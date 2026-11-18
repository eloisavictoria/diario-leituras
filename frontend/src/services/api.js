const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
export async function request(path, { token, ...options } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}/api${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o backend está ligado.');
  }
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error || `Erro HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}
