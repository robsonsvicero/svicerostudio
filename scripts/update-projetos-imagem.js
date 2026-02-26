// scripts/update-projetos-imagem.js
// Atualiza todos os projetos para usar link de imagem ao invés de base64

import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb+srv://svicerostudio_db_user:v2jqed63qV6W4Tj8@cluster0.phx8ywv.mongodb.net/svicerostudio?retryWrites=true&w=majority&appName=Cluster0';

const projetoSchema = new mongoose.Schema({}, { collection: 'projetos' });
const Projeto = mongoose.model('Projeto', projetoSchema);

async function updateImages() {
  await mongoose.connect(uri);
  const projetos = await Projeto.find({});
  let count = 0;
  for (const projeto of projetos) {
    if (projeto.imagem_url && projeto.imagem_url.startsWith('data:image/')) {
      await Projeto.updateOne({ _id: projeto._id }, { $set: { imagem_url: 'https://i.imgur.com/yaOnXyV.jpeg' } });
      count++;
    }
  }
  console.log(`Projetos atualizados: ${count}`);
  await mongoose.disconnect();
}

updateImages().catch(err => {
  console.error('Erro ao atualizar imagens:', err);
  process.exit(1);
});
