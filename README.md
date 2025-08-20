# 🪟 Operação Janela Aberta

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Transparência e acesso à informação pública no Brasil através de inteligência artificial**

A Operação Janela Aberta é uma plataforma open-source que democratiza o acesso aos dados de despesas dos deputados federais brasileiros (CEAP - Cota para Exercício da Atividade Parlamentar) através de interfaces intuitivas e inteligência artificial conversacional.

## 🎯 Missão

Facilitar o acesso às informações de despesas dos deputados federais brasileiros através de:
- 📊 **Visualizações interativas** dos dados CEAP
- 🤖 **IA conversacional** para consultas em linguagem natural
- 📱 **Interface mobile-first** acessível a todos os públicos
- 🔍 **Transparência total** com código aberto

## ✨ Funcionalidades

### Principais Features
- 🔍 **Busca Inteligente**: Consultas em linguagem natural sobre gastos públicos
- 📈 **Gráficos Dinâmicos**: Visualizações interativas por categoria, período e deputado
- ⚖️ **Comparações**: Compare gastos entre deputados, estados e partidos
- 🏆 **Rankings**: Rankings de gastos por diferentes critérios
- 🏢 **Análise de Fornecedores**: Identifique padrões de contratação

### Interface
- 🌙 **Tema escuro** com acentos em amarelo
- 📱 **Responsivo** para todos os dispositivos
- ♿ **Acessível** seguindo padrões WCAG
- ⚡ **Performance** otimizada

## 🚀 Como Funciona

### Pipeline de Dados
1. **📡 Coleta Automática**: Dados da API oficial da Câmara dos Deputados
2. **⚙️ Processamento**: Limpeza, validação e estruturação dos dados
3. **🗂️ Indexação IA**: Vetorização para consultas em linguagem natural
4. **🤖 Interface Conversacional**: LLM processa consultas e gera respostas

### Tecnologias
- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS
- **Backend**: Node.js, PostgreSQL, Vector Database
- **IA**: LLM com RAG (Retrieval-Augmented Generation)
- **Deploy**: Vercel (Frontend), AWS (Backend)

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm/yarn/pnpm
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/ismaelhugo/oja-front.git
cd oja-front

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção  
npm run start        # Servidor de produção
npm run lint         # Linter ESLint
npm run type-check   # Verificação de tipos TypeScript
```

### Estrutura do Projeto

```
oja-front/
├── src/
│   ├── app/           # App Router do Next.js
│   │   ├── globals.css # Estilos globais e animações
│   │   ├── layout.tsx  # Layout principal
│   │   └── page.tsx    # Landing page
│   └── components/     # Componentes reutilizáveis (em breve)
├── public/            # Assets estáticos
├── .github/           # Templates de Issues e PRs
└── docs/              # Documentação (em breve)
```

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Este projeto segue o modelo de **fork + pull request**.

### Processo Rápido
1. 🍴 **Fork** este repositório
2. 🌿 **Crie uma branch**: `git checkout -b feature/minha-feature`
3. 💻 **Faça suas alterações** seguindo os padrões do projeto
4. ✅ **Commit**: `git commit -m "feat: adiciona nova feature"`
5. 📤 **Push**: `git push origin feature/minha-feature`
6. 🔃 **Abra um Pull Request**

### Tipos de Contribuições
- 🐛 **Bug fixes**
- ✨ **Novas funcionalidades**
- 📚 **Documentação**
- 🎨 **Melhorias de UI/UX**
- ⚡ **Otimizações de performance**
- 🧪 **Testes**

📖 **Leia o [Guia de Contribuição](CONTRIBUTING.md) completo**

## 📊 Status do Projeto

🚧 **Em desenvolvimento ativo**

- ✅ Landing page responsiva
- ✅ Design system e animações
- ✅ Documentação de contribuição
- 🔄 Sistema de autenticação
- 🔄 API de dados CEAP
- 🔄 Interface conversacional
- ⏳ Dashboards interativos
- ⏳ Sistema de notificações

## 🌟 Reconhecimentos

### Contributors
<!-- Será atualizado automaticamente -->

### Tecnologias Utilizadas
- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Vercel](https://vercel.com/) - Deploy e hospedagem

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **GitHub**: [@ismaelhugo](https://github.com/ismaelhugo)
- **Website**: [operacaojanelaaberta.com](https://operacaojanelaaberta.com) (em breve)
- **Email**: contato@operacaojanelaaberta.com (em breve)

---

<div align="center">
  <p><strong>🇧🇷 Feito com ❤️ para promover transparência pública no Brasil</strong></p>
  <p>⭐ Se este projeto te ajuda, considere dar uma estrela!</p>
</div>
