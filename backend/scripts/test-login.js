import 'dotenv/config';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { AdminUser } from '../src/models/index.js';

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function testLogin() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const email = String(ADMIN_EMAIL).toLowerCase().trim();
    console.log('[test] Email:', email);
    console.log('[test] Senha configurada:', ADMIN_PASSWORD);
    console.log('[test] Comprimento da senha:', ADMIN_PASSWORD.length);
    
    const user = await AdminUser.findOne({ email });
    if (!user) {
      console.error('[test] ✗ Usuário não encontrado');
      process.exit(1);
    }
    
    console.log('[test] ✓ Usuário encontrado');
    console.log('[test] Hash armazenado:', user.password_hash);
    
    // Testar a comparação
    const isValid = await bcryptjs.compare(ADMIN_PASSWORD, user.password_hash);
    console.log('[test] Senha válida?', isValid);
    
    if (!isValid) {
      console.log('[test] ✗ Senha não corresponde!');
      // Tentar outras variações
      const variations = [
        ADMIN_PASSWORD,
        ADMIN_PASSWORD.trim(),
        ADMIN_PASSWORD.toLowerCase(),
        ADMIN_PASSWORD.toUpperCase(),
      ];
      
      for (const pwd of variations) {
        const result = await bcryptjs.compare(pwd, user.password_hash);
        console.log(`[test] "${pwd}" -> ${result}`);
      }
    } else {
      console.log('[test] ✓ Login deve funcionar!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('[test] Erro:', error.message);
    process.exit(1);
  }
}

testLogin();
