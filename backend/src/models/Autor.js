import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseSchema.js';

const autorSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID como chave primária
  nome: { type: String, required: true },
  cargo: { type: String, required: true },
  foto_url: String,
  bio: String,
  email: String,
  publicado: { type: Boolean, default: true, index: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, baseSchemaOptions);

const Autor = mongoose.model('Autor', autorSchema, 'autores');

export default Autor;
