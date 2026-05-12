import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AdminLayout from '../../components/Admin/AdminLayout';
import { API_URL } from '../../lib/api';
import Button from '../../components/UI/Button';

// Redesign dashboard: FAQ management with consistent SaaS styling

const AdminFAQ = () => {
    // --- Logic (100% preserved) ---
    const updateOrderBackend = (faqs) => {
      faqs.forEach((item, idx) => {
        const id = item.id || item._id;
        fetch(`${API_URL}/api/faq/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('svicero_admin_token')}` },
          body: JSON.stringify({ ordem: idx, pergunta: item.pergunta, resposta: item.resposta })
        });
      });
    };

    const handleDragEnd = (result) => {
      if (!result.destination) return;
      const reordered = Array.from(perguntas);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      setPerguntas(reordered);
      updateOrderBackend(reordered);
    };

  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(true);

    React.useEffect(() => {
      setLoading(true);
      fetch(`${API_URL}/api/faq`)
        .then(res => res.json())
        .then(data => {
          setPerguntas(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          setPerguntas([]);
          setLoading(false);
        });
    }, []);

  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [ordem, setOrdem] = useState(0);
  const [editIdx, setEditIdx] = useState(null);
  const [editPergunta, setEditPergunta] = useState('');
  const [editResposta, setEditResposta] = useState('');
  const [editOrdem, setEditOrdem] = useState(0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!pergunta.trim() || !resposta.trim()) return;
    fetch(`${API_URL}/api/faq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('svicero_admin_token')}` },
      body: JSON.stringify({ pergunta, resposta, ordem })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.pergunta) setPerguntas([data, ...perguntas]);
        setPergunta('');
        setResposta('');
        setOrdem(0);
      });
  };

  const handleDelete = (idx) => {
    const id = perguntas[idx].id || perguntas[idx]._id;
    fetch(`${API_URL}/api/faq/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('svicero_admin_token')}` }
    })
      .then(res => res.json())
      .then(() => {
        setPerguntas(perguntas.filter((_, i) => i !== idx));
        if (editIdx === idx) setEditIdx(null);
      });
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditPergunta(perguntas[idx].pergunta);
    setEditResposta(perguntas[idx].resposta);
    setEditOrdem(perguntas[idx].ordem || 0);
  };

  const handleSaveEdit = (idx) => {
    if (!editPergunta.trim() || !editResposta.trim()) return;
    const id = perguntas[idx].id || perguntas[idx]._id;
    fetch(`${API_URL}/api/faq/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('svicero_admin_token')}` },
      body: JSON.stringify({ pergunta: editPergunta, resposta: editResposta, ordem: editOrdem })
    })
      .then(res => res.json())
      .then(data => {
        const novasPerguntas = perguntas.map((item, i) => i === idx ? data : item);
        setPerguntas(novasPerguntas);
        setEditIdx(null);
      });
  };

  const handleCancelEdit = () => {
    setEditIdx(null);
  };

  // --- JSX (redesigned) ---
  return (
    <AdminLayout title="FAQ">
      {/* Add form */}
      <div className="rounded-xl border border-white/5 bg-surface p-6 mb-6">
        <h2 className="text-base font-semibold text-cream mb-4">Nova Pergunta</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Pergunta</label>
            <input
              type="text"
              value={pergunta}
              onChange={e => setPergunta(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-muted/50 outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20"
              placeholder="Digite a pergunta"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Resposta</label>
            <textarea
              value={resposta}
              onChange={e => setResposta(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-muted/50 outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20 resize-none"
              placeholder="Digite a resposta"
              rows={3}
            />
          </div>
          <div className="flex items-end gap-4">
            <div className="w-32">
              <label className="block text-sm font-medium text-muted mb-1.5">Ordem</label>
              <input
                type="number"
                value={ordem}
                onChange={e => setOrdem(Number(e.target.value))}
                className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20"
                min={0}
              />
            </div>
            <Button type="submit" className="rounded-lg bg-copper px-5 py-3 text-sm font-semibold text-white hover:brightness-110 transition">
              Adicionar
            </Button>
          </div>
        </form>
      </div>

      {/* FAQ list */}
      <div className="rounded-xl border border-white/5 bg-surface">
        <div className="border-b border-white/5 px-6 py-4">
          <h2 className="text-base font-semibold text-cream">
            Perguntas Cadastradas
            {!loading && <span className="ml-2 text-sm font-normal text-muted">({perguntas.length})</span>}
          </h2>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center text-muted py-10">Carregando perguntas...</div>
          ) : perguntas.length === 0 ? (
            <div className="text-center text-muted py-10">Nenhuma pergunta cadastrada.</div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="faq-list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <div style={{ minHeight: '1px' }} className="space-y-2">
                      {perguntas.map((item, idx) => (
                      <Draggable key={item.id || item._id} draggableId={String(item.id || item._id)} index={idx}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            className={`rounded-lg border bg-charcoal p-4 transition-all ${dragSnapshot.isDragging ? 'border-copper/50 shadow-lg shadow-copper/10' : 'border-white/5 hover:border-white/10'}`}
                            style={{ overflow: 'visible' }}
                          >
                            {editIdx === idx ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={editPergunta}
                                  onChange={e => setEditPergunta(e.target.value)}
                                  className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-sm text-cream outline-none transition focus:border-copper/40"
                                />
                                <textarea
                                  value={editResposta}
                                  onChange={e => setEditResposta(e.target.value)}
                                  className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-sm text-cream outline-none transition focus:border-copper/40 resize-none"
                                  rows={3}
                                />
                                <div className="flex items-center gap-3">
                                  <input
                                    type="number"
                                    value={editOrdem}
                                    onChange={e => setEditOrdem(Number(e.target.value))}
                                    className="w-24 rounded-lg border border-white/10 bg-surface px-3 py-2.5 text-sm text-cream outline-none transition focus:border-copper/40"
                                    min={0}
                                  />
                                  <Button onClick={() => handleSaveEdit(idx)} className="rounded-lg bg-copper px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition">Salvar</Button>
                                  <Button onClick={handleCancelEdit} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-muted hover:text-cream transition">Cancelar</Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-3">
                                <span {...dragProvided.dragHandleProps} className="cursor-grab text-muted hover:text-copper mt-0.5 text-base select-none flex-shrink-0 transition-colors" title="Arraste para reordenar">
                                  <i className="fa-solid fa-grip-vertical"></i>
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-cream">{item.pergunta}</p>
                                  <p className="mt-1 text-sm text-muted leading-relaxed line-clamp-2">{item.resposta}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Button onClick={() => handleEdit(idx)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted hover:text-cream hover:bg-white/10 transition">Editar</Button>
                                  <Button onClick={() => handleDelete(idx)} className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15 transition">Remover</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFAQ;
