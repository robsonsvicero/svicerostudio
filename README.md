# 🎨 Svicero Studio - Engenharia Visual & Design Estratégico

Svicero Studio é uma plataforma de portfólio, blog corporativo e serviços de design estratégico focada em posicionamento de marcas de elite (High-Ticket). O projeto atua com excelência, do diagnóstico à presença digital, combinando uma interface moderna (Front-end) com gerenciamento de conteúdo completo através de um painel administrativo (Back-end).

![Preview do Projeto](./src/images/preview.webp)

## 📖 Índice

- [Descrição do Projeto](#-descrição-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Uso e Execução](#-uso-e-execução)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 📌 Descrição do Projeto

Desenvolvido para **Svicero Studio**, este projeto funciona tanto como um portfólio interativo quanto uma plataforma de atração e conversão contínua. Ele reflete a filosofia da marca: começar pelo negócio, passando por estratégia e culminando no design visual impecável.

A aplicação conta com animações perfeitamente sincronizadas ao longo da rolagem, formulários integrados e um sistema robusto no backend para gerenciamento dinâmico de depoimentos, projetos de sucesso, comentários e postagens no blog corporativo.

## ✨ Funcionalidades

- **Experiência Visual Imersiva:** Animações baseadas em scroll (Intersection Observer) com _Framer Motion_ em todas as sessões e componentes.
- **Plataforma de Blog e FAQ Dinâmicos:** Criação e publicação de conteúdos direto de um painel de administração customizado.
- **Gestão de Depoimentos e Projetos:** Adição de novos cases e feedbacks de clientes via painel, com envio de imagens compactadas dinamicamente via backend.
- **Performance e SEO:** Otimização para mecanismos de busca e uso assertivo de formatos WebP, gerando máxima otimização com build extremamente veloz no _Vite_.
- **Atendimento Omnichannel:** Captura de Leads (Formulários de Interesse com Formspree) e redirecionamento dinâmico para WhatsApp.
- **Interface e Tematização Dark Premium:** UI altamente estilizada com esquema de cores Dark Mode / Cobre (transmitindo Luxo/Estratégia).

## 🚀 Tecnologias

### Front-end
- **React 18** e **Vite** para máxima produtividade e velocidade.
- **Tailwind CSS** para design utility-first fluido e altamente responsivo.
- **Framer Motion** para animações poderosas conectadas à interceptação de exibição.
- **Swiper JS** para carrosséis dinâmicos integrados.
- **React Router DOM 6+** na gestão de rotas, layouts e navegação client-side.

### Back-end
- **Node.js** e **Express 5.x** provendo uma API REST escalável e concisa.
- **MongoDB & Mongoose** como banco de dados NoSQL de alta interatividade.
- **JSON Web Tokens (JWT) & Bcryptjs** na camada de criptografia e autenticação do Painel Administrativo.
- **Multer e Sharp** para recebimento, tratamento de redimensionamento e compressão de imagens antes do armazenamento (s3/local).

## 📂 Estrutura do Projeto

```bash
svicerostudio/
├── backend/                  # API Rest e Banco de Dados (Express, MongoDB)
│   ├── scripts/              # Scripts de utilidade (seed, setup-admin, testes)
│   ├── src/
│   │   ├── middleware/       # Controle de acesso e autenticação JWT
│   │   ├── models/           # Schemas Mongoose (Post, Projeto, Comment, Depoimento...)
│   │   ├── routes/           # Mapeamento e lógica das Endpoints
│   │   ├── utils/            # Funções helpers
│   │   └── server.js         # Entry-point da API
│   └── package.json    
├── public/                   # Estáticos, sitemap e robots.txt
├── src/                      # Código Front-end Principal (React)
│   ├── api/                  # Clientes e instâncias de requisição web (Axios/Fetch)
│   ├── components/           # Componentes base e Blocos das páginas (UI/Admin/Home)
│   ├── pages/                # Rotas React completas e Telas do site
│   │   └── admin/            # Telas de CRUD e gestão CMS (Painel Admin)
│   ├── styles/               # CSS global (directives Tailwind)
│   └── utils/                # Ajudantes de frontend (Slugs, Formatadores)
├── index.html
├── tailwind.config.js        # Tokens de UI (Escala de cinzas, cores primárias, fontes)
└── vite.config.js            # Regras e plugins de empacotamento
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [MongoDB](https://www.mongodb.com/) rodando localmente (porta 27017) ou uma [URI do Atlas](https://www.mongodb.com/cloud/atlas).
- [Git](https://git-scm.com/)

### Passo a Passo

1. **Clone do Repositório**
   ```bash
   git clone https://github.com/robsonsvicero/svicerostudio.git
   cd svicerostudio
   ```

2. **Configuração do Backend**
   Abra um terminal e acesse a pasta `backend/`:
   ```bash
   cd backend
   npm install
   ```
   Crie um arquivo `.env` na raiz do backend baseado nas variáveis utilizadas no sistema:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/svicerodb
   JWT_SECRET=sua_chave_secreta_jwt
   ```
   *Se quiser iniciar o banco de dados com um usuário administrador:*
   ```bash
   npm run setup-admin
   ```

3. **Configuração do Frontend**
   No terminal alocado na raiz do projeto (`svicerostudio/`):
   ```bash
   npm install
   ```
   Para testes e apontamentos da api, pode-se criar `VITE_API_URL=http://localhost:5000` em um `.env` do front.

## 💻 Uso e Execução

O framework proporciona scripts organizados para facilitar a execução conjunta.

**A partir do diretório raiz (`svicerostudio/`):**

- **Iniciando Ambiente de Desenvolvimento:**
  ```bash
  # Inicia somente o servidor Backend (Node/Express)
  npm run dev:api 

  # Inicia o servidor Frontend (React/Vite) em modo de escuta
  npm run dev 
  ```

- **Gerando Build de Produção:**
  Para gerar arquivos otimizados prontos para deploy estático.
  ```bash
  npm run build
  ```
  Isso gera a pasta `/dist` que pode ser enviada a um servidor.
  *(Atenção: recursos como blog/admin dependem da inicialização de produção também na pasta `backend/` com `npm run start`)*.

## 🤝 Contribuição

Contribuições ajudam a aprimorar o código e a arquitetura visual da plataforma.

1. Faça o Fork deste repositório
2. Crie uma branch para sua nova funcionalidade (`git checkout -b feature/MinhaInovacao`)
3. Faça o commit de suas ações (`git commit -m 'feat: adicionar tal melhoria'`)
4. Empurre suas modificações (`git push origin feature/MinhaInovacao`)
5. Abra um **Pull Request**.

Qualquer dúvida ou debate de ideia, abra uma nova **Issue**.

## 📄 Licença

Este projeto está registrado sob a **Licença MIT** livre e padrão de mercado. Veja o arquivo base [LICENSE](LICENSE) deste repositório para detalhes sobre condições e permissões.

---

**Svicero Studio • Engenharia Visual & Design Estratégico**
- **Website:** [svicerostudio.com.br](https://svicerostudio.com.br/)
- **Instagram:** [@svicerostudio](https://instagram.com/svicerostudio)

*Desenvolvido com 💙 em São Paulo.*
