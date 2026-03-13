import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseSchema.js';

const projetoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    descricao_longa: String,
    descricao_longa_en: String,
    imagem_url: { type: String, required: true },
    site_url: String,
    link: { type: String, required: true },
    button_text: { type: String, default: 'Ver Projeto' },
    link2: String,
    button_text2: String,
    data_projeto: String,
    mostrar_home: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

const Projeto = mongoose.model('Projeto', projetoSchema, 'projetos');

export default Projeto;
