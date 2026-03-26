import 'dotenv/config';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { AdminUser } from '../src/models/index.js';

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function resetAdminUser() {
  try {
    console.log('[admin-reset] Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('[admin-reset] ✓ Conectado ao MongoDB');

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('[admin-reset] ✗ ADMIN_EMAIL ou ADMIN_PASSWORD não configurados');
      process.exit(1);
    }

    const email = String(ADMIN_EMAIL).toLowerCase().trim();
    
    // Deletar admin existente
    console.log(`[admin-reset] Deletando admin anterior: ${email}`);
    const deleteResult = await AdminUser.deleteMany({ email });
    console.log(`[admin-reset] ✓ Deletados ${deleteResult.deletedCount} admin(s)`);

    // Criar novo admin
    console.log(`[admin-reset] Criando novo admin: ${email}`);
    const password_hash = await bcryptjs.hash(ADMIN_PASSWORD, 12);
    console.log(`[admin-reset] Hash gerado: ${password_hash.substring(0, 20)}...`);
    
    const admin = await AdminUser.create({ email, password_hash });
    
    console.log('[admin-reset] ✓ Admin recriado com sucesso!');
    console.log(`[admin-reset] Email: ${email}`);
    console.log(`[admin-reset] Senha: ${ADMIN_PASSWORD}`);
    console.log(`[admin-reset] ID: ${admin._id}`);
    
    process.exit(0);
  } catch (error) {
    console.error('[admin-reset] ✗ Erro:', error.message);
    process.exit(1);
  }
}

resetAdminUser();
