export function notFound(req, res) { return res.status(404).json({ error: 'Rota não encontrada.' }); }
export function handleError(err, req, res, next) {
  if (err.name === 'CastError') return res.status(404).json({ error: 'Leitura não encontrada.' });
  if (err.name === 'ValidationError') return res.status(400).json({ error: 'Dados inválidos.', details: Object.values(err.errors).map(e => e.message) });
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ error: 'JSON inválido.' });
  console.error(err);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
}
