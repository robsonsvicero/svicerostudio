import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/UI/Button'
import Toast from '../components/UI/Toast'

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

const AdminComentarios = () => {
  const { token } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ slug: '', approved: 'all' })
  const [toast, setToast] = useState({ message: '', type: '' })

  const fetchComments = async () => {
    setLoading(true)
    let url = `${API_URL}?`
    if (filter.slug) url += `slug=${encodeURIComponent(filter.slug)}&`
    if (filter.approved !== 'all') url += `approved=${filter.approved}`
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        let errMsg = 'Erro ao buscar comentários';
        let status = res.status;
        try {
          const err = await res.json();
          errMsg = err.error || errMsg;
        } catch {}
        if (status === 401) {
          setToast({ message: 'Sessão expirada ou sem permissão. Faça login novamente.', type: 'error' });
        } else {
          setToast({ message: errMsg, type: 'error' });
        }
        setComments([]);
      } else {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setToast({ message: 'Erro de rede', type: 'error' });
      setComments([]);
    }
    setLoading(false);
  }

  useEffect(() => { if (token) fetchComments() }, [token, filter])

  const handleApprove = async (id) => {
    const res = await fetch(`${API_URL}/${id}/approve`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      setToast({ message: 'Comentário aprovado!', type: 'success' })
      fetchComments()
    } else {
      setToast({ message: 'Erro ao aprovar.', type: 'error' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este comentário?')) return
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      setToast({ message: 'Comentário excluído!', type: 'success' })
      fetchComments()
    } else {
      setToast({ message: 'Erro ao excluir.', type: 'error' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button
        className="mb-6 bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors border border-primary"
        onClick={() => window.location.href = '/admin'}
        style={{ minWidth: 100 }}
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Voltar ao Admin
      </button>
      <h1 className="font-title text-3xl mb-8">Moderação de Comentários</h1>
      <form className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Filtrar por slug do post"
          className="border rounded px-3 py-2 flex-1"
          value={filter.slug}
          onChange={e => setFilter(f => ({ ...f, slug: e.target.value }))}
        />
        <select
          className="border rounded px-3 py-2"
          value={filter.approved}
          onChange={e => setFilter(f => ({ ...f, approved: e.target.value }))}
        >
          <option value="all">Todos</option>
          <option value="false">Pendentes</option>
          <option value="true">Aprovados</option>
        </select>
        <Button type="button" variant='primary' onClick={fetchComments}>Buscar</Button>
      </form>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({})} />}
      {loading ? (
        <div>Carregando...</div>
      ) : comments.length === 0 ? (
        <div>
          Nenhum comentário encontrado.<br />
          <span className="text-xs text-low-medium">Verifique se há comentários pendentes ou aprovados para o filtro selecionado.</span>
        </div>
      ) : (
        <ul className="space-y-6">
          {comments.map(c => (
            <li key={c._id || c.id} className="border-b pb-4">
              <div className="font-semibold text-low-dark">{c.name} <span className="text-xs text-low-medium">({c.email})</span></div>
              <div className="text-xs text-low-medium mb-1">{new Date(c.createdAt).toLocaleString('pt-BR')} | Post: <span className="font-mono">{c.postSlug}</span></div>
              <div className="whitespace-pre-line text-low-dark mb-2">{c.content}</div>
              <div className="flex gap-2">
                {!c.approved && <Button size="sm" variant="primary" onClick={() => handleApprove(c._id || c.id)}>Aprovar</Button>}
                <Button size="sm" variant="outline" onClick={() => handleDelete(c._id || c.id)}>Excluir</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AdminComentarios
