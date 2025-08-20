# Configuração GitHub para Operação Janela Aberta

Este documento descreve as configurações recomendadas para o repositório no GitHub.

## 🛡️ Proteção de Branches

### Branch Principal (main)
Configure as seguintes proteções na branch `main`:

1. **Require a pull request before merging**
   - ✅ Require approvals: 1
   - ✅ Dismiss stale reviews when new commits are pushed
   - ✅ Require review from code owners (quando CODEOWNERS for criado)

2. **Require status checks to pass before merging**
   - ✅ Require branches to be up to date before merging
   - Checks obrigatórios:
     - `build` (quando CI for configurado)
     - `type-check` (quando CI for configurado)
     - `lint` (quando CI for configurado)

3. **Require linear history**
   - ✅ Require linear history (opcional, mas recomendado)

4. **Restrict pushes that create files**
   - ✅ Restrict pushes that create files with paths matching certain patterns
   - Patterns: `package-lock.json`, `yarn.lock` (para evitar conflitos)

## 👥 Colaboradores e Permissões

### Tipos de Acesso
- **Admin**: Mantedor principal (@ismaelhugo)
- **Write**: Colaboradores frequentes (a definir)
- **Triage**: Moderadores de issues (a definir)
- **Read**: Contribuidores externos (padrão)

### Configurações de Colaboração
1. **Base permissions**: Read
2. **Allow forking**: ✅ Enabled
3. **Allow merge commits**: ✅ Enabled
4. **Allow squash merging**: ✅ Enabled (preferido)
5. **Allow rebase merging**: ❌ Disabled
6. **Delete head branches automatically**: ✅ Enabled

## 🏷️ Labels e Templates

### Labels Personalizados
```yaml
# Tipos de Issue
- name: "bug"
  color: "d73a4a"
  description: "Algo não está funcionando"

- name: "enhancement"
  color: "a2eeef"
  description: "Nova funcionalidade ou solicitação"

- name: "documentation"
  color: "0075ca"
  description: "Melhorias ou adições à documentação"

- name: "good first issue"
  color: "7057ff"
  description: "Boa para novos contribuidores"

- name: "help wanted"
  color: "008672"
  description: "Ajuda extra é solicitada"

# Prioridades
- name: "priority: high"
  color: "ff6b6b"
  description: "Alta prioridade"

- name: "priority: medium"
  color: "feca57"
  description: "Média prioridade"

- name: "priority: low"
  color: "48dbfb"
  description: "Baixa prioridade"

# Status
- name: "needs-triage"
  color: "fbca04"
  description: "Precisa ser triado"

- name: "in-progress"
  color: "0e8a16"
  description: "Em desenvolvimento"

- name: "blocked"
  color: "b60205"
  description: "Bloqueado por dependência"
```

## 🔧 Configurações do Repositório

### Geral
- **Visibility**: Public
- **Include in the GitHub Archive Program**: ✅
- **Sponsorship**: ✅ (para doações futuras)

### Features
- **Wikis**: ❌ (usaremos o diretório docs/)
- **Issues**: ✅
- **Projects**: ✅ (para roadmap)
- **Discussions**: ✅ (para Q&A da comunidade)

### Pull Requests
- **Always suggest updating pull request branches**: ✅
- **Allow auto-merge**: ✅
- **Automatically delete head branches**: ✅

### Security
- **Private vulnerability reporting**: ✅
- **Dependency graph**: ✅
- **Dependabot alerts**: ✅
- **Dependabot updates**: ✅
- **Code scanning**: ✅ (quando configurado)

## 📊 Integrações Recomendadas

### Vercel (Deploy)
- Auto-deploy de PRs para preview
- Deploy automático da main para produção

### Dependabot
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore"
      include: "scope"
```

### GitHub Actions (Futuro)
- Build automático
- Testes automatizados
- Deploy automático
- Verificação de qualidade de código

## 📋 Workflows Recomendados

### Para Issues
1. Issue criada → Label `needs-triage`
2. Triagem → Labels apropriados + assignee
3. Em desenvolvimento → Label `in-progress`
4. Resolução → Close via PR

### Para Pull Requests
1. PR aberto → Reviews automáticos
2. Aprovação → Merge via squash
3. Deploy automático → Vercel

## 🤖 Automações Futuras

### Bots Úteis
- **Welcome Bot**: Mensagem para novos contribuidores
- **Stale Bot**: Fechar issues inativas
- **Size Label**: Labels automáticos baseados no tamanho do PR
- **Semantic Release**: Versionamento automático

---

**Nota**: Algumas configurações requerem permissões de admin no repositório GitHub.
