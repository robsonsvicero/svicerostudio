import jwt from 'jsonwebtoken'
// Middleware simples de autenticação admin (JWT via Authorization: Bearer)
function adminAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Token ausente' })
  try {
    const token = auth.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido' })
  }
}
// Listar todos os comentários (admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { slug, approved } = req.query
    const filter = {}
    if (slug) filter.postSlug = slug
    if (approved === 'true') filter.approved = true
    if (approved === 'false') filter.approved = false
    const comments = await Comment.find(filter).sort({ createdAt: -1 })
    res.json(comments)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar comentários' })
  }
})

// Aprovar comentário (admin)
router.patch('/:id/approve', adminAuth, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, { approved: true }, { new: true })
    if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' })
    res.json(comment)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao aprovar comentário' })
  }
})

// Excluir comentário (admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id)
    if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir comentário' })
  }
})
import express from 'express'
import Comment from '../models/Comment.js'

const router = express.Router()

// Listar comentários de um post
router.get('/:slug', async (req, res) => {
  try {
    const comments = await Comment.find({ postSlug: req.params.slug, approved: true })
      .sort({ createdAt: 1 })
    res.json(comments)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar comentários' })
  }
})

// Criar novo comentário
router.post('/:slug', async (req, res) => {
  try {
    const { name, email, content, parentId } = req.body
    if (!name || !content) {
      return res.status(400).json({ error: 'Nome e comentário são obrigatórios' })
    }
    const comment = await Comment.create({
      postSlug: req.params.slug,
      name,
      email,
      content,
      parentId: parentId || null,
      approved: false // Pode mudar para true se não quiser moderação
    })
    res.status(201).json(comment)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar comentário' })
  }
})

export default router
