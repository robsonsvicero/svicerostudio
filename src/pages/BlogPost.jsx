import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import SEOHelmet from '../components/SEOHelmet'
import { formatDate } from '../utils/formatDate'
import { API_URL } from '../lib/api.js'

import Comments from '../components/Blog/Comments'

const getEntityId = (item) => item?.id || item?._id || ''
const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value || '')
const isObjectId = (value) => /^[0-9a-f]{24}$/i.test(value || '')
const isPersistedId = (value) => isUuid(value) || isObjectId(value)
const getDisplayAuthorName = (value) => (value && !isPersistedId(value) ? value : '')

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [autor, setAutor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])


  // Buscar post pelo slug
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/db/posts/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'select', filters: [{ column: 'slug', operator: 'eq', value: slug }], single: true }),
        });
        const payload = await res.json();
        if (!res.ok || !payload.data) {
          setIsLoading(false);
          navigate('/404');
          return;
        }
        setPost(payload.data);
        // Usar dados enriquecidos do autor vindos do $lookup no backend.
        if (payload.data.autor_nome || payload.data.autor_foto || payload.data.autor_cargo || payload.data.autor_bio || payload.data.autor_email) {
          setAutor({
            nome: getDisplayAuthorName(payload.data.autor_nome) || getDisplayAuthorName(payload.data.autor) || 'Autor desconhecido',
            foto_url: payload.data.autor_foto || null,
            cargo: payload.data.autor_cargo || '',
            bio: payload.data.autor_bio || '',
            email: payload.data.autor_email || '',
          });
        } else if (payload.data.autor) {
          // Fallback: buscar manualmente se não veio do backend
          let autorEncontrado = null

          const resAutores = await fetch(`${API_URL}/api/db/autores/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation: 'select' }),
          })
          const autoresPayload = await resAutores.json()

          if (resAutores.ok && Array.isArray(autoresPayload.data)) {
            autorEncontrado = autoresPayload.data.find(
              (item) => String(getEntityId(item)) === String(payload.data.autor) || item.nome === payload.data.autor,
            ) || null
          }

          if (!autorEncontrado) {
            const resAutor = await fetch(`${API_URL}/api/db/autores/query`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operation: 'select', filters: [{ column: 'nome', operator: 'eq', value: payload.data.autor }], single: true }),
            })
            const autorPayload = await resAutor.json()
            if (resAutor.ok && autorPayload.data) autorEncontrado = autorPayload.data
          }

          if (autorEncontrado) {
            setAutor(autorEncontrado)
          } else {
            setAutor({ nome: getDisplayAuthorName(payload.data.autor) || 'Autor desconhecido' })
          }
        }
      } catch {
        navigate('/404');
      }
      setIsLoading(false);
    };
    if (slug) fetchPost();
  }, [slug, navigate]);



  // Renderizar conteúdo como Markdown
  const renderContent = (content) => (
    <div className="prose prose-lg prose-invert max-w-none text-muted prose-headings:text-cream prose-a:text-copper prose-strong:text-cream">
      <Markdown>{content || ''}</Markdown>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center font-body">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-copper"></div>
          <p className="mt-4 text-muted">Carregando post...</p>
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <>
      <SEOHelmet
        title={post?.titulo || 'Insights de Engenharia Visual'}
        description={post?.resumo || 'Leia mais sobre design, desenvolvimento e estratégia digital no Svicero Studio.'}
        keywords={post?.tags || 'design, desenvolvimento, tecnologia'}
        ogImage={post?.imagem_capa || '/images/og-image.jpg'}
        ogType="article"
      />
      <div className="min-h-screen bg-charcoal font-body relative overflow-hidden">
        {/* Background lighting effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-copper/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-copper/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4" />

        <Header variant="solid" />

        <article className="pt-32 pb-24 px-4 md:px-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-10">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-cream transition-colors uppercase tracking-widest font-mono font-medium"
              >
                <i className="fa-solid fa-arrow-left text-[10px]"></i>
                Voltar ao Blog
              </Link>
            </nav>

            {/* Cabeçalho do Post */}
            <header className="mb-12">
              {/* Categoria e Data */}
              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
                {post.categoria && (
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[12px] font-mono uppercase tracking-[.2em] text-copper">
                    <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
                    {post.categoria}
                  </span>
                )}
                <span className="text-muted/70 font-mono tracking-widest text-[11px] uppercase flex items-center gap-2">
                  <i className="fa-regular fa-calendar opacity-50"></i>
                  {formatDate(post.data_publicacao)}
                </span>
                {autor && autor.nome && (
                  <span className="text-muted/70 font-mono tracking-widest text-[11px] uppercase flex items-center gap-2">
                    <i className="fa-regular fa-user opacity-50"></i>
                    {autor.nome}
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-cream mb-8 text-balance">
                {post.titulo}
              </h1>

              {/* Resumo */}
              {post.resumo && (
                <p className="text-xl font-normal leading-[1.7] text-muted border-l-2 border-copper pl-8 py-2 max-w-3xl">
                  {post.resumo}
                </p>
              )}

              {/* Tags */}
              {post.tags && (
                <div className="flex flex-wrap gap-2 mt-8">
                  {String(post.tags).toLowerCase().split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/5 border border-white/10 text-muted rounded-full text-[12px] font-mono tracking-wider hover:border-copper/40 hover:text-copper transition-all cursor-default"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Imagem de Destaque */}
            {post.imagem_destaque && (
              <div className="mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
                <img
                  src={post.imagem_destaque}
                  alt={post.titulo}
                  className="w-full h-auto object-cover max-h-[600px]"
                />
              </div>
            )}

            {/* Conteúdo do Post */}
            <div className="bg-[#141414]/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 mb-12 border border-white/5 shadow-2xl">
              {renderContent(post.conteudo)}
            </div>

            {/* Informações do Autor */}
            {autor && autor.nome && (
              <div className="bg-[#141414]/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 mb-12 border border-white/5 shadow-xl">
                <p className="text-[10px] font-mono tracking-widest text-copper uppercase mb-8 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-copper/30"></span>
                  Sobre o Autor
                </p>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {autor.foto_url ? (
                    <img
                      src={autor.foto_url}
                      alt={autor.nome}
                      className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 border border-white/10 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-copper/10 border border-copper/20 flex items-center justify-center text-copper text-2xl font-bold flex-shrink-0">
                      {autor.nome[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-2xl font-medium text-cream mb-2">
                      {autor.nome}
                    </p>
                    <p className="text-xs text-copper/80 mb-4 font-mono tracking-widest uppercase">
                      {autor.cargo?.trim() || 'Cargo nao informado'}
                    </p>
                    <p className="text-base font-normal leading-[1.6] text-muted mb-6 max-w-2xl">
                      {autor.bio?.trim() || 'Biografia em atualizacao.'}
                    </p>
                    {autor.email?.trim() ? (
                      <a
                        href={`mailto:${autor.email}`}
                        className="inline-flex items-center gap-2 text-sm text-cream hover:text-copper transition-all font-mono tracking-wider"
                      >
                        <i className="fa-solid fa-envelope text-copper opacity-80"></i>
                        {autor.email}
                      </a>
                    ) : (
                      <p className="inline-flex items-center gap-2 text-sm text-muted/50 font-mono">
                        <i className="fa-solid fa-envelope opacity-30"></i>
                        E-mail nao informado
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Seção de Comentários */}
            <div className="bg-[#141414]/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 mb-16 border border-white/5 shadow-xl">
              <Comments slug={slug} />
            </div>

            {/* Posts Relacionados */}
            {relatedPosts.length > 0 && (
              <section className="pt-16 border-t border-white/5">
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-10 flex items-center gap-4">
                  Posts Relacionados
                  <span className="flex-1 h-[1px] bg-white/5"></span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="group bg-[#141414]/60 backdrop-blur-sm rounded-[2rem] border border-white/5 shadow-lg hover:border-copper/30 transition-all duration-500 overflow-hidden hover:-translate-y-2"
                    >
                      {relatedPost.imagem_destaque && (
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={relatedPost.imagem_destaque}
                            alt={relatedPost.titulo}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-base font-medium tracking-tight text-cream group-hover:text-copper transition-colors line-clamp-2 mb-4 leading-snug">
                          {relatedPost.titulo}
                        </h3>
                        <span className="text-[10px] text-muted font-mono tracking-widest uppercase opacity-60">
                          {formatDate(relatedPost.data_publicacao)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>

        <Footer />
      </div>
    </>
  )
}

export default BlogPost
