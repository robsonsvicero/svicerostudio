// scripts/fix-posts-date.js
// Corrige o campo data_publicacao dos posts para o formato ISO (YYYY-MM-DD)

import mongoose from 'mongoose';
const uri = process.env.MONGO_URI || 'mongodb+srv://svicerostudio_db_user:v2jqed63qV6W4Tj8@cluster0.phx8ywv.mongodb.net/svicerostudio?retryWrites=true&w=majority&appName=Cluster0';

const postSchema = new mongoose.Schema({
  data_publicacao: String,
}, { collection: 'posts' });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

function parseToISO(dateStr) {
  // Tenta converter DD/MM/YYYY para YYYY-MM-DD
  const brMatch = /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr);
  if (brMatch) {
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  // Se já está em ISO, retorna
  const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  if (isoMatch) return dateStr;
  // Tenta converter outros formatos
  const date = new Date(dateStr);
  if (!isNaN(date)) {
    return date.toISOString().slice(0, 10);
  }
  return null;
}

async function fixDates() {
  await mongoose.connect(uri);
  const posts = await Post.find({});
  let count = 0;
  for (const post of posts) {
    const fixed = parseToISO(post.data_publicacao);
    if (fixed && fixed !== post.data_publicacao) {
      await Post.updateOne({ _id: post._id }, { $set: { data_publicacao: fixed } });
      console.log(`Corrigido: ${post._id} -> ${fixed}`);
      count++;
    }
  }
  console.log(`Total corrigidos: ${count}`);
  await mongoose.disconnect();
}

fixDates().catch(err => {
  console.error('Erro ao corrigir datas:', err);
  process.exit(1);
});
