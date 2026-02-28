import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/UI/Button';
import { useToast } from '../hooks/useToast';
import Toast from '../components/UI/Toast';

const AdminDepoimentos = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate();
  const [depoimentos, setDepoimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast();

  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    empresa: '',
    texto: '',
    nota: 5,
    iniciais: '',
    cor_avatar: 'orange',
    ativo: true,
    ordem: 0
  });

  const coresAvatar = [
    { value: 'orange', label: 'Laranja', class: 'bg-orange-500/20 text-orange-500' },
    { value: 'gold', label: 'Dourado', class: 'bg-amber-500/20 text-amber-500' },
    { value: 'blue', label: 'Azul', class: 'bg-blue-600/20 text-blue-600' },
    { value: 'silver', label: 'Prata', class: 'bg-gray-400/20 text-gray-400' },
  ];

  // Buscar depoimentos
  const fetchDepoimentos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('svicero_admin_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/depoimentos/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderBy: { ordem: 1 } }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao buscar depoimentos');
      setDepoimentos(payload.data || []);
    } catch (error) {
      showToastMessage('Erro ao carregar depoimentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepoimentos(); }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gerar iniciais automaticamente se não fornecidas
      const iniciais = formData.iniciais || formData.nome
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

      const dataToSave = {
        ...formData,
        iniciais,
        nota: parseInt(formData.nota),
        ordem: parseInt(formData.ordem)
      };

      const token = localStorage.getItem('svicero_admin_token');
      if (editingId) {
        // Atualizar depoimento
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/depoimentos/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ filters: [{ id: editingId }], data: dataToSave }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Erro ao atualizar depoimento');
        showToastMessage('Depoimento atualizado com sucesso!');
      } else {
        // Criar depoimento
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/depoimentos/insert`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data: dataToSave }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Erro ao criar depoimento');
        showToastMessage('Depoimento criado com sucesso!');
      }

      resetForm();
      fetchDepoimentos();
    } catch (error) {
      // Erro ao salvar depoimento
      showToastMessage('Erro ao salvar depoimento', 'error');
    }
  };

  const handleEdit = (depoimento) => {
    setFormData({
      nome: depoimento.nome || '',
      cargo: depoimento.cargo || '',
      empresa: depoimento.empresa || '',
      texto: depoimento.texto || '',
      nota: depoimento.nota || 5,
      iniciais: depoimento.iniciais || '',
      cor_avatar: depoimento.cor_avatar || 'orange',
      ativo: depoimento.ativo !== false,
      ordem: depoimento.ordem || 0
    });
    setEditingId(depoimento.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este depoimento?')) return;

    try {
      const token = localStorage.getItem('svicero_admin_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/depoimentos/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filters: [{ id }] }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao excluir depoimento');
      showToastMessage('Depoimento excluído com sucesso!');
      fetchDepoimentos();
    } catch (error) {
      showToastMessage('Erro ao excluir depoimento', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      // Erro ao fazer logout
      showToastMessage('Erro ao sair', 'error')
    }
  }

  const toggleAtivo = async (id, ativo) => {
    try {
      const token = localStorage.getItem('svicero_admin_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/depoimentos/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filters: [{ id }], data: { ativo: !ativo } }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao atualizar status');
      showToastMessage(`Depoimento ${!ativo ? 'ativado' : 'desativado'}!`);
      fetchDepoimentos();
    } catch (error) {
      showToastMessage('Erro ao atualizar status', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cargo: '',
      empresa: '',
      texto: '',
      nota: 5,
      iniciais: '',
      cor_avatar: 'orange',
      ativo: true,
      ordem: 0
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getAvatarColorClass = (cor) => {
    const cores = {
      orange: 'bg-orange-500/20 text-orange-500',
      gold: 'bg-amber-500/20 text-amber-500',
      blue: 'bg-blue-600/20 text-blue-600',
      silver: 'bg-gray-400/20 text-gray-400',
    };
    return cores[cor] || cores.orange;
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {toastMessage}
        </div>
      )}

      <main className="pt-20 pb-20 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header padrão admin */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <button
                onClick={() => navigate('/admin')}
                className="text-primary hover:underline font-medium mb-4 flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i>
                Voltar ao Painel
              </button>
              <h1 className="font-title text-4xl font-semibold text-low-dark">
                Gerenciar Depoimentos
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Sair
            </button>
          </div>

          {/* Botão novo depoimento */}
          <div className="w-full items-center flex justify-end mb-8">
            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              variant="primary"
              icon={<i className="fa-solid fa-plus"></i>}
            >
              Novo Depoimento
            </Button>
          </div>

          {/* Formulário */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h2 className="font-title text-2xl font-light text-low-dark mb-6">
                {editingId ? 'Editar Depoimento' : 'Novo Depoimento'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-low-dark font-medium mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-low-light"
                      placeholder="Nome do cliente"
                    />
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="block text-low-dark font-medium mb-2">
                      Cargo
                    </label>
                    <input
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-low-light"
                      placeholder="Ex: CEO, Diretor, Proprietário"
                    />
                  </div>

                  {/* Empresa */}
                  <div>
                    <label className="block text-low-dark font-medium mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-low-light"
                      placeholder="Nome da empresa"
                    />
                  </div>

                  {/* Iniciais */}
                  <div>
                    <label className="block text-low-dark font-medium mb-2">
                      Iniciais (opcional)
                    </label>
                    <input
                      type="text"
                      name="iniciais"
                      value={formData.iniciais}
                      onChange={handleInputChange}
                      maxLength={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-low-light"
                      placeholder="Ex: AI (gerado automaticamente se vazio)"
                    />
                  </div>

                  {/* Nota */}
                  <div>
                    <label className="block text-low-dark font-medium mb-2">
                      Nota (1-5 estrelas)
                    </label>
                    <select
                      name="nota"
                      value={formData.nota}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-low-light"
                    >
                      {[5, 4, 3, 2, 1].map(n => (
                        <option key={n} value={n}>{n} estrela{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cor do Avatar */}
                  <div>
                    <label className="block text-low-dark font-medium mb-2">
                      Cor do Avatar
                    </label>
                    <select
                      name="cor_avatar"
                      value={formData.cor_avatar}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-low-light"
                    >
                      {coresAvatar.map(cor => (
                        <option key={cor.value} value={cor.value}>{cor.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ordem */}
                  <div>
                    <label className="block text-low-dark font-medium mb-2">
                      Ordem de exibição
                    </label>
                    <input
                      type="number"
                      name="ordem"
                      value={formData.ordem}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-low-light"
                      placeholder="0"
                    />
                  </div>

                  {/* Ativo */}
                  <div className="flex items-center gap-3 pt-8">
                    <input
                      type="checkbox"
                      name="ativo"
                      id="ativo"
                      checked={formData.ativo}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="ativo" className="text-low-dark font-medium">
                      Ativo (exibir no site)
                    </label>
                  </div>
                </div>

                {/* Texto do depoimento */}
                <div>
                  <label className="block text-low-dark font-medium mb-2">
                    Depoimento *
                  </label>
                  <textarea
                    name="texto"
                    value={formData.texto}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-low-light"
                    placeholder="Texto do depoimento do cliente..."
                  />
                </div>

                {/* Preview */}
                <div className="bg-low-dark rounded-xl p-6">
                  <p className="text-cream/60 text-sm mb-4">Preview:</p>
                  <div className="bg-low-dark/50 rounded-2xl p-6 border border-low-medium/20 max-w-md">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(parseInt(formData.nota) || 5)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star text-yellow-400 text-sm"></i>
                      ))}
                    </div>
                    <p className="text-cream/90 text-sm leading-relaxed mb-4 italic">
                      "{formData.texto || 'Texto do depoimento...'}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColorClass(formData.cor_avatar)}`}>
                        <span className="font-semibold text-sm">
                          {formData.iniciais || formData.nome?.substring(0, 2).toUpperCase() || 'XX'}
                        </span>
                      </div>
                      <div>
                        <p className="text-cream font-medium text-sm">{formData.nome || 'Nome'}</p>
                        <p className="text-cream/60 text-xs">
                          {formData.cargo}{formData.empresa ? `, ${formData.empresa}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-4">
                  <Button type="submit" variant="primary">
                    {editingId ? 'Atualizar' : 'Salvar'} Depoimento
                  </Button>
                  <Button type="button" variant="secondary" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Depoimentos */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : depoimentos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <i className="fa-regular fa-comment-dots text-6xl text-gray-300 mb-4"></i>
              <p className="text-low-medium text-lg">Nenhum depoimento cadastrado</p>
              <p className="text-gray-400">Clique em "Novo Depoimento" para adicionar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {depoimentos.map((depoimento) => (
                <div
                  key={depoimento.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all ${depoimento.ativo ? 'border-green-200' : 'border-gray-200 opacity-60'
                    }`}
                >
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${depoimento.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {depoimento.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="text-gray-400 text-sm">Ordem: {depoimento.ordem}</span>
                  </div>

                  {/* Estrelas */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(depoimento.nota || 5)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star text-yellow-400 text-sm"></i>
                    ))}
                  </div>

                  {/* Texto */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    "{depoimento.texto}"
                  </p>

                  {/* Autor */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColorClass(depoimento.cor_avatar)}`}>
                      <span className="font-semibold text-sm">{depoimento.iniciais}</span>
                    </div>
                    <div>
                      <p className="text-low-dark font-medium text-sm">{depoimento.nome}</p>
                      <p className="text-gray-400 text-xs">
                        {depoimento.cargo}{depoimento.empresa ? `, ${depoimento.empresa}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(depoimento)}
                      className="flex-1 px-3 py-2 text-sm bg-secondary hover:bg-secondary/90 rounded-lg transition-colors"
                    >
                      <i className="fa-solid fa-pen mr-2"></i>Editar
                    </button>
                    <button
                      onClick={() => toggleAtivo(depoimento.id, depoimento.ativo)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${depoimento.ativo
                          ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}
                    >
                      <i className={`fa-solid ${depoimento.ativo ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                    <button
                      onClick={() => handleDelete(depoimento.id)}
                      className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botões de navegação */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Button href="/admin" variant="primary">
              <i className="fa-solid fa-gauge-high mr-2"></i>
              Voltar ao Dashboard
            </Button>
            <Button href="/" variant="secondary">
              <i className="fa-solid fa-home mr-2"></i>
              Ir para o Site
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDepoimentos;
