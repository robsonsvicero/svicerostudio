// backend/routes/projetosRoutes.js

import express from 'express';
import mongoose from 'mongoose';
import Projeto from '../models/Projeto.js'; // Ajuste o caminho se necessário
import ProjetoGaleria from '../models/ProjetoGaleria.js'; // Ajuste o caminho se necessário
import { authMiddleware } from '../middleware/auth.js'; // Importe seu middleware de autenticação

const router = express.Router();

// Rota DELETE para excluir um projeto e sua galeria
// Exemplo de uso: DELETE /api/projetos/69a39ffbd1918ecf7854f359
router.delete('/projetos/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Converte o ID para ObjectId se for um ObjectId válido,
    // caso contrário, usa como string (para slugs antigos como _id)
    let queryId;
    if (mongoose.Types.ObjectId.isValid(id)) {
      queryId = new mongoose.Types.ObjectId(id);
    } else {
      queryId = id; // Para IDs que são strings puras (como slugs antigos)
    }

    // 1. Excluir itens da galeria associados
    // Isso garante que a galeria seja limpa antes do projeto principal
    const galleryDeleteResult = await ProjetoGaleria.deleteMany({ projeto_id: queryId });
    console.log(`Itens da galeria associados ao projeto ${id} excluídos: ${galleryDeleteResult.deletedCount}`);

    // 2. Excluir o projeto principal
    const projectDeleteResult = await Projeto.deleteOne({ _id: queryId });

    if (projectDeleteResult.deletedCount === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado ou já excluído.' });
    }

    res.status(200).json({ message: 'Projeto excluído com sucesso.' });

  } catch (error) {
    console.error('Erro ao excluir projeto:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao excluir projeto.' });
  }
});

export default router;