# Como Contribuir com o Projeto Operação Janela Aberta

Obrigado pelo seu interesse em contribuir! Este documento fornece diretrizes para contribuições ao projeto.

## 🤝 Processo de Contribuição

### 1. Fork do Repositório
1. Acesse o repositório no GitHub
2. Clique no botão "Fork" no canto superior direito
3. Isso criará uma cópia do projeto na sua conta do GitHub

### 2. Clone o seu Fork
```bash
git clone https://github.com/SEU_USUARIO/oja-front.git
cd oja-front
```

### 3. Configure o Repositório Original como Upstream
```bash
git remote add upstream https://github.com/ismaelhugo/oja-front.git
```

### 4. Crie uma Branch para sua Feature
```bash
git checkout -b feature/nome-da-sua-feature
```

### 5. Faça suas Alterações
- Mantenha o código limpo e bem documentado
- Siga os padrões de código existentes
- Teste suas alterações localmente

### 6. Commit suas Alterações
```bash
git add .
git commit -m "feat: descrição clara da alteração"
```

### 7. Push para seu Fork
```bash
git push origin feature/nome-da-sua-feature
```

### 8. Abra um Pull Request
1. Vá para o seu fork no GitHub
2. Clique em "Compare & pull request"
3. Preencha a descrição detalhando suas alterações
4. Aguarde a revisão

## 📋 Diretrizes para Contribuições

### Tipos de Contribuições Aceitas
- 🐛 **Bug fixes**: Correções de problemas existentes
- ✨ **Novas funcionalidades**: Melhorias que agregam valor ao projeto
- 📚 **Documentação**: Melhorias na documentação
- 🎨 **UI/UX**: Melhorias de interface e experiência do usuário
- ⚡ **Performance**: Otimizações de performance
- 🧪 **Testes**: Adição ou melhoria de testes automatizados

### Padrões de Código
- Use TypeScript para tipagem estática
- Siga as convenções do ESLint configurado
- Use componentes funcionais do React
- Implemente responsividade mobile-first
- Mantenha consistência com o design system existente

### Padrões de Commit
Use o formato [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição

feat: adiciona nova funcionalidade de filtros
fix: corrige bug na visualização de dados
docs: atualiza documentação da API
style: ajusta espaçamento dos componentes
refactor: refatora componente de gráficos
test: adiciona testes para utilitários
```

### Estrutura do Pull Request
Inclua no seu PR:

1. **Título claro**: Resumo da alteração em uma linha
2. **Descrição detalhada**: 
   - O que foi alterado
   - Por que foi alterado
   - Como testar as alterações
3. **Screenshots**: Se aplicável, para mudanças visuais
4. **Checklist**:
   - [ ] Testei localmente
   - [ ] Documentação atualizada (se necessário)
   - [ ] Código segue os padrões do projeto
   - [ ] Não quebra funcionalidades existentes

## 🚀 Configuração do Ambiente de Desenvolvimento

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### Instalação
```bash
# Clone seu fork
git clone https://github.com/SEU_USUARIO/oja-front.git
cd oja-front

# Instale dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Verifica problemas de código
npm run type-check   # Verifica tipos TypeScript
```

## 🔍 Processo de Revisão

### Critérios de Aceitação
- Código funciona corretamente
- Segue os padrões estabelecidos
- Não introduz regressões
- Documentação adequada
- Testes passam (quando aplicável)

### Tempo de Revisão
- Pull Requests simples: 1-3 dias úteis
- Pull Requests complexas: 3-7 dias úteis
- Emergências: Priorizadas conforme necessidade

## 🛡️ Código de Conduta

### Nossos Compromissos
- Manter um ambiente respeitoso e inclusivo
- Aceitar críticas construtivas
- Focar no que é melhor para a comunidade
- Demonstrar empatia com outros membros

### Comportamentos Inaceitáveis
- Linguagem ou imagens inadequadas
- Ataques pessoais ou políticos
- Assédio público ou privado
- Publicar informações privadas de terceiros

## 📞 Dúvidas e Suporte

### Canais de Comunicação
- **Issues**: Para bugs e solicitações de features
- **Discussions**: Para dúvidas gerais e discussões
- **Email**: contato@operacaojanelaaberta.com (em breve)

### FAQ

**P: Posso trabalhar em qualquer issue?**
R: Sim, mas verifique se não há alguém já trabalhando. Comente na issue indicando seu interesse.

**P: Quanto tempo tenho para completar uma contribuição?**
R: Não há prazo rígido, mas mantenha comunicação ativa. Issues inativas por 30+ dias podem ser liberadas.

**P: Posso fazer múltiplas alterações em um PR?**
R: Prefira um PR por feature/correção. Isso facilita a revisão e permite merges mais rápidos.

**P: Como reportar problemas de segurança?**
R: Envie email privado para security@operacaojanelaaberta.com (em breve) em vez de criar issue pública.

## 🙏 Reconhecimento

Todas as contribuições são valorizadas e contribuidores serão reconhecidos:
- Nome na seção de Contributors do README
- Menção em releases notes (para contribuições significativas)
- Badge especial de contributor no GitHub

---

**Lembre-se**: Toda contribuição, por menor que seja, faz diferença para a transparência pública no Brasil! 🇧🇷

*Última atualização: Agosto 2024*
