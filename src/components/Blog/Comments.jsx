import React, { useEffect, useState } from 'react';
import { API_URL } from '../../lib/api.js';

// Componente de comentários para posts do blog
const Comments = ({ slug }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/comments/${slug}`);
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch {
        setComments([]);
      }
      setLoading(false);
    };
    if (slug) fetchComments();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/api/comments/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content })
      });
      if (res.ok) {
        setMessage('Comentário enviado! Aguarde aprovação.');
        setName('');
        setContent('');
      } else {
        setMessage('Erro ao enviar comentário.');
      }
    } catch {
      setMessage('Erro de rede.');
    }
  };

  return (
    <div className="comments-section mt-12">
      <h3 className="font-title text-2xl mb-4">Comentários</h3>
      {loading ? (
        <p>Carregando comentários...</p>
      ) : comments.length === 0 ? (
        <p>Seja o primeiro a comentar!</p>
      ) : (
        <ul className="space-y-6 mb-8">
          {comments.map((c) => (
            <li key={c._id} className="border-b border-white/10 pb-4">
              <p className="font-semibold text-secondary mb-1">{c.name}</p>
              <p className="text-low-dark mb-1">{c.content}</p>
              <span className="text-xs text-low-medium">{new Date(c.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="border border-white/10 bg-gelo rounded px-3 py-2 text-low-dark placeholder:text-low-medium focus:border-secondary focus:outline-none transition-colors"
        />
        <textarea
          placeholder="Seu comentário"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          className="border border-white/10 bg-gelo rounded px-3 py-2 text-low-dark placeholder:text-low-medium focus:border-secondary focus:outline-none transition-colors"
          rows={3}
        />
        <button type="submit" className="bg-secondary text-white px-4 py-2 rounded shadow hover:bg-secondary/90 transition-colors">Enviar comentário</button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default Comments;
