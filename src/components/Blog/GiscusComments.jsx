import React, { useEffect, useRef } from 'react'

const GiscusComments = () => {
  const ref = useRef(null)

  useEffect(() => {
    // Remove scripts antigos para evitar duplicidade
    const old = document.getElementById('giscus-script')
    if (old) old.remove()

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'robsonsvicero/blog-comments')
    script.setAttribute('data-repo-id', 'R_kgDORUOEig')
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-category-id', 'DIC_kwDORUOEis4C2zzA')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'preferred_color_scheme')
    script.setAttribute('data-lang', 'pt')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true
    script.id = 'giscus-script'
    if (ref.current) {
      ref.current.appendChild(script)
    }
  }, [])

  return (
    <section className="giscus-comments mt-12">
      <h2 className="font-title text-2xl font-light text-low-dark mb-6 pb-4 border-b border-cream/40">
        <i className="fa-regular fa-comments mr-3 text-primary"></i>
        Comentários
      </h2>
      <div ref={ref}></div>
    </section>
  )
}

export default GiscusComments
