# UI-SPEC.md — CryptoMinerSimulator

## Documento de Design da Interface do Usuário

**Versão:** 0.1 (RFC)
**Status:** Aguardando Aprovação
**Data:** 2026-07-07

---

## 1. Visão Geral e Objetivos

### 1.1 Contexto

O **CryptoMinerSimulator** é um simulador complexo de gestão de exploração de criptomoedas, com profundos sistemas de engenharia elétrica, térmica e econômica. A interface atual é funcional, mas não transmite a complexidade e a "graça" do sistema.

### 1.2 Objetivos da UI/UX

1. **Profissionalismo Técnico:** A interface deve parecer um software de controle industrial real (SCADA/Dashboard de Data Center).
2. **Densidade Informativa:** Maximizar a quantidade de dados relevantes visíveis sem criar desordem (clutter).
3. **Clareza Hierárquica:** Usar cor, tipografia e tamanho para guiar o olho do jogador para as informações mais importantes.
4. **Feedback Imediato:** Cada ação do jogador deve ter uma resposta visual clara e imediata.
5. **Imersão:** Criar um ambiente digital que reforce a fantasia de ser um engenheiro chefe de uma operação de mineração.

### 1.3 Escopo

Este documento aplica-se à interface principal da aplicação (`App.tsx`) e todos os seus componentes filhos. Além dos componentes existentes (`Dashboard`, `ControlPanel`, `BuildMenu`, `GameGrid`), serão criados novos componentes para suportar as novas funcionalidades de UI.

---

## 2. Design System (Identidade Visual)

### 2.1 Paleta de Cores (Tema Escuro "Dark Mode Industrial")

| Tipo | Hex | Tailwind | Uso |
| :--- | :--- | :--- | :--- |
| **Backgrounds** | | | |
| `bg-base` | `#0B1215` | `bg-slate-950` | Fundo da tela/<body>. |
| `bg-panel` | `#111A21` | `bg-slate-900` | Painéis, sidebars, cards. |
| `bg-surface` | `#1E293B` | `bg-slate-800` | Elementos interativos (botões, inputs). |
| `bg-hover` | `#334155` | `bg-slate-700` | Estado hover de superfícies. |
| **Textos** | | | |
| `text-primary` | `#F8FAFC` | `text-slate-100` | Texto principal, títulos. |
| `text-secondary` | `#94A3B8` | `text-slate-400` | Labels, descrições. |
| `text-muted` | `#475569` | `text-slate-600` | Texto desabilitado/informações de baixa prioridade. |
| **Cores Semânticas / Status** | | | |
| `accent-green` | `#4ADE80` | `text-green-400` | Sucesso, energia, saúde (desejável). |
| `accent-blue` | `#60A5FA` | `text-blue-400` | Informação, normalidade (status). |
| `accent-orange` | `#FB923C` | `text-orange-400` | Atenção, sobreaquecimento, moderação. |
| `accent-red` | `#F87171` | `text-red-400` | Perigo, falha, crítico. |
| `accent-purple` | `#A78BFA` | `text-purple-400` | Pesquisa, upgrade, elementos de destaque. |
| `accent-cyan` | `#22D3EE` | `text-cyan-400` | Valores numéricos, dados de hashrate. |
| **Bordas** | | | |
| `border-subtle` | `#263840` | `border-slate-800` | Bordas padrão. |
| `border-active` | `#3B82F6` | `border-blue-500` | Elemento selecionado/ativo. |

### 2.2 Tipografia

| Elemento | Fonte | Peso | Tamanho | Estilo | Cor |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 (Títulos de Seção)** | `Inter` | Bold (700) | 14px | Uppercase, tracking-widest | `text-primary` |
| **H2 (Subtítulos/Cards)** | `Inter` | SemiBold (600) | 13px | Sentence case | `text-primary` |
| **Body (Corpo de texto)** | `Inter` | Regular (400) | 13px / 14px | Sentence case | `text-secondary` |
| **Data / Numbers** | `JetBrains Mono` | Bold (700) | 24px | Monospace | `accent-cyan` / `accent-green` |
| **Labels** | `Inter` | Medium (500) | 11px | Uppercase | `text-muted` |
| **Badges / Tags** | `Inter` | SemiBold (600) | 11px | Uppercase | Varia |

*Nota: Para a fonte `JetBrains Mono`, o projeto deve adicionar a dependência `@fontsource/jetbrains-mono` ou importar via CDN.*

### 2.3 Formas e Espaçamento

- **Border Radius (Arredondamento):**
  - Padrão: `4px` (ex: botões, inputs)
  - Cards/Painéis: `0px` para um look mais "técnico/profissional", ou `8px` para algo mais moderno.*Decisão de design a ser tomada*.
- **Espaçamento (Padding/Gap):**
  - Padrão 16px (`p-4`, `gap-4`).
  - Densos: 8px (`p-2`, `gap-2`) para tabelas e listas compactas.
  - Separadores: `1px` de espessura, cor `border-subtle`.

---

## 3. Arquitetura da Interface (Layout)

### 3.1 Estrutura Geral (Desktop Principal)

A disposição dos elementos na tela.`
```
+--------------------------------------------------------------------+
|  [HEADER]                                                          |
|  [Logo]  [Global Resource Monitor (Fiat, BTC, Hash, Power)]       |
+-----------+---------------------------+---------------------------+
|           |                           |                           |
|  SIDEBAR  |     MAIN CONTENT AREA     |  RIGHT SIDEBAR (Inspector)   |
|           |                           |                           |
| BuildMenu |     INTERACTIVE GRID      |  [Entity Details]           |
|           |                           |  [Status Gauges]            |
|           |                           |  [Action Buttons]           |
|           |                           |                           |
+-----------+---------------------------+---------------------------+
|  [FOOTER/BOTTOM BAR]                                               |
|  [Event Log / System Notifications / Mini-Map]                     |
+--------------------------------------------------------------------+
```

### 3.2 Responsividade e Responsabilidade

- **Desktop (>= 1280px):** Layout de 3 colunas (Sidebar Esquerda, Main, Sidebar Direita).
- **Tablet (768px - 1279px):** Sidebar direita (Inspector) pode ser um drawer/painel sobreposto. Grid adaptativo.
- **Mobile (< 768px):** Layout em abas/tabs. Sidebar esquerda (BuildMenu) se torna um drawer. Grid simplificado.

---

## 4. Componentes Principais (Especificação)

### 4.1 Header (Top Bar) — "Command Center Monitor"

Transformar o atual `Dashboard` em um painel de status global mais imersivo e visual.

**Funcionalidades:**
- **Resource Monitor:**
  - **FIAT ($):** Ícone de dólar, valor numérico grande (Fonte JetBrains Mono, verde), e uma pequena tendência (+/- por segundo).
  - **Bitcoin (BTC):** Ícone de Bitcoin, valor numérico grande (laranja), com histórico de mineração.
  - **Hashrate Total:** Ícone de lightning bolt, valor em TH/s (ciano), com barra de progresso showing capacity.
  - **Redundância / Estado Elétrico:** Indicador visual simples (círculo verde/amarelo/vermelho) + texto.
- **Clock/Tick Display:** Mostrar o tick atual do sistema de forma discreta.
- **Settings/Menu:** Ícone de engrenagem ou hambúrger para acessar configurações (som, velocidade, etc.).

**Referência Visual:**

```
+-----------------------------------------------------+---+
| [LOGO]  FIAT        |  BTC          |  HASHRATE      |  G| → Global Status
| $10,023.50  ▲12.5/s |  0.0452 BTC  |  14.2 TH/s    |  S| → Settings Gear
| (JetBrains Mono)    | (Orange)     |  (Cyan)       |  |
+-----------------------------------------------------+---+
```

### 4.2 Left Sidebar — "Build & Blueprint Menu"

Transformar o atual `BuildMenu` em um menu de construção mais visual e informativo, similar a um blueprint técnico.

**Funcionalidades:**
- **Categorias (Tabs):** Alternar entre "Power", "Mining", "Cooling", "Upgrades".
- **Lista de Itens:**
  - Cada item deve ser um Card horizontal com:
    - **Ícone/Ilustração:** Representação simples do prédio.
    - **Nome:** (ex: "Diesel Generator")
    - **Custo:** Em FIAT (verde).
    - **Stats Chave (TL;DR):** Potência (kW), Hashrate (TH/s), etc. (Ícones pequenos).
    - **Estado:** Botão "Buy" (se tiver dinheiro) ou "Cannot Afford" (desabilitado, escurecido).
  - **Filtro de Pesquisa:** Campo de input para filtrar por nome de prédio.
  - **Tooltips:** Ao passar o mouse sobre o item, mostrar um tooltip detalhado com todas as specs técnicas (consumo de energia, geração de calor, durabilidade, etc.).

**Interação:**
- **Clique único:** Seleciona o item para colocação no grid.
- **Selecionado:** Destaque de borda azul (`border-active`), e o cursor do mouse muda para uma "ghost" do prédio.

### 4.3 Main Content Area — "Interactive Grid"

Transformar o atual `GameGrid` em um canvas interativo visualmente rico.

**Funcionalidades:**
- **Tamanho e Zoom:** O grid deve ser scrollável/pannable. Suportar zoom in/out (Ctrl+Scroll ou +/- buttons).
- **Células (Tiles):**
  - **Empty:** Cor de fundo neutra. Ao passar o mouse, mostra um preview semi-transparente do prédio selecionado.
  - **Occupied:**
    - **Ícone do Prédio:** Representação grande e clara.
    - **Status Visual:** Pequeno indicador de status no canto (verde=ok, amarelo=sobreaquecido, vermelho=falha).
    - **Durabilidade:** Uma pequena barra de HP na parte inferior da célula (verde→amarelo→vermelho).
    - **Conexões:** Linhas finas e sutis entre prédios conectados (por exemplo, Miner→Generator).
  - **Efeitos:**
    - **Emissão de luz/Brilho:** Prédios ativos ativos devem ter um leve brilho/glow (ex: Generator emite luz amarela).
    - **Partículas:** Efeitos sutis para Miners (pequenos números flutuando "+0.00001 BTC") ou Fans (pequenas bolinhas de ar).
- **Context Menu:** Ao clicar com o botão direito em um prédio, abre um menu com opções: "Upgrade", "Repair", "Demolish", "Inspect".

### 4.4 Right Sidebar — "Entity Inspector / Details"

**NOVO COMPONENTE.** Aparece quando um prédio é selecionado (clicado) no grid.

**Funcionalidades:**
- **Header:** Nome do Prédio (ex: "ASIC Miner S9 #42") e Status (Badge colorido).
- **Gauges / Métricas:**
  - **Gráfico de Pizza/Donut:** Mostrar Idle vs. Active time (se aplicável).
  - **Barras de Progresso:** Durabilidade, Eficiência Térmica, Uso de Energia.
- **Status Técnico Detalhado:**
  - `Voltage: 240V | Current: 5.2A`
  - `Temp: 65°C (Stable)`
  - `Hashrate: 14.0 TH/s`
  - `Earnings: +0.000012 BTC/day`
- **Ações:**
  - `[Upgrade]` (se aplicável, mostrar custo).
  - `[Repair]` (se durabilidade < 90%, mostrar custo).
  - `[Demolish]` (com um pequeno ícone de lixo, e confirmação).
- **Histórico:** Pequeno gráfico de sparkline mostrando a temperatura ou hashrate ao longo dos últimos X ticks.

### 4.5 Footer / Bottom Bar — "System Log & Mini-Map"

**NOVO COMPONENTE.**

**Funcionalidades:**
- **Event Log:** Uma pequena área de texto (scrollável) que mostra eventos do sistema em tempo real (e.g., "Miner #3 overheat detected", "Electricity bill paid: -$120", "BTC Mined: +0.00002").
- **Mini-Map:** Uma versão miniaturizada do grid, mostrando a posição geral dos prédios (pontos coloridos). Permite clicar para navegar rápido no grid.
- **Global Warnings:** Se algum prédio está em estado crítico (falha, sobreaquecimento), uma banner vermelho pulsante aparece no topo do footer com o alerta e um botão "Go to".

---

## 5. Animações e Transições

### 5.1 Princípios

- **Subtlety (Subtileza):** As animações devem ser rápidas e funcionais, nunca chamativas ao ponto de distrair.
- **Feedback:** Toda ação do usuário deve receber feedback visual.
- **Performance:** Usar `transform` e `opacity` para animações (GPU-accelerated).

### 5.2 Especificações

- **Seleção de Item no Menu (BuildMenu):** 
  - Ao clicar: `scale(0.95)` por 100ms, depois `scale(1.0)`.
  - Estado de `selected`: Borda azul com `box-shadow: 0 0 10px rgba(59, 130, 246, 0.5)` (glow sutil).
- **Colocação de Prédio no Grid:**
  - Ao clicar no grid: Efeito de "construção" (rápido, ex: um flash de luz branca que desaparece em 200ms).
  - Prédio aparece com `opacity: 0` → `opacity: 1` e `scale(0.5)` → `scale(1.0)` em 300ms (ease-out).
- **Atualização de Status no Grid (ex: Durabilidade):**
  - Mudança de cor de fundo da barra de durabilidade: transição suave de 500ms.
  - Se atingir status crítico (< 20%): Pulse animation sutil no background da célula.
- **Mudança de Valores no Header (ex: Fiat):**
  - Aumento de valor: Texto verde, animação de `translateY(-5px)` e `opacity` em 500ms ("pop up").
  - Diminuição de valor: Texto vermelho, animação de shake (esquerda-direita)
- **Abertura do Inspector (Right Sidebar):**
  - `translateX(100%)` → `translateX(0)` em 300ms (ease-in-out).
- **Notificações no Footer:**
  - Entrada: `translateX(-100%)` → `translateX(0)` (slide in da esquerda).
  - Saída (auto, após 5s): `opacity: 1` → `opacity: 0`.

---

## 6. Interatividade e Feedback

### 6.1 Cursor / Mouse

- **Cursor Padrão:** `default`.
- **Hover no Grid:** `crosshair` (indicando seleção de área/tile).
- **Arrastar o Grid (Pan):** `grab` (quando o usuário quer mover o viewport do grid).
- **Hover em Botão Desabilitado:** `not-allowed`.
- **Prédio Selecionado para Colocação:** O cursor deve ser um "ghost" pequeno e semi-transparente do ícone do prédio, seguindo o mouse.

### 6.2 Tooltips

- **Delay:** 300ms após hover.
- **Conteúdo:** Informações detalhadas e técnicas sobre o item.
- **Estilo:** Fundo escuro (`bg-slate-900`), borda sutil, texto branco, padding de 8px, border-radius de 4px.

### 6.3 Confirmações

- **Ações Destrutivas (ex: Demolish):** O sistema deve requerer uma confirmação (um modal simples: "Are you sure you want to demolish [Entity Name]? This action cannot be undone.").
- **Ações de Alto Custo (ex: Upgrade caro):** Uma mudança visual sutil no botão (ex: brilho) quando o jogador tem fundos suficientes.

### 6.4 Modo de Construção

- Quando um item é selecionado no `BuildMenu`, o modo de construção é ativado.
- O grid deve destacar as células vazias com uma cor sutil (ex: borda azul tracejada).
- Ao passar o mouse sobre uma célula vazia, exibir um preview do prédio em 50% de opacidade.
- Ao clicar: Coloca o prédio e sai do modo de construção (ou mantém o modo, se "Ctrl" estiver pressionado para múltiplas colocações).

---

## 7. Assets e Recursos Visuais

### 7.1 Ícones

- **Conjunto de Ícones:** [Lucide-React](https://lucide.dev/) ou [Phosphor Icons](https://phosphoricons.com/) (estilo "outline" ou "duotone" para combinar com o tema industrial).
- **Ícones Necessários (exemplos):**
  - `Zap` (Energia), `Flame` (Calor), `Droplets` (Refrigeração), `Bitcoin` (Moeda), `Hash` (Hashrate), `Settings` (Configurações), `ChevronUp` (Upgrade), `Trash2` (Demolish), `AlertTriangle` (Warning).

### 7.2 Fontes

- **Primária (UI):** `Inter` (já incluída no Tailwind).
- **Secundária (Números/Técnico):** `JetBrains Mono` (via `@fontsource/jetbrains-mono` ou Google Fonts).

### 7.3 Texturas/Backgrounds (Opcional)

- Para um visual mais premium, um background com um leve padrão de grid/fundo de blueprint pode ser adicionado (ex: SVG de padrão de circuitry).

---

## 8. Checklist de Implementação (Pós-Aprovação)

Após aprovação, a implementação será dividida nas seguintes fases:

- [ ] **Fase 1: Foundation (Setup):**
  - Instalar dependências de fontes (`JetBrains Mono`).
  - Configurar Tailwind com as novas cores do Design System.
  - Criar os componentes base reutilizáveis (ex: `Card`, `Button`, `Badge`, `Tooltip`).
- [ ] **Fase 2: Layout (Estrutura):**
  - Reorganizar `App.tsx` para o layout de 3 colunas (Header, Sidebar, Main, Inspector, Footer).
  - Implementar a lógica de exibição/esconder do `Inspector` (Right Sidebar).
- [ ] **Fase 3: Header & Left Sidebar:**
  - Refatorar `Dashboard` → `Header` + `GlobalStatus`.
  - Refatorar `BuildMenu` para o novo visual de Blueprint com Tabs e Tooltips.
- [ ] **Fase 4: Main Grid (Interativo):**
  - Refatorar `GameGrid` com os novos efeitos visuais (brilho, partículas, zoom/pan).
  - Implementar context menu.
- [ ] **Fase 5: Inspector (Right Sidebar) & Bottom Bar:**
  - Criar o novo componente `Inspector` (Entity Details).
  - Criar `Footer` com `EventLog` e `MiniMap`.
- [ ] **Fase 6: Polimento e Animações:**
  - Implementar todas as animações e transições definidas na seção 5.
  - Adicionar responsividade.
  - Testes finais e otimização de performance.

---

## 9. Aprovação

- [ ] Eu, [Nome do Cliente/Designer], aprovo o escopo e a direção visual deste UI-SPEC.
- [ ] Eu entendo que mudanças significativas de layout após aprovação podem requerer re-planejamento.

**Observações do Aprovador (opcional):**
_>_
