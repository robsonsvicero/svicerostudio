import 'dotenv/config';
import mongoose from 'mongoose';
import {
  Projeto,
  ProjetoGaleria,
  Post,
  Autor,
  Depoimento,
  AdminUser,
  Upload,
  Comment,
  FAQ,
} from '../src/models/index.js';

const MONGODB_URI = process.env.MONGODB_URI;

async function initializeDatabase() {
  try {
    console.log('[seed] Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('[seed] ✓ Conectado ao MongoDB');

    // Criar índices para todas as coleções
    console.log('[seed] Criando índices e estruturas...');

    await Projeto.collection.createIndex({ slug: 1 }, { unique: true });
    console.log('[seed] ✓ Índice criado: projetos.slug');

    await ProjetoGaleria.collection.createIndex({ projeto_id: 1 });
    console.log('[seed] ✓ Índice criado: projeto_galeria.projeto_id');

    await Post.collection.createIndex({ slug: 1 }, { unique: true });
    console.log('[seed] ✓ Índice criado: posts.slug');

    await Autor.collection.createIndex({ publicado: 1 });
    console.log('[seed] ✓ Índice criado: autores.publicado');

    await Depoimento.collection.createIndex({ ativo: 1 });
    console.log('[seed] ✓ Índice criado: depoimentos.ativo');

    await AdminUser.collection.createIndex({ email: 1 }, { unique: true });
    console.log('[seed] ✓ Índice criado: admin_users.email');

    await Upload.collection.createIndex({ bucket: 1, storageKey: 1 }, { unique: true });
    console.log('[seed] ✓ Índice criado: uploads.bucket + storageKey');

    await Comment.collection.createIndex({ postSlug: 1 });
    console.log('[seed] ✓ Índice criado: comments.postSlug');

    console.log('[seed] ✓ Database inicializada com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('[seed] Erro ao inicializar database:', error);
    process.exit(1);
  }
}

initializeDatabase();
