import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function cleanup() {
  console.log('Conectando ao MongoDB...');
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection.db;
  const collections = await db.listCollections({ name: 'uploads' }).toArray();

  if (collections.length === 0) {
    console.log('Coleção uploads não encontrada. Nada a deletar.');
  } else {
    await db.dropCollection('uploads');
    console.log('Coleção uploads deletada com sucesso! Espaço liberado.');
  }

  await mongoose.disconnect();
  process.exit(0);
}

cleanup().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});