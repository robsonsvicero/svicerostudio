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
    <div className="bg-charcoal min-h-screen flex flex-col text-cream font-body relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-copper/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <Header variant="solid" />
      <main className="flex-1 relative z-10">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-14 sm:pb-16 lg:px-10 lg:pb-24 text-center mt-20 lg:mt-36">
          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-tight text-cream text-balance">FAQ – Perguntas Frequentes</h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg leading-[1.6] text-muted lg:text-xl">
            Use essa página para responder exatamente o que seus leads te perguntam pelo WhatsApp.
          </p>
        </section>
        <section className="mx-auto max-w-3xl px-6 py-8 lg:px-10 lg:py-12">
          <div className="space-y-8">
            {loading ? (
              <div className="text-center text-muted py-8">Carregando perguntas...</div>
            ) : perguntas.length === 0 ? (
              <div className="text-center text-muted py-8">Nenhuma pergunta cadastrada.</div>
            ) : (
              perguntas.map((item, idx) => (
                <div key={item.id || item._id} className="rounded-[2rem] border border-white/5 bg-[#141414]/60 backdrop-blur-xl p-8 md:p-10 shadow-lg hover:border-white/10 transition-colors">
                  <h2 className="text-xl font-medium text-copper mb-4">{item.pergunta}</h2>
                  <p className="text-muted text-base leading-[1.6]">{item.resposta}</p>
                </div>
              ))
            )}
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-6 py-8 lg:px-10 lg:py-12 text-center">
          <h2 className="text-[1.875rem] font-medium tracking-tight text-cream mb-4">Não encontrou sua dúvida aqui?</h2>
          <p className="text-muted mb-8">Me chama no WhatsApp e eu te respondo pessoalmente.</p>
          <Button href="https://wa.me/5511964932007" variant="outline" className="w-full md:w-auto">Falar com o Svicero Studio</Button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
