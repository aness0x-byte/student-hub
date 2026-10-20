# Glass UI Design System

A design method extracted from three references:

| Ref | Name | Mood | Used for |
|-----|------|------|----------|
| **A** | Finance Dashboard | Dark, violet/teal glow, frosted panels | Data dashboards |
| **B** | Liquid Brokers landing | Deep indigo-black, 3D liquid orb, floating glass chips | Marketing / hero pages |
| **C** | Domus smart-home | Warm taupe + sage-green glass, 3D object at center | Control panels, consumer apps |

> Values below are measured by eye from the screenshots and rounded to clean tokens. Treat them as the spec: use them exactly, and don't "improve" them.

---

## 1. Core Principles

1. **Everything is glass.** Surfaces are translucent, blurred, and sit over a rich background (gradient, 3D object, or glowing ribbon). Never use flat opaque cards.
2. **Borders are hairlines, not outlines.** 1px, low-opacity white (dark theme) or low-opacity white/black (light theme). The border defines the edge; it never shouts.
3. **Big radii, always.** Containers are 24–32px, inner cards 16–24px, controls are full pills. No sharp corners anywhere.
4. **One hero number per card.** Large, light-to-regular weight numerals, small quiet label above. Hierarchy comes from size, not color.
5. **Color is rare.** The UI is near-monochrome (white on near-black). Accent color appears only on: one primary button, one chart line, one status pill, one glow.
6. **The background does the decoration.** Panels stay calm; the glow, orb, or 3D object behind them carries the visual drama.
7. **Generous spacing.** Cards breathe: 20–28px padding, 16–20px gaps.
8. **Skeleton placeholders** (soft gray bars) are used for list rows that haven't loaded or are decorative.

---

## 2. Color Tokens

### 2.1 Dark theme (Refs A + B)

```css
:root {
  /* Backgrounds */
  --bg-base:        #07070C;   /* page behind everything, near-black with blue cast */
  --bg-deep-indigo: #1B1740;   /* ambient wash (Ref B outer area) */
  --bg-violet:      #3A2F66;   /* top-left glow in hero (Ref B) */

  /* Glass surfaces */
  --glass-1:        rgba(255, 255, 255, 0.04);  /* large container */
  --glass-2:        rgba(255, 255, 255, 0.06);  /* cards */
  --glass-3:        rgba(255, 255, 255, 0.10);  /* hover / floating chips */
  --glass-fill-dark: rgba(10, 10, 16, 0.55);    /* dark tinted glass (Ref A cards) */

  /* Borders */
  --border-1:       rgba(255, 255, 255, 0.08);  /* default card border */
  --border-2:       rgba(255, 255, 255, 0.14);  /* container / emphasized */
  --border-3:       rgba(255, 255, 255, 0.22);  /* focus / hover */

  /* Text */
  --text-primary:   #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.72);
  --text-muted:     rgba(255, 255, 255, 0.50);
  --text-faint:     rgba(255, 255, 255, 0.32);  /* axis labels, tiny captions */

  /* Accents */
  --accent-violet:       #5B2BE0;  /* solid primary button (Withdraw) */
  --accent-violet-light: #A77BF3;  /* gradient start (Sign up pill) */
  --accent-violet-mid:   #7F5AF0;  /* gradient end */
  --accent-orb:          #6D5BD0;  /* liquid orb body */
  --accent-teal:         #3FD0B0;  /* chart line */
  --accent-teal-glow:    rgba(63, 208, 176, 0.35);

  /* Status */
  --positive-text:  #34D17A;
  --positive-bg:    rgba(52, 209, 122, 0.16);
  --positive-border:rgba(52, 209, 122, 0.30);

  /* CTA on dark */
  --cta-white-bg:   #FFFFFF;
  --cta-white-text: #0B0B10;
}
```

### 2.2 Warm light-glass theme (Ref C)

```css
:root[data-theme="warm"] {
  --bg-taupe-1:     #C9BDB3;   /* background top */
  --bg-taupe-2:     #A89A8E;   /* background bottom */
  --bg-screen:      #5B574F;   /* UI backdrop inside the screen */

  --glass-warm-1:   rgba(255, 255, 255, 0.14);
  --glass-warm-2:   rgba(255, 255, 255, 0.22);
  --glass-olive:    rgba(70, 66, 54, 0.55);     /* dark olive glass cards */
  --glass-black:    rgba(8, 8, 8, 0.92);        /* near-opaque "hero" card (Energy Usage) */

  --border-warm:    rgba(255, 255, 255, 0.28);
  --border-warm-soft: rgba(255, 255, 255, 0.14);

  --accent-sage:    #B7E36B;   /* active ring, gauge, glow on panels */
  --accent-sage-dim:#7FA84A;
  --accent-sage-glow: rgba(183, 227, 107, 0.40);
  --accent-amber:   #E6C94B;   /* LED strip gradient end */

  --text-on-glass:  #FFFFFF;
  --text-on-glass-muted: rgba(255, 255, 255, 0.65);
}
```

---

## 3. Typography

### 3.1 Typefaces

| Role | Font | Fallback | Notes |
|------|------|----------|-------|
| Display + UI (Ref A) | **Urbanist** (or Outfit) | `system-ui, sans-serif` | Geometric, wide round bowls, light-regular numerals |
| Landing headline + UI (Ref B) | **Manrope** (or Plus Jakarta Sans) | `system-ui, sans-serif` | Semi-bold headline, tight tracking |
| Consumer UI (Ref C) | **Plus Jakarta Sans** (or Manrope) | `system-ui, sans-serif` | Friendly, slightly rounded |

**Default rule:** use **one family** per product. If unsure, use **Manrope** for everything. Load weights 300, 400, 500, 600, 700.

```css
:root {
  --font-sans: "Manrope", "Urbanist", "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
}
body { font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
```

### 3.2 Type Scale

| Token | Size / Line | Weight | Tracking | Used for (reference) |
|-------|-------------|--------|----------|----------------------|
| `display-xl` | 64px / 1.05 | 600 | -0.03em | Landing hero: "Elevate Your Trading Experience" (B) |
| `display-lg` | 48px / 1.05 | 400 | -0.02em | KPI hero numbers: `$404,585`, `$9,432.25` (A) |
| `display-md` | 36px / 1.1 | 400 | -0.02em | Secondary numbers: `$675,931`, `$21,478` (A) |
| `display-sm` | 32px / 1.1 | 500 | -0.01em | Gauge values `22.5°c`, `32%` (C) |
| `title` | 18px / 1.3 | 400 | 0 | Card titles: "Total Profit", "Revenue Overview" (A) |
| `body` | 14px / 1.5 | 400 | 0 | Subhead copy (B) |
| `label` | 14px / 1.3 | 400 | 0 | "Total Balance", nav links |
| `small` | 12px / 1.3 | 400 | 0 | Tabs (Daily/Weekly), chip text |
| `micro` | 10–11px / 1.2 | 400 | 0.01em | Axis labels, legend, "Trading Pairs" |
| `badge` | 11px / 1 | 500 | 0 | `+84%` pills |

**Rules**
- Numbers use **light/regular weight (400)** at large sizes, never bold. This is what makes the dashboard feel premium.
- Headlines in marketing use **600** with **negative tracking**.
- Sentence case everywhere. No all-caps labels.
- Muted labels sit directly above the number, 8–12px gap.
- Use `font-variant-numeric: tabular-nums` on all changing numbers.

---

## 4. Radius, Borders, Opacity, Blur

### 4.1 Radius scale

```css
:root {
  --r-xs:   8px;     /* tiny badges, skeleton bars */
  --r-sm:   12px;    /* small chips */
  --r-md:   16px;    /* inner cards, floating chips (B) */
  --r-lg:   24px;    /* KPI cards, panels (A, C) */
  --r-xl:   32px;    /* outer dashboard container (A), hero frame (B) */
  --r-2xl:  40px;    /* device-scale frames */
  --r-pill: 999px;   /* buttons, tabs, status pills, toggles */
}
```

| Element | Radius |
|---------|--------|
| Outer dashboard frame (A) | `--r-xl` 32px |
| Landing hero frame (B) | `--r-xl` 28–32px |
| KPI cards (A top row) | `--r-lg` 20–24px |
| Left balance column + chart card (A) | `--r-lg` 24px |
| Floating glass chip (B) | `--r-md` 16px |
| Device tiles (C) | `--r-lg` 20–24px |
| Buttons, nav pills, toggles, tabs | `--r-pill` |
| Withdraw button (A) | `--r-xs` 8px (the one exception: a slim rectangular CTA inside a card) |
| `+84%` badge | `--r-pill` |

**Nested radius rule:** inner radius = outer radius − padding. A 32px frame with 24px padding holds 8–16px children; a 24px card with 16px padding holds 12px children.

### 4.2 Borders

```css
.border-hair   { border: 1px solid var(--border-1); }
.border-strong { border: 1px solid var(--border-2); }
```

- Always **1px**. Never 2px.
- Default card: `rgba(255,255,255,0.08)`.
- Outer container: `rgba(255,255,255,0.14)`.
- Hover/focus: `rgba(255,255,255,0.22)`.
- Optional top-edge highlight to simulate light:
  `box-shadow: inset 0 1px 0 rgba(255,255,255,0.10);`

### 4.3 Opacity & blur

| Layer | Fill | Blur | Border |
|-------|------|------|--------|
| Outer container | `rgba(255,255,255,0.03)` | `backdrop-filter: blur(24px)` | `0.14` |
| Card | `rgba(255,255,255,0.04–0.06)` | `blur(20px)` | `0.08` |
| Floating chip (B) | `rgba(255,255,255,0.08)` | `blur(16px)` | `0.10` |
| Dark-tint card (A) | `rgba(10,10,16,0.55)` | `blur(20px)` | `0.08` |
| Warm glass (C) | `rgba(255,255,255,0.14–0.22)` | `blur(28px)` | `0.28` |
| Hero black card (C) | `rgba(8,8,8,0.92)` | none | none |

Always add `saturate(140%)` to the backdrop filter on colorful backgrounds:
`backdrop-filter: blur(20px) saturate(140%);`

### 4.4 Shadows

Dark theme uses almost no drop shadows; depth comes from borders and glow.

```css
--shadow-card:  0 20px 60px rgba(0, 0, 0, 0.35);
--shadow-chip:  0 8px 24px rgba(0, 0, 0, 0.30);
--glow-violet:  0 0 80px rgba(109, 91, 208, 0.35);
--glow-teal:    0 0 24px rgba(63, 208, 176, 0.45);
--glow-sage:    0 0 40px rgba(183, 227, 107, 0.35);
```

Warm theme (C) uses soft, long, low-opacity shadows: `0 30px 80px rgba(60,50,40,0.30)`.

---

## 5. Spacing & Layout

### 5.1 Scale (4px base)

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56 · 80`

| Use | Value |
|-----|-------|
| Outer frame inner padding | 24px |
| Card padding | 20–24px |
| Gap between cards | 16–20px |
| Label → number gap | 12–16px |
| Divider spacing in balance card | 16px above and below |
| Nav height (B) | 64–72px |
| Hero headline → subcopy | 32–40px |
| Subcopy → CTA | 32px |

### 5.2 Dashboard grid (Ref A)

```
┌───────────────────────────────────────────────────────────┐  outer frame (r 32, border .14)
│  ┌───────────┐  ┌───────────┐  ┌───────────┐             │
│  │ KPI       │  │ KPI       │  │ KPI       │   row 1: 3 equal columns, height ~135px
│  └───────────┘  └───────────┘  └───────────┘             │
│  ┌──────┐ ┌───────────────────────────┐ ┌────────────┐  │
│  │Balance│ │ Revenue Overview (chart)  │ │ List w/    │  │  row 2: 1fr · 2.4fr · 1fr
│  │ col   │ │                           │ │ skeletons  │  │
│  └──────┘ └───────────────────────────┘ └────────────┘  │
└───────────────────────────────────────────────────────────┘
```

```css
.dash        { display: grid; gap: 20px; padding: 24px; }
.dash-row-1  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.dash-row-2  { display: grid; grid-template-columns: 1fr 2.4fr 1fr; gap: 20px; }
```

### 5.3 Landing layout (Ref B)

```
        [Logo]     About  Trading▾  Contact  FAQ  ENG▾     [Login] [Sign up]
                          
                       Elevate Your
                     Trading Experience          ← centered, 2 lines, 64px
                    Unlock your trading…         ← centered, 14px, muted, max-w 340px
                      ( Sign Up & Trade )        ← white pill
        ┌ chip ┐             ◖ 3D orb ◗             ┌ chip ┐
        └──────┘          (bottom-cropped)          └──────┘
```

- Everything **center-aligned**, except nav (logo left, actions right).
- The orb is anchored to the bottom and cropped by the frame edge.
- Two glass chips float left-lower and right-lower of the orb, at different heights (asymmetric).
- Starfield: 1–2px white dots, opacity 0.2–0.6, sparse.

### 5.4 Smart-home layout (Ref C)

- Center: hero 3D object (house) in isometric view.
- Surrounding: glass tiles arranged around it, left column (stats), bottom row (devices), right column (room details + AI assistant).
- Tiles of **different sizes** and **different glass tints** (black, olive, frosted white) make a collage rhythm.
- Left rail: vertical icon nav, circular buttons (40px), active item = white filled circle.

---

## 6. Components

### 6.1 Outer container (frame)

```css
.frame {
  border-radius: 32px;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));
  border: 1px solid rgba(255,255,255,0.12);
  backdrop-filter: blur(24px) saturate(140%);
  box-shadow: var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.08);
}
```

### 6.2 KPI card

Structure: label (top-left, 18px) · badge (top-right) · big number (bottom-left, 48px).

```css
.kpi {
  position: relative;
  padding: 24px;
  min-height: 135px;
  border-radius: 24px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(20px);
}
.kpi__label  { font-size: 18px; font-weight: 400; color: #fff; }
.kpi__value  { margin-top: 20px; font-size: 48px; line-height: 1.05; font-weight: 400; letter-spacing: -0.02em; }
.kpi__badge  { position: absolute; top: 20px; right: 20px; }
```

### 6.3 Status badge

```css
.badge-positive {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px; font-weight: 500;
  color: #34D17A;
  background: rgba(52, 209, 122, 0.16);
  border: 1px solid rgba(52, 209, 122, 0.30);
}
```

### 6.4 Balance column (stacked stats)

- One tall card, three stat groups separated by 1px dividers `rgba(255,255,255,0.10)`.
- Each group: small label (14px) left + percent (12px, muted) right → number (36px) below.
- First group contains the **Withdraw** button, full width, 28–32px tall.

```css
.btn-solid {
  height: 30px; width: 100%;
  border-radius: 8px;
  background: #5B2BE0;
  color: #fff; font-size: 13px; font-weight: 500;
  border: 0;
  box-shadow: 0 6px 20px rgba(91, 43, 224, 0.40);
}
```

### 6.5 Chart card (Revenue Overview)

- Title left (18px), segmented tabs right: Daily · Weekly · Monthly · Yearly (12px, muted; active = white).
- **Smooth spline line**, 2px stroke, `#3FD0B0`, no fill, no grid lines.
- Y-axis labels: 10px, `rgba(255,255,255,0.45)`, left, evenly spaced (1,000 → 6,000).
- X-axis labels: 10px, hourly (12:00AM … 10:00AM).
- **Active point:** 12px white circle with 2px teal-tinted ring and soft glow, no tooltip box.
- Chart sits over a faint dotted/noise texture so it feels embedded in glass.

```css
.chart-line   { stroke: #3FD0B0; stroke-width: 2; fill: none; stroke-linecap: round;
                filter: drop-shadow(0 0 8px rgba(63,208,176,0.45)); }
.chart-point  { fill: #fff; stroke: rgba(255,255,255,0.35); stroke-width: 4; }
```

### 6.6 Skeleton list (right column)

- Section titles (14–16px, white): Employee, Independent Contractor, Contracted Employee, Stakeholders.
- Under each: 2 bars, 8–10px tall, `rgba(255,255,255,0.06)`, radius 8px, widths 70% and 100%.
- No card border; this column sits directly on the background.

### 6.7 Navigation (Ref B)

- Logo: text wordmark, 18px, weight 600, white.
- Links: 13–14px, weight 400, white at 0.9, gap 32px, chevron icons 12px on dropdowns.
- **Login:** pill, `rgba(255,255,255,0.06)` fill, no visible border, 13px, padding 10px 20px.
- **Sign up:** pill, gradient `linear-gradient(90deg, #A77BF3, #6B4BE8)`, white text, padding 10px 22px, slight glow `0 0 24px rgba(127,90,240,0.45)`.

### 6.8 Buttons

| Variant | Fill | Text | Radius | Height | Where |
|---------|------|------|--------|--------|-------|
| Primary white | `#FFFFFF` | `#0B0B10` | pill | 36–40px, padding 0 20px | Hero CTA "Sign Up & Trade" |
| Primary gradient | violet gradient | white | pill | 36px | Nav "Sign up" |
| Primary solid | `#5B2BE0` | white | 8px | 30px | "Withdraw" |
| Ghost | `rgba(255,255,255,0.06)` | white | pill | 36px | "Login" |
| Icon circle | `#FFFFFF` | `#0B0B10` | 50% | 22–28px | Arrow icon on chips (B) |
| Icon circle glass | `rgba(255,255,255,0.18)` | white | 50% | 40px | Left rail icons (C) |

Hover: raise fill opacity by 0.04 (ghost) or `brightness(1.08)` (solid). Press: `scale(0.98)`. Transition: `160ms ease`.

### 6.9 Floating glass chip (Ref B)

Two sizes:

**Wide chip** (left): ~165×88px, radius 16px
- Top-left: tiny label "Trading Pairs" (10px, muted)
- Top-right: 22px white circle with ↗ arrow icon
- Bottom-left: 14px, weight 600, two-line title
- Bottom-right: 10px faint percentage

**Stat chip** (right): ~165×88px, radius 16px
- Label 10px muted, big number "96%" at 24px weight 600
- 3px progress bar: white fill on `rgba(255,255,255,0.2)` track, radius 2px, 70px wide

```css
.chip {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.10);
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.08);
}
```

### 6.10 Liquid orb (Ref B hero art)

- A smooth, blobby sphere, `#6D5BD0` body with lighter top rim `#9B88FF` and darker core `#14102A`.
- Light comes from top-left; strong rim light on the upper edge, nearly black center.
- Rendered as a 3D asset (PNG/WebP with alpha) or WebGL. CSS fallback:

```css
.orb {
  width: 720px; height: 720px; border-radius: 50%;
  background:
    radial-gradient(60% 50% at 40% 15%, rgba(155,136,255,0.95), rgba(109,91,208,0.6) 40%, transparent 70%),
    radial-gradient(70% 70% at 50% 60%, #14102A 40%, #0A0818 100%);
  box-shadow: 0 -20px 120px rgba(109,91,208,0.45);
  filter: blur(0.3px);
}
```

### 6.11 Background glow ribbon (Ref A)

- Behind the dashboard: large flowing translucent ribbons in blue (`#3F5BFF`), violet (`#7B4BFF`), and amber (`#C9885A` at 0.4 opacity), blurred 30–60px.
- Ribbon passes **behind** and **through** the glass so panels refract it.
- Implement as pre-rendered image or stacked blurred gradients:

```css
.bg-glow {
  position: absolute; inset: 0; z-index: -1;
  background:
    radial-gradient(40% 30% at 85% 55%, rgba(63,91,255,0.45), transparent 70%),
    radial-gradient(35% 35% at 45% 45%, rgba(155,100,200,0.35), transparent 70%),
    radial-gradient(30% 20% at 20% 5%,  rgba(60,100,255,0.35), transparent 70%),
    #07070C;
}
```

### 6.12 Gauge / ring (Ref C)

- Ring stroke 6–8px, round caps, track `rgba(255,255,255,0.18)`, active arc `#B7E36B` with glow `0 0 12px rgba(183,227,107,0.5)`.
- Center value 32px weight 500, unit smaller (14px) superscript-aligned.
- Under value: tiny "Target" caption (9–10px, 0.5 opacity).
- +/− controls: 40px circles, `rgba(255,255,255,0.14)` fill, 1px border `0.25`.

### 6.13 Toggle switch (Ref C)

- Track 44×24px, pill, `rgba(255,255,255,0.22)` off / `rgba(255,255,255,0.9)` on.
- Knob 18px, on-state knob is dark olive `#3C3A2E`, off-state knob white.
- Transition 180ms.

### 6.14 Device tile (Ref C)

- Dark olive glass `rgba(70,66,54,0.55)`, radius 24px, border `rgba(255,255,255,0.14)`.
- Header row: small circular icon button (32px) + title (14px).
- Body: big value (32px) + mini visualization (bars / gradient strip / sliders).
- Bottom: tiny scale labels (Low / Medium / High, 9px, 0.55 opacity).

### 6.15 Pill label over scene (Ref C)

- Floating labels attached to 3D objects ("Solar • 3.8kW", "Front Door • Locked").
- Height 28–32px, padding 0 12px, pill, `rgba(255,255,255,0.25)` fill, blur 12px, border `rgba(255,255,255,0.35)`, 11px text.
- Leading 16–20px circular icon.

### 6.16 AI assistant card (Ref C)

- Olive-to-sage gradient glass: `linear-gradient(135deg, rgba(90,100,60,0.65), rgba(183,227,107,0.18))`.
- Title 12px weight 600, subtitle 10px muted.
- Input: full-width pill, 40px tall, `rgba(255,255,255,0.10)`, trailing mic button 32px white circle.

### 6.17 Avatar + user chip (Ref C)

- 32px circular avatar, name 12px weight 600, role 9px muted, chevron.
- Chip: pill, `rgba(255,255,255,0.22)`, blur, border `0.30`.

---

## 7. Iconography

- Style: **thin outline (1.5px stroke)**, rounded caps and joins, 16–20px.
- Library match: Lucide or Phosphor (Light/Regular).
- Icons inside circles: white on translucent, or dark on white.
- Arrow-up-right (↗) is the standard "open / go" glyph for chips.
- Chevron-down for dropdowns, 12px.

---

## 8. Motion

Keep motion sparse and tied to interaction.

| Interaction | Spec |
|-------------|------|
| Hover on card | border → `0.14`, translateY(-2px), 200ms ease-out |
| Button press | scale(0.98), 120ms |
| Tab switch (Daily/Weekly…) | active underline/fill slides, 200ms; chart line morphs 400ms ease-in-out |
| Chart point | follows cursor along the spline, glow follows |
| Toggle | knob slides 180ms, track fades |
| Hero orb | very slow float, ±8px on Y, 8s ease-in-out infinite |
| Page load | one staggered fade-up of hero text only (600ms, 80ms stagger) |

Respect `prefers-reduced-motion: reduce`: disable float and morphs.

---

## 9. Starter CSS (copy-paste base)

```css
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap");

:root {
  --font-sans: "Manrope", system-ui, sans-serif;

  --bg-base: #07070C;
  --glass-1: rgba(255,255,255,0.04);
  --glass-2: rgba(255,255,255,0.06);
  --border-1: rgba(255,255,255,0.08);
  --border-2: rgba(255,255,255,0.14);

  --text-primary: #fff;
  --text-secondary: rgba(255,255,255,0.72);
  --text-muted: rgba(255,255,255,0.50);
  --text-faint: rgba(255,255,255,0.32);

  --accent-violet: #5B2BE0;
  --accent-teal: #3FD0B0;
  --positive-text: #34D17A;
  --positive-bg: rgba(52,209,122,0.16);

  --r-md: 16px; --r-lg: 24px; --r-xl: 32px; --r-pill: 999px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  font-variant-numeric: tabular-nums;
}

.glass {
  background: var(--glass-2);
  border: 1px solid var(--border-1);
  border-radius: var(--r-lg);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
}

.num-xl { font-size: 48px; font-weight: 400; letter-spacing: -0.02em; line-height: 1.05; }
.num-md { font-size: 36px; font-weight: 400; letter-spacing: -0.02em; line-height: 1.1; }
.label  { font-size: 14px; color: var(--text-secondary); }
.micro  { font-size: 10px; color: var(--text-faint); }
```

---

## 10. Do / Don't

**Do**
- Stack glass on a colorful, blurred background.
- Keep 1px borders at 8–14% white.
- Use big radii and pill buttons.
- Show one large number per card, light weight.
- Let one accent color per component do the work.
- Use skeleton bars for placeholder lists.
- Mix tile sizes and tints in consumer/IoT layouts.

**Don't**
- Don't put glass on a flat solid background; it will look gray and dead.
- Don't use bold weights for large numbers.
- Don't use all-caps labels, heavy drop shadows, or 2px borders.
- Don't add gridlines, axis lines, or chart fills to the line chart.
- Don't use more than one saturated accent per card.
- Don't use sharp corners or square buttons (except the slim 8px "Withdraw" style).
- Don't use pure `#000` or pure gray fills; keep a cool blue-black cast.

---

## 11. Implementation Checklist

- [ ] Background has a gradient/glow/3D asset for the glass to blur.
- [ ] Every card: 1px border, radius ≥ 16px, backdrop blur ≥ 16px.
- [ ] One font family loaded, weights 300–700.
- [ ] Big numbers at weight 400, tabular numerals.
- [ ] Accent colors limited to the token list.
- [ ] Buttons follow the variants table in section 6.8.
- [ ] Chart: smooth spline, 2px, teal, no grid, glowing active dot.
- [ ] Skeleton rows for empty lists.
- [ ] Motion limited to the table in section 8; reduced-motion respected.
- [ ] Contrast: body text ≥ 4.5:1 against the *blurred* background; verify muted labels (0.50 white) are only used at ≥ 14px.
