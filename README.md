# 🎨 Robson Svicero - Portfólio Profissional

Este é o portfólio de Robson Svicero, especialista em Identidade Visual, UI/UX Design e Desenvolvimento Front-End. Meu foco é transformar ideias em experiências digitais memoráveis, utilizando ReactJS para performance e Tailwind CSS para um design ágil.

![Preview do Projeto](./src/images/preview.webp)

## 🚀 Tecnologias

- **React 18.2.0** - Biblioteca JavaScript para interfaces
- **Vite 5.0.0** - Build tool rápido
- **React Router DOM 6.x** - Navegação client-side
- **Tailwind CSS 3.4.15** - Framework CSS utility-first
- **Swiper 11.0.0** - Carrossel de serviços
- **Font Awesome 6.5.1** - Ícones
- **Formspree** - Processamento de formulários
- **Google Calendar** - Integração de agendamento

## ✨ Funcionalidades

### 🎯 Navegação e Performance
- **Single Page Application (SPA)** com React Router para navegação instantânea
- **Build otimizado** com Vite para carregamento ultra-rápido
- **Imagens em WebP** reduzindo até 70% o tamanho dos arquivos
- **Lazy loading** de componentes para melhor performance

### 🎨 Design e Experiência
- **Design 100% responsivo** adaptado para todos os dispositivos
- **Tema customizado** com Tailwind CSS refletindo identidade visual única
- **Animações suaves** e transições profissionais
- **Componentes reutilizáveis** (Button, Card) com variantes

### 📦 Funcionalidades de Negócio
- **3 páginas de serviços** detalhadas (Identidade Visual, UI/UX Design, Front-End)
- **Formulário de contato** integrado com Formspree
- **Agendamento online** com Google Calendar
- **Galeria de projetos** com links para Behance
- **Carrossel de serviços** com Swiper
- **WhatsApp flutuante** para contato rápido

### 🔍 SEO e Acessibilidade
- **Meta tags otimizadas** (Open Graph, Twitter Card)
- **Sitemap.xml** atualizado
- **Robots.txt** configurado
- **Página 404 customizada** com animação Lottie
- **Schema.org** para dados estruturados

## 📂 Estrutura do Projeto


```
svicerostudio/
├── public/               # Arquivos estáticos
│   ├── robots.txt        # SEO
│   └── sitemap.xml       # Mapa do site
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Layout/      # Header e Footer
│   │   └── UI/          # Button e Card
│   ├── images/          # Imagens (WebP otimizadas)
│   ├── pages/           # Páginas da aplicação
│   │   ├── Home.jsx
│   │   ├── ServiceFrontEnd.jsx
│   │   ├── ServiceIdentidadeVisual.jsx
│   │   ├── ServiceUIUXDesign.jsx
│   │   ├── NotFound.jsx
│   │   ├── Admin.jsx
│   │   ├── AdminBlog.jsx
│   │   ├── AdminAutores.jsx
│   │   ├── AdminProjetos.jsx
│   │   ├── AdminComentarios.jsx
│   │   ├── AdminDepoimentos.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   ├── Contato.jsx
│   │   ├── FAQ.jsx
│   │   ├── Portfolio.jsx
│   │   ├── PlanosPacotes.jsx
│   │   ├── PacoteMarca.jsx
│   │   ├── Agradecimento.jsx
│   │   ├── ExclusaoDados.jsx
│   │   ├── FormularioInteresse.jsx
│   │   ├── Processos.jsx
│   │   ├── ServicePage.jsx
│   │   └── BusinessCard.jsx
│   ├── styles/          # Estilos globais
│   ├── App.jsx          # Configuração de rotas
│   └── main.jsx         # Entry point
├── backend/             # Backend Node.js (caso utilize funcionalidades administrativas)
│   ├── src/
│   └── ...
├── index.html           # HTML principal
├── tailwind.config.js   # Configuração Tailwind
├── vite.config.js       # Configuração Vite
├── package.json         # Dependências
└── README.md            # Documentação
```

## 🛠️ Instalação


1. Clone o repositório:
```bash
git clone https://github.com/robsonsvicero/svicerostudio.git
cd svicerostudio
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:5173
```

## 📦 Build para Produção

## 🗓️ Formato de Datas (posts)

- **Formato recomendado:** sempre salvar `data_publicacao` no formato `YYYY-MM-DD` (ex.: `2026-01-16`).
- **Motivo:** datetimes com `Z` (UTC midnight) são convertidos para o fuso local (ex.: UTC-3), o que pode exibir o dia anterior. Para evitar esse deslocamento, o projeto agora normaliza datas ao salvar e ao exibir.
- **O que foi alterado:**
  - Util de formatação: [src/utils/formatDate.js](src/utils/formatDate.js#L1-L200) — agora interpreta `YYYY-MM-DD` e `YYYY-MM-DDT00:00:00Z` como data local antes de formatar.
  - Admin: [src/pages/AdminBlog.jsx](src/pages/AdminBlog.jsx) — antes de gravar, o campo `data_publicacao` é normalizado para `YYYY-MM-DD`; ao carregar para edição, também é apresentado nesse formato.
- **Como testar localmente:**
  1. Rode o script de testes criado: 

```bash
node scripts/test-formatDate.mjs
```

  2. No admin, crie/edite um post e defina a data de publicação como `2026-01-16`. Verifique na listagem do blog que a data aparece como `16 de janeiro de 2026`.

Se preferir, podemos também adotar a prática de sempre salvar `data_publicacao` com timezone explícito `-03:00` no backend; me avise se quer que eu implemente isso.

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 🚀 Deploy

### Hostinger (Recomendado)

1. Execute o script de deploy:
```bash
.\deploy-hostinger.ps1
```

2. Faça upload do conteúdo da pasta `dist/` para `public_html/` via:
   - File Manager da Hostinger
   - FTP (FileZilla)


## 🖥️ Backend (opcional)

O projeto possui uma pasta `backend/` com API Node.js para funcionalidades administrativas (blog, autores, projetos, comentários, etc). Para rodar o backend:

```bash
cd backend
npm install
node src/server.js
```

O frontend pode funcionar de forma estática, mas recursos administrativos exigem o backend em execução.

### Outros Hosts

O projeto é compatível com qualquer host que suporte:
- Arquivos estáticos
- Mod_rewrite (Apache) ou configuração similar (Nginx)

## 🎨 Personalização

### Cores do Tema

Edite `tailwind.config.js`:

```js
colors: {
  primary: '#2F353B',    // Cinza escuro
  secondary: '#B87333',  // Cobre
  cream: '#F8F7F2',      // Creme
  'dark-bg': '#141414',  // Fundo escuro
}
```

### Fontes

Configuradas no `tailwind.config.js`:
- **Inter** - Corpo do texto
- **Outfit** - Títulos

## 🙏 Créditos e Agradecimentos

Este site foi reconstruído com muito carinho e uma ajudinha de peso. Um salve especial à dupla que garantiu a performance e a agilidade: **ReactJS** (por toda a mágica da interface) e **Tailwind CSS** (por me salvar de vez de escrever muito CSS). Sem eles, a vida do desenvolvedor não seria tão leve!

### Tecnologias que tornaram isso possível:
- **React 18** - A base de tudo
- **Vite** - Build tool que faz a diferença
- **Tailwind CSS** - Styling sem sofrimento
- **Swiper** - Carrosséis elegantes
- **Font Awesome** - Ícones perfeitos
- **Formspree** - Formulários sem backend
- **Lottie** - Animações da página 404

## 📧 Contato

**Website**: [svicerostudio.com.br](https://svicerostudio.com.br)
- **LinkedIn**: [linkedin.com/in/robsonsvicero](https://www.linkedin.com/in/robsonsvicero/)
- **GitHub**: [github.com/robsonsvicero](https://github.com/robsonsvicero)
- **Behance**: [behance.net/robsonsvicero](https://www.behance.net/robsonsvicero)
**Email**: [hello@svicerostudio.com.br](mailto:hello@svicerostudio.com.br)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com 💙 em São Paulo
