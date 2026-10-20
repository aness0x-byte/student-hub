# DESIGN_SYSTEM.md — Monochrome Glass Card UI

> **Scope:** this document describes the **visual design only** (layout, typography, color, shape, effects, components). It deliberately contains **no product name, copy, labels, data, or app context** from the reference. All text in examples is placeholder (`Label`, `Title`, `00`). Any content can be substituted without changing the design.
> **Source of truth:** one reference screenshot (1246 × 950 px) of a dashboard-style interface.
> **Measurement convention:** pixel values are measured/estimated at **1:1 of the screenshot** (dashboard frame ≈ 1145 px wide). If the original was authored at another scale, apply one uniform scale factor to every token.
> **Labels:** `[M]` = measured (±2 px). `[E]` = estimated (colors by eye, font sizes from cap height, radii from curvature, blur/alpha from the look of the effect). No HEX was color-picked, so treat all colors as `[E]`.
> **Ignore:** the two floating viewer buttons at the bottom corners of the screenshot and the dark rounded outer border of the screenshot are presentation chrome, not part of the design.

---

## 1. Design Philosophy & Visual Identity

A strictly **achromatic (black / white / gray)** interface made of large, softly rounded cards on a frosted glass panel over a soft gray swirl backdrop. Hierarchy comes from **dark-vs-light surface inversion**, not color.

1. **Zero hue.** Every color is neutral gray. The single exception is one faintly cool blue-gray dot used as a secondary swatch (`#9A9CA8` `[E]`).
2. **Two card families.** *Dark cards* (`#262626`) for primary emphasis; *light cards* (white or frosted white) for everything else. They alternate across the grid.
3. **Glass over a swirl.** The whole layout sits in a translucent blurred panel; one card is explicitly frosted, the others are near-opaque white.
4. **Large radii everywhere.** Cards 22–28 px, tiles 14 px, controls are full pills/circles. No sharp corners.
5. **Flat.** No box shadows on cards or buttons. Depth = contrast + translucency + one rotated card.
6. **Compact type.** Micro text 9–11 px, titles 17–18 px, one large numeric display (≈ 38 px), one heading (≈ 26 px).
7. **Thin outline icons**, ≈ 1.5 px stroke, rounded, monochrome.

---

## 2. Global Design Tokens (CSS Variables)

```css
:root {
  /* ───── Neutrals [E] ───── */
  --color-black:      #0F0F0F;  /* chart main line, short accent bar, darkest ring */
  --color-ink-900:    #1A1A1A;  /* primary text / icons on light */
  --color-ink-800:    #262626;  /* DARK SURFACE: dark cards, dark buttons, active pill */
  --color-ink-700:    #3A3A3A;  /* dashed borders */
  --color-ink-600:    #5A5A5A;  /* section labels, secondary text */
  --color-gray-500:   #8C8C8C;  /* secondary icons, secondary chart line (~#A0A0A0) */
  --color-gray-400:   #A8A8A8;  /* muted text */
  --color-gray-300:   #C4C4C4;  /* unchecked checkbox border */
  --color-gray-200:   #E4E4E4;  /* hairlines, ring tracks on light */
  --color-gray-100:   #F2F2F2;  /* hover fills */
  --color-white:      #FFFFFF;

  --color-tile-default:  #EDEDED;  /* light tile on dark card */
  --color-tile-selected: #BDBDBD;  /* selected tile on dark card */
  --color-swatch-cool:   #9A9CA8;  /* only tinted color in the system */

  /* ───── Text roles ───── */
  --text-primary:        #1A1A1A;
  --text-secondary:      #5A5A5A;
  --text-muted:          #A8A8A8;
  --text-on-dark:        #FFFFFF;
  --text-on-dark-muted:  #A8A8A8;
  --text-on-dark-soft:   #DADADA;

  /* ───── Surfaces ───── */
  --surface-dark:        var(--color-ink-800);
  --surface-light:       #FFFFFF;
  --surface-light-soft:  rgba(255,255,255,0.92);
  --surface-glass:       rgba(255,255,255,0.35);   /* frosted card */
  --surface-glass-panel: rgba(255,255,255,0.22);   /* outer frame */
  --surface-menu-dark:   #232323;

  /* ───── Borders ───── */
  --border-hair:        1px;
  --border-control:     1.5px;
  --border-glass:       1px solid rgba(255,255,255,0.65);
  --border-outline-btn: 1px solid var(--color-ink-800);
  --border-dashed:      1.5px dashed var(--color-ink-700);
  --border-checkbox:    1.5px solid var(--color-gray-300);

  /* ───── Radius ───── */
  --radius-xs:    4px;     /* checkbox */
  --radius-sm:   10px;     /* popup menu */
  --radius-md:   14px;     /* tiles, active nav pill */
  --radius-lg:   22px;     /* item cards, dark list cards */
  --radius-xl:   26px;     /* main cards */
  --radius-2xl:  28px;     /* sidebar, dashed add tile */
  --radius-frame:40px;     /* outer glass frame */
  --radius-full: 999px;

  /* ───── Effects ───── */
  --blur-glass:        blur(18px);
  --blur-glass-panel:  blur(24px);
  --shadow-none:       none;                          /* default for everything */
  --shadow-menu:       0 6px 16px rgba(0,0,0,0.18);   /* popup only */
  --shadow-rotated:    0 8px 20px rgba(0,0,0,0.06);   /* rotated card only */

  /* ───── Typography ───── */
  --font-family: "Inter", "Manrope", "Helvetica Neue", Arial, sans-serif; /* [E] */
  --fs-heading:   26px;  --fs-display: 38px;  --fs-stat: 26px;
  --fs-title-lg:  18px;  --fs-title-md: 17px; --fs-title-sm: 15px;
  --fs-logo:      24px;  --fs-body: 13px;     --fs-label: 12px;
  --fs-caption:   11px;  --fs-micro: 9px;
  --fw-regular: 400; --fw-medium: 500; --fw-semibold: 600; --fw-bold: 700;
  --lh-tight: 1.1; --lh-snug: 1.25; --lh-normal: 1.4;

  /* ───── Spacing (4px base) ───── */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-7: 28px; --space-8: 32px; --space-10: 40px;

  /* ───── Layout ───── */
  --gap-grid:      20px;
  --card-pad:      28px;
  --sidebar-width: 185px;

  /* ───── Motion (inferred) ───── */
  --transition-fast: 120ms ease;
  --transition-base: 200ms ease;
}
```

---

## 3. Typography

**Family `[E]`:** clean neo-grotesque sans; closest match **Inter** (alternates Manrope, Plus Jakarta Sans). One family only.

| Role | Size | Weight | Line height | Letter-spacing | Color |
|---|---|---|---|---|---|
| Page heading (single greeting-style line) | 26 px | 700 | 1.1 | -0.01em | `--text-primary` |
| Wordmark | 24 px | 600 | 1.1 | -0.01em | `--text-primary` |
| Display number (on dark card) | 38 px | 600–700 | 1.0 | -0.01em | `--text-on-dark` |
| Stat number (inside tiles) | 26 px | 700 | 1.0 | 0 | `--text-primary` |
| Card title, large | 18 px | 500 | 1.2 | 0 | `--text-primary` |
| Card title, medium | 17 px | 500 | 1.2 | 0 | `--text-on-dark` or `--text-primary` |
| Item title (2-line max) | 15 px | 500 | 1.25 | 0 | by surface |
| Body / list item | 13 px | 400 | 1.4 | 0 | `--text-primary` (active) / `--text-muted` (inactive) |
| Navigation label | 12 px | 500 | 1.2 | 0 | white (active) / `--text-primary` |
| Section label | 11 px | 500, **UPPERCASE** | 1.2 | +0.02em | `--color-ink-600` |
| Button label | 12 px (pill) / 11 px (outline) | 500 | 1.0 | 0 | white / `--text-primary` |
| Caption (legend, axis, links, dropdown) | 11 px | 400–500 | 1.2 | 0 | `--text-secondary` |
| Micro (stat sublabel, helper note, badge, menu items) | 9–10 px | 400 (tile labels 500) | 1.2 | 0 | `--text-on-dark-muted` / `--text-muted` |
| Status text | 10 px | 400 | 1.2 | 0 | `--text-on-dark-soft` |
| Note text (on dark) | 9 px | 400 (lead-in word 700) | 1.35 | 0 | `--text-on-dark-muted` |
| Ring center value | 14 px | 700 | 1.0 | 0 | `--text-primary` |

Rules:
- Titles are **sentence case, weight 500**. Only the page heading, display numbers and tile numbers are bold.
- A large number is paired with a **two-line, left-aligned, 9 px muted caption placed beside it** (not under it).
- Headings are single-line; item titles wrap to max two lines.
- Text is left-aligned except tile contents and ring center.

---

## 4. Color Palette

### 4.1 Core (all `[E]`)
| Token | HEX | Use |
|---|---|---|
| `--color-black` | `#0F0F0F` | line series, short accent bar |
| `--color-ink-900` | `#1A1A1A` | text, icons on light |
| `--color-ink-800` | `#262626` | **dark surfaces**, dark buttons, active pill, checked checkbox, axis-active chip |
| `--color-ink-700` | `#3A3A3A` | dashed border |
| `--color-ink-600` | `#5A5A5A` | section labels; middle ring (`#6B6B6B`) |
| `--color-gray-500` | `#8C8C8C` | secondary icon |
| `--color-gray-400` | `#A8A8A8` | muted text |
| `--color-gray-300` | `#C4C4C4` | checkbox border; light ring (`#BDBDBD`) |
| `--color-gray-200` | `#E4E4E4` | hairlines, light tracks |
| `--color-gray-100` | `#F2F2F2` | hover fill |
| `--color-white` | `#FFFFFF` | light cards, sidebar, circle buttons |
| `--color-tile-default` | `#EDEDED` | light tile |
| `--color-tile-selected` | `#BDBDBD` | selected tile |
| `--color-swatch-cool` | `#9A9CA8` | the one tinted swatch |

### 4.2 Chart colors
| Element | Color |
|---|---|
| Line series 1 | `#0F0F0F`, 2 px |
| Line series 2 | `#A0A0A0`, 2 px |
| Area fill under lines | `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0))` `[E]` |
| Concentric ring 1 (outer) | `#262626`, stroke 6–7 px |
| Concentric ring 2 (middle) | `#6B6B6B`, stroke 6–7 px |
| Concentric ring 3 (inner) | `#BDBDBD`, stroke 6–7 px |
| Ring tracks | `rgba(0,0,0,0.08)` |

### 4.3 Backdrop `[E]`
Grayscale soft 3D swirl photograph: whites `#FFFFFF`, mid-grays `#BEBEBE`–`#9A9A9A`, shadows `#6E6E6E`. Decorative only. Fallback:
```css
background:
  radial-gradient(60% 50% at 20% 20%, #FFFFFF 0%, rgba(255,255,255,0) 60%),
  radial-gradient(50% 50% at 80% 70%, #8E8E8E 0%, rgba(142,142,142,0) 65%),
  linear-gradient(135deg, #D9D9D9, #A9A9A9);
```

### 4.4 Semantic colors
**None exist in the reference** (no red/green/amber). Do not add any.

---

## 5. Borders, Radius, Opacity, Shadows

### 5.1 Borders
| Element | Border |
|---|---|
| Outer glass frame | `1px solid rgba(255,255,255,0.65)` |
| Frosted card | `1px solid rgba(255,255,255,0.7)` |
| Solid white / dark cards | none |
| Outline pill button | `1px solid #262626`, transparent fill |
| Dashed add tile | `1.5px dashed #3A3A3A` (dash ≈ 4, gap ≈ 3), transparent fill |
| Unchecked checkbox | `1.5px solid #C4C4C4`, radius 4 |
| Mini progress ring | 2 px stroke; track `#E4E4E4` on light, `rgba(255,255,255,0.3)` on dark |
| Circle icon buttons | none (white fill defines shape) |

### 5.2 Radius map
| Element | Radius |
|---|---|
| Outer glass frame | 40 px |
| Sidebar | 28 px |
| Main cards (dark stat, frosted chart, ring chart) | 26 px |
| Checklist card | 24 px (use 26 for consistency) |
| Item cards | 22 px |
| Dashed add tile | 28 px |
| Dark list cards | 22 px |
| Stat tiles / active nav pill | 14 px |
| Corner badge-tile on item card | 16 px on the inner corner, card radius on the outer corner |
| Popup menu | 10 px |
| Value badge (chart tooltip) | 6 px |
| Checkbox | 4 px |
| Primary pill button, outline pill, circle buttons, dots, avatar, axis chip | 999 px |
| View-toggle active square | 8 px |

### 5.3 Opacity / transparency
| Surface | Fill | Backdrop |
|---|---|---|
| Outer frame | `rgba(255,255,255,0.22)` | `blur(24px)` |
| Frosted card | `rgba(255,255,255,0.35)` | `blur(18px)` |
| Other white cards | `rgba(255,255,255,0.92–1)` | optional `blur(18px)` |
| Sidebar | `#FFF` 100 % | none |
| Dark cards | `#262626` 100 % | none |
| Muted text | solid gray tokens, **not** alpha | |

### 5.4 Shadows
- **Default: none** on every card, button, tile.
- Popup menu: `0 6px 16px rgba(0,0,0,0.18)` `[E]`.
- Rotated card: `0 8px 20px rgba(0,0,0,0.06)` `[E]`.
- No glows, no inner shadows, no gradients on UI surfaces.

---

## 6. Layout & Spacing

### 6.1 Structure (measured)
```
┌──────────────── Glass frame (≈1145 × 818, r=40) ────────────────┐
│ ┌────────┐  ┌──────────────────────────────────────────────┐   │
│ │Sidebar │  │ Top bar: heading (left) ... controls (right)  │   │
│ │185×742 │  │ ROW 1: 3 cards  293 | 275 | 236   h≈268       │   │
│ │ white  │  │ ROW 2: 1 card 263 + 3 tiles ≈172   h≈227      │   │
│ │        │  │ ROW 3: 3 dark cards ≈264 each (clipped)       │   │
│ └────────┘  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```
| Measure | Value |
|---|---|
| Frame inset from image | ≈ 53 px left, 70 px top `[M]` |
| Frame inner padding | ≈ 33 px left, 36 px top `[M]` |
| Sidebar | x 87→272 (**185 wide**), y 106→848 (**742 tall**) `[M]` |
| Sidebar → content gap | ≈ 37 px `[M]` |
| Content width | ≈ 844 px `[M]` |
| Card gap | **≈ 20 px** horizontal, **≈ 21 px** vertical `[M]` |
| Heading → Row 1 | ≈ 22 px |

### 6.2 Grid
- Row 1: `1.07fr 1fr 0.86fr` → **293 / 275 / 236**, equal height ≈ **268**.
- Row 2: one 263-px card + a group of **3 equal tiles ≈ 172 × 160** (gap ≈ 16); the group has a section title above (≈ 14–18 px gap).
- Row 3: three equal dark cards ≈ **264** wide, gap ≈ 27, **clipped by the frame bottom**.
- Section titles are left-aligned to the first column they introduce; a text-link + chevron sits right-aligned on the same line.

### 6.3 Internal padding
| Component | Padding |
|---|---|
| Main cards | **28 px** (title ≈ 28–33 px from top) |
| Sidebar | 21 px horizontal; pills inset 21 px; logo 33 px from left |
| Nav pill | h 36, left padding 16, icon–text gap 12 |
| Stat tiles | 68 × 88, centered content |
| Item card | 22 px |
| Dark list card | 28 px |
| Checklist rows | pitch 33 px |

### 6.4 Sidebar rhythm
Primary nav pitch **≈ 38 px**; secondary group pitch ≈ 37 px; third group pitch ≈ 31 px; one item pinned to the bottom. Section labels sit ≈ 20 px above their group.

---

## 7. Component Specifications

### 7.1 Shell
```css
.page { min-height:100vh; display:grid; place-items:center;
  background: url("backdrop.jpg") center/cover no-repeat, #C9C9C9; }
.frame { width:min(1145px,92vw); padding:36px 33px;
  display:grid; grid-template-columns:185px 1fr; column-gap:37px;
  background:var(--surface-glass-panel);
  backdrop-filter:var(--blur-glass-panel); -webkit-backdrop-filter:var(--blur-glass-panel);
  border:var(--border-glass); border-radius:var(--radius-frame); }
```

### 7.2 Sidebar
White, opaque, radius 28, 185 × 742. Order: wordmark; 5 nav items; labeled group A (3 items, one with a dashed-circle-plus icon); labeled group B (2 items with colored dot markers 12 px: `#1A1A1A` and `#9A9CA8`); spacer; 1 pinned item.

```css
.sidebar { width:var(--sidebar-width); padding:14px 21px 24px; background:#FFF;
  border-radius:var(--radius-2xl); display:flex; flex-direction:column; }
.wordmark { display:flex; align-items:center; gap:8px; padding-left:12px;
  font:600 var(--fs-logo)/1.1 var(--font-family); }
.wordmark__mark { width:32px; height:28px; }          /* filled #1A1A1A glyph */
.nav-item { height:36px; padding:0 16px; display:flex; align-items:center; gap:12px;
  font:500 var(--fs-label)/1 var(--font-family); color:var(--text-primary);
  border-radius:var(--radius-md); transition:background var(--transition-fast); }
.nav-item svg { width:16px; height:16px; stroke-width:1.5; }
.nav-item--active { background:var(--surface-dark); color:#FFF; }
.nav-label { margin:0 0 10px 16px; font:500 var(--fs-caption)/1.2 var(--font-family);
  letter-spacing:.02em; text-transform:uppercase; color:var(--color-ink-600); }
.dot { width:12px; height:12px; border-radius:999px; }
```

### 7.3 Top bar
Heading left; right cluster with 12 px gaps: **primary pill** (black, 115 × 34, leading plus icon), **two white circle icon buttons** (46 px; one carries a 9 px dark notification dot at top-right), **avatar circle** (46 px).

```css
.btn-primary { height:34px; padding:0 28px; border:0; border-radius:999px;
  background:var(--surface-dark); color:#FFF; font:500 12px/1 var(--font-family);
  display:inline-flex; align-items:center; gap:8px; }
.icon-btn { position:relative; width:46px; height:46px; border:0; border-radius:999px;
  background:#FFF; display:grid; place-items:center; }
.icon-btn svg { width:18px; height:18px; stroke:var(--color-ink-900); stroke-width:1.5; }
.icon-btn__dot { position:absolute; top:6px; right:8px; width:9px; height:9px;
  border-radius:999px; background:var(--color-ink-900); }
.avatar { width:46px; height:46px; border-radius:999px; object-fit:cover; }
```

### 7.4 Dark stat card (293 × 268, r 26)
- Header: title (17/500 white) left; share icon + vertical kebab icon right (16 px, white).
- Two stat groups side by side, separated by a 1 px vertical divider (`rgba(255,255,255,0.18)`, ≈ 24 px tall). Each = display number (38 px) + two-line 9 px muted caption to its right.
- Under the first stat: accent bar 58 × 4, radius 2, `#0F0F0F`.
- Bottom: row of **3 tiles** (68 × 88, r 14, gap ≈ 14): 16 px outline icon top, 26/700 number center, 9/500 label bottom. First tile `#BDBDBD` (selected), others `#EDEDED`.

```css
.card { border-radius:var(--radius-xl); padding:var(--card-pad); box-shadow:none; }
.card--dark  { background:var(--surface-dark); color:var(--text-on-dark); }
.card--light { background:var(--surface-light); color:var(--text-primary); }
.card--glass { background:var(--surface-glass); backdrop-filter:var(--blur-glass);
  -webkit-backdrop-filter:var(--blur-glass); border:var(--border-glass); }
.stat { display:flex; align-items:flex-end; gap:6px; }
.stat__value   { font:600 var(--fs-display)/1 var(--font-family); }
.stat__caption { font:400 var(--fs-micro)/1.2 var(--font-family); color:var(--text-on-dark-muted); }
.tile { width:68px; height:88px; border-radius:var(--radius-md); background:var(--color-tile-default);
  color:var(--text-primary); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; }
.tile--selected { background:var(--color-tile-selected); }
.tile__value { font:700 var(--fs-stat)/1 var(--font-family); }
.tile__label { font:500 var(--fs-micro)/1 var(--font-family); }
```

### 7.5 Frosted line-chart card (275 × 268, r 26)
- Title 18/500 + 18 px outline icon top-right.
- Legend: 8 px dots (black, gray) + 11 px labels, 14 px apart.
- Chart: two smooth monotone/Catmull-Rom lines, **2 px**; left and bottom axis frame lines 1.5 px `#0F0F0F`; no grid except a ≈ 6 %-black hairline; plot area ≈ 220 × 85 px.
- **Value badge** above the highest point: `#262626`, ≈ 36 × 18, r 6, 9/600 white text, 6 px caret pointing down.
- X-axis: 7 evenly spaced labels (≈ 35 px pitch), 11/500 `#5A5A5A`, ≈ 20 px below baseline. The **active label** sits in a 20 px circle `#262626` with white text.

### 7.6 Ring-chart card (236 × 268, r 26)
- Solid white. Title 18/500 + 18 px trend icon top-right; 9 px sub-caption under it.
- Left: vertical legend (7 px dot + 11 px label), row pitch 24 px. Colors `#262626`, `#6B6B6B`, `#BDBDBD`.
- Right: **three concentric rings**, outer Ø ≈ 115 px, stroke 6–7 px, ≈ 4 px gaps, round caps, track `rgba(0,0,0,0.08)`; center value 14/700 with 6 px micro-caption beneath.
- Footer row: **34 px dark circle button** (white icon) + **outline pill** (h 34, w ≈ 150, 1 px `#262626`, 11/500, trailing icon).

```css
.btn-circle { width:34px; height:34px; border:0; border-radius:999px; background:var(--surface-dark); color:#FFF; }
.btn-outline { height:34px; padding:0 20px; border-radius:999px; border:var(--border-outline-btn);
  background:transparent; font:500 var(--fs-caption)/1 var(--font-family); color:var(--text-primary);
  display:inline-flex; align-items:center; gap:8px; transition:all var(--transition-fast); }
```

### 7.7 Checklist card (263 × 227, r 24–26)
- Title 17/500; right: 26 px mini ring with 8 px fraction text + 16 px edit icon.
- 4 rows, pitch 33 px, checkbox–label gap 10 px.
- **Checked:** 16 px square, r 4, fill `#262626`, white check; label `#1A1A1A`, no strikethrough.
- **Unchecked:** 16 px square, `1.5px solid #C4C4C4`; label `#A8A8A8`.

```css
.checkbox { width:16px; height:16px; border-radius:var(--radius-xs); border:var(--border-checkbox); background:transparent; }
.checkbox--checked { background:var(--surface-dark); border-color:var(--surface-dark); }
.check-row { display:flex; align-items:center; gap:10px; font:400 var(--fs-body)/1.4 var(--font-family); color:var(--text-muted); }
.check-row--checked { color:var(--text-primary); }
```

### 7.8 Item cards & add tile (group of 3 ≈ 172 × 160)
- Section header: title 18/500 left; text-link 11 px + 11 px right chevron at far right.
- **Item card:** white, r 22, padding 22. Top row: 22 px outline icon left, horizontal 3-dot kebab right. Middle: 15/500 title (max 2 lines). Footer: 10 px muted caption left, bell-style icon right.
  - **Variant "tilted":** `rotate(-3deg)`, faint rotated shadow, with a **dark corner tile** at bottom-right (≈ 52 × 50, `#262626`, radius `16px 0 22px 0`, white 16 px icon).
  - **Variant "upright":** no rotation; plain outline icon (16 px, `#1A1A1A`) at bottom-right, no dark tile.
- **Popup menu** (anchored above-right of a kebab): `#232323`, ≈ 81 × 67, r 10, padding 8 × 10, 3 rows (pitch 20): 9 px white label left + 10 px white icon right; 8 px caret pointing to the trigger; `--shadow-menu`.
- **Add tile:** transparent, `1.5px dashed #3A3A3A`, r 28, centered 16 px plus icon + 15/400 label, laid out horizontally.

```css
.item-card { position:relative; width:172px; height:160px; padding:22px; background:#FFF;
  border-radius:var(--radius-lg); display:flex; flex-direction:column; justify-content:space-between; }
.item-card--tilted { transform:rotate(-3deg); box-shadow:var(--shadow-rotated); }
.item-card__corner { position:absolute; right:0; bottom:0; width:52px; height:50px;
  background:var(--surface-dark); border-radius:16px 0 var(--radius-lg) 0; display:grid; place-items:center; }
.add-tile { border:var(--border-dashed); border-radius:var(--radius-2xl); background:transparent;
  display:flex; align-items:center; justify-content:center; gap:10px;
  font:400 var(--fs-title-sm)/1 var(--font-family); color:var(--text-primary); }
.menu { background:var(--surface-menu-dark); color:#FFF; border-radius:var(--radius-sm);
  padding:8px 10px; box-shadow:var(--shadow-menu); font:400 var(--fs-micro)/1 var(--font-family); }
.menu__item { display:flex; justify-content:space-between; align-items:center; height:20px; }
```

### 7.9 Dark list cards (≈ 264 × 128+, r 22)
- `#262626`, padding 28. Title 15/500 white; top-right 26 px **mini ring** (white 2 px arc on `rgba(255,255,255,0.3)` track, 8 px white fraction text centered).
- Status row ≈ 20 px under title: 6 px white dot + 10 px text `#DADADA`.
- Optional note line: 9/400 `#A8A8A8`, single line with ellipsis, lead-in word 700 `#DADADA`.
- Section header above: title 18/500 left; right: dropdown (11 px label + 12 px chevron) and **view toggle** — active = 24 px white square r 8 with dark grid icon, inactive = transparent with gray icon, gap 8.

### 7.10 Icons
Outline, **1.5 px stroke**, round caps/joins. Sizes: 16 px (nav, cards), 18 px (circle buttons), 22 px (item-card hero), 10–12 px (menu, chevrons). `#1A1A1A` on light, `#FFF` on dark. Never filled (except wordmark glyph and notification dot). One icon library only.

### 7.11 Dividers
Only one: the 1 px vertical divider in the dark stat card. No horizontal list dividers.

---

## 8. States & Interactions (all **inferred**; the screenshot is static)

| Element | Default (shown) | Hover | Active / selected | Focus | Disabled |
|---|---|---|---|---|---|
| Nav item | transparent | `#F2F2F2` bg | **`#262626` pill + white text** (shown) | 2 px `#262626` outline, 2 px offset | text `#A8A8A8` |
| Primary pill | `#262626` | `#000` | `#000`, scale .98 | white + dark double ring | opacity .4 |
| Circle icon btn | white | `#F2F2F2` | `#E4E4E4` | 2 px `#262626` outline | opacity .4 |
| Outline pill | transparent + 1 px dark | fill `#262626`, text white | same, scale .98 | focus ring | opacity .4 |
| Stat tile | `#EDEDED` | `#E0E0E0` | **`#BDBDBD`** (shown) | outline | — |
| Checkbox | 1.5 px `#C4C4C4` | border `#8C8C8C` | **filled `#262626` + white check** (shown) | outline | opacity .4 |
| Item card | white | translateY(-2px), no new shadow | tilted + dark corner tile (shown) | outline | opacity .6 |
| Add tile | dashed | border `#262626`, bg `rgba(255,255,255,0.4)` | — | outline | — |
| View toggle | white square active | inactive gets `rgba(255,255,255,0.6)` | white square + dark icon | outline | — |
| Axis label | text only | — | **dark circle + white text** (shown) | — | — |

Transitions: `background-color, color, border-color, transform` at 120–200 ms ease.

---

## 9. Visual Hierarchy

1. Strongest focal point: heading + the dark stat card (largest numerals, darkest surface, top-left).
2. Dark = emphasis or action: primary pill, active nav, stat card, corner badge-tile, active axis label, list cards.
3. Light cards = supporting content: title (500) > data > captions (muted).
4. Text contrast ladder: `#FFF`/`#1A1A1A` → `#5A5A5A` → `#A8A8A8`. Nothing readable lighter than `#C4C4C4`.
5. Density: compact. Small captions sit 4–6 px from their numbers; breathing room is in the 20 px card gaps and 28 px card padding.
6. Alternate dark / glass / white across a row; do not put two same-family main cards adjacent (except the dark list row).

---

## 10. Responsive Behavior

Only one desktop layout (≈ 1145 px) is shown. Everything else is **inferred**:
- `≥ 1100 px`: as in §6.
- `768–1099 px`: sidebar → icon-only rail (≈ 72 px wide, r 28); Row 1 and Row 3 become 2 columns.
- `< 768 px`: sidebar off-canvas or bottom bar; cards stack in one column, keeping 20 px gap, 28 px padding.
- Radii, type sizes, and colors never change across breakpoints.

---

## 11. Implementation Guidelines

1. Load tokens (§2) first; never hard-code HEX, radii, or font sizes in components.
2. Build order: backdrop → frame → sidebar → top bar → Row 1 → Row 2 → Row 3.
3. CSS Grid for rows, Flexbox inside cards.
4. SVG for charts (`stroke-linecap: round`, `fill: none`; ring stroke 6–7 px).
5. `backdrop-filter` only on the outer frame and the one frosted card; fall back to `rgba(255,255,255,0.7)` if unsupported.
6. Clip the last row with `overflow:hidden` on the frame to replicate the cut-off look (optional if the page scrolls).
7. Only one item card is tilted (`rotate(-3deg)`).
8. Placeholder content only: keep text lengths realistic (titles ≤ 2 lines, labels 1 line) so proportions hold.

```css
* { box-sizing:border-box; }
body { margin:0; font-family:var(--font-family); color:var(--text-primary); -webkit-font-smoothing:antialiased; }
.title-lg { font:500 var(--fs-title-lg)/1.2 var(--font-family); }
.title-md { font:500 var(--fs-title-md)/1.2 var(--font-family); }
.caption  { font:400 var(--fs-caption)/1.2 var(--font-family); color:var(--text-secondary); }
.micro    { font:400 var(--fs-micro)/1.2 var(--font-family); color:var(--text-muted); }
```

---

## 12. Consistency Checklist

- [ ] Only black / white / grays (plus the single `#9A9CA8` swatch).
- [ ] Main cards radius 22–28; controls full pills/circles; no square corners.
- [ ] Dark surfaces `#262626`, not pure black.
- [ ] No box shadows except popup and the tilted card.
- [ ] Titles weight 500; bold only on heading, display and tile numbers.
- [ ] Card padding ≈ 28 px; card gap ≈ 20 px.
- [ ] Icons outline 1.5 px; dark on light, white on dark.
- [ ] Active nav = dark pill with white text; no accent bar or color.
- [ ] Unchecked = gray border + gray text; checked = dark fill + white check + dark text.
- [ ] Number captions are 9 px, muted, two-line, **beside** the number.
- [ ] Charts monochrome; 2 px lines, 6–7 px ring strokes.
- [ ] Dashed tile is transparent, radius 28.
- [ ] Blur/transparency only on the frame and the one frosted card.
- [ ] Exactly one tilted card (≈ -3°) with a dark corner tile.

---

## 13. Common Mistakes to Avoid

1. Adding an accent or brand color (blue, purple, green) for active states or charts.
2. Using pure `#000` card backgrounds or heavy black overlays instead of `#262626`.
3. Adding drop shadows to cards.
4. Reducing radii (8–12 px on cards) or using non-pill shapes for pill buttons.
5. Bold (700) card titles.
6. Thick, filled, or mixed-library icons.
7. Gradient fills on cards or buttons.
8. Making every card frosted glass.
9. Introducing semantic colors (red destructive, green success).
10. Placing captions under large numbers instead of beside them.
11. Strikethrough on checked rows.
12. Equal heights where the reference varies (Row 2 ≈ 227 vs Row 1 ≈ 268).
13. Wide letter-spacing on regular text (only uppercase section labels get +0.02em).
14. Copying any text, names, or data from the reference; use neutral placeholders.
15. Including the screenshot's viewer buttons or outer dark border.

---

## 14. Uncertain Values & Assumptions

| Item | Status | Assumption |
|---|---|---|
| Font family | Not identifiable | Inter (alt. Manrope / Plus Jakarta Sans) |
| All HEX colors | Estimated by eye | `#262626` dark; ±6 luminance steps possible |
| Sizes < 12 px | Estimated | If the screenshot is a ~0.8× downscale of a 1440 px design, "real" sizes ≈ 11–14 px; scale everything uniformly |
| Radii | Estimated from curvature | §5.2 |
| Blur / glass alpha | Estimated | 18–24 px blur; 0.22 / 0.35 alpha |
| Shadows | None visible; faint ones are guesses | §5.4 |
| Glass border alpha | Estimated | 0.65–0.7 |
| Tilt angle | Estimated | -3° (range -2° to -4°) |
| Mini-ring fraction text | Estimated | 8 px |
| Checklist card radius | 24 measured vs 26 siblings | Use 26 |
| Item-tile gap | ≈ 12–20 px (tilt blurs edges) | 16 px |
| Header icon sizes | Estimated | 18 px |
| Hover / focus / disabled / responsive | **Not in reference** | Inferred (§8, §10) |
| Semantic colors | **Not in reference** | None defined |
| Backdrop swirl | Not reproducible exactly | Similar grayscale swirl or §4.3 gradient |
| Image count | Only **1** image provided | Re-validate if more screens exist |
