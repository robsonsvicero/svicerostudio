import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';

const tiposAtuacao = [
  'Profissional autônomo (sem CNPJ)',
  'MEI',
  'Pequena empresa',
  'Startup / empresa em crescimento',
  'Outro'
];
const marcaSite = [
  'Tenho logo e site',
  'Tenho logo, mas não tenho site',
  'Tenho site, mas não tenho logo definida',
  'Não tenho nem logo, nem site'
];
const motivos = [
  'Minha marca parece amadora e não me representa mais',
  'Quero ter um site profissional',
  'Quero conseguir cobrar melhor pelos meus serviços',
  'Quero organizar minha comunicação no digital',
  'Outro'
];
const prazos = [
  'Quero começar o quanto antes',
  'Posso começar nos próximos 30 dias',
  'Estou planejando para daqui a 2–3 meses',
  'Ainda não tenho prazo definido'
];
const investimentos = [
  'Quero entender valores primeiro, ainda estou avaliando',
  'Tenho orçamento, mas preciso escolher bem onde investir',
  'Estou pronto para investir, desde que faça sentido para o meu momento'
];
const pacotes = [
  'Pacote Marca de Alto Padrão',
  'Pacote Site Estratégico',
  'Pacote Presença Essencial',
  'Ainda não sei, quero que o estúdio recomende'
];

const FormularioInteresse = () => {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    cidade: '',
    tipoAtuacao: '',
    outroAtuacao: '',
    servico: '',
    marcaSite: '',
    link: '',
    motivo: '',
    outroMotivo: '',
    objetivo: '',
    prazo: '',
    investimento: '',
    pacote: '',
    mensagem: '',
    consent: false
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.tipoAtuacao || !form.servico || !form.marcaSite || !form.motivo || !form.objetivo || !form.prazo || !form.investimento || !form.pacote || !form.consent) {
      setError('Por favor, preencha todos os campos obrigatórios e aceite o consentimento.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/interesse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      } else {
        setError('Erro ao enviar o formulário. Tente novamente ou fale direto pelo WhatsApp.');
      }
    } catch (err) {
      setError('Erro ao enviar o formulário. Tente novamente ou fale direto pelo WhatsApp.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-[#141414] flex flex-col text-[#EFEFEFE] font-sans">
        <Header variant="solid" />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-xl mx-auto bg-cream/20 rounded-2xl p-8 border border-white/10 text-center mt-20 mb-20 lg:mt-36 lg:mb-36">
            <h2 className="text-2xl font-semibold text-[#E9BF84] mb-4">Formulário enviado com sucesso!</h2>
            <p className="text-white/80 mb-6">Em até 3 dias úteis o Svicero Studio vai analisar suas respostas e retornar com os próximos passos por e-mail (e, se necessário, por WhatsApp).<br/>Se precisar falar antes disso, você também pode chamar o estúdio diretamente pelo WhatsApp.</p>
            <Button href="https://wa.me/5511964932007" variant="secondary" >Chamar no WhatsApp</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#141414] flex flex-col text-[#EFEFEF] font-sans">
      <Header variant="solid" />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-12 lg:px-20 lg:py-36">
          <h1 className="font-title text-4xl font-semibold tracking-[-0.06em] text-white mb-4">Formulário de interesse</h1>
          <p className="mb-10 text-white/70">Conte um pouco sobre você e seu negócio para que o Svicero Studio possa te responder com a melhor opção de pacote e próximos passos.</p>
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Dados básicos */}
            <div className="space-y-4">
              <label className="block text-white font-medium">Nome completo*</label>
              <input name="nome" value={form.nome} onChange={handleChange} required className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white" type="text" placeholder="Seu nome" />

              <label className="block text-white font-medium mt-4">E-mail*</label>
              <input name="email" value={form.email} onChange={handleChange} required className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white" type="email" placeholder="Seu e-mail" />
              <span className="text-xs text-white/60">É por aqui que vou te responder com calma.</span>

              <label className="block text-white font-medium mt-4">WhatsApp (com DDD)</label>
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white" type="tel" placeholder="(XX) XXXXX-XXXX" />
              <span className="text-xs text-white/60">Opcional. Só uso se precisar tirar alguma dúvida rápida com você.</span>

              <label className="block text-white font-medium mt-4">Cidade / Estado / País</label>
              <input name="cidade" value={form.cidade} onChange={handleChange} className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white" type="text" placeholder="Sua cidade, estado ou país" />
              <span className="text-xs text-white/60">Só para eu entender de onde você fala (atendo online Brasil e exterior).</span>
            </div>

            {/* Sobre o negócio */}
            <div className="space-y-4">
              <label className="block text-white font-medium">Qual é o seu tipo de atuação hoje?*</label>
              <select name="tipoAtuacao" value={form.tipoAtuacao} onChange={handleChange} required className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white">
                <option value="">Selecione...</option>
                {tiposAtuacao.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              {form.tipoAtuacao === 'Outro' && (
                <input name="outroAtuacao" value={form.outroAtuacao} onChange={handleChange} className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white mt-2" type="text" placeholder="Especifique outro tipo" />
              )}

              <label className="block text-white font-medium mt-4">Em poucas palavras, qual é o seu serviço principal?*</label>
              <input name="servico" value={form.servico} onChange={handleChange} required className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white" type="text" placeholder="Ex.: psicopedagoga infantil, advogado trabalhista, consultor de marketing, etc." />

              <label className="block text-white font-medium mt-4">Você já tem marca (logo) e site hoje?*</label>
              <select name="marcaSite" value={form.marcaSite} onChange={handleChange} required className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white">
                <option value="">Selecione...</option>
                {marcaSite.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>

              <label className="block text-white font-medium mt-4">Se quiser, coloque o link do seu site ou Instagram:</label>
              <input name="link" value={form.link} onChange={handleChange} className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white" type="url" placeholder="https://" />
            </div>

            {/* Momento e objetivo */}
            <div className="space-y-4">
              <label className="block text-white font-medium">Qual é o principal motivo que te fez buscar o Svicero Studio agora?*</label>
              <select name="motivo" value={form.motivo} onChange={handleChange} required className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white">
                <option value="">Selecione...</option>
                {motivos.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              {form.motivo === 'Outro' && (
                <input name="outroMotivo" value={form.outroMotivo} onChange={handleChange} className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white mt-2" type="text" placeholder="Especifique outro motivo" />
              )}

              <label className="block text-white font-medium mt-4">O que você espera mudar com esse projeto?</label>
              <textarea name="objetivo" value={form.objetivo} onChange={handleChange} required className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white min-h-[80px]" placeholder="Pode ser algo simples, como: 'Quero parar de ter vergonha do meu site' ou 'Quero parecer mais profissional para atrair um público mais premium'." />
              <span className="text-xs text-white/60">Pode ser algo simples, como: 'Quero parar de ter vergonha do meu site' ou 'Quero parecer mais profissional para atrair um público mais premium'.</span>

              <label className="block text-white font-medium mt-4">Você já tem algum prazo em mente para essa mudança?*</label>
              <select name="prazo" value={form.prazo} onChange={handleChange} required className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white">
                <option value="">Selecione...</option>
                {prazos.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {/* Orçamento */}
            <div className="space-y-4">
              <label className="block text-white font-medium">Como você enxerga o investimento nesse momento?*</label>
              <select name="investimento" value={form.investimento} onChange={handleChange} required className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white">
                <option value="">Selecione...</option>
                {investimentos.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {/* Pacote de interesse */}
            <div className="space-y-4">
              <label className="block text-white font-medium">Você já tem em mente qual pacote pode fazer mais sentido?</label>
              <select name="pacote" value={form.pacote} onChange={handleChange} required className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white">
                <option value="">Selecione...</option>
                {pacotes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {/* Mensagem extra */}
            <div className="space-y-4">
              <label className="block text-white font-medium">Quer deixar algum detalhe extra?</label>
              <textarea name="mensagem" value={form.mensagem} onChange={handleChange} className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-white min-h-[80px]" placeholder="Aqui você pode contar algo específico sobre o seu momento, dúvidas ou referências que gosta." />
              <span className="text-xs text-white/60">Aqui você pode contar algo específico sobre o seu momento, dúvidas ou referências que gosta.</span>
            </div>

            {/* Consentimento */}
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input name="consent" type="checkbox" checked={form.consent} onChange={handleChange} className="accent-[#B87333]" />
                Concordo em receber contato do Svicero Studio para falar sobre meu projeto.
              </label>
              <span className="text-xs text-white/60">Ao enviar este formulário, você concorda com nossa <a href="/privacidade" className="underline text-[#E9BF84]">Política de Privacidade</a>.</span>
            </div>

            {/* Erro */}
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

            {/* Botão de envio */}
            <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar meu interesse'}
            </Button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FormularioInteresse;
