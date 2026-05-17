# Grana360 - Design System Specification

**Design Direction:** Editorial Minimalism with Purposeful Depth  
**Date:** 2026-04-24  
**Status:** ✅ Production-Ready Specification

---

## 🎨 Design Mandate

**Goal:** Create visually distinct, memorable interfaces for 5 new features while maintaining cohesive identity.

**Aesthetic Statement:**
> Grana360 designs for financial clarity through intentional restraint. Each feature has a distinct visual anchor (icon + color + interaction pattern), but all share the same system of grid, type, and motion. No decoration without purpose.

**Differentiation Anchor:**
> "If you see our interface with logo removed, you'll recognize it by: 1) Signature icon system (geometric, 1-stroke), 2) Consistent 8px grid + breathing space, 3) Specific color story per feature (but all from same palette), 4) Motion that leads to understanding, not distraction."

---

## 📐 Master Design System (Shared by All Features)

### 1. Typography System

#### Fonts
```css
/* Display (Headlines) */
--font-display: 'Geist Mono', monospace;
  /* Why: Editorial, distinctive, signals "data-driven" */
  /* Line-height: 1.1 (tight, confident) */

/* Body (Content) */
--font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  /* Why: Trusted default, highly readable at small sizes */
  /* Line-height: 1.6 (comfortable reading) */

/* Mono (Numbers, Codes) */
--font-mono: 'JetBrains Mono', monospace;
  /* Why: Clear distinction for amounts, IDs, tech content */
```

#### Type Scale (8px base)
```css
--text-xs:    0.75rem (12px);  /* Labels, captions */
--text-sm:    0.875rem (14px); /* Secondary text */
--text-base:  1rem (16px);     /* Body default */
--text-lg:    1.25rem (20px);  /* Subheadings */
--text-xl:    1.5rem (24px);   /* Section titles */
--text-2xl:   2rem (32px);     /* Page titles */
--text-3xl:   2.5rem (40px);   /* Feature announcements */

/* Font Weights */
--fw-normal:  400;
--fw-medium:  500;
--fw-bold:    700;
--fw-mono-bold: 600; /* For mono (doesn't have 700) */
```

### 2. Color System

#### Primary Palette (Core Brand)
```css
--color-purple-dark:   #6B21A8;  /* Existing Grana360 primary */
--color-purple-light:  #C084FC;  /* Lighter purple for hoverstates */
--color-purple-pale:   #DDD6FE;  /* Pale purple for backgrounds */

--color-green-action:  #10B981;  /* Call-to-action (confirm, add) */
--color-green-light:   #A7F3D0;  /* Light green for positive states */
--color-green-pale:    #ECFDF5;  /* Very pale for backgrounds */

--color-blue-info:     #3B82F6;  /* Information, secondary actions */
--color-blue-light:    #93C5FD;  /* Lighter blue */
--color-blue-pale:     #EFF6FF;  /* Pale blue for backgrounds */

--color-neutral-dark:  #1F2937;  /* Text primary */
--color-neutral-med:   #6B7280;  /* Text secondary */
--color-neutral-light: #E5E7EB;  /* Borders, dividers */
--color-neutral-bg:    #F9FAFB;  /* Background */

--color-red-error:     #EF4444;  /* Errors, destructive */
--color-red-light:     #FCA5A5;  /* Light red */
--color-red-pale:      #FEF2F2;  /* Pale red for backgrounds */
```

#### Feature-Specific Color Anchors
Each feature gets ONE dominant color (already defined above) + shades.

```css
/* Feature 1: Criativos/IA */
--feature-criativos-primary:    var(--color-purple-dark);
--feature-criativos-accent:     var(--color-purple-light);
--feature-criativos-background: var(--color-purple-pale);
Icon: Sparkles (✨)

/* Feature 2: Push Notifications */
--feature-push-primary:         var(--color-green-action);
--feature-push-accent:          var(--color-green-light);
--feature-push-background:      var(--color-green-pale);
Icon: Bell + Dot (🔔)

/* Feature 3: Tutorials */
--feature-tutorials-primary:    var(--color-blue-info);
--feature-tutorials-accent:     var(--color-blue-light);
--feature-tutorials-background: var(--color-blue-pale);
Icon: Book / Graduation Cap (📚)

/* Feature 4: Categorias Avançadas */
--feature-categorias-primary:   var(--color-purple-dark);
--feature-categorias-accent:    var(--color-purple-light);
--feature-categorias-background: var(--color-purple-pale);
Icon: Layers / Hierarchy (📊)

/* Feature 5: Roadmap */
--feature-roadmap-primary:      var(--color-blue-info);
--feature-roadmap-accent:       var(--color-blue-light);
--feature-roadmap-background:   var(--color-blue-pale);
Icon: Map / Timeline (🗺️)
```

### 3. Spacing & Grid System

```css
/* 8px base grid */
--space-0:    0;
--space-1:    0.25rem (2px);   /* Micro-adjustments */
--space-2:    0.5rem (4px);    /* Tight spacing */
--space-3:    0.75rem (6px);   /* Labels */
--space-4:    1rem (8px);      /* Default padding */
--space-6:    1.5rem (12px);   /* Medium spacing */
--space-8:    2rem (16px);     /* Section spacing */
--space-12:   3rem (24px);     /* Large gaps */
--space-16:   4rem (32px);     /* Major sections */
--space-20:   5rem (40px);     /* Page margins */

/* Container widths */
--container-sm:   320px;       /* Mobile */
--container-md:   768px;       /* Tablet */
--container-lg:   1024px;      /* Desktop */
--container-xl:   1280px;      /* Wide desktop */

/* Grid columns */
Mobile:  4 columns (20px margin + 4 columns)
Tablet:  8 columns (24px margin + 8 columns)
Desktop: 12 columns (32px margin + 12 columns)
```

### 4. Motion Philosophy

**Principle:** Motion serves understanding, not decoration.

```css
/* Animation Timings */
--duration-fast:   150ms;   /* Micro-interactions (toggle, hover) */
--duration-normal: 300ms;   /* Standard transitions (modal, fade) */
--duration-slow:   500ms;   /* Page transitions, heavy animations */

/* Easing */
--easing-ease-out: cubic-bezier(0.4, 0, 0.2, 1);  /* Decelerate (feels natural) */
--easing-ease-in:  cubic-bezier(0.4, 0, 1, 1);    /* Accelerate (feels snappy) */
--easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* Smooth both directions */

/* Standard Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Component Motion Rules */
Modal: slideUp 300ms ease-out
Toast: slideUp 300ms ease-out
Hover on button: background 150ms ease-out
Hover on card: shadow 150ms ease-out (no scale!)
Toggle: background 150ms ease-out
```

### 5. Component States

**All interactive components follow this pattern:**

```css
/* Button States */
.button {
  /* Default */
  background: var(--color-primary);
  color: white;
  transition: all 150ms ease-out;
}

.button:hover {
  /* Subtle: slightly darker background, not scale-up */
  background: var(--color-primary-dark);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.button:active {
  /* Pressed feeling */
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button:disabled {
  /* Clear disabled state */
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button:focus-visible {
  /* Accessibility: clear focus ring */
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### 6. Shadows & Depth

```css
/* Elevation system (Z-depth) */
--shadow-sm:     0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md:     0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg:     0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl:     0 20px 25px rgba(0, 0, 0, 0.15);

/* Usage */
Card (default):       box-shadow: var(--shadow-sm);
Card (hover):         box-shadow: var(--shadow-md);
Modal:                box-shadow: var(--shadow-xl);
Sticky header:        box-shadow: var(--shadow-sm);
Floating action button: box-shadow: var(--shadow-lg);
```

### 7. Accessibility (WCAG 2.1 AA)

```
✅ Color Contrast
   Text on background: 4.5:1 (AA) or better
   Interactive elements: 3:1 minimum

✅ Typography
   Max line length: 75 characters (body text)
   Line height: 1.5-1.6 minimum

✅ Focus States
   Visible focus ring on all interactive elements
   Focus outline: 2px solid, offset 2px

✅ Motion
   Respect prefers-reduced-motion query
   No auto-play animations

✅ Keyboard Navigation
   Tab order logical and visible
   Escape closes modals/dropdowns
```

---

## 🎯 Feature 1: Criativos/IA (Sparkles)

**DFII Score: 13/15**
- Aesthetic Impact: 5/5 (✨ instantly recognizable)
- Context Fit: 4/5 (perfect for "magical AI generation")
- Feasibility: 5/5 (straightforward to implement)
- Performance: 4/5 (animations can be heavy on low-end devices)
- Consistency Risk: -1 (sparkle effect may not scale everywhere)

### Design Direction
**"Playful Precision"** — AI generation should feel magical but grounded in real results.

### Visual Anchor
✨ **Animated Sparkle Icon** — When generating, sparkles animate around button. Appears nowhere else to avoid dilution.

### Color Scheme
```css
--accent-creative: var(--color-purple-dark);
--accent-creative-light: var(--color-purple-light);
Accent states: purple → lighter purple on hover
Background panels: var(--color-purple-pale)
```

### Layout
**Container:** 12-column grid
**Sections:**
- Header: "Criativos" title + stats (3 cards in row)
- Main: Tab navigation (Dashboard | Novo Criativo)
- Dashboard: Cards in 3-column grid (mobile: 1, tablet: 2)

### Component Specs

#### 1. Criativo Card
```
┌─────────────────────────────┐
│ [IMG Preview or Icon]        │ ← 200px square
├─────────────────────────────┤
│ Criativo Slogan              │ ← text-lg, fw-bold
│ Text                         │ ← text-sm, color-neutral-med
│ ⭐ 1 versão • 📅 2 dias ago │ ← text-xs, stats
├─────────────────────────────┤
│ [Ver] [Baixar] [Mais ⋯]     │ ← action buttons
└─────────────────────────────┘

Hover state:
  - box-shadow: md → lg
  - background: slight purple tint
  - translate: -2px (lifts slightly)
  - duration: 150ms
```

#### 2. Gerador Form
```
┌─ TIPO ─────────────────────┐
│ ⭕ Imagem ⭕ Texto ⭕ Headline
├─ BRIEFING ─────────────────┤
│ [________________ 312/500] │ ← auto-expand textarea
├─ TOM/ESTILO ───────────────┤
│ [Criativo v]                │ ← dropdown
├─ SEGMENTO ─────────────────┤
│ [E-commerce v]              │ ← dropdown
├─────────────────────────────┤
│         [✨ Gerar]          │ ← button with sparkle animation
└─────────────────────────────┘

Gerar button animation (on click):
  - Sparkles emit from center
  - Button scales 1 → 1.05 → 1
  - Duration: 300ms ease-out
  - Loading state: spinner replaces text
```

#### 3. Preview Modal
```
┌─────────────────────────────┐
│ ✕ Preview                   │
├─────────────────────────────┤
│ [Large preview image/text]  │
├─────────────────────────────┤
│ Usado [X] tokens de Gemini  │ ← info
│         Salvar como Rascunho│ ← checkbox
│         Nome: [Criativo...] │ ← input
├─────────────────────────────┤
│ [Cancelar] [Regenerar] [✓ Salvar]
└─────────────────────────────┘

Modal entry: scaleIn 300ms ease-out
```

### Icon System
```
✨ Sparkles (Gerador ativo)
📸 Imagem (tipo)
📝 Texto (tipo)
💫 Headline (tipo)
📌 Salvo (status)
🔄 Versionado (status)
🔗 Compartilhado (action)
⬇️ Baixar (action)
```

### Motion Details
```css
/* Sparkle animation (main CTA) */
@keyframes sparkles {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}

.sparkle {
  position: absolute;
  pointer-events: none;
  animation: sparkles 600ms ease-out forwards;
}

/* Button on hover */
.btn-gerar:hover {
  background: var(--color-purple-light);
  box-shadow: 0 8px 16px rgba(107, 33, 168, 0.25);
}

/* Loading state */
.btn-gerar.loading {
  position: relative;
}

.btn-gerar.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
```

---

## 🔔 Feature 2: Push Notifications (Bell + Dot)

**DFII Score: 12/15**
- Aesthetic Impact: 4/5 (bell icon common, but dot animation distinctive)
- Context Fit: 5/5 (perfect for notifications)
- Feasibility: 5/5 (standard UI patterns)
- Performance: 4/5 (no heavy animations)
- Consistency Risk: -1 (bell icon appears in many places, needs restraint)

### Design Direction
**"Urgent Clarity"** — Notifications must feel important but never intrusive. Design prioritizes clarity over decoration.

### Visual Anchor
🔔 **Dot Indicator + Subtle Pulse** — New notification count shown as dot with gentle pulse. No notification spam, no loud sounds.

### Color Scheme
```css
--accent-push: var(--color-green-action);
--accent-push-light: var(--color-green-light);
Background panels: var(--color-green-pale)
Error state: red (if delivery fails)
```

### Layout
**Container:** 12-column grid
**Sections:**
- Header: Title + stats (total this mês, taxa de click)
- Main: Tab navigation (Enviadas | Agendadas | Rascunhos)
- List: Table view with actions, or cards

### Component Specs

#### 1. Notification Card (List View)
```
┌──────────────────────────────┐
│ [🔔] Título da Notificação    │ ← icon + title
│      Descrição/preview...     │ ← text-sm
│      👥 234 enviadas • ✓ 12%  │ ← stats
│      📅 2026-04-22 às 14:30   │ ← timestamp
├──────────────────────────────┤
│ [Ver] [Editar] [Deletar]      │ ← actions
└──────────────────────────────┘

Hover:
  - background: slight green tint
  - shadow: sm → md
  - duration: 150ms
  - NO scale/lift (notifications are serious)
```

#### 2. Form: Enviar Notificação
```
┌─ TÍTULO ──────────────────────┐
│ [______ Máx 50 caracteres] │  │ ← counter
├─ MENSAGEM ────────────────────┤
│ [______________ Máx 200]       │
│ [___________________________] │ ← textarea
├─ ÍCONE ────────────────────────┤
│ [Upload] [Preview]             │
├─ URL DE AÇÃO ──────────────────┤
│ [https://exemplo.com/...]      │
├─ SEGMENTAÇÃO ──────────────────┤
│ ⭕ Todos ⭕ Específicos ⭕ Critério
├─ AGENDAMENTO ──────────────────┤
│ ⭕ Agora ⭕ Data/Hora ⭕ Recorrente
│   [Data picker] [Time picker]
├─ PREVIEW ──────────────────────┤
│ [Dispositivo Android/iOS]      │
│ [Preview da notificação]       │
├────────────────────────────────┤
│ [Cancelar] [Agendar] [✓ Enviar Agora]
└────────────────────────────────┘

Submit button:
  - Color: green-action
  - On hover: darker green
  - On click: confirmation toast
```

#### 3. Analytics Card
```
┌─────────────────────┐
│ 📊 Taxa de Click    │
│ 12.4%               │ ← text-2xl, bold
│ vs. média: 8.2%     │ ← text-sm, secondary
│ ↑ 51% melhor        │ ← green, small arrow
└─────────────────────┘

Border-left: 4px solid green-action
Background: green-pale
```

### Icon System
```
🔔 Bell (notificação)
✓ Entregue (status)
⏱️ Agendada (status)
✕ Falhou (status)
📊 Analytics (action)
🎯 Segmentação (action)
```

### Motion Details
```css
/* Dot pulse (new notifications) */
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
}

.notification-dot {
  animation: pulse-dot 2s ease-in-out infinite;
  width: 8px;
  height: 8px;
  background: var(--color-red-error);
  border-radius: 50%;
}

/* Toast on send */
@keyframes slideUp {
  from { transform: translateY(8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.toast {
  animation: slideUp 300ms ease-out;
  position: fixed;
  bottom: 20px;
  right: 20px;
}
```

---

## 📚 Feature 3: Tutorials (Book/Graduate Cap)

**DFII Score: 14/15**
- Aesthetic Impact: 5/5 (educational, familiar icon)
- Context Fit: 5/5 (perfect for onboarding/learning)
- Feasibility: 5/5 (straightforward implementation)
- Performance: 4/5 (progress bars, animations smooth)
- Consistency Risk: -1 (book icon common, needs distinctive treatment)

### Design Direction
**"Progressive Clarity"** — Tutorials guide users step-by-step. Design emphasizes progress, clarity, and forward momentum.

### Visual Anchor
📖 **Progress Ring + Step Counter** — Circular progress indicator at page header showing "Passo 2 de 5" visually. Rings are filled, not percentage-based, for clarity.

### Color Scheme
```css
--accent-tutorials: var(--color-blue-info);
--accent-tutorials-light: var(--color-blue-light);
Background panels: var(--color-blue-pale)
Accent for completion: green-action
```

### Layout
**Container:** 12-column grid
**Sections:**
- Breadcrumb: Ajuda > Categoria > Tutorial
- Header: Title + progress ring
- Main: Content (markdown) + image/video if present
- Sidebar (desktop): Step list (clicável)
- Footer: Navigation buttons

### Component Specs

#### 1. Tutorial Card (List View)
```
┌─────────────────────┐
│ [📸 Thumbnail]      │ ← 200px square
│                     │
├─────────────────────┤
│ Título do Tutorial  │ ← text-lg, bold
│ Categoria: Beginner │ ← text-sm, badge
├─────────────────────┤
│ ◐◑ 3/5 passos       │ ← progress indicator
│                     │
│ [Ver Tutorial]      │ ← button
└─────────────────────┘

Hover:
  - shadow: sm → md
  - background: slight blue tint
  - translate: -2px
  - duration: 150ms
```

#### 2. Viewer (Main Content Area)
```
┌──────────────────────────────────┐
│ Ajuda > Recursos > Enviando Email│ ← breadcrumb
├──────────────────────────────────┤
│ Enviando Email em 5 Passos        │ ← title (text-2xl)
│                                  │
│ [Progress Ring: 2/5]             │ ← visual progress
├──────────────────────────────────┤
│ [SIDEBAR: Steps]   │ [CONTENT]    │
│ 1. Abrir Painel    │ ○○●○○        │ ← step indicator
│ 2. Selecionar... ✓ │              │
│ 3. Escrever Email ← │ ### Passo 3: Escrever Email
│ 4. Enviar        │              │
│ 5. Confirmar     │ [Markdown content here]
│                  │ [Image if present]
│                  │
│                  │ Lorem ipsum dolor sit amet...
│                  │ [More content...]
│                  │
│                  │ [◀ Anterior] [Próximo ▶]
└──────────────────────────────────┘

Desktop: 3-col layout (sidebar + content + empty)
Tablet: 2-col (sidebar on left, content takes rest)
Mobile: 1-col (sidebar collapses to tabs)
```

#### 3. Completion Screen
```
┌──────────────────────────────┐
│                              │
│       ✅ Tutorial Completo!   │ ← large checkmark animation
│                              │
│ Você desbloqueou a Badge:    │
│ [🏆 Guia Enviado]            │
│                              │
│ Progresso Total: 23/145      │ ← 16% completo
│ ◐◐◐◐◐◐◐◐◐◑◑◑◑◑◑ ▶▶▶▶▶      │
│                              │
│ [⭐⭐⭐⭐⭐] Como foi?         │ ← rating
│ [Comentário] [Cancelar]      │
│                              │
│ [← Voltar] [Próximo →]       │
└──────────────────────────────┘

Entry animation:
  - Checkmark: scaleIn 400ms ease-out
  - Badge: slideUp 400ms ease-out (delay 200ms)
  - Text: fadeIn 300ms ease-out (delay 300ms)
```

#### 4. Progress Indicator (Reusable)
```
Step Indicator (circular):
  ◯ = Not started
  ◐ = In progress (half-filled)
  ◑ = Completed (filled)
  
Color: blue-info for current, green for completed
  
```

### Icon System
```
📖 Tutorial/Guide
✓ Completado
🏆 Badge
⭐ Rating
📝 Markdown content
▶️ Próximo
◀️ Anterior
```

### Motion Details
```css
/* Progress ring fill */
@keyframes fillRing {
  from { stroke-dashoffset: 100%; }
  to { stroke-dashoffset: 0%; }
}

.progress-ring {
  animation: fillRing 500ms ease-out;
  stroke-dasharray: 100%;
}

/* Checkmark on completion */
@keyframes drawCheckmark {
  0% { stroke-dashoffset: 100%; }
  100% { stroke-dashoffset: 0%; }
}

.checkmark {
  stroke-dasharray: 100%;
  animation: drawCheckmark 500ms ease-out;
  stroke: var(--color-green-action);
}

/* Step transition */
.tutorial-content {
  animation: fadeIn 300ms ease-out;
}

/* Sidebar step highlight */
.step-item.active {
  background: var(--color-blue-pale);
  border-left: 3px solid var(--color-blue-info);
  padding-left: 12px;
}
```

---

## 📊 Feature 4: Categorias Avançadas (Layers)

**DFII Score: 11/15**
- Aesthetic Impact: 4/5 (hierarchy shown visually is distinctive)
- Context Fit: 5/5 (layers icon perfectly suits categories)
- Feasibility: 4/5 (tree view + drag-drop requires careful implementation)
- Performance: 4/5 (no heavy animations)
- Consistency Risk: -1 (hierarchy can be visually complex)

### Design Direction
**"Structured Clarity"** — Hierarchical relationships must be instantly clear. No visual noise. Indent depth shows hierarchy.

### Visual Anchor
📊 **Indented Hierarchy with Color Rings** — Parent categories shown with larger icon, children indented. Each has a colored ring (50% opacity) around icon to show association.

### Color Scheme
```css
--accent-categories: var(--color-purple-dark);
--accent-categories-light: var(--color-purple-light);
Background panels: var(--color-purple-pale)
Parent categories: darker purple
Child categories: lighter purple (inherited)
```

### Layout
**Container:** 12-column grid
**Sections:**
- Header: Title + action buttons
- Main: Tree view (drag-and-drop enabled)
- Right panel: Category details (on select)

### Component Specs

#### 1. Category Tree
```
┌─ Categorias (Todas: 12) ─────────────────┐
│                                          │
│ 🏠 Casa                                   │ ← parent (dark purple)
│    ├─ 🛏️ Aluguel                         │ ← child (indented, light purple)
│    │  └─ 🪟 Condomínio  (archived)       │ ← grandchild (grayed out)
│    └─ 🔌 Utilidades                      │
│ 🍔 Alimentação                           │ ← parent
│    ├─ 🍕 Restaurante                    │
│    └─ 🛒 Supermercado                   │
│ ◐◐ Saúde (3 sub)                        │ ← collapsed view
│    └─ ...                               │
├──────────────────────────────────────────┤
│ Drag-and-drop: arraste para reordenar   │ ← helper text
└──────────────────────────────────────────┘

Parent category hover:
  - background: light purple
  - show "add child" button
  - cursor: grab

Child category hover:
  - background: lighter
  - show edit/delete buttons
  - cursor: grab
```

#### 2. Category Detail Panel (Right Sidebar, Desktop)
```
┌─ Aluguel ───────────────┐
│ [Ícone seleção] [Cor]   │
│                         │
│ Nome: [Aluguel____]     │
│ Pai: [Casa v]           │
│                         │
│ Limite Mensal: R$ [___] │
│ Alerta em: [80%]        │
│ ☐ Bloquear se exceder   │
│                         │
│ 📊 Últimos 3 meses:     │
│ Ago: R$1.200            │
│ Set: R$1.200            │
│ Out: R$1.350 (↑ 12%)    │
│                         │
│ [Renomear] [Mesclar]... │
│ [Arquivar] [Deletar]    │
└─────────────────────────┘

Layout: 4-col right sidebar (desktop)
Mobile: Modal sheet at bottom
Tablet: Inline below tree
```

#### 3. Rule Creation Modal
```
┌─ Nova Regra ────────────────────────┐
│ Quando descrição CONTÉM:            │
│ [Palavra-chave___________] [+ Mais] │
│                                     │
│ Categorizar em: [Casa v]            │
│ Prioridade: [1 (Máxima)] ←→ 10      │
│                                     │
│ ☐ Aplicar retroativamente          │
│ Isso afetaria: 34 transações       │
│                                     │
│ [Cancelar] [Testar] [✓ Salvar]     │
└─────────────────────────────────────┘

Test button shows preview:
  - 34 transações seriam recategorizadas
  - Mostra 5 exemplos
```

### Icon System
```
🏠 Casa (custom parent)
🛏️ Aluguel (custom child)
📊 Análise (distribution)
📈 Tendência (arrow up/down)
🔗 Relacionado (linked)
🎯 Limite (target)
```

### Motion Details
```css
/* Tree expand/collapse */
@keyframes expandTree {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 200px;
    opacity: 1;
  }
}

.tree-children {
  animation: expandTree 300ms ease-out;
}

/* Drag-and-drop */
.dragging {
  opacity: 0.5;
  background: var(--color-purple-pale);
}

.drop-target {
  background: var(--color-purple-pale);
  border-left: 3px solid var(--color-purple-dark);
}

/* Indent animation */
.tree-item {
  margin-left: calc(var(--depth, 0) * 24px);
}
```

---

## 🗺️ Feature 5: Roadmap Público (Map/Timeline)

**DFII Score: 13/15**
- Aesthetic Impact: 5/5 (timeline visual is distinctive and memorable)
- Context Fit: 4/5 (perfect for roadmap, somewhat common pattern)
- Feasibility: 5/5 (timeline components well-established)
- Performance: 4/5 (large timelines may scroll, optimize)
- Consistency Risk: -1 (horizontal timeline can break on mobile)

### Design Direction
**"Forward Motion"** — Roadmap shows progress over time. Design emphasizes movement left-to-right (Q1 → Q4) with clear status indicators.

### Visual Anchor
🗺️ **Trimestral Timeline with Status Cards** — Horizontal timeline showing Q1/Q2/Q3/Q4. Items colored by status (planejado=gray, dev=blue, beta=yellow, lançado=green). Vote count visible on each card.

### Color Scheme
```css
--accent-roadmap: var(--color-blue-info);

Status colors:
  - Planejado: neutral-light (gray)
  - Desenvolvimento: blue-info (active)
  - Beta: yellow/amber (#F59E0B)
  - Lançado: green-action (completed)

Vote indicator: purple (accent)
```

### Layout
**Container:** 12-column grid
**Sections:**
- Header: Title + filters
- Main: Horizontal timeline (scrollable on mobile)
- Modal: Detail view (on click)

### Component Specs

#### 1. Roadmap Timeline (Desktop)
```
┌─ ROADMAP ────────────────────────────────────────────────────┐
│ [Filter: Status ▼] [Filter: Categoria ▼] [Search: ___]       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Q1 2026          Q2 2026          Q3 2026        Q4 2026    │
│  ─────────        ─────────        ─────────      ─────────  │
│                                                               │
│  [Gray Card]      [Blue Card]      [Yellow Card] [Green Card]
│  Design System    API v2           Mobile App    Beta Close
│  👥 23 votos      👥 142 votos      👥 89 votos   👥 210 votos
│  [Vote]           [Voted ✓]        [Vote]        [Voted ✓]
│                                                               │
│  [Gray Card]                       [Yellow Card]              │
│  Roadmap Público                   Integração Pix             │
│  👥 45 votos                       👥 156 votos              │
│  [Voted ✓]                         [Vote]                    │
│                                                               │
│                   [Blue Card]      [Green Card]              │
│                   Premium Features  Performance+             │
│                   👥 78 votos        👥 234 votos            │
│                   [Vote]             [Voted ✓]              │
│                                                               │
└──────────────────────────────────────────────────────────────┘

Card dimensions:
  Width: 280px
  Height: auto (title + vote count)
  Gap: 16px between cards
  Padding: 12px inside card

Hover:
  - background: slightly darker
  - shadow: sm → md
  - NO scale (items on timeline should feel stable)
  - Vote button becomes primary color
```

#### 2. Roadmap Card (Individual)
```
┌─────────────────────────┐
│ Design System           │ ← title (text-lg, bold)
│ [Planejado]             │ ← status badge (gray)
├─────────────────────────┤
│ Redesenhar sistema de... │ ← description (text-sm)
│ (truncated)             │
├─────────────────────────┤
│ 👥 23                   │ ← vote count
│ [❤️ Vote] ou [❤️ 23]    │ ← toggle vote
└─────────────────────────┘

Status badge colors:
  Planejado: gray background
  Desenvolvimento: blue background
  Beta: yellow background
  Lançado: green background, bold text

All text white on colored backgrounds (WCAG AA)
```

#### 3. Detail Modal
```
┌──────────────────────────────────────┐
│ Design System                        │ ← title
│ Status: Desenvolvimento (25% done)   │ ← status + progress
│ Data estimada: Julho 2026            │ ← timeline
│                                      │
│ Descrição:                           │
│ Nós estamos redesenhando...          │
│ [Full description, markdown]         │
│                                      │
│ Categoria: Product                   │
│ Prioridade: Alta                     │
│ Votos: 142                           │
│ [❤️ Vote] ou [❤️ Remove vote]        │
│                                      │
│ Comentários (4):                     │
│ • "Ansioso por isso!" - João        │
│ • "Quando chega?" - Maria           │
│ [Ver todos] [Adicionar...]          │
│                                      │
│ [Releases que incluem isso]          │
│                                      │
│ [Fechar]                             │
└──────────────────────────────────────┘

Modal entry: slideUp 300ms ease-out
Modal position: centered, 90% width on mobile
```

#### 4. Mobile Timeline (Stacked)
```
On mobile: horizontal timeline breaks.
Instead: stacked cards in chronological order.

┌─ Q1 2026 ──────────────────┐
│ Design System              │
│ Planejado • 👥 23         │
│ [Vote]                     │
├────────────────────────────┤
│ Roadmap Público            │
│ Planejado • 👥 45         │
│ [Vote]                     │
└────────────────────────────┘
┌─ Q2 2026 ──────────────────┐
│ API v2                     │
│ Desenvolvimento • 👥 142   │
│ [Vote]                     │
└────────────────────────────┘
...

Layout: 1-col, full width cards
Timeline direction: top-to-bottom (not left-to-right)
```

#### 5. Top 5 Widget (Homepage)
```
┌─ Top 5 Features ─────────────┐
│ 1. Performance+ (234 votos)   │ ← green (lançado)
│ 2. Premium (210 votos)        │ ← yellow (beta)
│ 3. API v2 (142 votos)         │ ← blue (dev)
│ 4. Integração Pix (156 votos) │ ← yellow (beta)
│ 5. Mobile (89 votos)          │ ← yellow (beta)
│                               │
│ [Ver Roadmap Completo →]     │
└───────────────────────────────┘

Bar chart style:
  Horizontal bars showing vote count
  Color by status
  Each bar clickable → opens detail modal
```

### Icon System
```
🗺️ Roadmap/Timeline
❤️ Vote/Love
✓ Voted
📅 Data
🎯 Categoria
📊 Estatísticas
💬 Comentários
```

### Motion Details
```css
/* Timeline scroll snap (if horizontal) */
@supports (scroll-snap-type: x mandatory) {
  .timeline {
    scroll-snap-type: x mandatory;
  }
  
  .timeline-card {
    scroll-snap-align: start;
  }
}

/* Vote button animation */
.vote-button {
  transition: all 150ms ease-out;
}

.vote-button.voted {
  background: var(--color-purple-dark);
  color: white;
  animation: pulse 400ms ease-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* Card entrance */
.roadmap-card {
  animation: slideUp 300ms ease-out;
}
```

---

## 📋 Implementation Checklist

### Phase 1: Setup Master Design System
- [ ] CSS Variables file created (`src/styles/design-system.css`)
- [ ] Fonts loaded (Geist Mono, JetBrains Mono)
- [ ] Color palette defined and tested for contrast
- [ ] Spacing grid validated (8px base)
- [ ] Motion philosophy documented and tested
- [ ] Accessibility checklist reviewed (WCAG 2.1 AA)

### Phase 2: Per-Feature Components
- [ ] Criativos: Cards, Form, Modal, Animations
- [ ] Push: Cards, Form, Analytics, Toast
- [ ] Tutorials: Cards, Viewer, Progress ring, Completion
- [ ] Categorias: Tree view, Detail panel, Rules modal
- [ ] Roadmap: Timeline, Cards, Detail modal, Top 5 widget

### Phase 3: Testing & Refinement
- [ ] Component testing (Storybook or similar)
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Accessibility testing (contrast, keyboard nav, focus states)
- [ ] Motion testing (performance, reduced-motion preference)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Phase 4: Documentation
- [ ] Component usage guide
- [ ] Design token reference
- [ ] Do's and Don'ts per feature
- [ ] Figma file (if applicable)

---

## 🚀 Quick Reference: Color + Icon Mapping

| Feature        | Primary Color | Light | Pale | Icon |
|----------------|---------------|-------|------|------|
| Criativos      | Purple #6B21A8 | #C084FC | #DDD6FE | ✨ |
| Push           | Green #10B981 | #A7F3D0 | #ECFDF5 | 🔔 |
| Tutorials      | Blue #3B82F6 | #93C5FD | #EFF6FF | 📚 |
| Categorias     | Purple #6B21A8 | #C084FC | #DDD6FE | 📊 |
| Roadmap        | Blue #3B82F6 | #93C5FD | #EFF6FF | 🗺️ |

---

## 📐 Responsive Grid Breakdown

```
Mobile (< 640px):
  - 1 column
  - 16px margin
  - Full-width cards/forms
  - Stacked layouts

Tablet (640px - 1024px):
  - 2-3 columns
  - 24px margin
  - Side-by-side components
  - Horizontal scrolling for timelines

Desktop (> 1024px):
  - 3-4 columns
  - 32px margin
  - Full-width layouts
  - Sidebar navigation

**Grid unit: 4px (half of 8px base)**
**Breakpoints: 640px, 1024px, 1280px**
```

---

## 🎬 Animation Quick Reference

```css
/* Standard Durations */
Micro (toggle, hover):     150ms ease-out
Standard (modal, fade):    300ms ease-out
Slow (page transition):    500ms ease-out

/* Easing */
Decelerate (natural):      cubic-bezier(0.4, 0, 0.2, 1)
Accelerate (snappy):       cubic-bezier(0.4, 0, 1, 1)

/* Standard Animations */
Entrance: slideUp + fadeIn (300ms)
Hover: background + shadow (150ms)
Loading: spinner (linear infinite)
Success: checkmark + scale (400ms + 300ms delay)
```

---

**Document Status:** ✅ Ready for Implementation  
**Last Updated:** 2026-04-24  
**Next Step:** Convert to working components in Figma + code
