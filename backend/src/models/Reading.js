import mongoose from 'mongoose';
import { GENRES } from '../constants/genres.js';
const readingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  genre: { type: String, required: true, enum: GENRES },
  opinion: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5, validate: Number.isInteger },
  recommend: { type: Boolean, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true }
}, { timestamps: true, versionKey: false });
readingSchema.index({ userId: 1, createdAt: -1 });
export const Reading = mongoose.model('Reading', readingSchema);
