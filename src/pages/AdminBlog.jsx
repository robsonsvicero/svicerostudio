
import React from 'react';

const AdminBlog = () => {
  return (
    <div>Teste estrutura</div>
  );
};

export default AdminBlog;

import React from 'react';

const AdminBlog = () => {
  return (
    <div>Teste estrutura</div>
  );
};

export default AdminBlog;
    }

    // Busca slugs existentes via API
    const token = localStorage.getItem('svicero_admin_token');
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/posts/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ select: 'id,slug', filters: [{ slug: { $regex: `^${baseSlug}` } }] }),
    });
    const payload = await res.json();
    if (!res.ok) throw new Error(payload.error || 'Erro ao buscar slugs');
    const existingSlugs = new Set(
      (payload.data || [])
        .filter(post => post.id !== currentPostId)
        .map(post => post.slug)
        .filter(postSlug => new RegExp(`^${baseSlug}(-\d+)?$`).test(postSlug))
    );

    if (!existingSlugs.has(baseSlug)) {
      return baseSlug
    }

    let counter = 1
    while (existingSlugs.has(`${baseSlug}-${counter}`)) {
      counter += 1
    }

    return `${baseSlug}-${counter}`
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'titulo') {
      // Atualizar título e gerar slug automaticamente
      setFormData(prev => ({ 
        ...prev, 
        titulo: value,
        slug: generateSlug(value)
      }))
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }))
    }
  }

  // Função para processar imagens coladas
  const handlePaste = async (e) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      // Verificar se é uma imagem
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault()
        
        const file = item.getAsFile()
        if (!file) continue

        try {
          // Converter imagem para base64
          const reader = new FileReader()
          reader.onload = (event) => {
            const base64 = event.target.result
            const imageMarkdown = `\n\n![Imagem colada](${base64})\n\n`
            
            // Inserir no cursor ou no final
            const textarea = e.target
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const currentValue = formData.conteudo
            const newValue = currentValue.substring(0, start) + imageMarkdown + currentValue.substring(end)
            
            setFormData(prev => ({ ...prev, conteudo: newValue }))
            
            // Reposicionar cursor após a imagem
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length
              textarea.focus()
            }, 0)
            
            showToastMessage('Imagem colada com sucesso! (base64)', 'success')
          }
          reader.readAsDataURL(file)
        } catch (error) {
          // Erro ao processar imagem
          showToastMessage('Erro ao colar imagem', 'error')
        }
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const baseSlug = generateSlug(formData.slug || formData.titulo)

      if (!baseSlug) {
        showToastMessage('Informe um título para gerar o slug', 'error')
        return
      }

      // Normalizar tags para lowercase
      const normalizedData = {
        ...formData,
        tags: formData.tags.toLowerCase(),
        slug: baseSlug
      }

      // Normalizar data_publicacao para YYYY-MM-DD (sem timezone)
      if (normalizedData.data_publicacao) {
        // Pega os 10 primeiros caracteres (YYYY-MM-DD) para garantir formato
        normalizedData.data_publicacao = String(normalizedData.data_publicacao).slice(0, 10)
      }

      if (editingId) {
        // Atualizar post existente
        const { error } = await supabase
          .from('posts')
          .update(normalizedData)
          .eq('id', editingId)

        if (error) throw error
        showToastMessage('Post atualizado com sucesso!', 'success')
      } else {
        normalizedData.slug = await getUniqueSlug(baseSlug)

        // Criar novo post
        const { error } = await supabase
          .from('posts')
          .insert([normalizedData])

        if (error) throw error

        if (normalizedData.slug !== baseSlug) {
          showToastMessage(`Post criado com sucesso! Slug ajustado para: ${normalizedData.slug}`, 'success')
        } else {
          showToastMessage('Post criado com sucesso!', 'success')
        }
      }

      // Reset form
      setFormData({
        titulo: '',
        slug: '',
        resumo: '',
        conteudo: '',
        imagem_destaque: '',
        categoria: '',
        tags: '',
        data_publicacao: '',
        autor: 'Robson Svicero',
        publicado: false
      })
      setEditingId(null)
      fetchPosts()
    } catch (error) {
      const isDuplicateSlug =
        error?.code === '23505' ||
        error?.status === 409 ||
        /duplicate|unique|slug/i.test(error?.message || '')

      if (isDuplicateSlug) {
        showToastMessage('Já existe um post com este slug. Altere o título/slug e tente novamente.', 'error')
      } else {
        showToastMessage('Erro ao salvar post', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (post) => {
    setFormData({
      titulo: post.titulo,
      slug: post.slug,
      resumo: post.resumo || '',
      conteudo: post.conteudo,
      imagem_destaque: post.imagem_destaque || '',
      categoria: post.categoria || '',
      tags: post.tags || '',
      // Ao carregar para edição, garantir YYYY-MM-DD para o input date
      data_publicacao: post.data_publicacao ? String(post.data_publicacao).slice(0, 10) : '',
      autor: post.autor,
      publicado: post.publicado
    })
    setEditingId(post.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      showToastMessage('Post excluído com sucesso!', 'success')
      fetchPosts()
    } catch (error) {
      // Erro ao excluir post
      showToastMessage('Erro ao excluir post', 'error')
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      titulo: '',
      slug: '',
      resumo: '',
      conteudo: '',
      imagem_destaque: '',
      categoria: '',
      tags: '',
      data_publicacao: '',
      autor: 'Robson Svicero',
      publicado: false
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
    <div className="min-h-screen bg-cream pt-20 pb-24 px-4 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          {/* Header com informações do usuário e navegação */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl shadow-lg p-6 border border-cream/20">
            <div className="flex-1">
              <h1 className="font-title text-4xl md:text-5xl font-semibold text-low-dark mb-2">
                Bem-vindo
              </h1>
              <p className="text-low-medium text-lg">
                <span className="text-primary font-medium">{user?.email}</span>
              </p>
            </div>
            <div className="flex gap-3">
              
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
          {/* Formulário */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-cream/20">
            <h2 className="font-title text-2xl font-light text-low-dark mb-6">
              {editingId ? 'Editar Post' : 'Novo Post'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="Título do post"
                  />
                </div>
                <div>
                  <label htmlFor="slug" className="block text-low-dark text-base mb-2">
                    Slug (URL)* <span className="text-xs text-low-medium">(gerado automaticamente)</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                    placeholder="slug-do-post"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="resumo" className="block text-low-dark text-base mb-2">
                  Resumo <span className="text-xs text-low-medium">(aparece na listagem)</span>
                </label>
                <textarea
                  name="resumo"
                  id="resumo"
                  value={formData.resumo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none min-h-[80px] resize-y"
                  placeholder="Breve descrição do post..."
                />
              </div>
              <div>
                <label htmlFor="conteudo" className="block text-low-dark text-base mb-2">
                  Conteúdo* 
                  <span className="text-xs text-low-medium ml-2">
                    (use ## para títulos, ### para subtítulos, - para listas, ![alt](url) para imagens)
                  </span>
                </label>
                <textarea
                  name="conteudo"
                  id="conteudo"
                  required
                  value={formData.conteudo}
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none min-h-[300px] resize-y font-mono"
                  placeholder="Conteúdo completo do post... Cole imagens diretamente aqui!"
                />
                <p className="text-xs text-low-medium mt-2">
                  💡 <strong>Dica:</strong> Cole imagens (Ctrl+V) diretamente no campo ou use a sintaxe: <code className="bg-primary/10 px-1 rounded">![Descrição](url-da-imagem)</code>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="imagem_destaque" className="block text-low-dark text-base mb-2">
                    URL da Imagem de Destaque
                  </label>
                  <input
                    type="url"
                    name="imagem_destaque"
                    id="imagem_destaque"
                    value={formData.imagem_destaque}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div>
                  <label htmlFor="categoria" className="block text-low-dark text-base mb-2">
                    Categoria
                  </label>
                  <select
                    name="categoria"
                    id="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Engenharia da Percepção (Branding)">Engenharia da Percepção (Branding)</option>
                    <option value="Interface & Experiência (UX)">Interface & Experiência (UX)</option>
                    <option value="Performance & Conversão">Performance & Conversão</option>
                    <option value="Estratégia de Ativos (Business & IA)">Estratégia de Ativos (Business & IA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-low-dark text-base mb-2">
                  Tags <span className="text-xs text-low-medium">(separe por vírgula)</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                  placeholder="react, design, ui, ux, figma"
                />
                <p className="text-xs text-low-medium mt-2">
                  <i className="fa-solid fa-lightbulb mr-1"></i>
                  Use tags para facilitar a busca. Exemplo: react, typescript, design system
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="data_publicacao" className="block text-low-dark text-base mb-2">
                    Data de Publicação*
                  </label>
                  <input
                    type="date"
                    name="data_publicacao"
                    id="data_publicacao"
                    required
                    value={formData.data_publicacao}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="autor" className="block text-low-dark text-base mb-2">
                    Autor*
                  </label>
                  <select
                    name="autor"
                    id="autor"
                    required
                    value={formData.autor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-cream border border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none"
                  >
                    <option value="">Selecione um autor...</option>
                    {autores.map((autor) => (
                      <option key={autor.id} value={autor.nome}>
                        {autor.nome} - {autor.cargo}
                      </option>
                    ))}
                  </select>
                  {autores.length === 0 && (
                    <p className="text-xs text-orange-600 mt-2">
                      <i className="fa-solid fa-exclamation-triangle mr-1"></i>
                      Nenhum autor disponível. <a href="/admin/autores" className="underline hover:no-underline font-medium">Crie um autor</a>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="publicado"
                  id="publicado"
                  checked={formData.publicado}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border border-cream/40 text-primary focus:ring-primary focus:ring-2"
                />
                <label htmlFor="publicado" className="text-low-dark text-base cursor-pointer">
                  Publicar este post (tornar visível no site)
                </label>
              </div>

              <div className="flex gap-4 justify-end">
                {/* Botões de ação ficam aqui, sem código JS de submit */}
              </div>
            </form>

            {/* Listagem de posts */}
            <h2 className="font-title text-2xl font-light text-low-dark mb-6">
              Posts Cadastrados ({posts.length})
            </h2>

            {isLoading ? (
              <p className="text-center text-low-medium py-8">Carregando posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-center text-low-medium py-8">Nenhum post cadastrado ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border border-cream/40 rounded-xl">
                  <thead>
                    <tr className="bg-cream/40">
                      <th className="px-4 py-3 font-medium text-low-dark">Título</th>
                      <th className="px-4 py-3 font-medium text-low-dark">Categoria</th>
                      <th className="px-4 py-3 font-medium text-low-dark">Data</th>
                      <th className="px-4 py-3 font-medium text-low-dark">Status</th>
                      <th className="px-4 py-3 font-medium text-low-dark">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-t border-cream/40 hover:bg-cream/20">
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-low-dark font-medium">{post.titulo}</p>
                            <p className="text-sm text-low-medium">/{post.slug}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-low-medium">
                          {post.categoria || '-'}
                        </td>
                        <td className="px-4 py-4 text-low-medium">
                          {formatDate(post.data_publicacao)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            post.publicado 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-neutral-200 text-neutral-600'
                          }`}>
                            {post.publicado ? 'Publicado' : 'Rascunho'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              onClick={() => handleEdit(post)}
                              className="py-2 px-4 text-sm !bg-primary !text-white !border-2 !border-primary hover:!bg-primary/90"
                            >
                              <i className="fa-solid fa-pen mr-2"></i>
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDelete(post.id)}
                              className="py-2 px-4 text-sm !bg-red-500 !border-2 !border-red-500 !text-white hover:!bg-red-600"
                            >
                              <i className="fa-solid fa-trash mr-2"></i>
                              Excluir
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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

        </div>
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
export default AdminBlog
