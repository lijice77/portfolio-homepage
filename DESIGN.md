---
name: Nocturne Cinema
colors:
  surface: '#121317'
  surface-dim: '#121317'
  surface-bright: '#38393d'
  surface-container-lowest: '#0d0e12'
  surface-container-low: '#1a1b1f'
  surface-container: '#1e1f23'
  surface-container-high: '#292a2e'
  surface-container-highest: '#343539'
  on-surface: '#e3e2e7'
  on-surface-variant: '#cfc4c5'
  inverse-surface: '#e3e2e7'
  inverse-on-surface: '#2f3034'
  outline: '#988e90'
  outline-variant: '#4c4546'
  surface-tint: '#c6c6c6'
  primary: '#c6c6c6'
  on-primary: '#303030'
  primary-container: '#000000'
  on-primary-container: '#757575'
  inverse-primary: '#5e5e5e'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#e9c176'
  on-tertiary: '#412d00'
  tertiary-container: '#000000'
  on-tertiary-container: '#91702e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#e9c176'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4201'
  background: '#121317'
  on-background: '#e3e2e7'
  surface-variant: '#343539'
typography:
  display-lg:
    fontFamily: Bebas Neue
    fontSize: 120px
    fontWeight: '400'
    lineHeight: 110px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Bebas Neue
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: 0.05em
  headline-md:
    fontFamily: Bebas Neue
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Bebas Neue
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 48px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  technical-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is engineered to evoke the atmosphere of a darkened theater, where the interface recedes to allow the cinematography to command full attention. The brand personality is prestigious, technical, and atmospheric. It targets high-end commercial directors, film producers, and luxury brands seeking visual storytelling excellence.

The visual style is a fusion of **Minimalism** and **Cinematic High-Contrast**. It leverages expansive black voids to create depth, punctuated by precise, high-density metadata. Every interaction should feel like a mechanical camera adjustment—deliberate, smooth, and high-fidelity. The emotional goal is to make the user feel like they are viewing a curated gallery or a private screening.

## Colors

The palette is anchored in **True Black (#000000)** to ensure infinite contrast on OLED screens and deep immersion. 

- **Primary (Deep Black):** Used for the global background and "the stage."
- **Secondary (Charcoal):** Used for surface elevations, cards, and "off-stage" UI elements.
- **Tertiary (Spotlight Gold):** A desaturated, metallic gold used sparingly for active states, key CTAs, and focal points, mimicking the warmth of a tungsten lamp.
- **Neutral (Slate Gray):** Low-contrast text for technical metadata and secondary labels to maintain visual hierarchy.

## Typography

This design system utilizes a high-contrast typographic pairing to balance artistry with technical precision.

- **Headlines (Bebas Neue):** Reserved for film titles and section headers. It mimics the verticality of classic film posters. Use all-caps for a commanding, cinematic presence.
- **Body & Technical (Geist):** A modern, monospaced-influenced sans-serif used for descriptions, equipment lists, and camera specs. It provides a "spec sheet" aesthetic that conveys professional expertise.
- **Tracking:** Headings should use slightly expanded letter spacing (0.05em) to feel premium, while technical labels should use significant tracking (0.1em) for maximum legibility at small sizes.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model that mimics a film strip. Content is centered within a wide container, with generous margins to prevent visual clutter.

- **The Wide-Angle View:** High-impact imagery and video backgrounds should break the grid and span 100% of the viewport width.
- **The Spec Grid:** Metadata and technical info should be organized into a 12-column grid, often grouped in 3 or 4 column clusters to resemble camera log sheets.
- **Rhythm:** Use large vertical spacing (128px - 160px) between sections to create a "breathing room" effect, allowing the user to digest one project at a time.

## Elevation & Depth

In a dark-mode-first system, depth is conveyed through **Tonal Layers** rather than shadows. 

- **Level 0 (Background):** Pure Black (#000000). The base layer.
- **Level 1 (Surfaces):** Charcoal (#121212). Used for cards or inset sections.
- **Overlays:** Use high-blur backdrop filters (32px) on navigation bars to create a "frosted glass" effect over passing cinematography, maintaining a sense of transparency and light.
- **Active State:** The only "glow" allowed is from the Spotlight Gold accent color, used as a thin 1px border or a subtle outer glow to indicate focus, like a light leak in a darkroom.

## Shapes

The design system utilizes **Sharp (0px)** corners for all primary containers, buttons, and media players. This reinforces the technical, mechanical nature of camera equipment and monitors. 

Internal elements, such as small chips for "Gear Tags" or "Technical Specs," may use a very subtle 2px radius to prevent them from feeling overly aggressive, but the overall architectural language remains strictly rectangular.

## Components

### Buttons
- **Primary:** Solid Spotlight Gold with Black text. Sharp corners. All-caps technical font.
- **Secondary:** Ghost style with 1px White or Gold border. 
- **Hover State:** Slight brightness increase and a transition to a "viewfinder" crosshair cursor.

### Portfolio Cards
- Large-scale imagery with metadata (focal length, camera body, client) displayed in a technical-sm font overlay. 
- On hover, the image should slightly scale (1.05x) and a "Play" icon should appear in the center.

### Technical Spec Chips
- Small, outlined boxes containing technical data (e.g., "ARRI ALEXA 35", "35MM ANAMORPHIC"). 
- Background: Transparent; Border: 1px Charcoal; Text: Gray.

### Navigation
- Vertical or horizontal, pinned to the edge of the screen. 
- Links are monochromatic, turning Gold only when active.

### The "Film Strip" Scroller
- A horizontal scrolling gallery for behind-the-scenes (BTS) shots, using a continuous track with minimal spacing (4px) to simulate a physical roll of film.