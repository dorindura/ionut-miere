---
name: Prisaca Apuseni
description: Honey from our own painted hives in the Apuseni, sold straight from the beekeeper.
colors:
  wash: "#f5f6f0"
  wash-2: "#eceee4"
  paper: "#ffffff"
  ink: "#1c2a21"
  ink-2: "#45554a"
  ink-3: "#5c6a60"
  rule: "#d3d8ca"
  rule-strong: "#b7bfae"
  hive-sun: "#f2c230"
  hive-blue: "#2a64ad"
  hive-teal: "#137a75"
  hive-leaf: "#2f7a3a"
  hive-orange: "#e06a26"
  hive-red: "#b8322a"
  grass: "#5e9e3a"
  forest: "#1d3826"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 7.2vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
    fontVariation: "'opsz' 96"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 3.2rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.3
  plate:
    fontFamily: "Big Shoulders Stencil, Bricolage Grotesque, ui-sans-serif, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.06em"
    fontFeature: "tnum"
rounded:
  plate: "3px"
  window: "4px"
  sm: "8px"
  md: "10px"
  sheet: "14px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "64px"
  section-wide: "96px"
components:
  button-primary:
    backgroundColor: "{colors.hive-sun}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "color-mix(in oklab, #f2c230 88%, #ffffff)"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.wash}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "48px"
  button-ink-hover:
    backgroundColor: "color-mix(in oklab, #1c2a21 85%, #2f7a3a)"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.paper}"
  button-danger:
    backgroundColor: "{colors.hive-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "48px"
  button-sm:
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "40px"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "11px 14px"
    height: "48px"
  sheet:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.sheet}"
  chip:
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  plate:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.plate}"
    rounded: "{rounded.plate}"
    padding: "2px 8px 2px"
  hive-front:
    backgroundColor: "{colors.hive-blue}"
    textColor: "{colors.paper}"
    padding: "14px 14px 0"
  hive-window:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.window}"
  nav-link:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  nav-link-hover:
    backgroundColor: "{colors.wash-2}"
    textColor: "{colors.ink}"
---

# Design System: Prisaca Apuseni

## Overview

**Creative North Star: "The Painted Hive Row"**

The shop is the row of enamel-painted hives on the Gârde slope. Every honey variety stands as its own hive front: a flat box of paint with an overhanging darker lid, a stamped number plate, a white window showing the jar, and a dark entrance slot over a landing board. The fronts stand on a strip of grass. Everything else sits on a limewash ground, like the wall of the house beside the hives, and is written in deep forest ink.

Depth comes from flat planes that overlap. The hive row overlaps the bottom edge of the real hive-row photograph, the lid overhangs the body, and the white sheet sits on the limewash. The paints are named roles, not decoration: sunflower yellow carries the primary action, blue carries links and focus, and each variety keeps the same paint on every surface. The admin uses the same paints as quiet status chips and as four small painted hive counters on a limewash work surface. Density is generous on the storefront and compact but calm in the admin.

The system rejects two stock honey looks: the dark-gold luxury page and the cream-and-serif artisan page. There are no gradients and no glass, and no drop shadows fall onto the ground.

**Key Characteristics:**
- Limewash ground, forest-ink text, white paper sheets for working surfaces.
- Flat enamel hive paints as named colour roles, one paint per honey variety.
- The hive front (lid, painted body, plate, window, entrance) is the signature container.
- A sturdy variable grotesque display, a legible humanist body, and stencil numerals on plates.
- Depth only from overlapping flat planes. The one lip under the yellow button and the focus halo are the only shadows.
- An authored 2px-stroke line icon set. The logo mark is a small painted hive.

## Colors

Chalky limewash neutrals tinted toward green, forest ink, and six saturated enamel paints taken from the real hives.

### Primary
- **Sunflower Hive Yellow** (hive-sun): the primary action (the "Alege mierea" / add-to-cart button), the cart count badge, text selection, the contact band, step-number plates, and the polen variety's hive. Text on it is always ink, never white.

### Secondary
- **Hive Blue** (hive-blue): links, focus rings, form accent and caret, the "Stupina noastră" story band, the acacia (salcâm) hive, and the logo mark. It is the system's interactive colour.

### Tertiary
- **Turquoise Hive** (hive-teal): the linden (tei) hive and the "Expediată" status.
- **Leaf Hive Green** (hive-leaf): the fir honeydew (mană de brad) hive, the "Livrată" status, and success checks.
- **Marigold Hive Orange** (hive-orange): the polyfloral hive, the "Nouă" status (tinted at 15% with #9a4210 text), and the "to confirm" admin counter. Text on it is ink.
- **Warning Red** (hive-red): destructive actions and the "unpaid card" admin counter only. It is never used as a variety paint.
- **Grass** (grass): the ground strip under the hive row. Nowhere else.

### Neutral
- **Limewash** (wash): the page ground and the browser theme colour.
- **Limewash Shade** (wash-2): nav hover fills, the "Anulată" chip, and quiet insets.
- **Paper** (paper): sheets, fields, hive windows, and number plates.
- **Forest Ink** (ink): all primary text, the ink button, and the cart button.
- **Moss Ink** (ink-2): secondary text and nav links at rest.
- **Lichen Ink** (ink-3): hints, placeholders, and meta lines.
- **Rule** (rule): sheet borders and dividers.
- **Strong Rule** (rule-strong): field and ghost-button strokes, and the scrollbar.
- **Deep Forest** (forest): the footer ground, under a four-paint stripe (blue, teal, orange, leaf).

### Named Rules
**The One Paint Per Honey Rule.** Each variety keeps its paint on every surface: salcâm blue, mană de brad leaf, tei teal, polifloră orange, polen sun. New products take the next paint in the rotation (sun, blue, teal, orange, leaf). Red is never a variety paint.

**The Yellow Means Go Rule.** Sunflower yellow fills the one primary action on a view. Ink sits on yellow and orange. White sits on blue, teal, leaf, and red.

**The Quiet Status Rule.** In lists and tables, status is shown by the paint at 12–15% tint with full-strength text and a dot. Only the four admin counters use full paint.

## Typography

**Display Font:** Bricolage Grotesque, variable with opsz and wdth axes (with ui-sans-serif, system-ui)
**Body Font:** Figtree (with ui-sans-serif, system-ui)
**Label/Mono Font:** Big Shoulders Stencil, used only for number plates

**Character:** A chunky, slightly quirky grotesque, set tight and heavy, like signwriting on a painted box. Under it is a plain, friendly humanist sans for prices, weights and phone numbers. Figtree replaced the planned Atkinson Hyperlegible Next because Atkinson's slashed zeros read badly in "1000g", "45 lei" and phone numbers.

### Hierarchy
- **Display** (800, clamp(2.6rem, 7.2vw, 5rem), 0.95, -0.035em, opsz 96): the single page headline.
- **Headline** (800, clamp(2rem, 4.4vw, 3.2rem) up to clamp(2.2rem, 5vw, 3.6rem) for band sections, 1.0–1.02): section heads. All h1 to h3 use the display face, balanced wrapping, and -0.02em tracking.
- **Title** (800, 1.25rem): hive-front variety names, sheet headers, and the brand wordmark (1.05–1.15rem).
- **Body** (400, 1.0625rem, 1.55): running text. Lead paragraphs use 1.125rem, relaxed. Story prose is capped at 62ch.
- **Label** (700, 0.95rem): form labels, nav links (600), and definition terms. Hints are 400, 0.85rem, in lichen ink. Chips are 700, 0.8rem.
- **Plate** (Big Shoulders Stencil 800, 0.95rem, 0.06em, tabular): "Nr. 01" hive numbers, step numbers, and admin counter values (2rem).

### Named Rules
**The Stencil Is Stamped Rule.** The stencil face only appears on a white or yellow plate. It is never used for headings or running text.

**The Sentence Case Rule.** Labels, chips, and nav are in sentence case at their natural tracking. The system has no uppercase tracked labels.

## Layout

A single 72rem (max-w-6xl) container with 16px side padding. Sections breathe at 64px vertical padding on phones and 96px on desktop. Coloured bands (blue story, yellow contact, forest footer) run full-bleed, and their content stays inside the container. Desktop compositions use a 12-column grid (8/4 headline and lead, 5/7 photo and story, 4/8 FAQ). Gaps step through 8, 12, 16, 24, and 40px.

The hive row is four columns on desktop with 24px gaps. It is pulled up over the hive photograph (-13rem on desktop, -4rem on phone) and stands on the 1rem grass strip. On phones the row becomes a horizontal snap scroller of fronts about 72vw wide (max 300px), with the first front peeking into the first viewport. The admin uses a four-up counter row above a 2/1 grid of sheets, and orders render as table rows inside a sheet.

The layout is mobile-first. Touch targets are at least 44px, and buttons and fields are 48px.

## Elevation & Depth

The system is flat. Depth comes from overlapping flat planes: the lid overhanging the hive body by 0.5rem each side, the hive row overlapping the photograph, the white sheet on limewash, and the white window inside the paint. Hover lifts a hive front 6px, and nothing is cast below it.

### Shadow Vocabulary
- **Paint lip** (`box-shadow: inset 0 -3px 0 color-mix(in oklab, var(--color-hive-sun) 70%, #7a4d00)`): only on the yellow primary button, as the thicker bottom edge of a painted board.
- **Focus halo** (`box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-hive-blue) 22%, transparent)`): fields on focus.
- **Selected option** (`box-shadow: inset 0 0 0 1px var(--color-ink)`): a checked delivery or payment option card, which doubles its 1.5px ink border.

### Named Rules
**The Flat Planes Rule.** Nothing casts a shadow onto the ground. To separate a surface, overlap it, give it a darker lid, or put it on paper with a 1px rule.

## Shapes

Corners are small and practical. Plates have 3px corners, and hive windows have 4px. Nav links and option cards use 8px. Buttons and fields use 10px (0.625rem), and sheets use 14px (0.875rem). Chips and the cart badge are full pills. The hive silhouette is rectangular: a lid bar wider than the body with 3px top corners, a square-cornered body, a pill-shaped entrance slot (42% wide, #0f1a13), and a landing board (58% wide) in the lid colour. The lid colour is always the paint mixed 72% with #0b140e. Strokes are 1.5px on fields and ghost buttons and 1px on sheets.

## Components

### Buttons
Sturdy painted boards with heavy labels.
- **Shape:** gently rounded (10px), 48px tall, with 20px side padding. The small size is 40px tall with 14px padding. Labels are 700 at 0.975rem and may carry a trailing 18px icon.
- **Primary:** sunflower yellow with ink text and the paint lip. There is one per view.
- **Hover / Focus:** yellow lightens 12% toward white, and ink mixes 15% toward leaf. All buttons press down 1px on active. Transitions run 160ms on the expo-out curve. Focus shows a 3px hive-blue outline at a 2px offset.
- **Ink:** forest ink with limewash text, for form submits and the cart button.
- **Ghost:** transparent with a 1.5px strong-rule border. On hover the border turns ink and the fill turns paper.
- **Danger:** warning red with white text, darkening 12% on hover.
- **Disabled:** 55% opacity with a not-allowed cursor.

### Chips
- **Style:** pill, 700 at 0.8rem, with a 0.45rem dot in the text colour before the label. The fill is the status paint at 12–15%, and the text is the full paint.
- **State:** order status (Nouă orange, Confirmată blue, Expediată teal, Livrată leaf, Anulată wash-2 with lichen ink) and payment badges (Ramburs in yellow tint, card states in blue or leaf).

### Cards / Containers
- **Sheet:** paper with a 1px rule border and 14px corners, and no shadow. It is the working surface for the cart, checkout, product details, and every admin panel. Headers are divided by a rule.
- **Option card:** paper with a 1.5px strong-rule border and 8px corners, at least 48px tall. When checked, the border and inset turn ink.
- **Notice:** yellow at 35% tint with 8px corners, an icon, and a bold lead-in. Used for the easybox card-only warning.

### Inputs / Fields
- **Style:** paper with a 1.5px strong-rule border, 10px corners, 48px height, and 1rem text. Textareas are at least 7rem tall. Selects use an authored ink chevron. Placeholders are in lichen ink.
- **Focus:** the border turns hive blue and the 3px blue halo appears. Hover darkens the border to lichen ink.
- **Label:** 700 at 0.95rem, stacked above the field with a 6px gap. An optional hint sits beneath it at 400, 0.85rem.

### Navigation
- **Storefront:** sticky header, 64px on phones and 72px on desktop, on limewash with a bottom rule. It shows the hive mark and wordmark with a "Gârde · Munții Apuseni" subline. Links are 600 at 0.95rem in moss ink, with 8px-radius wash-2 hover fills. The cart is an ink button with a yellow pill count. On phones, links move into the mobile menu.
- **Admin:** a white bar with the hive mark. Tabs carry 2px-stroke icons, and the active tab has a blue underline.
- **Footer:** deep forest under a 12px four-paint stripe, with light green-grey text.

### Hive Front (signature)
A variety as a painted hive. It has a lid (0.9rem, the paint darkened), a body in the full paint with 14px padding, a plate row ("Nr. 01" plus an optional white "Popular" pill with a yellow star), a white window with the jar (object-contain, 4:5), the variety name in title type, weights, a "de la 45 lei" price, and an arrow. It ends in the entrance slot and landing board. Text on it uses the paint's paired foreground (--paint-fg). Hover lifts it 6px over 280ms on the expo-out curve. Fronts rise in with an 80ms stagger (18px, 700ms), and motion is removed under reduced-motion. In the admin, the same frame becomes a counter with a thinner lid (0.625rem), a bold label, and the value on a 2rem stencil plate.

### Icons
Authored 24px-grid line icons with a 2px stroke and round caps and joins, in currentColor, at 16–20px. The brand mark is a small SVG hive with a navy lid, blue body, dark slot, and yellow landing board.

## Do's and Don'ts

### Do:
- **Do** give every new variety a hive front in its own paint from the rotation (sun, blue, teal, orange, leaf), with a "Nr. 0X" stencil plate.
- **Do** use sunflower yellow with ink text for the single primary action on a view.
- **Do** separate surfaces with overlap, a darker lid, or white paper with a 1px rule (#d3d8ca).
- **Do** show order and payment status as tinted chips with a dot. Keep full paint for the admin counters.
- **Do** keep buttons and fields 48px tall with 10px corners, and focus in hive blue (3px outline, 2px offset).
- **Do** use the real hive-row and apiary photographs as the only imagery beside product jars.

### Don't:
- **Don't** add drop shadows, gradients, or glass. Only the three recorded insets and halos are allowed.
- **Don't** use hive red as a variety paint. It means danger or an unpaid card.
- **Don't** put white text on sunflower yellow or marigold orange.
- **Don't** use the stencil face outside a plate.
- **Don't** drift toward the dark-gold luxury honey page or a cream-and-serif artisan page.
- **Don't** use emoji or font glyphs as icons. Use the authored 2px-stroke set.
