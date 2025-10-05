# Design Guidelines: War Card Game

## Design Approach: Reference-Based (Professional Card Games)

**Primary References:** Hearthstone's clarity + Gwent's sophistication + modern minimalist gaming UI
**Target Audience:** Adult players seeking a polished, professional gaming experience

---

## Core Design Principles

1. **Professional Maturity:** Clean, sophisticated aesthetics without childish elements
2. **Visual Hierarchy:** Clear game state communication through design
3. **Emoji Restraint:** Reserved exclusively for card faces and rarity indicators
4. **Responsive Excellence:** Flawless display across all devices and orientations

---

## Color Palette

### Dark Mode Primary (Gaming Standard)
- **Background Base:** 220 15% 12% (deep slate, professional depth)
- **Surface Elevated:** 220 14% 16% (card containers, panels)
- **Primary Accent:** 210 80% 55% (strategic blue, action elements)
- **Success/Win:** 142 76% 45% (emerald green)
- **Danger/Loss:** 0 84% 60% (vibrant red)
- **Neutral Text:** 220 10% 90% (high contrast readable)
- **Muted Text:** 220 8% 65% (secondary information)

### Rarity System (Emoji-Indicated)
- Common: 220 8% 75% (subtle gray tone)
- Rare: 210 80% 55% (distinguished blue)
- Epic: 280 60% 58% (royal purple)  
- Legendary: 45 93% 58% (golden amber)

---

## Typography

**Font Stack:** 
- Primary: 'Inter' (Google Fonts) - clean, modern, professional
- Accent: 'Space Grotesk' (Google Fonts) - headers, card names

**Scale:**
- Headings: 32px/28px/24px (bold, Space Grotesk)
- Body: 16px/14px (regular/medium, Inter)
- Card Text: 18px (medium, Inter)
- UI Labels: 12px (uppercase, tracking-wide, Inter)

---

## Layout System

**Spacing Units:** Tailwind 4, 6, 8, 12, 16 (consistent rhythm)
- Card gaps: space-y-6
- Section padding: px-4 py-8 (mobile), px-8 py-12 (desktop)
- Component margins: mb-8 to mb-16

**Container Strategy:**
- Game board: max-w-6xl mx-auto
- Card displays: grid with responsive columns
- Mobile: single column, touch-optimized
- Desktop: multi-column strategic layout

---

## Component Library

### Cards
- **Structure:** Rounded-2xl, shadow-2xl elevation
- **Dimensions:** Aspect ratio 2:3, responsive scaling
- **Emoji Placement:** Centered top (suit/type), corner badge (rarity)
- **Hover State:** Subtle lift (translate-y-[-4px]) + glow effect
- **Active State:** Scale-95 feedback

### Game Board
- **Layout:** Flexbox/Grid for card positioning
- **Player Areas:** Distinct visual zones (top/bottom split)
- **Center:** Battle area with clear card comparison
- **Backgrounds:** Subtle gradient overlays, no busy patterns

### Buttons & Actions
- **Primary CTA:** Solid fill, 48px height, rounded-lg
- **Secondary:** Outline variant with subtle background
- **Icon Buttons:** 40px square, rounded-full for utility actions
- **States:** Smooth transitions (150ms), clear visual feedback

### Score Display
- **Position:** Fixed top, always visible
- **Style:** Glassmorphic panel (backdrop-blur-md)
- **Typography:** Large, bold numerals
- **Animation:** Count-up effects on score changes

### Game Status
- **Turn Indicator:** Prominent banner with player name
- **Win/Loss Modal:** Full-screen overlay, dramatic reveal
- **Notifications:** Toast-style, top-right positioning

---

## Visual Effects (Minimal)

**Strategic Use Only:**
- Card flip animations: 300ms 3D rotation
- Score updates: Pulse effect on change
- Victory screen: Subtle confetti or particle effect
- Transitions: Smooth, never jarring (200-300ms)

---

## Responsive Breakpoints

- Mobile (<640px): Single column, stack cards vertically, touch-optimized buttons (min 44px)
- Tablet (640-1024px): Two-column layouts, moderate spacing
- Desktop (>1024px): Full game board, side panels for stats/history

---

## Critical Implementation Notes

1. **No Decorative Emojis:** Text interfaces, buttons, headers remain emoji-free
2. **Card Emojis:** ♠️♥️♦️♣️ for suits, ⭐💎👑 for rarities (visual only, not interactive)
3. **Display Fixes:** Use CSS Grid for precise card alignment, Flexbox for dynamic spacing
4. **Performance:** Optimize card renders, use transform for animations (GPU acceleration)
5. **Accessibility:** High contrast ratios, keyboard navigation, clear focus states

---

## Deployment Readiness

- Mobile-first responsive design
- Touch-friendly 44px minimum tap targets
- Fast load times (optimize assets)
- Clear error states and loading indicators
- Consistent dark theme throughout (no white flashes)