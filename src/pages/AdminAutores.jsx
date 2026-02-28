import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/UI/Button'
import { useToast } from '../hooks/useToast'
import Toast from '../components/UI/Toast'

const AdminAutores = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [autores, setAutores] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [imagemParaCrop, setImagemParaCrop] = useState(null)
  const [cropZoom, setCropZoom] = useState(1)
  const [cropPositionX, setCropPositionX] = useState(0)
  const [cropPositionY, setCropPositionY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast()

  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    foto_url: '',
    bio: '',
    email: '',
    publicado: true
  })

  // Buscar autores
  const fetchAutores = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('svicero_admin_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/autores/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderBy: { column: 'created_at', ascending: false } }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao buscar autores');
      setAutores(payload.data || []);
    } catch (error) {
      showToastMessage('Erro ao carregar autores', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAutores()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Função para processar imagens coladas ou selecionadas
  const handleImageChange = async (e) => {
    const file = e.target?.files?.[0] || e.clipboardData?.items?.[0]?.getAsFile()
    
    if (!file) return

    try {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        showToastMessage('Por favor, selecione uma imagem válida', 'error')
        return
      }

      // Converter imagem para base64
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target.result
        
        // Carregar imagem para obter dimensões e calcular zoom
        const img = new Image()
        img.onload = () => {
          const containerSize = 400
          // Calcular zoom de "cover" para preencher o quadrado
          const coverScale = Math.max(containerSize / img.width, containerSize / img.height)
          
          // Calcular offsets iniciais para centralizar a imagem
          const scaledWidth = img.width * coverScale
          const scaledHeight = img.height * coverScale
          const initialOffsetX = (containerSize - scaledWidth) / 2
          const initialOffsetY = (containerSize - scaledHeight) / 2
          
          setImagemParaCrop(base64)
          setShowCropModal(true)
          setCropZoom(coverScale)
          setCropPositionX(initialOffsetX)
          setCropPositionY(initialOffsetY)
          showToastMessage('Imagem carregada! Agora posicione e ajuste o zoom', 'success')
        }
        img.src = base64
      }
      reader.readAsDataURL(file)
    } catch (error) {
      showToastMessage('Erro ao processar imagem', 'error')
    }
  }

  // Função para colar imagem
  const handlePaste = async (e) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault()
        const file = items[i].getAsFile()
        if (file) {
          handleImageChange({ target: { files: [file] } })
        }
      }
    }
  }

  // Funções de crop
  const handleCropMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - cropPositionX, y: e.clientY - cropPositionY })
  }

  const handleCropMouseMove = (e) => {
    if (!isDragging) return
    
    setCropPositionX(e.clientX - dragStart.x)
    setCropPositionY(e.clientY - dragStart.y)
  }

  const handleCropMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomChange = (e) => {
    setCropZoom(parseFloat(e.target.value))
  }

  const gerarCrop = () => {
    // Criar um canvas com tamanho quadrado (para foto de perfil)
    const canvas = document.createElement('canvas')
    const size = 400 // Tamanho quadrado 400x400
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext('2d')
    
    // Criar imagem
    const img = new Image()
    img.onload = () => {
      // Limpar canvas com fundo branco
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size, size)

      // Calcular dimensões escaladas
      const scaledWidth = img.width * cropZoom
      const scaledHeight = img.height * cropZoom
      
      // Calcular posição final: centralização + ajustes do usuário
      const drawX = (size - scaledWidth) / 2 + cropPositionX
      const drawY = (size - scaledHeight) / 2 + cropPositionY
      
      // Desenhar a imagem escalada e posicionada
      ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight)

      // Converter canvas para base64
      const croppedImage = canvas.toDataURL('image/jpeg', 0.9)
      setFormData(prev => ({ ...prev, foto_url: croppedImage }))
      setFotoPreview(croppedImage)
      setShowCropModal(false)
      setImagemParaCrop(null)
      showToastMessage('Imagem posicionada com sucesso!', 'success')
    }
    img.src = imagemParaCrop
  }

  const cancelCrop = () => {
    setShowCropModal(false)
    setImagemParaCrop(null)
    setCropZoom(1)
    setCropPositionX(0)
    setCropPositionY(0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.nome || !formData.cargo) {
        showToastMessage('Nome e cargo são obrigatórios', 'error')
        setIsSubmitting(false)
        return
      }

      if (editingId) {
        // Atualizar autor existente
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/autores/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'update', filters: [{ column: 'id', operator: 'eq', value: editingId }], payload: formData }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Erro ao atualizar autor');
        showToastMessage('Autor atualizado com sucesso!', 'success');
      } else {
        // Criar novo autor
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/autores/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'insert', payload: formData }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Erro ao criar autor');
        showToastMessage('Autor criado com sucesso!', 'success');
      }

      // Reset form
      setFormData({
        nome: '',
        cargo: '',
        foto_url: '',
        bio: '',
        email: '',
        publicado: true
      })
      setFotoPreview(null)
      setEditingId(null)
      fetchAutores()
    } catch (error) {
      showToastMessage('Erro ao salvar autor', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (autor) => {
    setFormData({
      nome: autor.nome,
      cargo: autor.cargo,
      foto_url: autor.foto_url || '',
      bio: autor.bio || '',
      email: autor.email || '',
      publicado: autor.publicado
    })
    setFotoPreview(autor.foto_url || null)
    setEditingId(autor.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este autor?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/autores/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'delete', filters: [{ column: 'id', operator: 'eq', value: id }] }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao excluir autor');
      showToastMessage('Autor excluído com sucesso!', 'success');
      fetchAutores();
    } catch (error) {
      showToastMessage('Erro ao excluir autor', 'error');
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      nome: '',
      cargo: '',
      foto_url: '',
      bio: '',
      email: '',
      publicado: true
    })
    setFotoPreview(null)
    setEditingId(null)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      showToastMessage('Erro ao sair', 'error')
    }
  }

  return (
    <div className="bg-cream min-h-screen">
      <Toast 
        message={toastMessage} 
        type={toastType} 
        show={showToast} 
        onClose={hideToast}
      />

      <main className="pt-20 pb-20 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
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
                Gerenciar Autores
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-6">
                  {editingId ? 'Editar Autor' : 'Novo Autor'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Foto */}
                  <div>
                    <label className="block text-sm font-medium text-low-dark mb-2">
                      Foto do Autor
                    </label>
                    <div className="mb-3">
                      {fotoPreview && (
                        <div className="relative group">
                          <img
                            src={fotoPreview}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagemParaCrop(fotoPreview)
                              setShowCropModal(true)
                            }}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity"
                          >
                            <i className="fa-solid fa-crop text-white text-2xl"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      onPaste={handlePaste}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-low-medium mt-1">
                      Você pode colar uma imagem (Ctrl+V)
                    </p>
                    {fotoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagemParaCrop(fotoPreview)
                          setShowCropModal(true)
                        }}
                        className="mt-2 w-full px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors text-sm font-medium"
                      >
                        <i className="fa-solid fa-crop mr-2"></i>
                        Posicionar Imagem
                      </button>
                    )}
                  </div>

                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-low-dark mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      placeholder="Nome completo"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-low-dark placeholder-gray-500"
                      required
                    />
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="block text-sm font-medium text-low-dark mb-2">
                      Cargo *
                    </label>
                    <input
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      placeholder="Ex: Designer, Desenvolvedor"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-low-dark placeholder-gray-500"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-low-dark mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@exemplo.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-low-dark placeholder-gray-500"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-low-dark mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Descrição breve sobre o autor"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-low-dark placeholder-gray-500"
                    />
                  </div>

                  {/* Publicado */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="publicado"
                      name="publicado"
                      checked={formData.publicado}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                    />
                    <label htmlFor="publicado" className="text-sm font-medium text-low-dark">
                      Publicado
                    </label>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                    >
                      {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 text-low-dark rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Lista de Autores */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-low-medium">Carregando autores...</p>
                </div>
              ) : autores.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <i className="fa-solid fa-user-tie text-4xl text-low-light mb-4"></i>
                  <p className="text-low-medium">Nenhum autor criado ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {autores.map((autor) => (
                    <div
                      key={autor.id}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex gap-4">
                        {autor.foto_url && (
                          <img
                            src={autor.foto_url}
                            alt={autor.nome}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-title text-xl font-semibold text-low-dark">
                                {autor.nome}
                              </h3>
                              <p className="text-primary font-medium text-sm">
                                {autor.cargo}
                              </p>
                              {autor.email && (
                                <p className="text-low-medium text-sm mt-1">
                                  <i className="fa-solid fa-envelope mr-2"></i>
                                  {autor.email}
                                </p>
                              )}
                              {autor.bio && (
                                <p className="text-low-medium text-sm mt-2 line-clamp-2">
                                  {autor.bio}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-3 text-xs">
                                {autor.publicado ? (
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                    <i className="fa-solid fa-check mr-1"></i>
                                    Publicado
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                                    <i className="fa-solid fa-ban mr-1"></i>
                                    Não publicado
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(autor)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors font-medium text-sm"
                              >
                                <i className="fa-solid fa-edit"></i>
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(autor.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors font-medium text-sm"
                              >
                                <i className="fa-solid fa-trash"></i>
                                Excluir
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Crop */}
      {showCropModal && imagemParaCrop && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="font-title text-2xl font-semibold text-low-dark">
                Posicionar Foto
              </h3>
              <button
                onClick={cancelCrop}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Área de Crop */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-low-dark">
                  Arraste a imagem para posicionar dentro do quadrado
                </label>
                <div
                  className="w-full aspect-square bg-gray-100 border-2 border-gray-300 rounded-xl overflow-hidden cursor-move relative"
                  onMouseDown={handleCropMouseDown}
                  onMouseMove={handleCropMouseMove}
                  onMouseUp={handleCropMouseUp}
                  onMouseLeave={handleCropMouseUp}
                  style={{ userSelect: 'none' }}
                >
                  <img
                    src={imagemParaCrop}
                    alt="Crop preview"
                    onMouseDown={handleCropMouseDown}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: `scale(${cropZoom}) translate(${cropPositionX}px, ${cropPositionY}px)`,
                      cursor: isDragging ? 'grabbing' : 'grab',
                      transformOrigin: 'center',
                      transition: isDragging ? 'none' : 'transform 0.1s ease'
                    }}
                    draggable={false}
                  />
                  
                  {/* Grade de referência */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: `
                      linear-gradient(to right, transparent 33.33%, rgba(255,255,255,0.1) 33.33%, rgba(255,255,255,0.1) 66.66%, transparent 66.66%),
                      linear-gradient(to bottom, transparent 33.33%, rgba(255,255,255,0.1) 33.33%, rgba(255,255,255,0.1) 66.66%, transparent 66.66%)
                    `,
                    backgroundSize: '100% 100%'
                  }}></div>
                </div>
              </div>

              {/* Controle de Zoom */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-low-dark">
                  Zoom: {Math.round(cropZoom * 100)}%
                </label>
                <div className="flex items-center gap-4">
                  <i className="fa-solid fa-minus text-gray-400"></i>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={cropZoom}
                    onChange={handleZoomChange}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <i className="fa-solid fa-plus text-gray-400"></i>
                </div>
              </div>

              {/* Dica */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <i className="fa-solid fa-lightbulb mr-2"></i>
                  <strong>Dica:</strong> Arraste a imagem para posicionar o rosto no centro do quadrado. Use o zoom para ajustar o tamanho.
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={cancelCrop}
                  className="px-6 py-2 border border-gray-300 text-low-dark rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={gerarCrop}
                  className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium"
                >
                  <i className="fa-solid fa-check mr-2"></i>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAutores
