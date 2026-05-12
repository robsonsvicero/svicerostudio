import React, { useEffect, useState, useRef } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import { API_URL } from '../lib/api.js';

const bulletsParaQuem = [
  'Você está à frente do próprio negócio e sente que sua imagem não acompanha a qualidade do seu trabalho.',
  'Tem vergonha de mostrar seu Instagram ou site quando alguém pede "o link pra te conhecer melhor".',
  'Quer cobrar melhor pelos seus serviços, mas sente que sua marca ainda não sustenta um preço mais alto.',
  'Já entendeu que só um logo bonito não resolve – você precisa de identidade, site e comunicação organizados.',
];

const reforcoParaQuem =
  'Se você se vê em pelo menos dois pontos acima, o Pacote Marca de Alto Padrão foi pensado exatamente para o seu momento.';

const blocosIncluidos = [
  {
    titulo: 'Estratégia e posicionamento',
    itens: [
      'Encontro de diagnóstico e alinhamento (online)',
      'Definição de público-alvo, diferenciais e proposta de valor',
      'Direcionamento de linguagem e tom da marca',
      'Resultado: clareza sobre como você quer ser visto e o espaço que quer ocupar no mercado.',
    ],
  },
  {
    titulo: 'Identidade visual completa',
    itens: [
      'Logo principal + versões de uso (horizontal/vertical, claro/escuro)',
      'Paleta de cores',
      'Tipografia principal e secundária',
      'Elementos gráficos de apoio (ícones, texturas, etc.)',
      'Mini manual de uso da marca (PDF)',
      'Resultado: uma marca que passa confiança, tira a cara de amadorismo e é fácil de aplicar no dia a dia.',
    ],
  },
  {
    titulo: 'Presença digital (site estratégico)',
    itens: [
      'Site de X páginas (Home + Sobre + Serviços + Contato, por exemplo)',
      'Estrutura pensada em UX (experiência do usuário)',
      'Foco em facilitar contato, agendamento ou pedidos',
      'Layout responsivo (funciona bem em celular e computador)',
      'Integração com WhatsApp, redes sociais e formulários de contato',
      'Resultado: um site que parece profissional, ajuda a vender e transmite o nível do seu trabalho.',
    ],
  },
  {
    titulo: 'Kit de materiais para o dia a dia',
    itens: [
      'Arte base para posts ou capas (ex: template de feed/story)',
      'Arte de cartão de visita ou equivalente digital',
      'Arte de capa para WhatsApp/Instagram ou outra rede prioritária',
      'Resultado: tudo que você precisa para manter a comunicação com a mesma cara, sem cada peça parecer de um lugar diferente.',
    ],
  },
  {
    titulo: 'Entrega organizada + suporte inicial',
    itens: [
      'Entrega de todos os arquivos em pasta organizada (Google Drive ou similar)',
      'Vídeo ou guia rápido explicando como usar a nova identidade',
      'Suporte por X dias após a entrega para dúvidas e pequenos ajustes (definir: 15/30 dias, etc.)',
      'Resultado: segurança para implementar a nova marca sem se sentir perdido.',
    ],
  },
];

const processo = [
  'Contato e diagnóstico',
  'Imersão e estratégia',
  'Criação da identidade visual',
  'Construção do site e materiais',
  'Ajustes finais e entrega',
];

const beneficios = [
  'Você para de parecer amador e passa a ser visto como profissional de alto padrão.',
  'Ganha segurança para falar o seu preço sem pedir desculpas.',
  'Passa mais confiança já nos primeiros segundos de contato com sua marca.',
  'Tem um site e uma identidade visual que trabalham por você 24h por dia.',
  'Para de perder tempo "quebrando a cabeça com arte" – sua comunicação fica organizada e consistente.',
];

const bulletsNaoEh = [
  'Você só quer "um logo baratinho pra quebrar o galho".',
  'Não está disposto a participar minimamente do processo (responder questionário, dar feedback).',
  'Quer copiar a marca de outro profissional ou seguir modinha de design.',
];

const reforcoNaoEh =
  'Se você quer construir algo sólido, que ajude o seu negócio a crescer, esse pacote foi pensado para você.';

// Componente único e correto — tudo junto em um só lugar
const PacoteMarca = () => {
  const [depoimentos, setDepoimentos] = useState([]);
  // Guarda a instância diretamente, não num array, pois há apenas um swiper aqui
  const swiperInstanceRef = useRef(null);

  useEffect(() => {
    const fetchDepoimentos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/db/depoimentos/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operation: 'select',
            orderBy: { column: 'ordem', ascending: true },
          }),
        });
        const payload = await res.json();
        setDepoimentos(payload.data || []);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      }
    };
    fetchDepoimentos();
  }, []);

  useEffect(() => {
    if (depoimentos.length === 0) return;

    const timeoutId = setTimeout(() => {
      const el = document.querySelector('.depoimentos-swiper');
      if (!el) {
        console.error('Elemento .depoimentos-swiper não encontrado');
        return;
      }

      // Destrói instância anterior antes de criar uma nova
      if (swiperInstanceRef.current) {
        try {
          swiperInstanceRef.current.destroy(true, true);
        } catch (e) {
          // ignora
        }
        swiperInstanceRef.current = null;
      }

      swiperInstanceRef.current = new Swiper('.depoimentos-swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 24,
        grabCursor: true,
        centeredSlides: false,
        watchOverflow: true,
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
        slidesPerGroup: 1,
        resistanceRatio: 0.85,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        pagination: {
          el: '.depoimentos-swiper .swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.depoimentos-swiper .swiper-button-next',
          prevEl: '.depoimentos-swiper .swiper-button-prev',
        },
        breakpoints: {
          640: { slidesPerView: 1, spaceBetween: 24 },
          768: { slidesPerView: 2, spaceBetween: 32 },
          1024: { slidesPerView: 3, spaceBetween: 32 },
        },
      });
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (swiperInstanceRef.current) {
        try {
          swiperInstanceRef.current.destroy(true, true);
        } catch (e) {
          // ignora
        }
        swiperInstanceRef.current = null;
      }
    };
  }, [depoimentos]);

  return (
    <div className="bg-charcoal min-h-screen flex flex-col text-cream font-body py-14 sm:py-20 md:py-28 lg:py-36">
      <Header variant="solid" />
      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-14 sm:pb-16 lg:px-10 lg:pb-24">
          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-tight text-cream text-balance">
            Pacote Marca de Alto Padrão
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-[1.6] text-muted">
            Para autônomos, MEIs e pequenos negócios que querem sair da "cara de amador" e ter uma
            marca à altura da qualidade do que entregam.
          </p>
        </section>

        {/* PARA QUEM É */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="text-[1.875rem] md:text-4xl font-medium tracking-tight text-cream mb-6">
            Esse pacote é para você se…
          </h2>
          <ul className="space-y-5">
            {bulletsParaQuem.map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-copper/25 bg-copper/10 text-xs font-mono font-medium text-copper">
                  {idx + 1}
                </span>
                <span className="text-muted text-base leading-[1.6]">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg text-copper font-medium">{reforcoParaQuem}</p>
        </section>

        {/* O QUE ESTÁ INCLUÍDO */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="text-[1.875rem] md:text-4xl font-medium tracking-tight text-cream mb-8">
            O que está incluído no Pacote Marca de Alto Padrão
          </h2>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {blocosIncluidos.map((bloco) => (
              <div
                key={bloco.titulo}
                className="rounded-[2rem] border border-white/5 bg-surface p-8 shadow-sm hover:border-white/10 hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-medium tracking-tight text-copper mb-4">{bloco.titulo}</h3>
                <ul className="space-y-3">
                  {bloco.itens.map((item, i) => (
                    <li key={i} className="text-muted text-base leading-[1.6]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESSO */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="text-[1.875rem] md:text-4xl font-medium tracking-tight text-cream mb-6">
            Como vamos trabalhar juntos
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {processo.map((step, idx) => (
              <li key={idx} className="text-muted text-base leading-[1.6]">
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* BENEFÍCIOS */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="text-[1.875rem] md:text-4xl font-medium tracking-tight text-cream mb-6">
            O que muda para o seu negócio com esse pacote
          </h2>
          <ul className="space-y-5">
            {beneficios.map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-copper/25 bg-copper/10 text-xs font-mono font-medium text-copper">
                  {idx + 1}
                </span>
                <span className="text-muted text-base leading-[1.6]">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* PARA QUEM NÃO É */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="text-[1.875rem] md:text-4xl font-medium tracking-tight text-cream mb-6">
            Esse pacote não é para você se…
          </h2>
          <ul className="space-y-5">
            {bulletsNaoEh.map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-copper/25 bg-copper/10 text-xs font-mono font-medium text-copper">
                  {idx + 1}
                </span>
                <span className="text-muted text-base leading-[1.6]">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg text-copper font-medium">{reforcoNaoEh}</p>
        </section>

        {/* INVESTIMENTO E CTA */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20 text-center">
          <div className="rounded-[2rem] border border-white/5 bg-surface shadow-sm p-12 hover:border-white/10 hover:shadow-md transition-all">
            <h2 className="text-[1.875rem] md:text-4xl font-medium tracking-tight text-cream mb-6">
              Investimento
            </h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto leading-[1.6]">
              O Pacote Marca de Alto Padrão é personalizado de acordo com o momento e a complexidade
              do seu negócio.
              <br />
              Me chama no WhatsApp ou preencha o formulário para eu entender sua necessidade e te
              enviar uma proposta clara, sem surpresas.
            </p>
            <Button href="https://wa.me/5511964932007" variant="primary" className="mt-4">
              Quero conversar sobre o pacote
            </Button>
          </div>
        </section>

        {/* DEPOIMENTOS */}
        {depoimentos.length > 0 && (
          <section className="bg-charcoal py-24 px-4 md:px-16 border-t border-white/5">
            <div className="max-w-screen-xl mx-auto">
              <div className="mb-12 text-center md:text-left">
                <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
                  <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
                  FEEDBACK
                </span>
                <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-cream mb-6 text-balance">
                  O que diz quem passa pelo nosso processo
                </h2>
              </div>
              <div className="relative">
                <div className="swiper depoimentos-swiper">
                  <div className="swiper-wrapper py-4">
                    {[...depoimentos]
                      .sort((a, b) => Number(a.ordem) - Number(b.ordem))
                      .map((depoimento) => (
                        <div key={depoimento.id} className="swiper-slide h-auto">
                          <div className="bg-surface rounded-[2rem] border border-white/5 p-8 flex flex-col h-full shadow-sm hover:shadow-md transition-all">
                            <div className="mb-4">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <i
                                  key={i}
                                  className={`fa-solid fa-star text-copper text-xl mr-1 ${
                                    i >= (depoimento.estrelas || 5) ? 'opacity-30' : ''
                                  }`}
                                ></i>
                              ))}
                            </div>
                            <p className="text-muted text-base font-normal leading-[1.6] mb-8 italic flex-1">
                              "{depoimento.texto}"
                            </p>
                            <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-6">
                              <div className="w-12 h-12 flex-shrink-0 rounded-full bg-copper/10 flex items-center justify-center border border-copper/20">
                                <span className="font-medium text-lg text-copper">
                                  {depoimento.iniciais ||
                                    depoimento.nome?.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-cream font-medium text-base">{depoimento.nome}</p>
                                <p className="text-muted text-sm font-normal">
                                  {depoimento.cargo}
                                  {depoimento.empresa ? `, ${depoimento.empresa}` : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="swiper-button-prev !text-copper !bg-white !w-12 !h-12 !rounded-full !shadow-md border border-black/5 after:!text-xl"></div>
                  <div className="swiper-button-next !text-copper !bg-white !w-12 !h-12 !rounded-full !shadow-md border border-black/5 after:!text-xl"></div>
                  <div className="swiper-pagination mt-12 flex justify-center !bottom-0"></div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PacoteMarca;