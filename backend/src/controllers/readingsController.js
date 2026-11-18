import mongoose from 'mongoose';
import { Reading } from '../models/Reading.js';
import { GENRES } from '../constants/genres.js';
const FIELDS = ['title', 'author', 'genre', 'opinion', 'rating', 'recommend'];
function validate(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'Envie um objeto JSON.';
  if (Object.keys(data).some(key => !FIELDS.includes(key))) return 'Campos desconhecidos não são permitidos.';
  for (const key of ['title', 'author', 'opinion']) {
    if (typeof data[key] !== 'string' || !data[key].trim()) return `O campo ${key} é obrigatório.`;
  }
  if (!GENRES.includes(data.genre)) return 'Selecione um gênero válido.';
  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) return 'A avaliação deve ser um inteiro de 1 a 5.';
  if (typeof data.recommend !== 'boolean') return 'A recomendação deve ser true ou false.';
  return null;
}
const safely = handler => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
export const listReadings = safely(async (req, res) => {
  const items = await Reading.find({ userId: req.user.id }).sort({ createdAt: -1 });
  return res.json(items);
});
export const createReading = safely(async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });
  const clean = Object.fromEntries(FIELDS.map(key => [key, typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key]]));
  const reading = await Reading.create({ ...clean, userId: req.user.id });
  return res.status(201).json(reading);
});
async function ownedReading(req) {
  if (!mongoose.isValidObjectId(req.params.id)) return null;
  return Reading.findOne({ _id: req.params.id, userId: req.user.id });
}
export const getReading = safely(async (req, res) => {
  const reading = await ownedReading(req);
  if (!reading) return res.status(404).json({ error: 'Leitura não encontrada.' });
  return res.json(reading);
});
export const updateReading = safely(async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });
  const reading = await ownedReading(req);
  if (!reading) return res.status(404).json({ error: 'Leitura não encontrada.' });
  for (const key of FIELDS) reading[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
  await reading.save();
  return res.json(reading);
});
export const deleteReading = safely(async (req, res) => {
  const reading = await ownedReading(req);
  if (!reading) return res.status(404).json({ error: 'Leitura não encontrada.' });
  await reading.deleteOne();
  return res.status(204).send();
});
