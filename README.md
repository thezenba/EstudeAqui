# 🏛️ EstudeAqui — Simulador Clássico INEP / ENEM / Vestibulares

> **Simulador educacional de alta concentração com interface clássica desktop estilo Windows XP / Classic em Preto e Branco.**  
> Mais de 1.800 questões oficiais do ENEM (2015 a 2024), vestibulares tradicionais e concursos públicos para estudo offline.

---

## 📖 Documentação de Referência e Arquitetura

Para desenvolvedores e Agentes de IA que forem manter ou evoluir este projeto, consulte o guia mestre canônico:
👉 **[AGENTS.md](file:///e:/Projects/EstudeAqui/AGENTS.md)** — Contém as regras invioláveis de design, estrutura de pastas, schemas de dados, fluxo de estado do React e instruções de rollback.

---

## ⚡ Início Rápido

### 1. Execução Rápida Offline no Windows (Sem Node.js)
Dê um duplo clique no arquivo:
```
public/INICIAR_ESTUDEAQUI.bat
```
O script iniciará um servidor HTTP nativo local e abrirá a aplicação em seu navegador padrão.

### 2. Desenvolvimento com Node.js e Vite
```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build

# Testar prévia do build de produção
npm run preview
```

---

## 🚀 Funcionalidades Principais

* **Modo Simulado vs. Modo Treino:**
  * **Simulado:** Cronômetro oficial regressivo, sem consulta de respostas durante a prova e emissão de relatório completo ao finalizar.
  * **Treino:** Resolução com conferência imediata de gabarito e comentários para estudo contínuo.
* **Seleção Versátil de Provas:**
  * **Provas Oficiais Individuais:** Cadernos organizados por ano e dia de aplicação.
  * **Simulado Misto por Disciplina:** Sorteio randômico de questões específicas por matéria (História, Geografia, Física, Química, Biologia, Matemática, etc.).
  * **Combo de Provas:** Criação de cadernos personalizados combinando múltiplas edições.
* **Recursos do Exibidor de Questões:**
  * Risco/eliminação de alternativas (*strikethrough*).
  * Marcação de questões com bandeira (*flag*) para revisão.
  * Grade lateral de navegação instantânea.
* **Acessibilidade e Temas Visuais:**
  * Clássico P&B (escala de cinza Windows 2000/XP).
  * Alto Contraste Claro (leitura de alto foco).
  * Modo Escuro e Alto Contraste Escuro (conforto visual noturno).
  * Ajuste de tipografia com 3 tamanhos de fonte.

---

## 🔒 Checkpoint de Segurança e Restauração

Este projeto conta com um checkpoint estável versionado:
* **Tag Git:** `v1.0.0-checkpoint`
* **Backup Físico:** `backup/checkpoint_v1.0_estavel_20261007.zip`

Caso alguma modificação comprometa o funcionamento ou o propósito do projeto, execute no terminal:
```bash
git reset --hard v1.0.0-checkpoint
git clean -fd
```
Para mais detalhes sobre recuperação, leia o [AGENTS.md](file:///e:/Projects/EstudeAqui/AGENTS.md).
