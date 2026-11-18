import jwt from 'jsonwebtoken';
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const match = typeof header === 'string' && /^Bearer (\S+)$/i.exec(header);
  if (!match) return res.status(401).json({ error: 'Autenticação necessária.' });
  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (typeof payload.sub !== 'string') throw new Error('Token sem usuário');
    req.user = { id: payload.sub };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}
