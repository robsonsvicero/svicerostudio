import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/UI/Button'
import { useToast } from '../hooks/useToast'
import Toast from '../components/UI/Toast'
import { translateToEnglish } from '../services/translateService'

const AdminProjetos = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast()
  const [galleryImages, setGalleryImages] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    descricao_longa: '',
    descricao_longa_en: '',
    imagem_url: '',
    site_url: '',
    link: '',
    button_text: 'Ver Projeto',
    link2: '',
    button_text2: '',
    data_projeto: '',
    mostrar_home: true
  })

  // Buscar projetos
  const fetchProjetos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('svicero_admin_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/projetos/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ operation: 'select', filters: [{ column: 'mostrar_home', operator: 'eq', value: true }], orderBy: { column: 'data_projeto', ascending: false } }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao buscar projetos');
      setProjects(payload.data || []);
    } catch (error) {
      showToastMessage('Erro ao carregar projetos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProjetos(); }, []);

  // Buscar galeria de imagens ao editar
  useEffect(() => {
    if (editingId) {
      fetchGalleryImages(editingId)
    } else {
      setGalleryImages([])
    }
  }, [editingId])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // Função de tradução automática
  const handleTranslate = async () => {
    if (!formData.descricao_longa || formData.descricao_longa.trim() === '') {
      showToastMessage('Escreva a descrição em português primeiro', 'error')
      return
    }

    try {
      setIsTranslating(true)
      const translated = await translateToEnglish(formData.descricao_longa)
      setFormData(prev => ({ ...prev, descricao_longa_en: translated }))
      showToastMessage('Texto traduzido com sucesso!', 'success')
    } catch (error) {
      showToastMessage(error.message || 'Erro ao traduzir texto', 'error')
    } finally {
      setIsTranslating(false)
    }
  }

  // Buscar galeria de imagens
  const fetchGalleryImages = async (projetoId) => {
    try {
      const token = localStorage.getItem('svicero_admin_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/projeto_galeria/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filters: [{ column: 'projeto_id', operator: 'eq', value: projetoId }], orderBy: { column: 'ordem', ascending: true } }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao buscar galeria');
      setGalleryImages(payload.data || []);
    } catch (error) {
      console.error('Erro ao carregar galeria:', error);
    }
  };

  // Upload de múltiplas imagens (binário via /api/storage/upload)
  const handleGalleryUpload = async (files) => {
    if (!files || files.length === 0) return;
    if (files.length > 15) {
      showToastMessage('Máximo de 15 imagens por projeto', 'error');
      return;
    }
    // Limite de tamanho: 8MB por imagem (backend aceita até 8MB)
    const tooBig = Array.from(files).find(f => f.size > 8 * 1024 * 1024);
    if (tooBig) {
      showToastMessage('Cada imagem deve ter no máximo 8MB', 'error');
      return;
    }
    setUploadingImages(true);
    try {
      const token = localStorage.getItem('svicero_admin_token');
      const uploadedImages = [];
      for (let idx = 0; idx < files.length; idx++) {
        const file = files[idx];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'projetos');
        formData.append('key', `${Date.now()}_${file.name}`);
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/storage/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const payload = await res.json();
        // Novo formato: espera data.path
        if (!res.ok || !payload.data?.path) {
          console.error('Falha no upload. Status:', res.status, 'Payload:', payload);
          throw new Error(payload.error || JSON.stringify(payload) || 'Erro ao enviar imagem');
        }
        // Monta a URL da imagem usando o endpoint correto do backend
        const apiUrl = import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app';
        const imageUrl = `${apiUrl}/api/storage/public/projetos/${payload.data.path}`;
        uploadedImages.push({
          imagem_url: imageUrl,
          ordem: galleryImages.length + idx,
        });
      }
      setGalleryImages(prev => [...prev, ...uploadedImages]);
      showToastMessage(`${files.length} imagens adicionadas!`, 'success');
    } catch (error) {
      // Tenta mostrar a mensagem real do backend, se existir
      if (error instanceof Error && error.message) {
        console.error('Erro ao fazer upload:', error.message);
        showToastMessage(`Erro ao fazer upload: ${error.message}`, 'error');
      } else {
        console.error('Erro ao fazer upload:', error);
        showToastMessage('Erro ao fazer upload das imagens', 'error');
      }
    } finally {
      setUploadingImages(false);
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files || [])
    handleGalleryUpload(files)
  }

  // Remover imagem da galeria
  const handleRemoveGalleryImage = async (index, imageId) => {
    if (imageId) {
      // Se já está salvo no banco, deletar
      try {
        const token = localStorage.getItem('svicero_admin_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/projeto_galeria/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ filters: [{ id: imageId }] }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Erro ao remover imagem');
      } catch (error) {
        console.error('Erro ao deletar imagem:', error);
        showToastMessage('Erro ao remover imagem', 'error');
        return;
      }
    }
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  // Reordenar imagens da galeria
  const handleReorderGallery = (fromIndex, toIndex) => {
    const newGallery = [...galleryImages]
    const [removed] = newGallery.splice(fromIndex, 1)
    newGallery.splice(toIndex, 0, removed)
    
    // Atualizar ordem
    const reordered = newGallery.map((img, index) => ({
      ...img,
      ordem: index
    }))
    
    setGalleryImages(reordered)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let projetoId = editingId;
      const token = localStorage.getItem('svicero_admin_token');
      if (editingId) {
        // Atualizar projeto existente
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/projetos/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ operation: 'update', filters: [{ id: editingId }], payload: formData }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Erro ao atualizar projeto');
      } else {
        // Criar novo projeto
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/projetos/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ operation: 'insert', payload: formData }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Erro ao criar projeto');
        projetoId = payload.data?.[0]?.id;
        // Após criar, já entra em modo de edição do novo projeto
        setEditingId(projetoId);
        fetchGalleryImages(projetoId);
      }
      // Salvar galeria de imagens (URLs)
      if (galleryImages.length > 0) {
        // Deletar imagens antigas se estiver editando
        if (editingId) {
          await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ operation: 'delete', filters: [{ column: 'projeto_id', operator: 'eq', value: editingId }] }),
          });
        }
        // Inserir novas imagens (apenas URLs)
        const imagesToInsert = galleryImages.map((img, index) => ({
          projeto_id: projetoId,
          imagem_url: img.imagem_url,
          ordem: img.ordem !== undefined ? img.ordem : index,
          legenda: img.legenda || null
        }));
        await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/projeto_galeria/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ operation: 'insert', payload: imagesToInsert }),
        });
      }
      showToastMessage(
        editingId ? 'Projeto atualizado com sucesso!' : 'Projeto criado com sucesso!',
        'success'
      );
      // Reset form
      setFormData({
        titulo: '',
        descricao: '',
        descricao_longa: '',
        descricao_longa_en: '',
        imagem_url: '',
        site_url: '',
        link: '',
        button_text: 'Ver Projeto',
        link2: '',
        button_text2: '',
        data_projeto: '',
        mostrar_home: true
      });
      setEditingId(null);
      setGalleryImages([]);
      fetchProjetos();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showToastMessage('Erro ao salvar projeto', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (projeto) => {
    setFormData({
      titulo: projeto.titulo,
      descricao: projeto.descricao,
      descricao_longa: projeto.descricao_longa || '',
      descricao_longa_en: projeto.descricao_longa_en || '',
      imagem_url: projeto.imagem_url,
      site_url: projeto.site_url || '',
      link: projeto.link,
      button_text: projeto.button_text,
      link2: projeto.link2 || '',
      button_text2: projeto.button_text2 || '',
      data_projeto: projeto.data_projeto || '',
      mostrar_home: projeto.mostrar_home ?? true
    })
    setEditingId(projeto.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    try {
      const token = localStorage.getItem('svicero_admin_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/projetos/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filters: [{ id }] }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao excluir projeto');
      showToastMessage('Projeto excluído com sucesso!', 'success');
      fetchProjetos();
    } catch (error) {
      showToastMessage('Erro ao excluir projeto', 'error');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      titulo: '',
      descricao: '',
      descricao_longa: '',
      descricao_longa_en: '',
      imagem_url: '',
      site_url: '',
      link: '',
      button_text: 'Ver Projeto',
      link2: '',
      button_text2: '',
      data_projeto: '',
      mostrar_home: true
    })
    setEditingId(null)
    setGalleryImages([])
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      // Erro ao fazer logout
      showToastMessage('Erro ao sair', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <section className="pt-20 pb-24 px-4 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          {/* Header com informações do usuário e logout */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl shadow-lg p-6 border border-cream/20">
            <div>
              <h1 className="font-title text-4xl md:text-5xl font-semibold text-low-dark mb-2">
                Bem-vindo
              </h1>
              <p className="text-low-medium text-lg">
                <span className="text-primary font-medium">{user?.email}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="px-6 py-2"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Voltar ao Admin
              </Button>
            </div>
          </div>

          <div className="mb-12 text-center">
            <h1 className="font-title text-4xl md:text-5xl font-semibold text-low-dark mb-2 mt-16">
              Gerenciar Projetos
            </h1>
            <p className="text-lg text-low-medium">
              Adicione, edite ou remova projetos do portfólio
            </p>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-cream/20">
            <h2 className="font-title text-2xl font-light text-low-dark mb-6">
              {editingId ? 'Editar Projeto' : 'Novo Projeto'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label htmlFor="titulo" className="block text-low-dark text-base mb-2">
                  Título*
                </label>
                <input
                  type="text"
                  name="titulo"
                  id="titulo"
                  required
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                  placeholder="Nome do projeto"
                />
              </div>

              <div>
                <label htmlFor="descricao" className="block text-low-dark text-base mb-2">
                  Descrição Curta (para o card)*
                </label>
                <textarea
                  name="descricao"
                  id="descricao"
                  required
                  value={formData.descricao}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none min-h-[120px] resize-y"
                  placeholder="Descrição curta que aparece no card do projeto"
                />
              </div>

              {/* Descrição Longa / Storytelling */}
              <div className="pt-4 border-t border-cream/40">
                <h3 className="text-low-dark text-lg font-medium mb-4">
                  <i className="fa-solid fa-book mr-2"></i>
                  Storytelling do Projeto
                </h3>
                <p className="text-sm text-low-medium mb-4">
                  Descrição completa que aparecerá no modal. Conte a história do projeto!
                </p>

                <div className="mb-4">
                  <label htmlFor="descricao_longa" className="block text-low-dark text-base mb-2">
                    Descrição Completa (Português)*
                  </label>
                  <textarea
                    name="descricao_longa"
                    id="descricao_longa"
                    value={formData.descricao_longa}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none min-h-[200px] resize-y"
                    placeholder="Conte a história completa do projeto, os desafios, soluções e resultados..."
                  />
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="descricao_longa_en" className="block text-low-dark text-base">
                      Descrição Completa (Inglês)
                    </label>
                    <button
                      type="button"
                      onClick={handleTranslate}
                      disabled={isTranslating || !formData.descricao_longa}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isTranslating ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          Traduzindo...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-language mr-2"></i>
                          Traduzir Automaticamente
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    name="descricao_longa_en"
                    id="descricao_longa_en"
                    value={formData.descricao_longa_en}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none min-h-[200px] resize-y"
                    placeholder="English version of the project story (or use automatic translation)"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="imagem_url" className="block text-low-dark text-base mb-2">
                  Imagem de Capa* (link do imgur)
                </label>
                <input
                  type="url"
                  name="imagem_url"
                  id="imagem_url"
                  required={!editingId}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                  placeholder="https://i.imgur.com/TAgNZWF.png"
                  value={formData.imagem_url}
                  onChange={handleInputChange}
                />
                {formData.imagem_url && (
                  <img src={formData.imagem_url} alt="Prévia da imagem" className="mt-2 rounded-lg max-h-40" />
                )}
                <p className="text-sm text-low-medium mt-1">Cole aqui o link direto da imagem hospedada no imgur. Exemplo: <span className="text-primary">https://i.imgur.com/TAgNZWF.png</span></p>
              </div>

              {/* Galeria de Imagens do Projeto */}
              <div className="pt-4 border-t border-cream/40">
                <h3 className="text-low-dark text-lg font-medium mb-4">
                  <i className="fa-solid fa-images mr-2"></i>
                  Galeria de Imagens (10-15 imagens)
                </h3>
                <p className="text-sm text-low-medium mb-4">
                  Adicione imagens que serão exibidas no modal do projeto. Arraste para reordenar.
                </p>

                <div className="mb-4">
                  <label
                    htmlFor="gallery-upload"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`block w-full px-6 py-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-primary bg-cream/40'
                        : 'border-cream/60 hover:border-primary hover:bg-cream/30'
                    }`}
                  >
                    {uploadingImages ? (
                      <div className="flex flex-col items-center gap-2">
                        <i className="fa-solid fa-spinner fa-spin text-3xl text-primary"></i>
                        <p className="text-low-dark">Enviando imagens...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <i className="fa-solid fa-cloud-arrow-up text-4xl text-primary"></i>
                        <p className="text-low-dark font-medium">Clique ou arraste imagens aqui</p>
                        <p className="text-sm text-low-medium">PNG, JPG, WEBP até 500kb cada</p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="gallery-upload"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleGalleryUpload(Array.from(e.target.files))}
                      className="hidden"
                      disabled={uploadingImages}
                    />
                  </label>
                  <p className="text-sm text-low-medium mt-1">Imagens serão salvas diretamente no banco de dados (upload binário). Máximo 8MB por imagem.</p>
                </div>

                {/* Preview da Galeria (URLs) */}
                {(() => { console.log('DEBUG galleryImages:', JSON.stringify(galleryImages, null, 2)); return null; })()}
                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.imagem_url}
                          alt={`Galeria ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                          onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(index, img.id)}
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full"
                            title="Remover imagem"
                          >
                            <i className="fa-solid fa-trash text-sm"></i>
                          </button>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleReorderGallery(index, index - 1)}
                              className="w-8 h-8 bg-white hover:bg-cream text-low-dark rounded-full"
                              title="Mover para esquerda"
                            >
                              <i className="fa-solid fa-chevron-left text-sm"></i>
                            </button>
                          )}
                          {index < galleryImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleReorderGallery(index, index + 1)}
                              className="w-8 h-8 bg-white hover:bg-cream text-low-dark rounded-full"
                              title="Mover para direita"
                            >
                              <i className="fa-solid fa-chevron-right text-sm"></i>
                            </button>
                          )}
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Links do Projeto */}
              <div className="pt-4 border-t border-cream/40">
                <h3 className="text-low-dark text-lg font-medium mb-4">
                  <i className="fa-solid fa-link mr-2"></i>
                  Links do Projeto
                </h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="site_url" className="block text-low-dark text-base mb-2">
                      <i className="fa-solid fa-globe mr-2"></i>
                      Link do Site (se aplicável)
                    </label>
                    <input
                      type="url"
                      name="site_url"
                      id="site_url"
                      value={formData.site_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                      placeholder="https://sitedobebeto.com.br"
                    />
                    <p className="text-sm text-low-medium mt-1">
                      Se o projeto incluiu criação de site, o botão "Visitar Site" aparecerá no modal
                    </p>
                  </div>

              <div>
                <label htmlFor="link" className="block text-low-dark text-base mb-2">
                  <i className="fa-brands fa-behance mr-2"></i>
                  Link do Behance/Portfolio*
                </label>
                <input
                  type="url"
                  name="link"
                  id="link"
                  required
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                  placeholder="https://behance.net/gallery/..."
                />
              </div>

              <div>
                <label htmlFor="button_text" className="block text-low-dark text-base mb-2">
                  Texto do Botão Behance*
                </label>
                <input
                  type="text"
                  name="button_text"
                  id="button_text"
                  required
                  value={formData.button_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                  placeholder="Ver no Behance"
                />
              </div>
                </div>
              </div>

              {/* Segundo Link (Opcional) */}
              <div className="pt-4 border-t border-cream/40">
                <h3 className="text-low-dark text-lg font-medium mb-4">Link Adicional (Opcional)</h3>
                <p className="text-sm text-low-medium mb-4">Use quando o projeto tiver mais de um serviço (ex: site + identidade visual)</p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="link2" className="block text-low-dark text-base mb-2">
                      Link do Segundo Projeto
                    </label>
                    <input
                      type="url"
                      name="link2"
                      id="link2"
                      value={formData.link2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                      placeholder="https://exemplo.com/projeto2"
                    />
                  </div>

                  <div>
                    <label htmlFor="button_text2" className="block text-low-dark text-base mb-2">
                      Texto do Segundo Botão
                    </label>
                    <input
                      type="text"
                      name="button_text2"
                      id="button_text2"
                      value={formData.button_text2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                      placeholder="Ver no Behance"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="data_projeto" className="block text-low-dark text-base mb-2">
                  Data de Criação do Projeto*
                </label>
                <input
                  type="date"
                  name="data_projeto"
                  id="data_projeto"
                  required
                  value={formData.data_projeto}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="mostrar_home"
                  id="mostrar_home"
                  checked={formData.mostrar_home}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border border-cream/40 text-primary focus:ring-primary focus:ring-2"
                />
                <label htmlFor="mostrar_home" className="text-low-dark text-base cursor-pointer">
                  Exibir este projeto na página inicial (Home)
                </label>
              </div>

              <div className="flex gap-4 justify-end">
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="px-8 py-3 !bg-neutral-200 !text-neutral-800 !border-2 !border-neutral-300 hover:!bg-neutral-300"
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  className="px-8 py-3 !bg-primary !text-white hover:!bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar Projeto'}
                </Button>
              </div>
            </form>
          </div>

          {/* Lista de Projetos */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-cream/20">
            <h2 className="font-title text-2xl font-light text-low-dark mb-6">
              Projetos Cadastrados ({projects.length})
            </h2>

            {isLoading ? (
              <p className="text-center text-low-medium py-8">Carregando projetos...</p>
            ) : projects.length === 0 ? (
              <p className="text-center text-low-medium py-8">Nenhum projeto cadastrado ainda.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...projects]
                  .sort((a, b) => new Date(b.data_projeto) - new Date(a.data_projeto))
                  .map((projeto) => (
                    <div
                      key={projeto.id}
                      className="border border-cream/40 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={projeto.imagem_url || projeto.imagemUrl || '/images/placeholder.png'}
                        alt={projeto.titulo}
                        className="w-full aspect-video object-cover"
                        onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }}
                      />
                      <div className="p-4">
                        <h3 className="font-title text-xl font-light text-low-dark mb-2">
                          {projeto.titulo}
                        </h3>
                        <p className="text-sm text-low-medium mb-4 line-clamp-2">
                          {projeto.descricao}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            onClick={() => handleEdit(projeto)}
                            className="flex-1 py-2 text-sm"
                          >
                            <i className="fa-solid fa-pen mr-2"></i>
                            Editar
                          </Button>
                          <Button
                            variant="custom"
                            onClick={() => handleDelete(projeto.id)}
                            className="flex-1 py-2 text-sm !bg-red-500 !border-2 !border-red-500 !text-white hover:!bg-red-600"
                          >
                            <i className="fa-solid fa-trash mr-2"></i>
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Botões de navegação */}

      </section>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-8 right-8 z-50 min-w-[320px] max-w-[450px] p-6 bg-white rounded-xl shadow-2xl flex items-center justify-between gap-4 animate-slideInRight border-l-4 ${toastType === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          <div className="flex items-center gap-3 flex-1">
            <i className={`fa-solid text-2xl ${toastType === 'success' ? 'fa-circle-check text-green-500' : 'fa-circle-exclamation text-red-500'}`}></i>
            <span className="text-low-dark text-base">{toastMessage}</span>
          </div>
          <button
            onClick={hideToast}
            className="text-low-medium hover:text-low-dark transition-colors"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminProjetos
