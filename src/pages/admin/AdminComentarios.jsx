import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/UI/Button';
import AdminLayout from '../../components/Admin/AdminLayout';
import AdminListCard from '../../components/Admin/AdminListCard';

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
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 text-sm font-medium transition ${filter === 'pending' ? 'bg-ds-accent text-white' : 'text-ds-muted hover:text-ds-text hover:bg-white/5'}`}
        >
          Pendentes
        </button>
        <button
          type="button"
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 text-sm font-medium transition ${filter === 'approved' ? 'bg-ds-accent text-white' : 'text-ds-muted border border-ds-border/30 hover:text-ds-text hover:bg-ds-bg'}`}
        >
          Aprovados
        </button>
      </div>
    );

    return (
        <AdminLayout
          title="Comentários"
          actions={filterTabs}
          toastProps={{ show: showToast, message: toastMessage, type: toastType, onClose: hideToast }}
        >
          <AdminListCard
            title={filter === 'pending' ? 'Comentários Pendentes' : 'Comentários Aprovados'}
            count={comments.length}
            loading={loading}
            loadingText="Carregando comentários..."
            emptyText={`Nenhum comentário ${filter === 'pending' ? 'pendente' : 'aprovado'}`}
            bodyClassName="p-4"
          >
            {comments.length > 0 && (
              <div className="space-y-2">
                {comments.map((comment) => (
                    <div key={getEntityId(comment)} className="rounded-lg border border-white/5 bg-ds-bg p-4 hover:border-white/10 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-ds-text">{comment.name}</span>
                            <a href={`mailto:${comment.email}`} className="text-xs text-ds-muted hover:text-ds-accent truncate transition-colors">{comment.email}</a>
                          </div>
                          <p className="mt-1 text-xs text-ds-muted">
                            Em <a href={`/blog/${comment.postSlug}`} target="_blank" rel="noopener noreferrer" className="hover:text-ds-text underline underline-offset-2 transition-colors">{comment.postSlug}</a>
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
                      <p className="mt-3 text-sm text-ds-text/80 whitespace-pre-line leading-relaxed border-t border-white/5 pt-3">{comment.content}</p>
                    </div>
                ))}
              </div>
            )}
          </AdminListCard>
    </AdminLayout>
    );
};

export default AdminComentarios;
