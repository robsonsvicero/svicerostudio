import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';

const MONGODB_URI = process.env.MONGODB_URI;

// Testar conexão
async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Conectado ao MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('\nColeções no banco:');
    collections.forEach(c => console.log(`  - ${c.name}`));

    // Listar índices da coleção projetos
    const indexes = await db.collection('projetos').getIndexes();
    console.log('\nÍndices da coleção projetos:');
    Object.entries(indexes).forEach(([name, spec]) => {
      console.log(`  - ${name}:`, JSON.stringify(spec));
    });

    process.exit(0);
  } catch (error) {
    console.error('✗ Erro:', error.message);
    process.exit(1);
  }
}

testConnection();
