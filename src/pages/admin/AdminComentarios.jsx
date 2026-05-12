import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/UI/Button';
import AdminLayout from '../../components/Admin/AdminLayout';

import { API_URL } from '../../lib/api.js';

// Redesign dashboard: Comments moderation with consistent SaaS styling

const getEntityId = (item) => item?.id || item?._id || '';

const AdminComentarios = () => {
    const { token } = useAuth();
    const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast();
    
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    // --- Data fetching (100% preserved) ---
    const fetchComments = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        const approvedStatus = filter === 'pending' ? 'false' : 'true';
        try {
            const res = await fetch(`${API_URL}/api/comments?approved=${approvedStatus}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao buscar comentários');
            setComments(Array.isArray(data) ? data : []);
        } catch (e) {
            showToastMessage(e.message, 'error');
            setComments([]);
        } finally {
            setLoading(false);
        }
    }, [token, filter, showToastMessage]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleUpdateStatus = async (id, newStatus) => {
        const url = newStatus === 'approved' 
            ? `${API_URL}/api/comments/${id}/approve`
            : `${API_URL}/api/comments/${id}`;
        const method = newStatus === 'approved' ? 'PATCH' : 'DELETE';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || `Erro ao ${newStatus === 'approved' ? 'aprovar' : 'excluir'}`);
            }
            showToastMessage(`Comentário ${newStatus === 'approved' ? 'aprovado' : 'excluído'}!`, 'success');
            fetchComments();
        } catch (err) {
            showToastMessage(err.message, 'error');
        }
    };

    // --- JSX (redesigned) ---
    const filterTabs = (
      <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-charcoal p-1">
        <Button
          onClick={() => setFilter('pending')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${filter === 'pending' ? 'bg-copper text-white' : 'text-muted hover:text-cream hover:bg-white/5'}`}
        >
          Pendentes
        </Button>
        <Button
          onClick={() => setFilter('approved')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${filter === 'approved' ? 'bg-copper text-white' : 'text-muted hover:text-cream hover:bg-white/5'}`}
        >
          Aprovados
        </Button>
      </div>
    );

    return (
        <AdminLayout
          title="Comentários"
          actions={filterTabs}
          toastProps={{ show: showToast, message: toastMessage, type: toastType, onClose: hideToast }}
        >
          <div className="rounded-xl border border-white/5 bg-surface">
            <div className="border-b border-white/5 px-6 py-4">
              <h2 className="text-base font-semibold text-cream">
                {filter === 'pending' ? 'Comentários Pendentes' : 'Comentários Aprovados'}
                {!loading && <span className="ml-2 text-sm font-normal text-muted">({comments.length})</span>}
              </h2>
            </div>

            <div className="p-4">
              {loading && <p className="text-muted text-center py-12">Carregando comentários...</p>}
              {!loading && comments.length === 0 && (
                <div className="py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 mx-auto mb-4">
                    <i className="fa-solid fa-check-double text-lg text-muted"></i>
                  </div>
                  <p className="text-sm font-medium text-cream">Nenhum comentário {filter === 'pending' ? 'pendente' : 'aprovado'}</p>
                  <p className="mt-1 text-xs text-muted">Todos os comentários estão em dia!</p>
                </div>
              )}
              {!loading && comments.length > 0 && (
                <div className="space-y-2">
                  {comments.map((comment) => (
                    <div key={getEntityId(comment)} className="rounded-lg border border-white/5 bg-charcoal p-4 hover:border-white/10 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-cream">{comment.name}</span>
                            <a href={`mailto:${comment.email}`} className="text-xs text-muted hover:text-copper truncate transition-colors">{comment.email}</a>
                          </div>
                          <p className="mt-1 text-xs text-muted">
                            Em <a href={`/blog/${comment.postSlug}`} target="_blank" rel="noopener noreferrer" className="hover:text-cream underline underline-offset-2 transition-colors">{comment.postSlug}</a>
                            {' · '}
                            {new Date(comment.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {filter === 'pending' && (
                            <Button
                              onClick={() => handleUpdateStatus(getEntityId(comment), 'approved')}
                              className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition"
                            >
                              Aprovar
                            </Button>
                          )}
                          <Button
                            onClick={() => handleUpdateStatus(getEntityId(comment), 'deleted')}
                            className="rounded-lg bg-red-500/5 border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15 transition"
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-cream/80 whitespace-pre-line leading-relaxed border-t border-white/5 pt-3">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
    </AdminLayout>
    );
};

export default AdminComentarios;
