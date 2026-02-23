import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import SEOHelmet from '../components/SEOHelmet'
import { formatDate } from '../utils/formatDate'

// Imagem do Hero
import capaBlog from '../images/capa-blog.jpg'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [categories, setCategories] = useState(['Todos'])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [allTags, setAllTags] = useState([])
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [authors, setAuthors] = useState([])

  // Buscar posts e autores via API REST
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/posts/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderBy: { data_publicacao: -1 } }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Erro ao buscar posts');
        setPosts(payload.data || []);
        // Extrair categorias e tags
        const cats = new Set(['Todos']);
        const tags = new Set();
        const authorsSet = new Set();
        (payload.data || []).forEach(post => {
          if (post.categoria) cats.add(post.categoria);
          if (post.tags) post.tags.split(',').forEach(t => tags.add(t.trim().toLowerCase()));
          if (post.autor) authorsSet.add(post.autor);
        });
        setCategories(Array.from(cats));
        setAllTags(Array.from(tags));
        setAuthors(Array.from(authorsSet));
      } catch (error) {
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Filtrar posts por categoria, tags, autor e busca
  const filteredPosts = posts.filter(post => {
    // Filtro de categoria
    const categoryMatch = selectedCategory === 'Todos' || post.categoria === selectedCategory
    
    // Filtro de tag (normalizar para lowercase)
    const tagMatch = !selectedTag || (post.tags && post.tags.toLowerCase().split(',').map(t => t.trim()).includes(selectedTag.toLowerCase()))
    
    // Filtro de autor
    const authorMatch = !selectedAuthor || post.autor === selectedAuthor
    
    // Filtro de busca (título, resumo ou conteúdo)
    const searchMatch = !searchTerm || 
      post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.resumo && post.resumo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      post.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
    
    return categoryMatch && tagMatch && authorMatch && searchMatch
  })

  // Formatar data
  // Usa `formatDate` de `src/utils/formatDate.js`

  return (
    <>
      <SEOHelmet 
        title="Insights de Engenharia Visual"
        description="Artigos e insights sobre UX Design, Estratégia de Marca e Engenharia de Percepção. O conteúdo exclusivo do Svicero Studio para quem busca o topo do mercado digital."
        keywords="blog design, tendências design, desenvolvimento web, ui ux, design thinking"
      />
      <div className="min-h-screen bg-cream">
        <Header variant="solid" />

        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          {/* Imagem de fundo */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${capaBlog})` }}
          >
            {/* 
            Overlay escuro */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/70 via-dark-bg/60 to-dark-bg/80"></div> */}
          </div>
          
          {/* Conteúdo do Hero */}
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="font-title text-4xl lg:text-6xl font-semibold text-primary mb-6 leading-tight">
              Crônicas de Design
            </h1>
            <p className="text-xl md:text-2xl text-primary/80 max-w-2xl mx-auto leading-relaxed font-light">
              Insights sobre design, desenvolvimento e criatividade
            </p>
          </div>
        </section>
        
        <section className="py-24 px-4 md:px-16">
          <div className="max-w-screen-xl mx-auto">

            {/* Barra de Busca */}
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar posts por título, conteúdo ou tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pr-12 rounded-xl bg-white border-2 border-cream/40 text-low-dark text-base focus:border-primary focus:outline-none shadow-sm"
                />
                <i className="fa-solid fa-search absolute right-5 top-1/2 -translate-y-1/2 text-low-medium text-lg"></i>
              </div>
              {searchTerm && (
                <p className="text-sm text-low-medium mt-2 text-center">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                </p>
              )}
            </div>

            {/* Filtros de Tags */}
            {allTags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag('')}
                      className="px-4 py-2 rounded-full text-sm bg-primary text-white shadow-md hover:bg-primary/90 transition-all"
                    >
                      <i className="fa-solid fa-times mr-2"></i>
                      {selectedTag}
                    </button>
                  )}
                  {!selectedTag && (
                    <>
                      <span className="px-4 py-2 text-sm text-low-medium flex items-center">
                        <i className="fa-solid fa-tag mr-2"></i>
                        Tags:
                      </span>
                      {allTags.slice(0, 10).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className="px-4 py-2 rounded-full text-sm bg-white text-low-medium hover:bg-primary hover:text-white border border-cream/40 transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                      {allTags.length > 10 && (
                        <span className="px-4 py-2 text-sm text-low-medium">
                          +{allTags.length - 10} tags
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Filtros de Categoria */}
            {categories.length > 1 && (
              <div className="mb-8 flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-low-medium hover:bg-primary/10 border border-cream/40'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {/* Filtros de Autor */}
            {authors.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedAuthor && (
                    <button
                      onClick={() => setSelectedAuthor('')}
                      className="px-4 py-2 rounded-full text-sm bg-primary text-white shadow-md hover:bg-primary/90 transition-all"
                    >
                      <i className="fa-solid fa-times mr-2"></i>
                      {selectedAuthor}
                    </button>
                  )}
                  {!selectedAuthor && (
                    <>
                      <span className="px-4 py-2 text-sm text-low-medium flex items-center">
                        <i className="fa-solid fa-user mr-2"></i>
                        Autores:
                      </span>
                      {authors.map((author) => (
                        <button
                          key={author}
                          onClick={() => setSelectedAuthor(author)}
                          className="px-4 py-2 rounded-full text-sm bg-white text-low-medium hover:bg-primary hover:text-white border border-cream/40 transition-all"
                        >
                          {author}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Grid de Posts */}
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-low-medium">Carregando posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <i className="fa-regular fa-newspaper text-6xl text-low-light mb-4"></i>
                <p className="text-xl text-low-medium">
                  {selectedCategory === 'Todos' && !selectedAuthor && !selectedTag
                    ? 'Nenhum post publicado ainda.' 
                    : `Nenhum post encontrado com os filtros selecionados.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-cream/20"
                  >
                    {/* Imagem de Destaque */}
                    {post.imagem_destaque && (
                      <div className="aspect-video overflow-hidden bg-cream">
                        <img
                          src={post.imagem_destaque}
                          alt={post.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      {/* Categoria e Data */}
                      <div className="flex items-center gap-3 mb-3 text-sm">
                        {post.categoria && (
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                            {post.categoria}
                          </span>
                        )}
                        <span className="text-low-medium">
                          {formatDate(post.data_publicacao)}
                        </span>
                      </div>

                      {/* Título */}
                      <h2 className="font-title text-2xl font-light text-low-dark mb-3 group-hover:text-primary transition-colors">
                        {post.titulo}
                      </h2>

                      {/* Resumo */}
                      {post.resumo && (
                        <p className="text-low-medium mb-4 line-clamp-3 leading-relaxed">
                          {post.resumo}
                        </p>
                      )}

                      {/* Tags */}
                      {post.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.toLowerCase().split(',').slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-cream text-low-medium rounded text-xs"
                            >
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Link de Leitura */}
                      <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                        Ler mais
                        <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

export default Blog
