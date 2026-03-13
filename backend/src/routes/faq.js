import express from 'express';
import FAQ from '../models/FAQ.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware simples de autenticação admin (JWT via Authorization: Bearer)
function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Token ausente' });
  try {
    const token = auth.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Listar todas as perguntas (público)
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ ordem: 1, createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar perguntas' });
  }
});

// Adicionar nova pergunta (admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { pergunta, resposta, ordem } = req.body;
    if (!pergunta || !resposta) return res.status(400).json({ error: 'Pergunta e resposta são obrigatórias' });
    const faq = await FAQ.create({ pergunta, resposta, ordem });
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar pergunta' });
  }
});

// Editar pergunta (admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { pergunta, resposta, ordem } = req.body;
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { pergunta, resposta, ordem },
      { new: true }
    );
    if (!faq) return res.status(404).json({ error: 'Pergunta não encontrada' });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao editar pergunta' });
  }
});

// Remover pergunta (admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ error: 'Pergunta não encontrada' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover pergunta' });
  }
});

export default router;
