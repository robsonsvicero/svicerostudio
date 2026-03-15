import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseSchema.js';

const projetoGaleriaSchema = new mongoose.Schema(
  {
     _id: { type: String, required: true },
    projeto_id: { type: String, required: true, index: true },
    imagem_url: { type: String, required: true },
    ordem: { type: Number, default: 0 },
    legenda: String,
    created_at: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

const ProjetoGaleria = mongoose.model('ProjetoGaleria', projetoGaleriaSchema, 'projeto_galeria');

export default ProjetoGaleria;
