import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import SEOHelmet from '../components/SEOHelmet'
import { formatDate } from '../utils/formatDate'
import { API_URL } from '../lib/api.js'

import Comments from '../components/Blog/Comments'

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
        // Usar autor_nome e autor_foto do post se existirem (via $lookup do backend)
        if (payload.data.autor_nome || payload.data.autor_foto) {
          setAutor({
            nome: payload.data.autor_nome || payload.data.autor || 'Autor desconhecido',
            foto_url: payload.data.autor_foto || null,
          });
        } else if (payload.data.autor) {
          // Fallback: buscar manualmente se não veio do backend
          let resAutor, autorPayload;
          resAutor = await fetch(`${API_URL}/api/db/autores/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation: 'select', filters: [{ column: 'id', operator: 'eq', value: payload.data.autor }], single: true }),
          });
          autorPayload = await resAutor.json();
          if (!(resAutor.ok && autorPayload.data)) {
            resAutor = await fetch(`${API_URL}/api/db/autores/query`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operation: 'select', filters: [{ column: 'nome', operator: 'eq', value: payload.data.autor }], single: true }),
            });
            autorPayload = await resAutor.json();
          }
          if (resAutor.ok && autorPayload.data) {
            setAutor(autorPayload.data);
          } else {
            setAutor({ nome: payload.data.autor });
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
    <div className="prose prose-lg prose-invert max-w-none">
      <Markdown>{content || ''}</Markdown>
    </div>
  )

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            <p className="mt-4 text-low-medium">Carregando post...</p>
          </div>
        </div>
      </>
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
      <div className="min-h-screen bg-dark-bg font-body">
        <Header variant="solid" />
        
        <article className="pt-[200px] pb-24 px-4 md:px-16">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link to="/blog" className="text-secondary hover:underline font-medium">
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Voltar ao Blog
              </Link>
            </nav>

            {/* Cabeçalho do Post */}
            <header className="mb-12">
              {/* Categoria e Data */}
              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                {post.categoria && (
                  <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full font-medium">
                    {post.categoria}
                  </span>
                )}
                <span className="text-low-medium flex items-center gap-2">
                  <i className="fa-regular fa-calendar"></i>
                  {formatDate(post.data_publicacao)}
                </span>
                {autor && autor.nome && (
                  <span className="text-low-medium flex items-center gap-2">
                    <i className="fa-regular fa-user"></i>
                    {autor.nome}
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="font-title text-4xl md:text-5xl font-semibold text-low-dark mb-6 leading-tight">
                {post.titulo}
              </h1>

              {/* Resumo */}
              {post.resumo && (
                <p className="text-xl text-low-medium leading-relaxed border-l-4 border-secondary pl-6 py-2">
                  {post.resumo}
                </p>
              )}

              {/* Tags */}
              {post.tags && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {String(post.tags).toLowerCase().split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-secondary/10 text-secondary rounded-lg text-sm font-medium hover:bg-secondary hover:text-white transition-colors cursor-default"
                    >
                      <i className="fa-solid fa-tag mr-2"></i>
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Imagem de Destaque */}
            {post.imagem_destaque && (
              <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={post.imagem_destaque}
                  alt={post.titulo}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Conteúdo do Post */}
            <div className="bg-gelo rounded-xl p-8 md:p-12 mb-16 border border-white/8">
              {renderContent(post.conteudo)}
            </div>

            {/* Informações do Autor */}
            {autor && autor.nome && (
              <div className="bg-gelo rounded-xl p-8 md:p-12 mb-16 border border-white/8">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {autor.foto_url ? (
                    <img
                      src={autor.foto_url}
                      alt={autor.nome}
                      className="w-20 h-20 rounded-full object-cover flex-shrink-0 border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 border-4 border-white shadow-md">
                      {autor.nome[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="fa-solid fa-user text-secondary"></i>
                      <h3 className="font-title text-xl font-semibold text-low-dark">
                        Sobre o Autor
                      </h3>
                    </div>
                    <p className="font-title text-lg text-low-dark mb-1">
                      {autor.nome}
                    </p>
                    {autor.cargo && (
                      <p className="text-secondary font-medium mb-3">
                        {autor.cargo}
                      </p>
                    )}
                    {autor.bio && (
                      <p className="text-low-medium mb-4">
                        {autor.bio}
                      </p>
                    )}
                    {autor.email && (
                      <a 
                        href={`mailto:${autor.email}`}
                        className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors font-medium"
                      >
                        <i className="fa-solid fa-envelope"></i>
                        {autor.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Seção de Comentários - Isso */}
            <div className="bg-gelo rounded-xl p-8 md:p-12 mb-16 border border-white/8">
              <Comments slug={slug} />
            </div>

            {/* Posts Relacionados */}
            {relatedPosts.length > 0 && (
              <section className="mt-16 pt-16 border-t border-white/10">
                <h2 className="font-title text-3xl font-light text-low-dark mb-8">
                  Posts Relacionados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="group bg-gelo rounded-xl hover:border-secondary/30 transition-all duration-300 overflow-hidden border border-white/8"
                    >
                      {relatedPost.imagem_destaque && (
                        <div className="aspect-video overflow-hidden bg-dark-bg">
                          <img
                            src={relatedPost.imagem_destaque}
                            alt={relatedPost.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-title text-lg font-light text-low-dark group-hover:text-secondary transition-colors line-clamp-2">
                          {relatedPost.titulo}
                        </h3>
                        <span className="text-sm text-low-medium mt-2 block">
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
