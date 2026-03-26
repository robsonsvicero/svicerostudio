import 'dotenv/config';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { AdminUser } from '../src/models/index.js';

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function createAdminUser() {
  try {
    console.log('[admin-setup] Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('[admin-setup] ✓ Conectado ao MongoDB');

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('[admin-setup] ✗ ADMIN_EMAIL ou ADMIN_PASSWORD não configurados no .env');
      process.exit(1);
    }

    const email = String(ADMIN_EMAIL).toLowerCase().trim();
    
    // Verificar se já existe
    const existing = await AdminUser.findOne({ email });
    if (existing) {
      console.log(`[admin-setup] ✓ Admin já existe: ${email}`);
      process.exit(0);
    }

    // Criar novo admin
    console.log(`[admin-setup] Criando admin: ${email}`);
    const password_hash = await bcryptjs.hash(ADMIN_PASSWORD, 12);
    const admin = await AdminUser.create({ email, password_hash });
    
    console.log('[admin-setup] ✓ Admin criado com sucesso!');
    console.log(`[admin-setup] Email: ${email}`);
    console.log(`[admin-setup] ID: ${admin._id}`);
    
    process.exit(0);
  } catch (error) {
    console.error('[admin-setup] ✗ Erro ao criar admin:', error.message);
    process.exit(1);
  }
}

createAdminUser();
