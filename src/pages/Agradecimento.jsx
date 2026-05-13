import React from "react";
import logo from "../assets/logo_horizontal.png";
import Button from "../components/UI/Button";

const Agradecimento = () => (
  <div className="min-h-screen flex items-center justify-center bg-charcoal px-4 py-12 font-body relative overflow-hidden">
    {/* Efeitos de Luz de Fundo */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-copper/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-copper/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

    <div className="max-w-lg w-full bg-[#141414]/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 text-left border border-white/5 shadow-2xl relative z-10">
      <img
        src={logo}
        alt="Logo Svicero Studio"
        className="mx-auto mb-10 w-40 h-auto"
        style={{ maxWidth: '180px' }}
      />
      
      <span className="flex justify-center mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
          <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]" />
          SOLICITAÇÃO RECEBIDA
        </span>
      </span>

      <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-cream mb-6 text-center">
        Recebemos sua solicitação com sucesso.
      </h1>
      
      <p className="text-muted leading-[1.6] mb-6 text-base">
        Obrigado por compartilhar os detalhes do seu projeto conosco. No Svicero Studio, acreditamos que marcas excepcionais são construídas sobre diagnósticos precisos, e nossa equipe já iniciou a análise preliminar das suas informações.
      </p>
      
      <div className="rounded-xl border border-white/5 bg-[#1A1A1A] p-5 mb-8">
        <p className="text-cream font-medium mb-3 text-base">O que acontece agora?</p>
        <p className="text-muted leading-[1.6] text-sm">
          O próximo passo é uma avaliação técnica do seu posicionamento atual. Em até 48 horas úteis, entraremos em contato via WhatsApp para agendar sua breve reunião estratégica.
        </p>
      </div>

      <p className="text-muted leading-[1.6] mb-8 text-base text-center">
        Estamos ansiosos para entender como podemos elevar o valor de mercado do seu negócio.
      </p>

      <Button
        href="/"
        variant="primary"
        className="w-full text-center"
      >
        Voltar para a Home
      </Button>
    </div>
  </div>
);

export default Agradecimento;
