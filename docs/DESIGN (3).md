---
name: Mach-Red Kinetic
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#e8bdb6'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#ae8882'
  outline-variant: '#5e3f3b'
  surface-tint: '#ffb4a9'
  primary: '#ffb4a9'
  on-primary: '#690002'
  primary-container: '#de1615'
  on-primary-container: '#fff2f0'
  inverse-primary: '#c00009'
  secondary: '#ffb59f'
  on-secondary: '#5f1600'
  secondary-container: '#b73300'
  on-secondary-container: '#ffd8cd'
  tertiary: '#bec7d5'
  on-tertiary: '#28313c'
  tertiary-container: '#68717e'
  on-tertiary-container: '#f1f5ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4a9'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930005'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb59f'
  on-secondary-fixed: '#3a0a00'
  on-secondary-fixed-variant: '#862300'
  tertiary-fixed: '#dae3f2'
  tertiary-fixed-dim: '#bec7d5'
  on-tertiary-fixed: '#131c27'
  on-tertiary-fixed-variant: '#3e4753'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
  pitch-black: '#000000'
  surface-glass: rgba(37, 46, 57, 0.6)
  border-subtle: rgba(245, 245, 245, 0.1)
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-technical:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  stat-value:
    fontFamily: Sora
    fontSize: 56px
    fontWeight: '800'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-desktop: 80px
  margin-mobile: 20px
  gutter: 24px
  section-gap: 120px
  container-max: 1440px
---

## Brand & Style

This design system embodies the high-octane world of offroad racing, merging the precision of aerospace engineering with the aggressive aesthetic of Formula 1. The brand personality is technical, elite, and relentless. It is designed to evoke a sense of velocity and structural integrity, targeting sponsors and high-tier recruits who value engineering excellence.

The visual style is a hybrid of **Glassmorphism** and **Corporate Modernism**, characterized by:
- **Dark-First Technicality:** A deep charcoal and black foundation that allows high-chroma reds and oranges to vibrate.
- **Aerospace Precision:** Micro-details such as thin borders, monospaced data readouts, and subtle grid overlays.
- **Kinetic Depth:** Using translucent layers and background blurs to simulate the complex, layered nature of a racing chassis.
- **High-Contrast Impact:** Large, bold typography paired with generous whitespace to command attention and ensure legibility at speed.

## Colors

The palette is anchored in a "Pitch Black" environment to maximize the brilliance of the brand colors. 
- **Primary Red (#DE1615):** Used for critical actions, branding accents, and highlighting performance peaks.
- **Secondary Orange (#FF6534):** A technical accent color, reminiscent of heat signatures and warning indicators. It should be used sparingly for secondary data points or hover states.
- **Charcoal & Black:** Form the structural layers of the UI. Charcoal is used for containers and elevated surfaces to create depth against the pure black background.
- **White (#F5F5F5):** Reserved strictly for high-priority typography and icons to ensure maximum contrast and readability against dark backgrounds.

## Typography

The typography strategy focuses on a hierarchy that separates "Action" from "Information."
- **Display & Headlines:** Sora is utilized for its geometric, wide-track feel, reflecting modern automotive branding. Headlines should use tight tracking and heavy weights.
- **Body Text:** Inter provides a clean, neutral balance, ensuring that long-form content about team history or technical specs remains highly legible.
- **Technical Labels:** JetBrains Mono is used for all labels, captions, and data markers to reinforce the engineering and "code-driven" nature of the vehicle's development.
- **Responsiveness:** Scale display sizes aggressively on mobile; headline-xl should reflow to headline-lg-mobile to maintain visual impact without breaking layouts.

## Layout & Spacing

The system uses a **fixed-width central grid** for desktop and a **fluid fluid-edge grid** for mobile. 
- **The 12-Column Grid:** On desktop, content resides in a 12-column structure with 24px gutters. Use asymmetric layouts (e.g., 8 cols for text, 4 for technical stats) to create dynamic tension.
- **Whitespace:** Large section gaps (120px+) are mandatory to evoke a "premium" feel and allow complex vehicle imagery to breathe.
- **Safe Areas:** Maintain a minimum 80px side margin on desktop to ensure the glassmorphism effects on card edges are not lost against the viewport edge.

## Elevation & Depth

Depth is achieved through **Material Transparency** rather than traditional drop shadows.
- **The Base:** Solid #000000 background.
- **Layer 1 (The Chassis):** Semi-transparent charcoal containers (#252E39 at 60% opacity) with a 20px backdrop blur.
- **Layer 2 (The Cockpit):** Active elements or hovered cards increase opacity to 80% and add a 1px solid border using `border-subtle`.
- **Accents:** Use "Glow" effects (outer glows) in the primary red for active states or critical path indicators, simulating LED telemetry displays. Avoid soft, blurry shadows in favor of crisp, directional glows.

## Shapes

The shape language is "Streamlined Geometric." A consistent **20px radius** is applied to all primary containers and cards, creating a modern, friendly-yet-technical feel that avoids the "boxy" look of older industrial designs. 

Small components like chips, buttons, and input fields should follow a **Pill-shaped** (Full Rounded) or **8px radius** to provide a tactile, functional contrast to the larger structural cards.

## Components

- **High-End Cards:** Use the `surface-glass` style. Include a 1px border-top for a "rim-light" effect. Titles should be in Sora Bold, with metadata in JetBrains Mono.
- **Technical Stat Counters:** Use `stat-value` for the number. Add a small, 12px JetBrains Mono label above or below the number in Primary Red.
- **Sleek Navigation:** A floating "glass" bar with 20px rounding. Hover states on links should trigger a Primary Red underline or glow.
- **Timeline Markers:** A vertical 2px line in Charcoal. Years should be in `label-technical` (JetBrains Mono). Active milestones use a Primary Red circular node with an outer glow.
- **Buttons:** 
  - *Primary:* Solid Red background, White text (Sora Bold).
  - *Secondary:* Ghost style with 1px White or Red border, blurring the background content behind the button.
- **Input Fields:** Dark charcoal fill, 1px subtle border that turns Primary Red on focus. Use JetBrains Mono for placeholder text.