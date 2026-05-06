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
  'w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-secondary/60 transition-colors';

const labelClass = 'block text-white font-medium mb-1';
const helperClass = 'text-xs text-white/50 mt-1';

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
      <div className="bg-[#141414] min-h-screen flex flex-col text-[#EFEFEF] font-body">
        <Header variant="solid" />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-xl w-full mx-auto bg-white/5 rounded-2xl p-8 border border-white/10 text-center mt-20 mb-20 lg:mt-36 lg:mb-36">
            <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-secondary/10 text-xs font-semibold text-secondary tracking-widest border border-secondary/30">
              <span className="w-2 h-2 -rotate-45 bg-secondary inline-block" />
              RECEBIDO
            </span>
            <h2 className="font-title text-2xl sm:text-3xl font-semibold text-white mb-4">
              Formulário recebido com sucesso.
            </h2>
            <p className="text-white/70 leading-7 mb-6">
              O Svicero Studio vai analisar suas respostas e retornar em até{' '}
              <span className="text-white font-medium">2 dias úteis</span> para
              agendar o Diagnóstico de Posicionamento.
              <br />
              <br />
              Se preferir antecipar a conversa, pode chamar diretamente pelo
              WhatsApp.
            </p>
            <Button
              href="https://wa.me/5511964932007?text=Olá%20Robson%2C%20acabei%20de%20preencher%20o%20formulário%20e%20gostaria%20de%20adiantar%20a%20conversa."
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              Falar pelo WhatsApp
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#141414] min-h-screen flex flex-col text-[#EFEFEF] font-body">
      <SEOHelmet
        title="Formulário de Interesse — Svicero Studio"
        description="Preencha o formulário para agendar seu Diagnóstico de Posicionamento com o Svicero Studio."
        keywords="formulário interesse svicero studio, diagnóstico de posicionamento, branding estratégico"
      />
      <Header variant="solid" />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-36">

          {/* Cabeçalho */}
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/10 text-xs font-semibold text-secondary tracking-widest border border-secondary/30">
            <span className="w-2 h-2 -rotate-45 bg-secondary inline-block" />
            PRIMEIRO PASSO
          </span>

          <h1 className="font-title text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-white mb-4">
            Conte um pouco sobre o seu negócio
          </h1>

          <p className="text-white/65 text-base sm:text-lg leading-7 mb-10">
            Essas informações ajudam o estúdio a chegar no Diagnóstico de
            Posicionamento já preparado para a sua realidade — sem perder tempo
            com perguntas básicas durante a conversa.
          </p>

          <form className="space-y-8" onSubmit={handleSubmit}>

            {/* BLOCO 1: Identificação */}
            <div className="rounded-[20px] border border-white/8 bg-[#181818] p-6 sm:p-8 space-y-5">
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">
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
            <div className="rounded-[20px] border border-white/8 bg-[#181818] p-6 sm:p-8 space-y-5">
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">
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
            <div className="rounded-[20px] border border-white/8 bg-[#181818] p-6 sm:p-8 space-y-5">
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">
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
            <div className="rounded-[20px] border border-white/8 bg-[#181818] p-6 sm:p-8 space-y-5">
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">
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
                  className="mt-1 accent-secondary"
                />
                <span className="text-sm text-white/70 leading-6">
                  Concordo em receber contato do Svicero Studio para tratar sobre
                  meu diagnóstico de posicionamento.
                </span>
              </label>
              <p className="text-xs text-white/40 pl-6">
                Ao enviar, você concorda com nossa{' '}
                <a href="/privacidade" className="underline text-secondary/80">
                  Política de Privacidade
                </a>
                . Seus dados não são compartilhados com terceiros.
              </p>
            </div>

            {/* Erro */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar e aguardar contato'}
            </Button>

            <p className="text-xs text-white/40 text-center">
              O estúdio retorna em até 2 dias úteis para agendar o diagnóstico.
              Se preferir agilidade, fale direto pelo{' '}
              <a
                href="https://wa.me/5511964932007"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-secondary/80"
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