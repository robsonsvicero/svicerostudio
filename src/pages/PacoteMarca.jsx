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
    <div className="bg-[#141414] min-h-screen flex flex-col text-[#EFEFEF] font-body py-20 md:py-36">
      <Header variant="solid" />
      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:px-10 lg:pb-24">
          <h1 className="font-title text-5xl font-semibold tracking-[-0.06em] text-white lg:text-7xl">
            Pacote Marca de Alto Padrão
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 lg:text-xl">
            Para autônomos, MEIs e pequenos negócios que querem sair da "cara de amador" e ter uma
            marca à altura da qualidade do que entregam.
          </p>
        </section>

        {/* PARA QUEM É */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-[DM Sans] text-3xl font-semibold tracking-[-0.04em] text-white mb-6">
            Esse pacote é para você se…
          </h2>
          <ul className="space-y-4">
            {bulletsParaQuem.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">
                  {idx + 1}
                </span>
                <span className="text-white/80 text-base">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg text-[#E9BF84] font-medium">{reforcoParaQuem}</p>
        </section>

        {/* O QUE ESTÁ INCLUÍDO */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-[DM Sans] text-3xl font-semibold tracking-[-0.04em] text-white mb-8">
            O que está incluído no Pacote Marca de Alto Padrão
          </h2>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {blocosIncluidos.map((bloco) => (
              <div
                key={bloco.titulo}
                className="rounded-[30px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur"
              >
                <h3 className="text-xl font-semibold text-[#E9BF84] mb-4">{bloco.titulo}</h3>
                <ul className="space-y-2">
                  {bloco.itens.map((item, i) => (
                    <li key={i} className="text-white/80 text-base">
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
          <h2 className="font-[DM Sans] text-3xl font-semibold tracking-[-0.04em] text-white mb-6">
            Como vamos trabalhar juntos
          </h2>
          <ol className="space-y-4 list-decimal list-inside">
            {processo.map((step, idx) => (
              <li key={idx} className="text-white/80 text-base">
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* BENEFÍCIOS */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-[DM Sans] text-3xl font-semibold tracking-[-0.04em] text-white mb-6">
            O que muda para o seu negócio com esse pacote
          </h2>
          <ul className="space-y-4">
            {beneficios.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">
                  {idx + 1}
                </span>
                <span className="text-white/80 text-base">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* PARA QUEM NÃO É */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-[DM Sans] text-3xl font-semibold tracking-[-0.04em] text-white mb-6">
            Esse pacote não é para você se…
          </h2>
          <ul className="space-y-4">
            {bulletsNaoEh.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">
                  {idx + 1}
                </span>
                <span className="text-white/80 text-base">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg text-[#E9BF84] font-medium">{reforcoNaoEh}</p>
        </section>

        {/* INVESTIMENTO E CTA */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20 text-center">
          <h2 className="font-[DM Sans] text-3xl font-semibold tracking-[-0.04em] text-white mb-6">
            Investimento
          </h2>
          <p className="text-white/80 text-base mb-6">
            O Pacote Marca de Alto Padrão é personalizado de acordo com o momento e a complexidade
            do seu negócio.
            <br />
            Me chama no WhatsApp ou preencha o formulário para eu entender sua necessidade e te
            enviar uma proposta clara, sem surpresas.
          </p>
          <Button href="https://wa.me/5511964932007" variant="secondary" className="mt-4">
            Quero conversar sobre o pacote
          </Button>
        </section>

        {/* DEPOIMENTOS */}
        {depoimentos.length > 0 && (
          <section className="bg-dark-bg py-24 px-4 md:px-16">
            <div className="max-w-screen-xl mx-auto">
              <div className="mb-12 text-left">
                <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
                  <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
                  FEEDBACK
                </span>
                <h2 className="font-title text-4xl md:text-5xl font-extrabold text-white mb-6">
                  O que diz quem passa pelo nosso processo
                </h2>
              </div>
              <div className="relative">
                <div className="swiper depoimentos-swiper">
                  <div className="swiper-wrapper">
                    {[...depoimentos]
                      .sort((a, b) => Number(a.ordem) - Number(b.ordem))
                      .map((depoimento) => (
                        <div key={depoimento.id} className="swiper-slide">
                          <div className="bg-white/5 rounded-2xl border border-secondary700 p-8 flex flex-col h-full shadow-md">
                            <div className="mb-4">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <i
                                  key={i}
                                  className={`fa-solid fa-star text-secondary text-xl mr-1 ${
                                    i >= (depoimento.estrelas || 5) ? 'opacity-30' : ''
                                  }`}
                                ></i>
                              ))}
                            </div>
                            <p className="text-[#B2B8C6] text-base font-normal leading-relaxed mb-6 italic flex-1">
                              "{depoimento.texto}"
                            </p>
                            <div className="flex items-center gap-4 mt-auto">
                              <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#E5E5E5] flex items-center justify-center">
                                <span className="font-semibold text-lg text-secondary700">
                                  {depoimento.iniciais ||
                                    depoimento.nome?.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-bold text-base">{depoimento.nome}</p>
                                <p className="text-[#B2B8C6] text-sm font-normal">
                                  {depoimento.cargo}
                                  {depoimento.empresa ? `, ${depoimento.empresa}` : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="swiper-button-prev"></div>
                  <div className="swiper-button-next"></div>
                  <div className="swiper-pagination mt-12 flex justify-center"></div>
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