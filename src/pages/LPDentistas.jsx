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
  'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-white/30 focus:outline-none focus:border-copper/60 focus:bg-white/10 transition-colors shadow-sm';

const labelClass = 'block text-cream font-medium mb-1 text-sm';
const helperClass = 'text-xs text-muted mt-1';

// ==========================================
// SEÇÕES DA LANDING PAGE (Variáveis de Estrutura)
// ==========================================

const HeroSection = (
  <section id="hero" className="w-full min-h-screen pt-24 pb-16 bg-charcoal text-cream flex items-center relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 w-full z-10">
      
      {/* Lado Esquerdo (Texto) */}
      <div className="w-full md:w-1/2 flex flex-col items-start gap-8 z-10">
        <h1 className="font-display text-4xl md:text-5xl lg:text-exg leading-tight tracking-tight">
          Pare de competir pelo preço da manutenção e torne-se a escolha óbvia para <span className="text-copper-light italic">tratamentos de alto ticket.</span>
        </h1>
        
        <p className="font-body text-lg md:text-g text-muted leading-relaxed">
          Estratégia de marca e posicionamento exclusivo para ortodontistas e clínicas que desejam atrair pacientes que valorizam a excelência, não o desconto.
        </p>
        
        <Button 
          href="#diagnostico" 
          variant="primary" 
          size="lg" 
          className="w-full md:w-auto text-center"
        >
          Quero um Diagnóstico de Posicionamento
        </Button>
      </div>

      {/* Lado Direito (Imagem) - Esconde no Mobile, aparece a partir do Medium */}
      <div className="w-full md:w-1/2 hidden md:flex justify-end relative">
        {/* Efeito de brilho/sombra atrás da imagem */}
        <div className="absolute -inset-4 bg-copper/20 blur-2xl rounded-full opacity-30"></div>
        
        <img 
          src={imageConsultorio} 
          alt="Consultório Odontológico Premium" 
          className="w-full max-w-[600px] aspect-[4/5] object-cover rounded-lg shadow-2xl border border-surface z-10 relative"
          loading="lazy"
        />
      </div>

    </div>
  </section>
);

const DoresSection = (
  <section id="dores-mercado" className="w-full py-24 bg-surface text-cream">
    <div className="max-w-7xl mx-auto px-6">
      
      {/* Título da Seção */}
      <div className="text-center mb-16 md:mb-20">
        <h2 className="font-display text-3xl md:text-4xl lg:text-xg text-cream max-w-2xl mx-auto">
          O verdadeiro custo de um consultório <span className="text-muted italic">invisível</span>
        </h2>
      </div>

      {/* Grid de Dores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1 */}
        <div className="bg-card p-10 rounded-2xl border border-white/5 hover:border-copper/40 transition-all duration-300 flex flex-col items-start gap-6 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-copper/10">
          <div className="w-14 h-14 rounded-xl bg-charcoal flex items-center justify-center text-copper-light group-hover:bg-copper group-hover:text-cream transition-colors duration-300">
            <TrendingDown size={28} />
          </div>
          <div>
            <h3 className="font-display text-xl md:text-2xl text-cream mb-4">Agenda Cheia, Lucro Baixo</h3>
            <p className="font-body text-muted leading-relaxed">
              Você se esforça para lotar a agenda de procedimentos de baixo valor, mas no fim do mês a margem não acompanha o esforço.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-card p-10 rounded-2xl border border-white/5 hover:border-copper/40 transition-all duration-300 flex flex-col items-start gap-6 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-copper/10">
          <div className="w-14 h-14 rounded-xl bg-charcoal flex items-center justify-center text-copper-light group-hover:bg-copper group-hover:text-cream transition-colors duration-300">
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
            <h3 className="font-display text-xl md:text-2xl text-cream mb-4">Guerra de Preços</h3>
            <p className="font-body text-muted leading-relaxed">
              Seus pacientes acham que Invisalign ou implantes são iguais aos da concorrência popular e sempre pedem desconto.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-card p-10 rounded-2xl border border-white/5 hover:border-copper/40 transition-all duration-300 flex flex-col items-start gap-6 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-copper/10">
          <div className="w-14 h-14 rounded-xl bg-charcoal flex items-center justify-center text-copper-light group-hover:bg-copper group-hover:text-cream transition-colors duration-300">
            <Paintbrush size={28} />
          </div>
          <div>
            <h3 className="font-display text-xl md:text-2xl text-cream mb-4">Comunicação Genérica</h3>
            <p className="font-body text-muted leading-relaxed">
              Sua marca parece um copia e cola do Canva de outros dentistas e não transmite a sua verdadeira excelência.
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>
);

const SolucaoSection = (
  <section id="solucao" className="w-full py-24 bg-charcoal text-cream relative">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      
      {/* Títulos e Subtítulo */}
      <div className="text-center mb-20">
        <h2 className="font-display text-4xl md:text-5xl lg:text-xg text-cream mb-6 leading-tight">
          Do Consultório Comum à <span className="text-copper-light italic">Marca de Elite</span>
        </h2>
        <p className="font-body text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
          Não entregamos apenas design. Construímos os pilares que sustentam um negócio de alto valor.
        </p>
      </div>

      {/* Grid de Passos/Blocos Horizontais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Passo 01 */}
        <div className="flex flex-col items-center text-center p-6 gap-5 group">
          <span className="font-display text-7xl text-white/5 font-light tracking-tighter group-hover:text-copper-light/20 transition-colors duration-500">01</span>
          <h3 className="font-display text-2xl text-cream">Diagnóstico de Percepção</h3>
          <p className="font-body text-muted leading-relaxed">
            Analisamos como o seu paciente te enxerga hoje e onde você está perdendo dinheiro por falta de diferenciação.
          </p>
        </div>

        {/* Passo 02 */}
        <div className="flex flex-col items-center text-center p-6 gap-5 group">
          <span className="font-display text-7xl text-white/5 font-light tracking-tighter group-hover:text-copper-light/20 transition-colors duration-500">02</span>
          <h3 className="font-display text-2xl text-cream">Engenharia de Marca</h3>
          <p className="font-body text-muted leading-relaxed">
            Criamos uma identidade visual e um tom de voz que eliminam a comparação por preço. Sua clínica passa a transmitir o rigor técnico que você possui.
          </p>
        </div>

        {/* Passo 03 */}
        <div className="flex flex-col items-center text-center p-6 gap-5 group">
          <span className="font-display text-7xl text-white/5 font-light tracking-tighter group-hover:text-copper-light/20 transition-colors duration-500">03</span>
          <h3 className="font-display text-2xl text-cream">Blindagem Comercial</h3>
          <p className="font-body text-muted leading-relaxed">
            Alinhamos sua comunicação para que sua equipe e seu ambiente físico vendam por você, facilitando o fechamento de tratamentos de alto ticket.
          </p>
        </div>

      </div>
    </div>
  </section>
);

const ProvaSocialSection = (
  <section id="prova-social" className="w-full py-24 bg-surface border-y border-white/5 text-cream">
    <div className="max-w-7xl mx-auto px-6">
      
      {/* Título da Seção */}
      <div className="text-center mb-16 md:mb-20">
        <h2 className="font-display text-3xl md:text-4xl lg:text-xg text-cream max-w-3xl mx-auto leading-tight">
          Do Design Estratégico ao <span className="text-copper-light italic">Resultado de Negócio</span>
        </h2>
      </div>

      {/* Layout Flex para Cases */}
      <div className="flex flex-col md:flex-row items-stretch gap-10 lg:gap-12">
        
        {/* Case 1: Cia Odontológica */}
        <div className="flex-1 bg-card p-10 lg:p-12 rounded-2xl border border-white/5 shadow-xl hover:border-copper/30 transition-colors duration-300 flex flex-col justify-start">
          <span className="text-copper font-mono text-sm uppercase tracking-widest mb-5 block">Case: Cia Odontológica</span>
          <h3 className="font-display text-2xl md:text-3xl text-cream mb-6 leading-tight">
            Filtro de Audiência e Aumento de Conversão
          </h3>
          <p className="font-body text-muted leading-relaxed text-lg">
            A clínica sofria com pacientes que buscavam apenas preço popular, gerando baixa margem de lucro. Nossa estratégia visual redefiniu a percepção de valor. O resultado? Redução drástica de curiosos e aumento de pacientes com perfil para tratamentos de alto ticket, otimizando os fechamentos de orçamento.
          </p>
        </div>

        {/* Case 2: Dra. Sandra */}
        <div className="flex-1 bg-card p-10 lg:p-12 rounded-2xl border border-white/5 shadow-xl hover:border-copper/30 transition-colors duration-300 flex flex-col justify-start">
          <span className="text-copper font-mono text-sm uppercase tracking-widest mb-5 block">Case: Dra. Sandra</span>
          <h3 className="font-display text-2xl md:text-3xl text-cream mb-6 leading-tight">
            Posicionamento de Autoridade para Ortodontia de Elite
          </h3>
          <p className="font-body text-muted leading-relaxed text-lg">
            Um projeto sigiloso focado em reposicionar uma profissional de destaque para o público AA. Através de branding sofisticado, garantimos a segurança necessária para que o paciente investisse em tratamentos premium sem questionar o orçamento.
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
    <section id="diagnostico" className="w-full py-24 bg-charcoal text-cream relative overflow-hidden">
      {/* Efeito de iluminação de fundo premium */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-copper/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Títulos */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl lg:text-xg text-cream mb-6 leading-tight">
            Aplicação para Diagnóstico de <span className="text-copper-light italic">Posicionamento de Marca</span>
          </h2>
          <p className="font-body text-lg md:text-xl text-muted">
            Exclusivo para Clínicas e Profissionais de Saúde que buscam elite.
          </p>
        </div>

        {/* Formulário Sofisticado (Dark Mode - Logica Copiada de FormularioInteresse) */}
        <div className="bg-card p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl">
          {success ? (
            <div className="text-center py-10">
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
                <p className="text-[10px] uppercase tracking-widest font-mono text-copper">Sobre você</p>
                
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
                <p className="text-[10px] uppercase tracking-widest font-mono text-copper">Sobre o negócio</p>

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
                      <option value="" disabled className="bg-card text-muted">Selecione...</option>
                      {situacaoMarca.map((opt) => (
                        <option key={opt} value={opt} className="bg-card text-cream">{opt}</option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  </div>
                </div>

                 <div>
                  <label className={labelClass}>Link do site, Instagram ou portfólio</label>
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
                <p className="text-[10px] uppercase tracking-widest font-mono text-copper">Seu momento</p>

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
                      <option value="" disabled className="bg-card text-muted">Selecione...</option>
                      {prazos.map((opt) => (
                        <option key={opt} value={opt} className="bg-card text-cream">{opt}</option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  </div>
                </div>
              </div>

               <hr className="border-white/5 my-8" />

              {/* BLOCO 4: Como conheceu */}
              <div className="space-y-5">
                <p className="text-[10px] uppercase tracking-widest font-mono text-copper">Só curiosidade</p>
                <div>
                  <label className={labelClass}>Como você conheceu o Svicero Studio?</label>
                  <div className="relative">
                    <select
                      name="comoConheceu"
                      value={form.comoConheceu}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none cursor-pointer pr-10`}
                    >
                      <option value="" disabled className="bg-card text-muted">Selecione...</option>
                      {comoConheceu.map((opt) => (
                        <option key={opt} value={opt} className="bg-card text-cream">{opt}</option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
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
                    className="mt-1 w-5 h-5 rounded border-white/20 bg-transparent text-copper focus:ring-copper focus:ring-offset-background"
                  />
                  <span className="text-sm text-cream/80 leading-[1.6]">
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
                  size="lg" 
                  className="w-full md:w-auto text-center"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Quero um Diagnóstico de Posicionamento'}
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
    <div className="min-h-screen bg-charcoal font-body antialiased selection:bg-copper selection:text-cream text-cream">
      {/* 
        Aqui seria o equivalente ao <head> em HTML puro. 
        Como estamos em React, recomendamos o uso de React Helmet 
        para gerenciar as meta tags SEO, Title, etc. 
      */}
      <header className="fixed top-0 w-full z-50 bg-charcoal/90 backdrop-blur-sm border-b border-surface">
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

      <footer className="w-full py-8 text-center bg-charcoal border-t border-surface text-muted text-sm">
        {/* Rodapé básico */}
        <p>&copy; {new Date().getFullYear()} Svicero Studio - Estratégia Odontológica.</p>
      </footer>
    </div>
  );
}
