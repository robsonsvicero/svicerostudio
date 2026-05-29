import React, { useState } from 'react';
import { TrendingDown, Paintbrush, ChevronDown } from 'lucide-react';
import imageConsultorio from '../assets/imagem-consultorio.png';
import Button from '../components/UI/Button';

// Constantes copiadas do FormularioInteresse.jsx
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const situacaoMarca = [
  'O consultório está cheio, mas a margem de lucro está baixa.',
  'Quero parar de atender convênios e focar em pacientes particulares.',
  'Vou investir em novas tecnologias (ex: Invisalign) e preciso atrair o público certo.',
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
  'w-full rounded-lg border border-ds-border bg-white/5 px-4 py-3 text-ds-text placeholder:text-white/30 focus:outline-none focus:border-ds-accent focus:bg-white/10 transition-colors shadow-sm';

const labelClass = 'block text-ds-text font-medium mb-1 text-sm';
const helperClass = 'text-xs text-ds-muted mt-1';

// ==========================================
// SEÇÕES DA LANDING PAGE (Variáveis de Estrutura)
// ==========================================

const HeroSection = (
  <section id="hero" className="w-full min-h-screen pt-24 pb-16 bg-ds-bg text-ds-text flex items-center relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 w-full z-10">
      
      {/* Lado Esquerdo (Texto) */}
      <div className="w-full md:w-1/2 flex flex-col items-start gap-8 z-10">
        <h1 className="font-display text-4xl md:text-5xl lg:text-exg leading-tight tracking-tight">
          {/* TODO: revisar cor (sem equivalente claro no mapeamento) */}
          Pare de competir pelo preço da manutenção e torne-se a escolha óbvia para <span className="text-ds-accent italic">tratamentos particulares.</span>
        </h1>
        
        <p className="font-body text-lg md:text-g text-ds-muted leading-relaxed">
          Estratégia de marca e posicionamento para ortodontistas e clínicas que desejam atrair pacientes que valorizam excelência, segurança, confiança e não o menor preço.
        </p>
        
        <Button 
          href="#diagnostico" 
          variant="primary" 
          size="lg" 
          className="w-full md:w-auto text-center"
        >
          Agendar Diagnóstico
        </Button>
      </div>

      {/* Lado Direito (Imagem) - Exibe também no mobile */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
        {/* Efeito de brilho/sombra atrás da imagem */}
        <div className="absolute -inset-4 bg-ds-accent/20 blur-2xl rounded-full opacity-30"></div>
        
        <img 
          src={imageConsultorio} 
          alt="Consultório Odontológico Premium" 
          className="w-full max-w-[420px] md:max-w-[600px] aspect-[4/5] object-cover rounded-lg shadow-2xl border border-ds-border z-10 relative"
          loading="lazy"
        />
      </div>

    </div>
  </section>
);

const DoresSection = (
  <section id="dores-mercado" className="w-full py-24 bg-ds-surface text-ds-text">
    <div className="max-w-7xl mx-auto px-6">
      
      {/* Título da Seção */}
      <div className="text-center mb-16 md:mb-20">
        <h2 className="font-display text-3xl md:text-4xl lg:text-xg text-ds-text max-w-2xl mx-auto">
          O verdadeiro custo de um consultório <span className="text-ds-accent italic">invisível</span>
        </h2>
      </div>

      {/* Grid de Dores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1 */}
        <div className="bg-ds-surface p-10 rounded-2xl border border-white/5 hover:border-ds-accent/40 transition-all duration-300 flex flex-col items-start gap-6 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-copper/10">
          {/* TODO: revisar cor (sem equivalente claro no mapeamento) */}
          <div className="w-14 h-14 rounded-xl bg-ds-bg flex items-center justify-center text-ds-tech group-hover:bg-ds-tech-hover group-hover:text-ds-surface transition-colors duration-300">
            <TrendingDown size={28} />
          </div>
          <div>
            <h3 className="font-display text-xl md:text-2xl text-ds-text mb-4">Agenda Cheia, Lucro Baixo</h3>
            <p className="font-body text-ds-muted leading-relaxed">
              Você trabalha com a agenda lotada, mas no fim do mês a margem não acompanha o esforço. O problema não é falta de demanda, é falta de percepção de valor nos tratamentos certos.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-ds-surface p-10 rounded-2xl border border-white/5 hover:border-ds-accent/40 transition-all duration-300 flex flex-col items-start gap-6 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-copper/10">
          {/* TODO: revisar cor (sem equivalente claro no mapeamento) */}
          <div className="w-14 h-14 rounded-xl bg-ds-bg flex items-center justify-center text-ds-tech group-hover:bg-ds-tech-hover group-hover:text-ds-surface transition-colors duration-300">
            {/* Ícone customizado de Dente com $ em SVG puro */}
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s-3-2-3-7V7a3 3 0 0 1 6 0v8c0 5-3 7-3 7z"/> {/* Formato base de dente */}
              <path d="M12 2C9 2 7 4 7 7"/>
              <path d="M12 2c3 0 5 2 5 5"/>
              <line x1="6" y1="18" x2="18" y2="6"/> {/* Risco transversal */}
              <path d="M10 10h4"/> {/* $ improvisado */}
              <line x1="12" y1="8" x2="12" y2="12"/>
            </svg>
          </div>
          <div>
            <h3 className="font-display text-xl md:text-2xl text-ds-text mb-4">Guerra de Preços</h3>
            <p className="font-body text-ds-muted leading-relaxed">
              Seus pacientes ainda comparam seu trabalho com o de clínicas que vivem de promoções e parcelamentos agressivos. Quando a marca não comunica diferença real, a conversa inevitavelmente desce para o preço.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-ds-surface p-10 rounded-2xl border border-white/5 hover:border-ds-accent/40 transition-all duration-300 flex flex-col items-start gap-6 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-copper/10">
          {/* TODO: revisar cor (sem equivalente claro no mapeamento) */}
          <div className="w-14 h-14 rounded-xl bg-ds-bg flex items-center justify-center text-ds-tech group-hover:bg-ds-tech-hover group-hover:text-ds-surface transition-colors duration-300">
            <Paintbrush size={28} />
          </div>
          <div>
            <h3 className="font-display text-xl md:text-2xl text-ds-text mb-4">Comunicação Genérica</h3>
            <p className="font-body text-ds-muted leading-relaxed">
              Sua marca parece mais uma entre tantas: feed parecido, frases prontas, site sem personalidade. Isso enfraquece sua autoridade e faz uma clínica de excelência parecer apenas “mais uma opção”.
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>
);

const SolucaoSection = (
  <section id="solucao" className="w-full py-24 bg-ds-bg text-ds-text relative">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      
      {/* Títulos e Subtítulo */}
      <div className="text-center mb-20">
        <h2 className="font-display text-4xl md:text-5xl lg:text-xg text-ds-text mb-6 leading-tight">
          {/* TODO: revisar cor (sem equivalente claro no mapeamento) */}
          Do Consultório Comum à <span className="text-ds-accent italic">Marca de Elite</span>
        </h2>
        <p className="font-body text-lg md:text-xl text-ds-muted max-w-3xl mx-auto leading-relaxed">
          Não entregamos apenas design. Construímos os pilares que tornam sua clínica mais clara, desejada e confiável para o paciente certo.
        </p>
      </div>

      {/* Grid de Passos/Blocos Horizontais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Passo 01 */}
        <div className="flex flex-col items-center text-center p-6 gap-5 group">
          {/* TODO: revisar cor (sem equivalente claro no mapeamento) */}
          <span className="font-display text-7xl text-ds-accent/15 font-light tracking-tighter group-hover:text-ds-accent/30 transition-colors duration-500">01</span>
          <h3 className="font-display text-2xl text-ds-text">Diagnóstico de Percepção</h3>
          <p className="font-body text-ds-muted leading-relaxed">
            Analisamos como o seu paciente te enxerga hoje e onde sua clínica está perdendo dinheiro por falhas de diferenciação e comunicação.
          </p>
        </div>

        {/* Passo 02 */}
        <div className="flex flex-col items-center text-center p-6 gap-5 group">
          {/* TODO: revisar cor (sem equivalente claro no mapeamento) */}
          <span className="font-display text-7xl text-ds-accent/15 font-light tracking-tighter group-hover:text-ds-accent/30 transition-colors duration-500">02</span>
          <h3 className="font-display text-2xl text-ds-text">Engenharia de Marca</h3>
          <p className="font-body text-ds-muted leading-relaxed">
            Criamos uma identidade visual e um tom de voz que eliminam a sensação de “clínica comum” e sustentam o valor dos seus tratamentos particulares.
          </p>
        </div>

        {/* Passo 03 */}
        <div className="flex flex-col items-center text-center p-6 gap-5 group">
          {/* TODO: revisar cor (sem equivalente claro no mapeamento) */}
          <span className="font-display text-7xl text-ds-accent/15 font-light tracking-tighter group-hover:text-ds-accent/30 transition-colors duration-500">03</span>
          <h3 className="font-display text-2xl text-ds-text">Blindagem Comercial</h3>
          <p className="font-body text-ds-muted leading-relaxed">
            Alinhamos sua comunicação para que a proposta de tratamento faça sentido para o paciente antes mesmo de falar em valores, facilitando a aceitação de orçamentos de alto valor.
          </p>
        </div>

      </div>
    </div>
  </section>
);

const ProvaSocialSection = (
  <section id="prova-social" className="w-full py-24 bg-ds-surface border-y border-white/5 text-ds-text">
    <div className="max-w-7xl mx-auto px-6">
      
      {/* Título da Seção */}
      <div className="text-center mb-16 md:mb-20">
        <h2 className="font-display text-3xl md:text-4xl lg:text-xg text-ds-text max-w-3xl mx-auto leading-tight">
          {/* TODO: revisar cor (sem equivalente claro no mapeamento) */}
          Do Design Estratégico ao <span className="text-ds-accent italic">Resultado de Negócio</span>
        </h2>
      </div>

      {/* Layout Flex para Cases */}
      <div className="flex flex-col md:flex-row items-stretch gap-10 lg:gap-12">
        
        {/* Case 1: Cia Odontológica */}
        <div className="flex-1 bg-ds-surface p-10 lg:p-12 rounded-2xl border border-white/5 shadow-xl hover:border-ds-accent/30 transition-colors duration-300 flex flex-col justify-start">
          <span className="text-ds-accent font-mono text-sm uppercase tracking-widest mb-5 block">Case: Cia Odontológica</span>
          <h3 className="font-display text-2xl md:text-3xl text-ds-text mb-6 leading-tight">
            Filtro de Audiência e Aumento de Conversão
          </h3>
          <p className="font-body text-ds-muted leading-relaxed text-lg">
            A clínica atraía principalmente pacientes em busca de preço baixo, comprimindo a margem de lucro. Nossa estratégia reposicionou a percepção de valor da marca, ajustando narrativa, identidade visual e presença digital. Resultado, redução de pedidos de desconto, aumento de pacientes com perfil para tratamentos de alto valor e melhora nas taxas de fechamento de orçamento.
          </p>
        </div>

        {/* Case 2: Sigiloso */}
        <div className="flex-1 bg-ds-surface p-10 lg:p-12 rounded-2xl border border-white/5 shadow-xl hover:border-ds-accent/30 transition-colors duration-300 flex flex-col justify-start">
          <span className="text-ds-accent font-mono text-sm uppercase tracking-widest mb-5 block">Case: Sigiloso</span>
          <h3 className="font-display text-2xl md:text-3xl text-ds-text mb-6 leading-tight">
            Posicionamento de Autoridade para Ortodontia
          </h3>
          <p className="font-body text-ds-muted leading-relaxed text-lg">
            Um projeto focado em reposicionar uma profissional de destaque para um público A/B. Através de branding sólido, linguagem mais madura e presença digital consistente, construímos a segurança necessária para que o paciente investisse em tratamentos premium sem questionar a todo momento o valor.
          </p>
        </div>

      </div>
    </div>
  </section>
);

const CTAFinalSection = () => {
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

  return (
    <section id="diagnostico" className="w-full py-24 bg-ds-bg text-ds-text relative overflow-hidden">
      {/* Efeito de iluminação de fundo premium */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-ds-accent/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Títulos */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl lg:text-xg text-ds-text mb-6 leading-tight">
            {/* TODO: revisar cor (sem equivalente claro no mapeamento) */}
            Aplicação para Diagnóstico de <span className="text-ds-accent italic">Posicionamento de Marca</span>
          </h2>
          <p className="font-body text-lg md:text-xl text-ds-muted">
            Exclusivo para clínicas e profissionais de saúde que buscam estrutura de marca à altura da qualidade do seu trabalho.
          </p>
        </div>

        {/* Formulário Sofisticado (Logica Copiada de FormularioInteresse) */}
        <div className="bg-ds-surface p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl">
          {success ? (
            <div className="text-center py-10">
               <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-ds-accent/25 bg-ds-accent/5 text-[11px] font-mono uppercase tracking-[.2em] text-ds-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(184,115,51,0.5)]" />
                  RECEBIDO
                </span>
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ds-text mb-4">
                  Formulário recebido com sucesso.
                </h2>
                <p className="text-ds-muted leading-[1.6] mb-6">
                  O Svicero Studio vai analisar suas respostas e retornar em até{' '}
                  <span className="text-ds-text font-medium">2 dias úteis</span> para
                  agendar o Diagnóstico de Posicionamento.
                  <br />
                  <br />
                  Se preferir antecipar a conversa, pode chamar diretamente pelo
                  WhatsApp.
                </p>
                <div className="reveal stagger-4 flex flex-row gap-6 items-center w-full sm:w-auto">
                  <Button
                    href="https://wa.me/5511964932007?text=Olá%20Robson%2C%20acabei%20de%20preencher%20o%20formulário%20na%20Landing%20Page%20e%20gostaria%20de%20adiantar%20a%20conversa."
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                  >
                    Falar pelo WhatsApp
                  </Button>
                </div>
            </div>
          ) : (
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* BLOCO 1: Identificação */}
              <div className="space-y-5">
                <p className="text-[10px] uppercase tracking-widest font-mono text-ds-accent">Sobre você</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Nome completo *</label>
                    <input
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      type="text"
                      placeholder="Dr(a). Nome Sobrenome"
                    />
                  </div>
                  
                  <div>
                    <label className={labelClass}>E-mail Profissional *</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      type="email"
                      placeholder="contato@suaclinica.com"
                    />
                  </div>
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
                </div>
              </div>

              <hr className="border-white/5 my-8" />

              {/* BLOCO 2: Negócio */}
              <div className="space-y-5">
                <p className="text-[10px] uppercase tracking-widest font-mono text-ds-accent">Sobre o negócio</p>

                <div>
                  <label className={labelClass}>Qual é o seu serviço ou negócio principal? *</label>
                  <input
                    name="servico"
                    value={form.servico}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    type="text"
                    placeholder="Ex.: Ortodontia, Implantes, Harmonização..."
                  />
                </div>

                <div>
                  <label className={labelClass}>Qual é a situação atual da sua marca? *</label>
                  <div className="relative">
                    <select
                      name="situacaoMarca"
                      value={form.situacaoMarca}
                      onChange={handleChange}
                      required
                      className={`${inputClass} appearance-none cursor-pointer pr-10`}
                    >
                      <option value="" disabled className="bg-ds-surface text-ds-muted">Selecione...</option>
                      {situacaoMarca.map((opt) => (
                        <option key={opt} value={opt} className="bg-ds-surface text-ds-text">{opt}</option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-ds-muted pointer-events-none" />
                  </div>
                </div>

                 <div>
                  <label className={labelClass}>Link do site, Instagram ou projetos</label>
                  <input
                    name="link"
                    value={form.link}
                    onChange={handleChange}
                    className={inputClass}
                    type="url"
                    placeholder="https://"
                  />
                </div>
              </div>

              <hr className="border-white/5 my-8" />

              {/* BLOCO 3: Desafio */}
              <div className="space-y-5">
                <p className="text-[10px] uppercase tracking-widest font-mono text-ds-accent">Seu momento</p>

                <div>
                  <label className={labelClass}>Qual é o maior desafio da sua marca hoje? *</label>
                  <textarea
                    name="desafio"
                    value={form.desafio}
                    onChange={handleChange}
                    required
                    className={`${inputClass} min-h-[120px] resize-none`}
                    placeholder="Pode ser algo como: 'Meus pacientes acham o Invisalign caro porque não entendem meu diferencial.'."
                  />
                </div>

                <div>
                  <label className={labelClass}>Você tem algum prazo em mente para avançar? *</label>
                  <div className="relative">
                    <select
                      name="prazo"
                      value={form.prazo}
                      onChange={handleChange}
                      required
                      className={`${inputClass} appearance-none cursor-pointer pr-10`}
                    >
                      <option value="" disabled className="bg-ds-surface text-ds-muted">Selecione...</option>
                      {prazos.map((opt) => (
                        <option key={opt} value={opt} className="bg-ds-surface text-ds-text">{opt}</option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-ds-muted pointer-events-none" />
                  </div>
                </div>
              </div>

               <hr className="border-white/5 my-8" />

              {/* BLOCO 4: Como conheceu */}
              <div className="space-y-5">
                <p className="text-[10px] uppercase tracking-widest font-mono text-ds-accent">Só curiosidade</p>
                <div>
                  <label className={labelClass}>Como você conheceu o Svicero Studio?</label>
                  <div className="relative">
                    <select
                      name="comoConheceu"
                      value={form.comoConheceu}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none cursor-pointer pr-10`}
                    >
                      <option value="" disabled className="bg-ds-surface text-ds-muted">Selecione...</option>
                      {comoConheceu.map((opt) => (
                        <option key={opt} value={opt} className="bg-ds-surface text-ds-text">{opt}</option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-ds-muted pointer-events-none" />
                  </div>

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
              <div className="space-y-2 mt-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    name="consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 rounded border-ds-border bg-transparent text-ds-accent focus:ring-ds-accent focus:ring-offset-background"
                  />
                  <span className="text-sm text-ds-text/80 leading-[1.6]">
                    Concordo em receber contato do Svicero Studio para tratar sobre meu diagnóstico de posicionamento.
                  </span>
                </label>
              </div>

              {/* Erro */}
              {error && (
                <div className="rounded-lg bg-red-900/20 border border-red-900/50 px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="mt-8 flex justify-center">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="md" 
                  className="w-full md:w-auto text-center"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Agendar Diagnóstico'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// ESTRUTURA PRINCIPAL DA PÁGINA
// ==========================================

export default function LPDentistas() {
  return (
    <div className="min-h-screen bg-ds-bg font-body antialiased selection:bg-ds-accent selection:text-ds-text text-ds-text">
      {/* 
        Aqui seria o equivalente ao <head> em HTML puro. 
        Como estamos em React, recomendamos o uso de React Helmet 
        para gerenciar as meta tags SEO, Title, etc. 
      */}
      <header className="fixed top-0 w-full z-50 bg-ds-bg/90 backdrop-blur-sm border-b border-ds-border">
        {/* Navegação/Logo pode vir aqui */}
      </header>

      {/* Contêiner Principal equivalente ao <body>/<main> */}
      <main className="w-full flex flex-col">
        {HeroSection}
        {DoresSection}
        {SolucaoSection}
        {ProvaSocialSection}
        <CTAFinalSection />
      </main>

      <footer className="w-full py-8 text-center bg-ds-bg border-t border-ds-border text-ds-muted text-sm">
        {/* Rodapé básico */}
        <p>&copy; {new Date().getFullYear()} Svicero Studio - Estratégia Odontológica.</p>
      </footer>
    </div>
  );
}
