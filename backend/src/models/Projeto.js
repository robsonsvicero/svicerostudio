import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseSchema.js';

const projetoSchema = new mongoose.Schema(
  {
    titulo:           { type: String, required: true },
    slug:             { type: String, required: true, unique: true },
    categoria:        { type: String, default: '' },
    cliente:          { type: String, default: '' },
    data_projeto:     String,
    status:           { type: String, default: 'draft' },
    descricao:        { type: String, required: true },
    descricao_longa:  String,
    descricao_longa_en: String,
    imagem_url:       { type: String, default: '' },
    site_url:         String,
    link:             { type: String, default: '' },
    button_text:      { type: String, default: 'Ver Projeto' },
    link2:            String,
    button_text2:     String,
    mostrar_home:     { type: Boolean, default: true },
    created_at:       { type: Date, default: Date.now },
    updated_at:       { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

const Projeto = mongoose.model('Projeto', projetoSchema, 'projetos');

export default Projeto;
