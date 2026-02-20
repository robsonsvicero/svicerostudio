import React, { useState, useEffect } from 'react'
import IssoComments from '../components/Blog/GiscusComments'
import { marked } from 'marked'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import SEOHelmet from '../components/SEOHelmet'
import { formatDate } from '../utils/formatDate'

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [autor, setAutor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])

  // Facebook Comments removido: toda a lógica do SDK foi eliminada para evitar conflitos com Giscus.

  // Buscar post pelo slug
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('publicado', true)
        .single()
      if (error || !data) {
        setIsLoading(false)
        navigate('/404')
        return
      }
      setPost(data)
      
      // Buscar autor pelo nome
      if (data.autor) {
        const { data: autorData, error: autorError } = await supabase
          .from('autores')
          .select('id, nome, cargo, foto_url, bio, email')
          .eq('nome', data.autor)
          .eq('publicado', true)
          .single()
        
        if (!autorError && autorData) {
          setAutor(autorData)
        }
      }
      
      setIsLoading(false)
    }
    if (slug) fetchPost()
  }, [slug, navigate])



  // Renderizar conteúdo como Markdown
  const renderContent = (content) => (
    <div
      className="prose prose-lg max-w-none text-low-medium"
      dangerouslySetInnerHTML={{ __html: marked.parse(content || '') }}
    />
  )
// Código antigo de parsing manual removido. Agora apenas renderContent baseado em marked é usado.

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
      <div className="min-h-screen bg-cream">
        <Header variant="solid" />
        
        <article className="pt-[200px] pb-24 px-4 md:px-16">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link to="/blog" className="text-primary hover:underline font-medium">
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Voltar ao Blog
              </Link>
            </nav>

            {/* Cabeçalho do Post */}
            <header className="mb-12">
              {/* Categoria e Data */}
              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                {post.categoria && (
                  <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium">
                    {post.categoria}
                  </span>
                )}
                <span className="text-low-medium flex items-center gap-2">
                  <i className="fa-regular fa-calendar"></i>
                  {formatDate(post.data_publicacao)}
                </span>
                {post.autor && (
                  <span className="text-low-medium flex items-center gap-2">
                    <i className="fa-regular fa-user"></i>
                    {post.autor}
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="font-title text-4xl md:text-5xl font-semibold text-low-dark mb-6 leading-tight">
                {post.titulo}
              </h1>

              {/* Resumo */}
              {post.resumo && (
                <p className="text-xl text-low-medium leading-relaxed border-l-4 border-primary pl-6 py-2">
                  {post.resumo}
                </p>
              )}

              {/* Tags */}
              {post.tags && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {String(post.tags).toLowerCase().split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-default"
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
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 mb-16 border border-cream/20">
              <div className="prose prose-lg max-w-none">
                {renderContent(post.conteudo)}
              </div>
            </div>

            {/* Informações do Autor */}
            {autor && (
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 md:p-12 mb-16 border border-primary/20">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {autor.foto_url && (
                    <img
                      src={autor.foto_url}
                      alt={autor.nome}
                      className="w-20 h-20 rounded-full object-cover flex-shrink-0 border-4 border-white shadow-md"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="fa-solid fa-user text-primary"></i>
                      <h3 className="font-title text-xl font-semibold text-low-dark">
                        Sobre o Autor
                      </h3>
                    </div>
                    <p className="font-title text-lg text-low-dark mb-1">
                      {autor.nome}
                    </p>
                    <p className="text-primary font-medium mb-3">
                      {autor.cargo}
                    </p>
                    {autor.bio && (
                      <p className="text-low-medium mb-4">
                        {autor.bio}
                      </p>
                    )}
                    {autor.email && (
                      <a 
                        href={`mailto:${autor.email}`}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
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
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 mb-16 border border-cream/20">
              <IssoComments slug={slug} />
            </div>

            {/* Posts Relacionados */}
            {relatedPosts.length > 0 && (
              <section className="mt-16 pt-16 border-t border-cream/40">
                <h2 className="font-title text-3xl font-light text-low-dark mb-8">
                  Posts Relacionados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-cream/20"
                    >
                      {relatedPost.imagem_destaque && (
                        <div className="aspect-video overflow-hidden bg-cream">
                          <img
                            src={relatedPost.imagem_destaque}
                            alt={relatedPost.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-title text-lg font-light text-low-dark group-hover:text-primary transition-colors line-clamp-2">
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
