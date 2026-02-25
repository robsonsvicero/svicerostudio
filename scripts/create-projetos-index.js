// scripts/create-projetos-index.js
// Cria índice no campo data_projeto da coleção projetos

import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb+srv://svicerostudio_db_user:v2jqed63qV6W4Tj8@cluster0.phx8ywv.mongodb.net/svicerostudio?retryWrites=true&w=majority&appName=Cluster0';

const projetoSchema = new mongoose.Schema({}, { collection: 'projetos' });
const Projeto = mongoose.model('Projeto', projetoSchema);

async function createIndex() {
  await mongoose.connect(uri);
  const result = await Projeto.collection.createIndex({ data_projeto: -1 });
  console.log('Índice criado:', result);
  await mongoose.disconnect();
}

createIndex().catch(err => {
  console.error('Erro ao criar índice:', err);
  process.exit(1);
});
