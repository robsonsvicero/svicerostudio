import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/UI/Button'
import { useToast } from '../hooks/useToast'
import Toast from '../components/UI/Toast'

const AdminProjetos = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast()

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem_url: '',
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
      setIsLoading(true)
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      // Erro ao buscar projetos
      showToastMessage('Erro ao carregar projetos', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjetos()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId) {
        // Atualizar projeto existente
        const { error } = await supabase
          .from('projetos')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
        showToastMessage('Projeto atualizado com sucesso!', 'success')
      } else {
        // Criar novo projeto
        const { error } = await supabase
          .from('projetos')
          .insert([formData])

        if (error) throw error
        showToastMessage('Projeto criado com sucesso!', 'success')
      }

      // Reset form
      setFormData({
        titulo: '',
        descricao: '',
        imagem_url: '',
        link: '',
        button_text: 'Ver Projeto',
        link2: '',
        button_text2: '',
        data_projeto: '',
        mostrar_home: true
      })
      setEditingId(null)
      fetchProjetos()
    } catch (error) {
      // Erro ao salvar projeto
      showToastMessage('Erro ao salvar projeto', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (projeto) => {
    setFormData({
      titulo: projeto.titulo,
      descricao: projeto.descricao,
      imagem_url: projeto.imagem_url,
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
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return

    try {
      const { error } = await supabase
        .from('projetos')
        .delete()
        .eq('id', id)

      if (error) throw error
      showToastMessage('Projeto excluído com sucesso!', 'success')
      fetchProjetos()
    } catch (error) {
      // Erro ao excluir projeto
      showToastMessage('Erro ao excluir projeto', 'error')
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      titulo: '',
      descricao: '',
      imagem_url: '',
      link: '',
      button_text: 'Ver Projeto',
      link2: '',
      button_text2: '',
      data_projeto: '',
      mostrar_home: true
    })
    setEditingId(null)
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
                variant="primary"
                onClick={() => navigate('/admin/blog')}
                className="px-6 py-2 bg"
              >
                <i className="fa-solid fa-blog mr-2"></i>
                Gerenciar Blog
              </Button>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="px-6 py-2 !bg-red-500 !border-2 !border-red-500 !text-white hover:!bg-red-600"
              >
                <i className="fa-solid fa-right-from-bracket mr-2"></i>
                Sair
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
                  Descrição*
                </label>
                <textarea
                  name="descricao"
                  id="descricao"
                  required
                  value={formData.descricao}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none min-h-[120px] resize-y"
                  placeholder="Descrição do projeto"
                />
              </div>

              <div>
                <label htmlFor="imagem_url" className="block text-low-dark text-base mb-2">
                  URL da Imagem*
                </label>
                <input
                  type="url"
                  name="imagem_url"
                  id="imagem_url"
                  required
                  value={formData.imagem_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div>
                <label htmlFor="link" className="block text-low-dark text-base mb-2">
                  Link do Projeto*
                </label>
                <input
                  type="url"
                  name="link"
                  id="link"
                  required
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                  placeholder="https://exemplo.com"
                />
              </div>

              <div>
                <label htmlFor="button_text" className="block text-low-dark text-base mb-2">
                  Texto do Botão*
                </label>
                <input
                  type="text"
                  name="button_text"
                  id="button_text"
                  required
                  value={formData.button_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                  placeholder="Ver Projeto"
                />
              </div>

              {/* Segundo Link (Opcional) */}
              <div className="pt-4 border-t border-cream/40">
                <h3 className="text-low-dark text-lg font-medium mb-4">Segundo Link (Opcional)</h3>
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
                {projects.map((projeto) => (
                  <div
                    key={projeto.id}
                    className="border border-cream/40 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={projeto.imagem_url}
                      alt={projeto.titulo}
                      className="w-full aspect-video object-cover"
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
                          variant="outline"
                          onClick={() => handleEdit(projeto)}
                          className="flex-1 py-2 text-sm !bg-primary !text-white !border-2 !border-primary hover:!bg-primary/90"
                        >
                          <i className="fa-solid fa-pen mr-2"></i>
                          Editar
                        </Button>
                        <Button
                          variant="outline"
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
        <div className="max-w-screen-xl mx-auto mt-12 mb-8 flex flex-col sm:flex-row justify-center gap-4 px-4 md:px-16">
          <Button href="/admin" variant="primary">
            <i className="fa-solid fa-gauge-high mr-2"></i>
            Voltar ao Dashboard
          </Button>
          <Button href="/" variant="secondary">
            <i className="fa-solid fa-home mr-2"></i>
            Ir para o Site
          </Button>
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-8 right-8 z-50 min-w-[320px] max-w-[450px] p-6 bg-white rounded-xl shadow-2xl flex items-center justify-between gap-4 animate-slideInRight border-l-4 ${toastType === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          <div className="flex items-center gap-3 flex-1">
            <i className={`fa-solid text-2xl ${toastType === 'success' ? 'fa-circle-check text-green-500' : 'fa-circle-exclamation text-red-500'}`}></i>
            <span className="text-low-dark text-base">{toastMessage}</span>
          </div>
          <button
            onClick={() => setShowToast(false)}
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
