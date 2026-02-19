import React, { useEffect, useRef } from 'react'

const IssoComments = () => {
  const ref = useRef(null)

  useEffect(() => {
    // Remove scripts antigos para evitar duplicidade
    const old = document.getElementById('isso-script')
    if (old) old.remove()

    // Adiciona o script do Isso
    const script = document.createElement('script')
    script.src = 'https://isso.svicerostudio.com.br/js/embed.min.js'
    script.async = true
    script.id = 'isso-script'
    if (ref.current) {
      ref.current.appendChild(script)
    }
  }, [])

  return (
    <section className="isso-comments mt-12">
      <h2 className="font-title text-2xl font-light text-low-dark mb-6 pb-4 border-b border-cream/40">
        <i className="fa-regular fa-comments mr-3 text-primary"></i>
        Comentários
      </h2>
      <div ref={ref}>
        <div id="isso-thread"></div>
      </div>
    </section>
  )
}

export default IssoComments
