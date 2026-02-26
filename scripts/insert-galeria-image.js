// scripts/insert-galeria-image.js
// Insere uma imagem de exemplo na coleção projeto_galeria

import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb+srv://svicerostudio_db_user:v2jqed63qV6W4Tj8@cluster0.phx8ywv.mongodb.net/svicerostudio?retryWrites=true&w=majority&appName=Cluster0';

const galeriaSchema = new mongoose.Schema({}, { collection: 'projeto_galeria' });
const ProjetoGaleria = mongoose.model('ProjetoGaleria', galeriaSchema);

async function insertImage() {
  await mongoose.connect(uri);
  // Substitua pelo ID do projeto criado
  const projetoId = '699f93077a1cfe4485dfe811';
  const image = {
    projeto_id: projetoId,
    imagem_url: 'https://i.imgur.com/yaOnXyV.jpeg',
    ordem: 0,
    legenda: 'Imagem de exemplo'
  };
  const result = await ProjetoGaleria.create(image);
  console.log('Imagem inserida:', result);
  await mongoose.disconnect();
}

insertImage().catch(err => {
  console.error('Erro ao inserir imagem:', err);
  process.exit(1);
});
