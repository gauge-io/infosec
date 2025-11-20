# Design Style Guide

## Overview

This design system is inspired by gauge.io's sophisticated dark mode aesthetic, featuring IBM Plex typography and a carefully curated color palette optimized for professional, technology-focused applications.

---

## Color Palette

### Base Colors (Dark Mode)

The color system uses HSL values for better control and theming capabilities, matching gauge.io's visual language.

#### Background & Surface Colors

- **Background**: `hsl(0, 0%, 9%)` - Very dark charcoal (#171717), primary background
- **Card**: `hsl(0, 0%, 11%)` - Slightly lighter for card surfaces
- **Popover**: `hsl(0, 0%, 11%)` - Matching card for overlays
- **Muted**: `hsl(0, 0%, 15%)` - Subtle background for muted elements

#### Foreground Colors

- **Foreground**: `hsl(0, 0%, 98%)` - Primary text color (near white)
- **Muted Foreground**: `hsl(0, 0%, 65%)` - Secondary text, less emphasis
- **Card Foreground**: `hsl(0, 0%, 98%)` - Text on card surfaces

#### Primary Colors

- **Primary**: `hsl(200, 100%, 70%)` - Light blue for links and primary actions
- **Primary Foreground**: `hsl(0, 0%, 9%)` - Dark text on primary backgrounds

#### Secondary Colors

- **Secondary**: `hsl(260, 30%, 20%)` - Dark purple for header backgrounds (gauge.io style)
- **Secondary Foreground**: `hsl(0, 0%, 98%)` - Text on secondary backgrounds

#### Accent Colors

- **Accent**: `hsl(0, 0%, 15%)` - Accent backgrounds for highlights
- **Accent Foreground**: `hsl(200, 100%, 70%)` - Light blue for accent text
- **Accent Orange**: `hsl(15, 100%, 60%)` - Bright orange for accent lines and dividers
- **Accent Pink**: `hsl(330, 100%, 71%)` - Pink for accent lines and decorative elements

#### Semantic Colors

- **Destructive**: `hsl(0, 72%, 51%)` - Red for errors and destructive actions (#E53E3E)
- **Destructive Foreground**: `hsl(0, 0%, 98%)` - Text on destructive backgrounds
- **Success**: `hsl(142, 71%, 45%)` - Green for success states
- **Warning**: `hsl(38, 92%, 50%)` - Amber for warnings
- **Info**: `hsl(200, 100%, 70%)` - Light blue for informational messages

#### Border & Input Colors

- **Border**: `hsl(0, 0%, 20%)` - Subtle borders and dividers
- **Input**: `hsl(0, 0%, 20%)` - Input field borders
- **Ring**: `hsl(200, 100%, 70%)` - Focus ring color (matches primary)

---

## Typography

### Font Families

- **Primary Font**: `IBM Plex Sans` - The primary typeface for all UI text, headings, and body content
  - Fallback stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Monospace**: `IBM Plex Mono` - For code, technical content, and monospaced text
  - Fallback stack: `"JetBrains Mono", "Fira Code", "Consolas", Monaco, monospace`

IBM Plex Sans provides excellent readability and a modern, professional appearance that aligns with gauge.io's sophisticated aesthetic.

### Font Scale

| Size | Value | Usage |
|------|-------|-------|
| **xs** | `0.75rem` (12px) | Captions, labels |
| **sm** | `0.875rem` (14px) | Small text, metadata |
| **base** | `1rem` (16px) | Body text (default) |
| **lg** | `1.125rem` (18px) | Large body text |
| **xl** | `1.25rem` (20px) | Subheadings |
| **2xl** | `1.5rem` (24px) | Section headings |
| **3xl** | `1.875rem` (30px) | Page headings |
| **4xl** | `2.25rem` (36px) | Hero headings |
| **5xl** | `3rem` (48px) | Display headings |

### Font Weights

- **Light**: `300` - Rarely used, for large display text
- **Regular**: `400` - Body text
- **Medium**: `500` - Emphasized text, buttons
- **Semibold**: `600` - Headings, strong emphasis
- **Bold**: `700` - Strong headings

### Line Heights

- **Tight**: `1.25` - Headings
- **Normal**: `1.5` - Body text
- **Relaxed**: `1.75` - Long-form content

### Letter Spacing

- **Tighter**: `-0.025em` - Large headings
- **Normal**: `0` - Default
- **Wide**: `0.025em` - Uppercase text, labels

---

## Spacing System

Based on a 4px base unit for consistency.

| Token | Value | Usage |
|-------|-------|-------|
| **0** | `0` | No spacing |
| **1** | `0.25rem` (4px) | Tight spacing |
| **2** | `0.5rem` (8px) | Small gaps |
| **3** | `0.75rem` (12px) | Component padding |
| **4** | `1rem` (16px) | Standard spacing |
| **5** | `1.25rem` (20px) | Medium spacing |
| **6** | `1.5rem` (24px) | Section spacing |
| **8** | `2rem` (32px) | Large spacing |
| **10** | `2.5rem` (40px) | Extra large spacing |
| **12** | `3rem` (48px) | Section gaps |
| **16** | `4rem` (64px) | Page sections |
| **20** | `5rem` (80px) | Hero spacing |
| **24** | `6rem` (96px) | Maximum spacing |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| **none** | `0` | Sharp corners |
| **sm** | `0.125rem` (2px) | Small elements |
| **md** | `0.375rem` (6px) | Default radius |
| **lg** | `0.5rem` (8px) | Cards, buttons |
| **xl** | `0.75rem` (12px) | Large cards |
| **2xl** | `1rem` (16px) | Modals, dialogs |
| **full** | `9999px` | Pills, avatars |

Default radius: `0.5rem` (8px)

---

## Shadows & Elevation

Dark mode shadows use subtle glows and elevated surfaces.

| Level | Value | Usage |
|-------|-------|-------|
| **sm** | `0 1px 2px 0 rgba(0, 0, 0, 0.3)` | Subtle elevation |
| **md** | `0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)` | Cards |
| **lg** | `0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)` | Elevated cards |
| **xl** | `0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)` | Modals |
| **glow** | `0 0 20px rgba(7, 182, 213, 0.15)` | Accent glow (cyan) |

---

## Opacity

| Token | Value | Usage |
|-------|-------|-------|
| **0** | `0` | Fully transparent |
| **25** | `0.25` | Very subtle |
| **50** | `0.5` | Semi-transparent |
| **75** | `0.75` | Mostly opaque |
| **100** | `1` | Fully opaque |

---

## Transitions & Animations

### Duration

- **Fast**: `150ms` - Hover states, micro-interactions
- **Normal**: `200ms` - Standard transitions
- **Slow**: `300ms` - Complex animations

### Easing

- **Ease In**: `cubic-bezier(0.4, 0, 1, 1)`
- **Ease Out**: `cubic-bezier(0, 0, 0.2, 1)`
- **Ease In Out**: `cubic-bezier(0.4, 0, 0.2, 1)` (default)

### Common Transitions

```css
/* Standard transition */
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

/* Color transitions */
transition: color 150ms ease-out, background-color 150ms ease-out;

/* Transform transitions */
transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Breakpoints

| Name | Value | Usage |
|------|-------|-------|
| **sm** | `640px` | Small tablets |
| **md** | `768px` | Tablets |
| **lg** | `1024px` | Small desktops |
| **xl** | `1280px` | Desktops |
| **2xl** | `1536px` | Large desktops |

---

## Z-Index Scale

| Level | Value | Usage |
|-------|-------|-------|
| **0** | `0` | Base level |
| **10** | `10` | Dropdowns |
| **20** | `20` | Sticky elements |
| **30** | `30` | Overlays |
| **40** | `40` | Modals |
| **50** | `50` | Popovers |
| **100** | `100` | Tooltips |

---

## Component-Specific Tokens

### Buttons

- **Height (default)**: `2.5rem` (40px)
- **Height (small)**: `2.25rem` (36px)
- **Height (large)**: `2.75rem` (44px)
- **Padding (horizontal)**: `1rem` (16px)
- **Border radius**: `0.5rem` (8px)
- **Font weight**: `500` (medium)

### Inputs

- **Height**: `2.5rem` (40px)
- **Padding**: `0.75rem` (12px)
- **Border radius**: `0.375rem` (6px)
- **Border width**: `1px`

### Cards

- **Padding**: `1.5rem` (24px)
- **Border radius**: `0.5rem` (8px)
- **Border width**: `1px`
- **Background**: Card color token

---

## Usage Guidelines

### Color Contrast

- Ensure minimum contrast ratio of **4.5:1** for normal text
- Ensure minimum contrast ratio of **3:1** for large text (18px+)
- Use foreground colors appropriately for readability

### Typography Hierarchy

1. Use size and weight to establish visual hierarchy
2. Limit to 2-3 font sizes per section
3. Maintain consistent line heights for readability

### Spacing Consistency

- Use spacing tokens consistently throughout
- Maintain visual rhythm with regular spacing intervals
- Group related elements with tighter spacing

### Dark Mode Best Practices

- Avoid pure black (`#000000`) - use very dark charcoal (`#171717` / `hsl(0, 0%, 9%)`) instead
- Use subtle borders and dividers with `hsl(0, 0%, 20%)`
- Leverage elevation and shadows for depth
- Use accent lines (orange and pink) sparingly for visual interest and section separation
- Ensure sufficient contrast for accessibility (minimum 4.5:1 for normal text)
- Dark purple (`hsl(260, 30%, 20%)`) can be used for header/navigation backgrounds

---

## Implementation

All design tokens are implemented using CSS custom properties (CSS variables) in `src/index.css` and configured in `tailwind.config.js`. Components reference these tokens through Tailwind CSS utility classes.

### Example Usage

```tsx
// Using color tokens
<div className="bg-background text-foreground">
  <Card className="bg-card border-border">
    <h2 className="text-2xl font-semibold text-foreground">
      Heading
    </h2>
    <p className="text-muted-foreground">
      Body text
    </p>
  </Card>
</div>

// Using accent lines (gauge.io style)
<div className="border-t border-accent-orange h-px"></div>
<div className="border-t border-accent-pink h-px"></div>

// Using spacing tokens
<div className="p-6 space-y-4">
  <Button className="bg-primary text-primary-foreground">
    Primary Action
  </Button>
</div>

// Using secondary purple background for headers
<header className="bg-secondary text-secondary-foreground">
  Navigation content
</header>
```

---

## References

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

