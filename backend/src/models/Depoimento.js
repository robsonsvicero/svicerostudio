import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseSchema.js';

const depoimentoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    cargo: String,
    empresa: String,
    texto: { type: String, required: true },
    nota: { type: Number, default: 5 },
    iniciais: String,
    cor_avatar: { type: String, default: 'orange' },
    ativo: { type: Boolean, default: true, index: true },
    ordem: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

const Depoimento = mongoose.model('Depoimento', depoimentoSchema, 'depoimentos');

export default Depoimento;
