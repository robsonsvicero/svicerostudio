import React, { useEffect, useState } from 'react'

const resolveApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL

  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:4000'
    }
  }

  return 'https://svicerostudio-production.up.railway.app'
}

const API_URL = `${resolveApiBaseUrl()}/api/comments`

const Comments = ({ slug }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', content: '' })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Função para aprovar comentário
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_URL}/approve/${id}`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Erro ao aprovar comentário')
      setSuccess('Comentário aprovado!')
    } catch (err) {
      setError(err.message)
    }
  }

  // Função para excluir comentário
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir comentário')
      setSuccess('Comentário excluído!')
    } catch (err) {
      setError(err.message)
    }
  }

  // Botão para voltar
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/admin'
    }
  }

  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}/${slug}`)
      .then(res => res.json())
      .then(data => {
        setComments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug, success])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSending(true)
    setError('')
    setSuccess('')
    if (!form.name.trim() || !form.content.trim()) {
      setError('Nome e comentário são obrigatórios.')
      setSending(false)
      return
    }
    try {
      const res = await fetch(`${API_URL}/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao enviar comentário')
      }
      setForm({ name: '', email: '', content: '' })
      setSuccess('Comentário enviado! Aguarde aprovação.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="comments mt-12">
      <button
        className="mb-4 bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors border border-primary"
        onClick={handleBack}
        style={{ minWidth: 100 }}
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
      </button>
      <h2 className="font-title text-2xl font-light text-low-dark mb-6 pb-4 border-b border-cream/40">
        <i className="fa-regular fa-comments mr-3 text-primary"></i>
        Comentários
      </h2>
      <form className="mb-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Seu nome*"
            className="flex-1 border rounded px-4 py-2"
            value={form.name}
            onChange={handleChange}
            required
            disabled={sending}
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail (opcional)"
            className="flex-1 border rounded px-4 py-2"
            value={form.email}
            onChange={handleChange}
            disabled={sending}
          />
        </div>
        <textarea
          name="content"
          placeholder="Escreva seu comentário*"
          className="w-full border rounded px-4 py-2 mb-4 min-h-[80px]"
          value={form.content}
          onChange={handleChange}
          required
          disabled={sending}
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-700 mb-2">{success}</div>}
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded font-medium shadow hover:bg-primary/90 transition-colors border border-primary"
          disabled={sending}
          style={{ minWidth: 120 }}
        >
          {sending ? 'Enviando...' : 'Comentar'}
        </button>
      </form>
      <div>
        {loading ? (
          <div className="text-low-medium">Carregando comentários...</div>
        ) : comments.length === 0 ? (
          <div className="text-low-medium">Nenhum comentário ainda.</div>
        ) : (
          <ul className="space-y-6">
            {comments.map(c => (
              <li key={c._id || c.id} className="border-b pb-4">
                <div className="font-semibold text-low-dark">{c.name}</div>
                <div className="text-xs text-low-medium mb-1">{new Date(c.createdAt).toLocaleString('pt-BR')}</div>
                <div className="whitespace-pre-line text-low-dark">{c.content}</div>
                {!c.approved && (
                  <div className="mt-2 flex gap-2">
                    <button
                      className="bg-green-700 text-white px-3 py-1 rounded shadow border border-green-700 hover:bg-green-800"
                      onClick={() => handleApprove(c._id || c.id)}
                      style={{ minWidth: 80 }}
                    >Aprovar</button>
                    <button
                      className="bg-red-700 text-white px-3 py-1 rounded shadow border border-red-700 hover:bg-red-800"
                      onClick={() => handleDelete(c._id || c.id)}
                      style={{ minWidth: 80 }}
                    >Excluir</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default Comments
