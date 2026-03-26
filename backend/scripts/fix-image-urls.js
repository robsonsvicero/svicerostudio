import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function fixImageUrls() {
  try {
    console.log('[FIX-URLS] Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    const db = mongoose.connection.db;
    const uploadCol = db.collection('uploads');
    const galCol = db.collection('projeto_galeria');
    const projCol = db.collection('projetos');

    // 1. Pegar todos uploads
    const uploads = await uploadCol.find().toArray();
    console.log(`[FIX-URLS] Total de uploads encontrados: ${uploads.length}`);

    // 2. Criar mapa de originalName -> ID
    const nameToId = {};
    uploads.forEach(u => {
      if (u.originalName) {
        nameToId[u.originalName] = u._id.toString();
      }
    });

    // 3. Corrigir URLs nas galerias
    console.log('[FIX-URLS] Procurando galerias com URLs inválidas...');
    const badGalerias = await galCol.find({ imagem_url: { $regex: '^mongodb://' } }).toArray();
    console.log(`[FIX-URLS] Encontradas ${badGalerias.length} URLs inválidas em galerias`);

    let galeriasFixadas = 0;
    for (const gal of badGalerias) {
      // URL format: mongodb://storage/svicerostudio/projetos/sacada-classz/galeria/1774488707290-561097759_18533437261001897_6811592113330557678_n.jpg
      // Extrair nome do arquivo
      const match = gal.imagem_url.match(/\/([^\/]+\.[a-z]{3,4})$/i);
      if (match) {
        const fullFileName = match[1]; // ex: "1774488707290-561097759_18533437261001897_6811592113330557678_n.jpg"
        const uploadsMatching = uploads.filter(u => u.originalName && fullFileName.includes(u.originalName));
        
        if (uploadsMatching.length > 0) {
          const uploadId = uploadsMatching[0]._id.toString();
          const newUrl = `http://localhost:8080/api/storage/${uploadId}`;
          
          await galCol.updateOne(
            { _id: gal._id },
            { $set: { imagem_url: newUrl } }
          );
          galeriasFixadas++;
          console.log(`  ✓ Corrigida galeria: ${gal._id} -> ${newUrl}`);
        }
      }
    }
    console.log(`[FIX-URLS] ${galeriasFixadas} galerias corrigidas`);

    // 4. Corrigir URLs nos projetos (imagem_url de capa)
    console.log('[FIX-URLS] Procurando projetos com URLs inválidas...');
    const badProjetos = await projCol.find({ imagem_url: { $regex: '^mongodb://' } }).toArray();
    console.log(`[FIX-URLS] Encontradas ${badProjetos.length} URLs inválidas em projetos`);

    let projetosFixados = 0;
    for (const proj of badProjetos) {
      const match = proj.imagem_url.match(/\/([^\/]+\.[a-z]{3,4})$/i);
      if (match) {
        const fullFileName = match[1];
        const uploadsMatching = uploads.filter(u => u.originalName && fullFileName.includes(u.originalName));
        
        if (uploadsMatching.length > 0) {
          const uploadId = uploadsMatching[0]._id.toString();
          const newUrl = `http://localhost:8080/api/storage/${uploadId}`;
          
          await projCol.updateOne(
            { _id: proj._id },
            { $set: { imagem_url: newUrl } }
          );
          projetosFixados++;
          console.log(`  ✓ Corrigido projeto: ${proj.slug} -> ${newUrl}`);
        }
      }
    }
    console.log(`[FIX-URLS] ${projetosFixados} projetos corrigidos`);

    console.log('[FIX-URLS] ✅ Migration concluída com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('[FIX-URLS] ❌ Erro:', err.message);
    process.exit(1);
  }
}

fixImageUrls();
