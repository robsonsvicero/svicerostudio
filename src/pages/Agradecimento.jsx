
import React from "react";
import logo from "../images/logo_alternativo 1.png";
import Button from "../components/UI/Button";

const Agradecimento = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-bg px-2 py-8">
    <div className="max-w-lg w-full bg-gelo rounded-2xl p-8 text-left border border-white/10">
      <img
        src={logo}
        alt="Logo Svicero Studio"
        className="mx-auto mb-8 w-40 h-auto"
        style={{ maxWidth: '180px' }}
      />
      <h1 className="text-2xl md:text-2xl font-bold text-low-dark mb-5 text-center">Recebemos sua solicitação com sucesso.</h1>
      <p className="text-low-medium mb-4 text-base">
        Obrigado por compartilhar os detalhes do seu projeto conosco. No Svicero Studio, acreditamos que marcas excepcionais são construídas sobre diagnósticos precisos, e nossa equipe já iniciou a análise preliminar das suas informações.
      </p>
      <p className="text-low-dark font-semibold mb-2 text-base">O que acontece agora?</p>
      <p className="text-low-medium mb-4 text-base">
        O próximo passo é uma avaliação técnica do seu posicionamento atual. Em até 48 horas úteis, entraremos em contato via WhatsApp para agendar sua breve reunião estratégica.
      </p>
      <p className="text-low-medium mb-4 text-base">
        Estamos ansiosos para entender como podemos elevar o valor de mercado do seu negócio.
      </p>
      <p className="text-low-dark mb-6 text-base">Cordialmente, Equipe <strong>Svicero Studio</strong></p>
      <Button
        href="/"
        variant="secondary"
        className="w-full text-center"
      >
        Visite o nosso site
      </Button>
    </div>
  </div>
);

export default Agradecimento;
