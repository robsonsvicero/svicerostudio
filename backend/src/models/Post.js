import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseSchema.js';

const postSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    titulo: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    resumo: String,
    conteudo: { type: String, required: true },
    imagem_destaque: String,
    categoria: String,
    tags: String,
    data_publicacao: { type: String, required: true },
    autor: { type: String },
    publicado: { type: Boolean, default: false, index: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

const Post = mongoose.model('Post', postSchema, 'posts');

export default Post;
