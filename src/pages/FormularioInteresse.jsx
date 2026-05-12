import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import SEOHelmet from '../components/SEOHelmet';

const situacaoMarca = [
  'Tenho logo e site',
  'Tenho logo, mas não tenho site',
  'Tenho site, mas não tenho logo definida',
  'Não tenho nem logo, nem site',
];

const prazos = [
  'Quero começar o quanto antes',
  'Posso começar nos próximos 30 dias',
  'Estou planejando para daqui a 2–3 meses',
  'Ainda não tenho prazo definido',
];

const comoConheceu = [
  'Instagram',
  'Google',
  'Indicação de alguém',
  'LinkedIn',
  'Outro',
];

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-white/30 focus:outline-none focus:border-copper/60 focus:bg-white/10 transition-colors shadow-sm';

const labelClass = 'block text-cream font-medium mb-1';
const helperClass = 'text-xs text-muted mt-1';

const FormularioInteresse = () => {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    servico: '',
    situacaoMarca: '',
    link: '',
    desafio: '',
    prazo: '',
    comoConheceu: '',
    outroComoConheceu: '',
    consent: false,
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.nome ||
      !form.email ||
      !form.servico ||
      !form.situacaoMarca ||
      !form.desafio ||
      !form.prazo ||
      !form.consent
    ) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/interesse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.ok) {
        setSuccess(true);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      } else {
        setError(
          'Erro ao enviar o formulário. Tente novamente ou fale direto pelo WhatsApp.'
        );
      }
    } catch {
      setError(
        'Erro ao enviar o formulário. Tente novamente ou fale direto pelo WhatsApp.'
      );
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-charcoal min-h-screen flex flex-col text-cream font-body">
        <Header variant="solid" />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-xl w-full mx-auto bg-surface rounded-[2rem] p-8 border border-white/5 shadow-md text-center mt-20 mb-20 lg:mt-36 lg:mb-36">
            <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
              <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]" />
              RECEBIDO
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-cream mb-4">
              Formulário recebido com sucesso.
            </h2>
            <p className="text-muted leading-[1.6] mb-6">
              O Svicero Studio vai analisar suas respostas e retornar em até{' '}
              <span className="text-cream font-medium">2 dias úteis</span> para
              agendar o Diagnóstico de Posicionamento.
              <br />
              <br />
              Se preferir antecipar a conversa, pode chamar diretamente pelo
              WhatsApp.
            </p>
            <div className="flex justify-center">
              <Button
                href="https://wa.me/5511964932007?text=Olá%20Robson%2C%20acabei%20de%20preencher%20o%20formulário%20e%20gostaria%20de%20adiantar%20a%20conversa."
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                Falar pelo WhatsApp
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-charcoal min-h-screen flex flex-col text-cream font-body relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-copper/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <SEOHelmet
        title="Formulário de Interesse — Svicero Studio"
        description="Preencha o formulário para agendar seu Diagnóstico de Posicionamento com o Svicero Studio."
        keywords="formulário interesse svicero studio, diagnóstico de posicionamento, branding estratégico"
      />
      <Header variant="solid" />
      <main className="flex-1 relative z-10">
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-36">

          {/* Cabeçalho */}
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
            <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]" />
            PRIMEIRO PASSO
          </span>

          <h1 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-cream text-balance">
            Conte um pouco sobre o seu negócio
          </h1>

          <p className="text-muted text-base sm:text-lg leading-[1.6] mb-10">
            Essas informações ajudam o estúdio a chegar no Diagnóstico de
            Posicionamento já preparado para a sua realidade — sem perder tempo
            com perguntas básicas durante a conversa.
          </p>

          <form className="space-y-8" onSubmit={handleSubmit}>

            {/* BLOCO 1: Identificação */}
            <div className="rounded-[2rem] border border-white/5 bg-[#141414]/60 backdrop-blur-xl shadow-sm p-6 sm:p-8 space-y-5">
              <p className="text-[10px] uppercase tracking-widest font-mono text-copper">
                Sobre você
              </p>

              <div>
                <label className={labelClass}>Nome completo *</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  type="text"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className={labelClass}>E-mail *</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  type="email"
                  placeholder="Seu e-mail"
                />
                <p className={helperClass}>
                  É por aqui que o estúdio vai retornar com os próximos passos.
                </p>
              </div>

              <div>
                <label className={labelClass}>WhatsApp (com DDD)</label>
                <input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className={inputClass}
                  type="tel"
                  placeholder="(XX) XXXXX-XXXX"
                />
                <p className={helperClass}>
                  Opcional. Usado apenas se precisar tirar alguma dúvida rápida
                  antes do diagnóstico.
                </p>
              </div>
            </div>

            {/* BLOCO 2: Negócio */}
            <div className="rounded-[2rem] border border-white/5 bg-[#141414]/60 backdrop-blur-xl shadow-sm p-6 sm:p-8 space-y-5">
              <p className="text-[10px] uppercase tracking-widest font-mono text-copper">
                Sobre o negócio
              </p>

              <div>
                <label className={labelClass}>
                  Qual é o seu serviço ou negócio principal? *
                </label>
                <input
                  name="servico"
                  value={form.servico}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  type="text"
                  placeholder="Ex.: consultoria financeira, clínica odontológica, loja de moda feminina..."
                />
              </div>

              <div>
                <label className={labelClass}>
                  Qual é a situação atual da sua marca? *
                </label>
                <select
                  name="situacaoMarca"
                  value={form.situacaoMarca}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Selecione...</option>
                  {situacaoMarca.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Link do site, Instagram ou portfólio
                </label>
                <input
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  className={inputClass}
                  type="url"
                  placeholder="https://"
                />
                <p className={helperClass}>
                  Opcional, mas ajuda muito o estúdio a entender seu momento
                  visual antes da conversa.
                </p>
              </div>
            </div>

            {/* BLOCO 3: Desafio */}
            <div className="rounded-[2rem] border border-white/5 bg-[#141414]/60 backdrop-blur-xl shadow-sm p-6 sm:p-8 space-y-5">
              <p className="text-[10px] uppercase tracking-widest font-mono text-copper">
                Seu momento
              </p>

              <div>
                <label className={labelClass}>
                  Qual é o maior desafio da sua marca hoje? *
                </label>
                <textarea
                  name="desafio"
                  value={form.desafio}
                  onChange={handleChange}
                  required
                  className={`${inputClass} min-h-[120px] resize-none`}
                  placeholder="Pode ser algo como: 'Clientes sempre pedem desconto e não enxergam o valor do que entrego' ou 'Minha comunicação parece genérica, igual à dos meus concorrentes'."
                />
                <p className={helperClass}>
                  Quanto mais honesto, mais produtivo vai ser o diagnóstico.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Você tem algum prazo em mente para avançar? *
                </label>
                <select
                  name="prazo"
                  value={form.prazo}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Selecione...</option>
                  {prazos.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BLOCO 4: Como conheceu */}
            <div className="rounded-[2rem] border border-white/5 bg-[#141414]/60 backdrop-blur-xl shadow-sm p-6 sm:p-8 space-y-5">
              <p className="text-[10px] uppercase tracking-widest font-mono text-copper">
                Só curiosidade
              </p>

              <div>
                <label className={labelClass}>
                  Como você conheceu o Svicero Studio?
                </label>
                <select
                  name="comoConheceu"
                  value={form.comoConheceu}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Selecione...</option>
                  {comoConheceu.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                {form.comoConheceu === 'Outro' && (
                  <input
                    name="outroComoConheceu"
                    value={form.outroComoConheceu}
                    onChange={handleChange}
                    className={`${inputClass} mt-3`}
                    type="text"
                    placeholder="Onde foi?"
                  />
                )}
              </div>
            </div>

            {/* Consentimento */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  name="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={handleChange}
                  className="mt-1 accent-copper"
                />
                <span className="text-sm text-cream/80 leading-[1.6]">
                  Concordo em receber contato do Svicero Studio para tratar sobre
                  meu diagnóstico de posicionamento.
                </span>
              </label>
              <p className="text-[10px] uppercase font-mono tracking-widest text-muted pl-6">
                Ao enviar, você concorda com nossa{' '}
                <a href="/privacidade" className="underline text-copper hover:text-copper/80">
                  Política de Privacidade
                </a>
                . Seus dados não são compartilhados com terceiros.
              </p>
            </div>

            {/* Erro */}
            {error && (
              <div className="rounded-lg bg-red-900/20 border border-red-900/50 px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar e aguardar contato'}
            </Button>

            <p className="text-[10px] font-mono tracking-widest uppercase text-muted text-center">
              O estúdio retorna em até 2 dias úteis para agendar o diagnóstico.
              Se preferir agilidade, fale direto pelo{' '}
              <a
                href="https://wa.me/5511964932007"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-copper hover:text-copper/80"
              >
                WhatsApp
              </a>
              .
            </p>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FormularioInteresse;