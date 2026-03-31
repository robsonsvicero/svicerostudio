import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import capaBlog from '../assets/capa-blog.jpg'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import SEOHelmet from '../components/SEOHelmet'
import { formatDate } from '../utils/formatDate'
import { API_URL } from '../lib/api.js'

const getEntityId = (item) => item?.id || item?._id || ''

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar posts
        const resPosts = await fetch(`${API_URL}/api/db/posts/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderBy: { data_publicacao: -1 } }),
        });
        const postsPayload = await resPosts.json();
        if (!resPosts.ok) throw new Error(postsPayload.error || 'Erro ao buscar posts');

        // Buscar autores
        const resAutores = await fetch(`${API_URL}/api/db/autores/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'select', filters: [{ column: 'publicado', operator: 'eq', value: true }] }),
        });
        const autoresPayload = await resAutores.json();
        if (!resAutores.ok) throw new Error(autoresPayload.error || 'Erro ao buscar autores');
        const autoresMap = {};
        (autoresPayload.data || []).forEach((autor) => {
          const autorId = getEntityId(autor)
          if (autorId) autoresMap[autorId] = autor.nome
        });

        // Substituir autor pelo nome correspondente (garante que sempre será nome, nunca UUID)
        const postsCorrigidos = (postsPayload.data || []).map(post => {
          let nomeAutor = '';
          if (autoresMap[post.autor]) {
            nomeAutor = autoresMap[post.autor];
          } else if (post.autor_nome) {
            nomeAutor = post.autor_nome;
          } else if (typeof post.autor === 'string' && !/^[0-9a-fA-F-]{36}$/.test(post.autor)) {
            nomeAutor = post.autor;
          } else {
            nomeAutor = 'Autor desconhecido';
          }
          return {
            ...post,
            autor: nomeAutor
          };
        });
        setPosts(postsCorrigidos);

        // Categorias, tags e autores para filtros
        const cats = new Set(['Todos']);
        const tags = new Set();
        // Adiciona apenas nomes de autores dos posts publicados (resolve nome, nunca UUID)
        const nomesAutoresPosts = new Set(postsCorrigidos.map(post => {
          if (/^[0-9a-fA-F-]{36}$/.test(post.autor)) {
            return autoresMap[post.autor] || post.autor_nome || 'Autor desconhecido';
          }
          return post.autor || post.autor_nome || 'Autor desconhecido';
        }).filter(Boolean));
        postsCorrigidos.forEach(post => {
          if (post.categoria) cats.add(post.categoria);
          if (post.tags) post.tags.split(',').forEach(t => tags.add(t.trim().toLowerCase()));
        });
        setCategories(Array.from(cats));
        setAllTags(Array.from(tags));
        setAuthors(Array.from(nomesAutoresPosts));
      } catch {
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = posts
    .filter(post => {
      const categoryMatch = selectedCategory === 'Todos' || post.categoria === selectedCategory
      const tagMatch = !selectedTag || (post.tags && post.tags.toLowerCase().split(',').map(t => t.trim()).includes(selectedTag.toLowerCase()))
      const authorMatch = !selectedAuthor || post.autor === selectedAuthor
      const searchMatch =
        !searchTerm ||
        post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.resumo && post.resumo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
      return categoryMatch && tagMatch && authorMatch && searchMatch
    })
    .sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao))

  const hasActiveFilter = selectedCategory !== 'Todos' || selectedTag || selectedAuthor || searchTerm

  const clearAllFilters = () => {
    setSelectedCategory('Todos')
    setSelectedTag('')
    setSelectedAuthor('')
    setSearchTerm('')
  }

  return (
    <>
      <SEOHelmet
        title="Insights de Engenharia Visual"
        description="Artigos e insights sobre UX Design, Estratégia de Marca e Engenharia de Percepção. O conteúdo exclusivo do Svicero Studio para quem busca o topo do mercado digital."
        keywords="blog design, tendências design, desenvolvimento web, ui ux, design thinking"
      />
      <div className="bg-dark-bg min-h-screen text-[#EFEFEF] font-body">
        <Header variant="solid" />

        {/* Hero */}
        <section className="relative flex items-center justify-center px-0 md:px-0 py-16 lg:py-32 mb-16 overflow-hidden min-h-[420px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>

          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(35,35,35,1) 0%, rgba(35,35,35,0.85) 50%, rgba(35,35,35,0.1) 100%), url(${capaBlog})`
            }}
          ></div>
          {/* Conteúdo principal */}
          <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-12 px-4 sm:px-6 lg:px-8">

            <h1 className="font-title text-4xl lg:text-6xl font-semibold tracking-[-0.05em] text-white mb-6">
              Crônicas de Design
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed">
              Conteúdos para fortalecer sua marca, inspirar sua jornada e te ajudar a dominar a arte de criar experiências digitais memoráveis.
            </p>
          </div>
        </section>

        {/* Filtros + Grid */}
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10 lg:pb-28">

          {/* Barra de Busca */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por título, conteúdo ou tags…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-2xl bg-[#181818] border border-white/10 text-white text-base placeholder-white/30 focus:border-secondary focus:outline-none transition-colors"
              />
              <i className="fa-solid fa-search absolute right-5 top-1/2 -translate-y-1/2 text-white/30 text-lg pointer-events-none"></i>
            </div>
            {searchTerm && (
              <p className="text-sm text-white/40 mt-2 text-center">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            )}
          </div>

          {/* Filtros de Categoria */}
          {categories.length > 1 && (
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                    ? 'bg-secondary text-white shadow-md'
                    : 'bg-[#181818] text-white/50 hover:text-white border border-white/10 hover:border-white/20'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Filtros de Tags */}
          {allTags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap justify-center gap-2">
                {selectedTag ? (
                  <button
                    onClick={() => setSelectedTag('')}
                    className="px-4 py-1.5 rounded-full text-sm bg-secondary text-white shadow-md hover:bg-secondary/80 transition-all flex items-center gap-2"
                  >
                    <i className="fa-solid fa-times text-xs"></i>
                    {selectedTag}
                  </button>
                ) : (
                  <>
                    <span className="px-3 py-1.5 text-sm text-white/30 flex items-center gap-1.5">
                      <i className="fa-solid fa-tag text-xs"></i>
                      Tags:
                    </span>
                    {allTags.slice(0, 10).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className="px-4 py-1.5 rounded-full text-sm bg-[#181818] text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                    {allTags.length > 10 && (
                      <span className="px-3 py-1.5 text-sm text-white/30">
                        +{allTags.length - 10}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Filtros de Autor */}
          {authors.length > 0 && (
            <div className="mb-10">
              <div className="flex flex-wrap justify-center gap-2">
                {selectedAuthor ? (
                  <button
                    onClick={() => setSelectedAuthor('')}
                    className="px-4 py-1.5 rounded-full text-sm bg-secondary text-white shadow-md hover:bg-secondary/80 transition-all flex items-center gap-2"
                  >
                    <i className="fa-solid fa-times text-xs"></i>
                    {selectedAuthor}
                  </button>
                ) : (
                  <>
                    <span className="px-3 py-1.5 text-sm text-white/30 flex items-center gap-1.5">
                      <i className="fa-solid fa-user text-xs"></i>
                      Autores:
                    </span>
                    {authors.map((author) => (
                      <button
                        key={author}
                        onClick={() => setSelectedAuthor(author)}
                        className="px-4 py-1.5 rounded-full text-sm bg-[#181818] text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                      >
                        {author}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Limpar filtros */}
          {hasActiveFilter && (
            <div className="flex justify-center mb-8">
              <button
                onClick={clearAllFilters}
                className="text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
              >
                Limpar todos os filtros
              </button>
            </div>
          )}

          {/* Grid de Posts */}
          {isLoading ? (
            <div className="text-center py-24">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-secondary"></div>
              <p className="mt-4 text-white/40 text-sm">Carregando posts…</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-24">
              <i className="fa-regular fa-newspaper text-5xl text-white/20 mb-5 block"></i>
              <p className="text-lg text-white/40">
                {!hasActiveFilter
                  ? 'Nenhum post publicado ainda.'
                  : 'Nenhum post encontrado com os filtros selecionados.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-[30px] border border-white/8 bg-[#181818] shadow-lg transition duration-300 hover:-translate-y-1 hover:border-white/14 focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {/* Imagem de Destaque */}
                  {post.imagem_destaque && (
                    <div className="aspect-video overflow-hidden bg-dark-bg">
                      <img
                        src={post.imagem_destaque}
                        alt={post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="p-7">
                    {/* Categoria e Data */}
                    <div className="flex items-center gap-3 mb-4 text-xs">
                      {post.categoria && (
                        <span className="inline-flex rounded-full border border-white/10 bg-cream/20 px-3 py-1  text-white text-xs">
                          {post.categoria}
                        </span>
                      )}
                      <span className="text-white/40">
                        {formatDate(post.data_publicacao)}
                      </span>
                    </div>

                    {/* Título */}
                    <h2 className="font-title text-xl font-semibold tracking-[-0.03em] text-white mb-3 group-hover:text-secondary transition-colors leading-snug">
                      {post.titulo}
                    </h2>

                    {/* Resumo */}
                    {post.resumo && (
                      <p className="text-white/55 text-sm mb-5 line-clamp-3 leading-relaxed">
                        {post.resumo}
                      </p>
                    )}

                    {/* Tags */}
                    {post.tags && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {post.tags.toLowerCase().split(',').slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-white/5 text-white/40 rounded text-xs"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Ler mais */}
                    <div className="flex items-center text-secondary text-sm font-medium">
                      Ler mais
                      <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </>
  )
}

export default Blog
