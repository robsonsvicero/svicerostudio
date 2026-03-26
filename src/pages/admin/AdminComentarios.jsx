import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/UI/Button';
import AdminLayout from '../../components/Admin/AdminLayout';

import { API_URL } from '../../lib/api.js';

const AdminComentarios = () => {
    const { token } = useAuth();
    const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast();
    
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // 'pending', 'approved'

    const fetchComments = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        // Backend expects 'false' for pending, 'true' for approved
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
            : `${API_URL}/api/comments/${id}`; // Assuming DELETE for rejection
        
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

    return (
        <AdminLayout toastProps={{ show: showToast, message: toastMessage, type: toastType, onClose: hideToast }}>
                <div className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[#181818] shadow-2xl shadow-black/30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(184,115,51,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(95,178,216,0.10),_transparent_22%)]" />
                    <div className="relative border-b border-white/8 px-6 py-6 lg:px-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#E9BF84]">
                                    Moderação
                                </div>
                                <h1 className="mt-4 font-[DM Sans] text-3xl font-semibold tracking-[-0.04em] text-white lg:text-5xl">
                                    Gerenciar Comentários
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 lg:text-base">
                                    Aprove, rejeite e gerencie as interações nos artigos do blog.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-1.5">
                                <button onClick={() => setFilter('pending')} className={`w-full rounded-[14px] px-5 py-3 text-sm font-medium transition ${filter === 'pending' ? 'bg-[#B87333] text-black' : 'text-white/60 hover:bg-white/5'}`}>
                                    Pendentes
                                </button>
                                <button onClick={() => setFilter('approved')} className={`w-full rounded-[14px] px-5 py-3 text-sm font-medium transition ${filter === 'approved' ? 'bg-[#B87333] text-black' : 'text-white/60 hover:bg-white/5'}`}>
                                    Aprovados
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 lg:p-8">
                        {loading && <p className="text-white/60 text-center py-10">Carregando comentários...</p>}
                        {!loading && comments.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-lg font-medium text-white">Nenhum comentário {filter === 'pending' ? 'pendente' : 'aprovado'}.</p>
                                <p className="mt-2 text-sm text-white/50">Todos os comentários estão em dia!</p>
                            </div>
                        )}
                        {!loading && comments.length > 0 && (
                            <ul className="space-y-4">
                                {comments.map((comment) => (
                                    <li key={comment._id} className="rounded-2xl border border-white/10 bg-white/[.03] p-5 backdrop-blur-sm">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="font-semibold text-white">{comment.name}</div>
                                                    <a href={`mailto:${comment.email}`} className="text-sm text-white/50 hover:text-[#B87333] truncate">{comment.email}</a>
                                                </div>
                                                <p className="mt-1 text-xs text-white/40">
                                                    Em <a href={`/blog/${comment.postSlug}`} target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-2">{comment.postSlug}</a>
                                                    {' • '}
                                                    {new Date(comment.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="mt-4 sm:mt-0 flex-shrink-0 flex items-center gap-2">
                                                {filter === 'pending' && (
                                                    <Button variant="primary" onClick={() => handleUpdateStatus(comment._id, 'approved')}>
                                                        Aprovar
                                                    </Button>
                                                )}
                                                <Button variant="danger" onClick={() => handleUpdateStatus(comment._id, 'deleted')}>
                                                    Excluir
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-white/80 whitespace-pre-line text-sm leading-6">{comment.content}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
    </AdminLayout>
    );
};

export default AdminComentarios;
