// scripts/migrate-projetos-id-to-string.js
import { MongoClient } from 'mongodb';

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://svicerostudio_db_user:v2jqed63qV6W4Tj8@cluster0.phx8ywv.mongodb.net/svicerostudio?retryWrites=true&w=majority&appName=Cluster0';

async function migrateProjetosIdToString() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB. Iniciando migração...');

    const db = client.db('svicerostudio');
    const collection = db.collection('projetos');

    // Busca todos os documentos da coleção
    const projetos = await collection.find({}).toArray();
    console.log(`Total de projetos encontrados: ${projetos.length}`);

    let migrados = 0;
    let ignorados = 0;

    for (const projeto of projetos) {
      // Se _id já é string, pula
      if (typeof projeto._id === 'string') {
        ignorados++;
        continue;
      }

      const newId = projeto._id.toString();
      const { _id, ...rest } = projeto;

      try {
        // Insere com o novo _id string
        await collection.insertOne({ _id: newId, ...rest });
        // Remove o documento original com ObjectId
        await collection.deleteOne({ _id: projeto._id });
        migrados++;
        console.log(`✓ Migrado: ${newId}`);
      } catch (err) {
        console.error(`✗ Erro ao migrar ${newId}:`, err.message);
      }
    }

    console.log('---');
    console.log(`Migração concluída.`);
    console.log(`  Migrados:             ${migrados}`);
    console.log(`  Ignorados (já string): ${ignorados}`);
  } finally {
    await client.disconnect();
  }
}

migrateProjetosIdToString();