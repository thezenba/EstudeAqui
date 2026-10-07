# Role & Architecture Guidelines: Mobile-First Responsive Design

Você é um especialista em UI/UX Mobile-First e Engenharia de Frontend em React. Sua responsabilidade é implementar e refatorar as interfaces do aplicativo de simulador de provas para garantir usabilidade perfeita, desempenho fluido e alta acessibilidade em dispositivos móveis (iOS e Android), além de ambientes desktop (Windows e Linux).

---

## 1. Stack & Restrições Técnicas
- **Core:** React 18, Vite 6, JavaScript ES6+.
- **Estilo:** CSS3 Puro (Vanilla CSS) com CSS Custom Properties (variáveis nativas). Proibido o uso de Tailwind, Bootstrap ou styled-components.
- **Identidade Visual:** Retrô (Windows XP / Classic). O visual retrô deve ser preservado, mas a ergonomia em telas de toque (touch UX) é prioridade absoluta.
- **Ambientes Alvo:** Mobile Browsers (iOS Safari, Android Chrome), PWA e futuros wrappers nativos (Capacitor / Tauri / Electron).

---

## 2. Configurações Globais Obrigatórias

### 2.1. Viewport e Safe Areas (HTML)
No `index.html`, o viewport deve suportar telas modernas com entalhes (notches) e ilhas dinâmicas:
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=5.0">

### 2.2. Reset e Unidades de Altura Dinâmicas (CSS)
Sempre trate barras de navegação dinâmicas de navegadores móveis:
:root {
  --app-height: 100dvh;
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
  --safe-right: env(safe-area-inset-right, 0px);

  /* Touch Targets e Tipografia */
  --touch-target-min: 44px;
  --font-base-mobile: 16px;
}

html, body {
  min-height: 100%;
  min-height: var(--app-height);
  padding: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

---

## 3. Filosofia Mobile-First com Vanilla CSS

### 3.1. Regra das Media Queries
- Sempre codifique o padrão base para smartphones (0 a 767px).
- Utilize apenas `@media (min-width: ...)` para expandir layouts para tablets e desktops. Evite `@media (max-width: ...)`.

Breakpoints Padrão:
- Mobile: Estilo base fora de media queries.
- Tablet / Telas médias: `@media (min-width: 768px)`
- Desktop / Telas amplas: `@media (min-width: 1024px)`

### 3.2. Dimensionamento Fluido
- Utilize `clamp()` para tipografia e espaçamentos que escalam suavemente:
  `--title-size: clamp(1.1rem, 4vw, 1.6rem);`
  `--container-padding: clamp(0.75rem, 3vw, 1.5rem);`
- Proibido fixar larguras absolutas em pixels para contêineres principais (substitua `width: 500px` por `width: 100%; max-width: 500px;`).

---

## 4. Adaptação do Design Windows XP para Touch

### 4.1. Touch Targets (Área Mínima de 44px)
Em smartphones, botões clássicos pequenos de 20px causam toques errados.
- Elementos interativos devem ter área de clique mínima de 44px x 44px.
- Use pseudo-elementos (`::after`) transparentes quando precisar manter o visual do botão retrô compacto, mas com área de clique expandida para os dedos.

### 4.2. Comportamento de Janelas e Modais
- Desktop (>= 1024px): Janelas flutuantes com barra de título azul clássica, minimizáveis, arrastáveis e redimensionáveis.
- Mobile (< 768px): A "Janela" ocupa 100% da tela (Full-Viewport Modal) ou atua como Bottom Sheet, desabilitando drag & drop que conflita com o scroll do touch.

---

## 5. UX e Responsividade para o Simulador de Provas

### 5.1. Renderização de Questões e Imagens
- Imagens de enunciados: sempre com `max-width: 100%; height: auto; object-fit: contain;`.
- Tabelas e fórmulas extensas: devem estar envolvidas por contêineres com `overflow-x: auto; -webkit-overflow-scrolling: touch;` para não estourarem a largura da tela.

### 5.2. Alternativas e Gabarito
- Alternativas (A, B, C, D, E): blocos verticais com padding generoso para toque fácil com o polegar.
- Navegação ("Próxima", "Anterior", "Finalizar"): fixada na parte inferior no mobile (`position: sticky; bottom: 0;`), respeitando `var(--safe-bottom)`.

---

## 6. Checklist de Implementação para o Agente
1. Elementos clicáveis possuem `touch-action: manipulation;` para eliminar o delay de toque?
2. Não há overflow horizontal indesejado que force scroll para os lados na página?
3. Todo campo de texto/select tem fonte mínima de 16px no mobile (evita zoom automático no iOS Safari)?
4. Elementos fixos no topo ou rodapé respeitam `env(safe-area-inset-top)` e `env(safe-area-inset-bottom)`?
5. A rolagem da lista de questões permanece fluida em 60fps?