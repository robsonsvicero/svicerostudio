import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import { API_URL } from '../lib/api';


const FAQ = () => {
  const [perguntas, setPerguntas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/faq`)
      .then(res => res.json())
      .then(data => {
        let faqs = Array.isArray(data) ? data : [];
        faqs = faqs.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
        setPerguntas(faqs);
        setLoading(false);
      })
      .catch(() => {
        setPerguntas([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-dark-bg min-h-screen flex flex-col text-[#EFEFEF] font-body">
      <Header variant="solid" />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-14 sm:pb-16 lg:px-10 lg:pb-24 text-center mt-20 lg:mt-36">
          <h1 className="font-title text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-white lg:text-7xl text-balance">FAQ – Perguntas Frequentes</h1>
          <p className="mt-6 max-w-3xl mx-auto text-base leading-8 text-white/72 lg:text-xl">
            Use essa página para responder exatamente o que seus leads te perguntam pelo WhatsApp.
          </p>
        </section>
        <section className="mx-auto max-w-3xl px-6 py-8 lg:px-10 lg:py-12">
          <div className="space-y-8">
            {loading ? (
              <div className="text-center text-white/60 py-8">Carregando perguntas...</div>
            ) : perguntas.length === 0 ? (
              <div className="text-center text-white/60 py-8">Nenhuma pergunta cadastrada.</div>
            ) : (
              perguntas.map((item, idx) => (
                <div key={item.id || item._id} className="rounded-[30px] border border-white/8 bg-[#181818] p-8 shadow-lg">
                  <h2 className="text-xl font-semibold text-[#E9BF84] mb-2">{item.pergunta}</h2>
                  <p className="text-white/80 text-base leading-7">{item.resposta}</p>
                </div>
              ))
            )}
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-6 py-8 lg:px-10 lg:py-12 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Não encontrou sua dúvida aqui?</h2>
          <p className="text-white/70 mb-6">Me chama no WhatsApp e eu te respondo pessoalmente.</p>
          <Button href="https://wa.me/5511964932007" variant="secondary" className="w-full md:w-auto">Falar com o Svicero Studio</Button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
