import { createContext, useContext, useState } from 'react';
import { request } from '../services/api.js';
const AuthContext = createContext(null);
function storedAuth() {
  try { return JSON.parse(sessionStorage.getItem('readingAuth') || 'null'); } catch { return null; }
}
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(storedAuth);
  async function login(email, password) {
    const result = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    const value = { token: result.token, user: result.user };
    sessionStorage.setItem('readingAuth', JSON.stringify(value));
    setAuth(value);
  }
  function logout() { sessionStorage.removeItem('readingAuth'); setAuth(null); }
  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
