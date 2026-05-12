import React, { useEffect, useState } from 'react';
import { API_URL } from '../../lib/api.js';
import Button from '../UI/Button';

const getEntityId = (item) => item?.id || item?._id || '';

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
    <div className="comments-section">
      <h3 className="text-2xl font-medium tracking-tight text-cream mb-8">Comentários</h3>
      {loading ? (
        <p className="text-muted/60 animate-pulse">Carregando comentários...</p>
      ) : comments.length === 0 ? (
        <p className="text-muted mb-10 opacity-60">Seja o primeiro a comentar!</p>
      ) : (
        <ul className="space-y-8 mb-12">
          {comments.map((c) => (
            <li key={getEntityId(c)} className="border-b border-white/5 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-copper/10 border border-copper/20 flex items-center justify-center text-copper text-xs font-bold">
                  {c.name ? c.name[0].toUpperCase() : '?'}
                </div>
                <p className="font-medium text-cream">{c.name}</p>
              </div>
              <p className="text-muted leading-[1.6] mb-3 ml-11">{c.content}</p>
              <span className="text-[10px] text-muted/40 font-mono uppercase tracking-[0.2em] ml-11">
                {new Date(c.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 md:p-10 mt-12">
        <h4 className="text-lg font-medium text-cream mb-6">Deixe seu comentário</h4>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted/80 ml-1">Nome</label>
              <input
                type="text"
                placeholder="Como gostaria de ser chamado?"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-cream placeholder:text-muted/50 focus:border-copper/60 focus:bg-white/10 focus:outline-none transition-all shadow-inner"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted/80 ml-1">Mensagem</label>
              <textarea
                placeholder="Escreva aqui seu comentário..."
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-cream placeholder:text-muted/50 focus:border-copper/60 focus:bg-white/10 focus:outline-none transition-all shadow-inner min-h-[120px]"
                rows={4}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary"
          >
            Publicar Comentário
          </Button>
          
          {message && (
            <div className={`text-sm mt-4 p-4 rounded-xl border ${message.includes('Erro') ? 'bg-red-900/10 border-red-900/30 text-red-400' : 'bg-copper/10 border-copper/20 text-copper'}`}>
              <i className={`fa-solid ${message.includes('Erro') ? 'fa-circle-xmark' : 'fa-circle-check'} mr-2`}></i>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Comments;
