import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AdminLayout from '../../components/Layout/AdminLayout';
import { API_URL } from '../../lib/api';


const AdminFAQ = () => {
    // Função para atualizar ordem no backend
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

    // Handler drag end
    const handleDragEnd = (result) => {
      if (!result.destination) return;
      const reordered = Array.from(perguntas);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      // Atualiza ordem local
      setPerguntas(reordered);
      // Atualiza ordem no backend
      updateOrderBackend(reordered);
    };
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(true);
    // Buscar perguntas do backend
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

  return (
    <AdminLayout title="Admin FAQ">
      <div className="w-full mx-auto py-20 lg:py-36 px-20 lg:px-36 font-body">
        <h1 className="text-3xl font-bold mb-6">Gerenciar Perguntas Frequentes (FAQ)</h1>
        <form onSubmit={handleAdd} className="bg-[#181818] p-6 rounded-xl mb-8 shadow">
          <div className="mb-4">
            <label className="block text-[#E9BF84] mb-2">Pergunta</label>
            <input
              type="text"
              value={pergunta}
              onChange={e => setPergunta(e.target.value)}
              className="w-full p-3 rounded bg-[#222] text-white border border-[#E9BF84]/20"
              placeholder="Digite a pergunta"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#E9BF84] mb-2">Resposta</label>
            <textarea
              value={resposta}
              onChange={e => setResposta(e.target.value)}
              className="w-full p-3 rounded bg-[#222] text-white border border-[#E9BF84]/20"
              placeholder="Digite a resposta"
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#E9BF84] mb-2">Ordem</label>
            <input
              type="number"
              value={ordem}
              onChange={e => setOrdem(Number(e.target.value))}
              className="w-full p-3 rounded bg-[#222] text-white border border-[#E9BF84]/20"
              placeholder="Defina a ordem de exibição"
              min={0}
            />
          </div>
          <button type="submit" className="bg-[#E9BF84] text-[#181818] font-semibold px-6 py-2 rounded hover:bg-[#cfa76b]">Adicionar</button>
        </form>
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-white/60 py-8">Carregando perguntas...</div>
          ) : perguntas.length === 0 ? (
            <div className="text-center text-white/60 py-8">Nenhuma pergunta cadastrada.</div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="faq-list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {/* Ajuste de min-height para garantir drop acima */}
                    <div style={{ minHeight: '1px' }}>
                      {perguntas.map((item, idx) => (
                      <Draggable key={item.id || item._id} draggableId={String(item.id || item._id)} index={idx}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            className={`bg-[#181818] p-5 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between mb-4 ${dragSnapshot.isDragging ? 'ring-2 ring-[#E9BF84]' : ''}`}
                            style={{ overflow: 'visible' }}
                          >
                            {editIdx === idx ? (
                              <div className="w-full mt-4">
                                <input
                                  type="text"
                                  value={editPergunta}
                                  onChange={e => setEditPergunta(e.target.value)}
                                  className="w-full p-3 rounded bg-[#222] text-white border border-[#E9BF84]/20 mb-2"
                                />
                                <textarea
                                  value={editResposta}
                                  onChange={e => setEditResposta(e.target.value)}
                                  className="w-full p-3 rounded bg-[#222] text-white border border-[#E9BF84]/20 mb-2"
                                  rows={4}
                                />
                                <input
                                  type="number"
                                  value={editOrdem}
                                  onChange={e => setEditOrdem(Number(e.target.value))}
                                  className="w-full p-3 rounded bg-[#222] text-white border border-[#E9BF84]/20 mb-2"
                                  placeholder="Defina a ordem de exibição"
                                  min={0}
                                />
                                <div className="flex gap-2 mt-2">
                                  <button onClick={() => handleSaveEdit(idx)} className="bg-[#E9BF84] text-[#181818] font-semibold px-4 py-2 rounded hover:bg-[#cfa76b]">Salvar</button>
                                  <button onClick={handleCancelEdit} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Cancelar</button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center mb-2">
                                  <span {...dragProvided.dragHandleProps} className="cursor-grab text-[#E9BF84] mr-4 text-xl md:text-2xl select-none" title="Arraste para reordenar">☰</span>
                                  <div className="flex-1">
                                    <div className="text-[#E9BF84] font-semibold mb-1">{item.pergunta}</div>
                                    <div className="text-white/80">{item.resposta}</div>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-3 md:mt-0">
                                  <button onClick={() => handleEdit(idx)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Editar</button>
                                  <button onClick={() => handleDelete(idx)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Remover</button>
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
