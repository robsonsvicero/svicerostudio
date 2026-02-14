/**
 * Script de Migração: Supabase → MongoDB
 * 
 * Uso: npm run migrate:supabase (na pasta backend)
 * 
 * Migra as seguintes tabelas:
 * - projetos
 * - projeto_galeria
 * - posts
 * - autores
 * - depoimentos
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import mongoose from 'mongoose';

// Configuração
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios no .env');
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI é obrigatório no .env');
  process.exit(1);
}

// Clientes
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Tabelas a migrar
const TABLES = ['projetos', 'projeto_galeria', 'posts', 'autores', 'depoimentos'];

// Schemas MongoDB (simplificados para migração)
const baseOptions = { versionKey: false, strict: false };

const schemas = {
  projetos: new mongoose.Schema({}, baseOptions),
  projeto_galeria: new mongoose.Schema({}, baseOptions),
  posts: new mongoose.Schema({}, baseOptions),
  autores: new mongoose.Schema({}, baseOptions),
  depoimentos: new mongoose.Schema({}, baseOptions),
};

// Função para buscar todos os dados de uma tabela do Supabase
async function fetchFromSupabase(table) {
  console.log(`📥 Buscando dados de ${table}...`);
  
  const { data, error, count } = await supabase
    .from(table)
    .select('*', { count: 'exact' });

  if (error) {
    console.error(`   ❌ Erro ao buscar ${table}:`, error.message);
    return [];
  }

  console.log(`   ✅ ${data?.length || 0} registros encontrados`);
  return data || [];
}

// Função para inserir dados no MongoDB
async function insertToMongo(table, data) {
  if (!data || data.length === 0) {
    console.log(`   ⏭️ Nenhum dado para inserir em ${table}`);
    return 0;
  }

  console.log(`📤 Inserindo ${data.length} registros em ${table}...`);

  // Usar conexão direta ao invés de Model do Mongoose
  const collection = mongoose.connection.db.collection(table);

  // Limpar collection existente
  await collection.deleteMany({});
  console.log(`   🗑️ Collection ${table} limpa`);

  // Manter IDs originais do Supabase (UUIDs como strings)
  const transformedData = data.map((item) => {
    // Manter id original como _id (string UUID)
    const { id, ...rest } = item;
    return {
      _id: id, // UUID string como _id
      ...rest,
    };
  });

  // Inserir em lotes
  const BATCH_SIZE = 100;
  let inserted = 0;

  for (let i = 0; i < transformedData.length; i += BATCH_SIZE) {
    const batch = transformedData.slice(i, i + BATCH_SIZE);
    await collection.insertMany(batch, { ordered: false });
    inserted += batch.length;
    console.log(`   📊 ${inserted}/${transformedData.length} inseridos`);
  }

  console.log(`   ✅ ${inserted} registros inseridos em ${table}`);
  return inserted;
}

// Função principal
async function migrate() {
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('   MIGRAÇÃO SUPABASE → MONGODB');
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  console.log(`🔗 Supabase: ${SUPABASE_URL}`);
  console.log(`🔗 MongoDB: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
  console.log('');

  try {
    // Conectar ao MongoDB
    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('   ✅ Conectado!');
    console.log('');

    // Migrar cada tabela
    const results = {};

    for (const table of TABLES) {
      console.log('───────────────────────────────────────────────────');
      
      // Buscar do Supabase
      const data = await fetchFromSupabase(table);
      
      // Inserir no MongoDB
      const count = await insertToMongo(table, data);
      results[table] = count;
      
      console.log('');
    }

    // Resumo
    console.log('═══════════════════════════════════════════════════');
    console.log('   RESUMO DA MIGRAÇÃO');
    console.log('═══════════════════════════════════════════════════');
    console.log('');

    let total = 0;
    for (const [table, count] of Object.entries(results)) {
      console.log(`   ${table}: ${count} registros`);
      total += count;
    }

    console.log('');
    console.log(`   TOTAL: ${total} registros migrados`);
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('   ✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ ERRO NA MIGRAÇÃO:', error.message);
    console.error('');
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  }
}

// Executar
migrate();
