# Servana Color Palette

## Theme System

The application uses CSS custom properties (variables) for dynamic theming with light and dark modes.

---

## 🎨 Primary Brand Colors

### Purple Gradient (Main Brand)
```css
/* Primary Purple */
#6237A0  /* Main brand color - buttons, accents */
#552C8C  /* Hover state - darker purple */
#7A4ED9  /* Mid gradient - highlights */
#8B5CF6  /* Light gradient - accents */

/* Purple Variations */
#c4b5fd  /* Light purple text (dark mode) */
rgba(139, 92, 246, 0.15)  /* Purple background (dark mode) */
rgba(139, 92, 246, 0.4)   /* Purple border (dark mode) */
#f5f3ff  /* Purple background (light mode) */
#e9d5ff  /* Purple border (light mode) */
```

### Gradient Definitions
```css
/* Header/Banner Gradient */
background: linear-gradient(135deg, #6237A0 0%, #7A4ED9 50%, #8B5CF6 100%);

/* Accent Gradient */
background: linear-gradient(to right, #6237A0, #8B5CF6);

/* Underline Gradient */
background: linear-gradient(to right, #6237A0, #8B5CF6, transparent);
```

---

## 🌓 Theme Variables

### Light Mode
```css
:root[data-theme="light"] {
  --bg-primary: #ffffff;      /* Main background */
  --bg-secondary: #f3f4f6;    /* Secondary background */
  --bg-tertiary: #f0f0f0;     /* Tertiary background */
  --text-primary: #1a1a1a;    /* Primary text */
  --text-secondary: #6b7280;  /* Secondary text */
  --border-color: #e5e7eb;    /* Borders */
  --card-bg: #ffffff;         /* Card backgrounds */
  --input-bg: #ffffff;        /* Input backgrounds */
  --scrollbar-track-bg: #f1f1f1; /* Scrollbar track */
}
```

### Dark Mode
```css
:root[data-theme="dark"] {
  --bg-primary: #2a2a2a;      /* Main background */
  --bg-secondary: #1e1e1e;    /* Secondary background */
  --bg-tertiary: #3a3a3a;     /* Tertiary background */
  --text-primary: #f5f5f5;    /* Primary text */
  --text-secondary: #d1d1d1;  /* Secondary text */
  --border-color: #4a4a4a;    /* Borders */
  --card-bg: #2a2a2a;         /* Card backgrounds */
  --input-bg: #3a3a3a;        /* Input backgrounds */
  --scrollbar-track-bg: #2a2a2a; /* Scrollbar track */
}
```

---

## 🎯 Semantic Colors

### Success (Green)
```css
#10b981  /* Success green - online status, success messages */
#d4edda  /* Success background (light) */
#155724  /* Success text (light) */
```

### Error (Red)
```css
#ef4444  /* Error red - error messages, delete actions */
#f8d7da  /* Error background (light) */
#721c24  /* Error text (light) */
#dc2626  /* Darker error red */
#fee2e2  /* Light error background */
#991b1b  /* Dark error text */
```

### Warning (Yellow/Orange)
```css
#f59e0b  /* Warning orange */
#fef3c7  /* Warning background (light) */
#92400e  /* Warning text (light) */
```

### Info (Blue)
```css
#3b82f6  /* Info blue */
#d1ecf1  /* Info background (light) */
#0c5460  /* Info text (light) */
```

---

## 🔘 UI Component Colors

### Buttons
```css
/* Primary Button */
background: #6237A0;
hover: #552C8C;
text: #ffffff;

/* Secondary Button (Light Mode) */
background: #e5e7eb;
hover: #d1d5db;
text: var(--text-primary);

/* Secondary Button (Dark Mode) */
background: #4a4a4a;
hover: #5a5a5a;
text: var(--text-primary);

/* Disabled Button (Light Mode) */
background: #d1d5db;
text: #6b7280;

/* Disabled Button (Dark Mode) */
background: #4a4a4a;
text: #9ca3af;
```

### Status Indicators
```css
/* Online */
#10b981  /* Green dot */

/* Offline */
#6b7280  /* Gray dot (light mode) */
#9ca3af  /* Gray dot (dark mode) */

/* Away/Idle */
#f59e0b  /* Orange/yellow */
```

---

## 📊 Chart & Data Visualization

### Chart Colors
```css
/* Primary Chart Colors */
#6237A0  /* Purple - main data */
#8B5CF6  /* Light purple - secondary data */
#3b82f6  /* Blue - tertiary data */
#10b981  /* Green - positive metrics */
#ef4444  /* Red - negative metrics */
#f59e0b  /* Orange - warning metrics */

/* Chart Backgrounds */
rgba(98, 55, 160, 0.1)   /* Purple transparent */
rgba(139, 92, 246, 0.1)  /* Light purple transparent */
```

---

## 🎭 Overlay & Shadow Colors

### Overlays
```css
/* Modal Backdrop */
rgba(0, 0, 0, 0.5)      /* 50% black */
rgba(0, 0, 0, 0.4)      /* 40% black */

/* Blur Backdrop */
backdrop-filter: blur(4px);
```

### Shadows
```css
/* Card Shadow */
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

/* Elevated Shadow */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Large Shadow */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## 🎨 Neutral Grays

### Light Mode Grays
```css
#f9fafb  /* Gray 50 */
#f3f4f6  /* Gray 100 */
#e5e7eb  /* Gray 200 */
#d1d5db  /* Gray 300 */
#9ca3af  /* Gray 400 */
#6b7280  /* Gray 500 */
#4b5563  /* Gray 600 */
#374151  /* Gray 700 */
#1f2937  /* Gray 800 */
#111827  /* Gray 900 */
```

### Dark Mode Grays
```css
#1e1e1e  /* Darkest background */
#2a2a2a  /* Dark background */
#3a3a3a  /* Medium dark */
#4a4a4a  /* Medium */
#5a5a5a  /* Medium light */
#6a6a6a  /* Light */
```

---

## 🔄 Opacity Variations

### White Overlays
```css
rgba(255, 255, 255, 0.02)  /* Very subtle */
rgba(255, 255, 255, 0.06)  /* Subtle hover */
rgba(255, 255, 255, 0.1)   /* Light overlay */
rgba(255, 255, 255, 0.2)   /* Medium overlay */
rgba(255, 255, 255, 0.3)   /* Strong overlay */
```

### Black Overlays
```css
rgba(0, 0, 0, 0.02)  /* Very subtle */
rgba(0, 0, 0, 0.04)  /* Subtle hover */
rgba(0, 0, 0, 0.1)   /* Light overlay */
rgba(0, 0, 0, 0.2)   /* Medium overlay */
rgba(0, 0, 0, 0.5)   /* Modal backdrop */
```

---

## 📱 Special UI Elements

### Scrollbar
```css
/* Light Mode */
track: #f1f1f1;
thumb: #d1d5db;
thumb-hover: #a1a1aa;

/* Dark Mode */
track: rgba(255, 255, 255, 0.1);
thumb: rgba(255, 255, 255, 0.2);
thumb-hover: rgba(255, 255, 255, 0.3);
```

### Focus Ring
```css
focus-ring: #6237A0;
focus-ring-opacity: 0.5;
```

### Selection
```css
::selection {
  background: #6237A0;
  color: #ffffff;
}
```

---

## 🎯 Usage Guidelines

### Primary Actions
Use **#6237A0** (purple) for:
- Primary buttons
- Active states
- Important CTAs
- Brand elements

### Secondary Actions
Use **gray variants** for:
- Cancel buttons
- Secondary actions
- Neutral states

### Status Colors
- **Green (#10b981)**: Success, online, positive
- **Red (#ef4444)**: Error, offline, negative
- **Orange (#f59e0b)**: Warning, pending
- **Blue (#3b82f6)**: Info, neutral actions

### Text Hierarchy
1. **Primary text**: `var(--text-primary)` - Main content
2. **Secondary text**: `var(--text-secondary)` - Labels, descriptions
3. **Muted text**: Gray variants - Timestamps, metadata

---

## 🎨 Color Accessibility

### Contrast Ratios (WCAG AA)
- Purple (#6237A0) on white: ✅ 7.2:1
- White text on purple: ✅ 7.2:1
- Primary text on backgrounds: ✅ >4.5:1

### Color Blind Friendly
- Use icons alongside colors
- Provide text labels
- Avoid red/green only distinctions

---

## 💡 Quick Reference

```css
/* Copy-paste ready */
--brand-purple: #6237A0;
--brand-purple-hover: #552C8C;
--brand-purple-light: #8B5CF6;
--success-green: #10b981;
--error-red: #ef4444;
--warning-orange: #f59e0b;
--info-blue: #3b82f6;
```

---

## 🔗 Related Files
- `web_servana/src/index.css` - Theme variables
- `web_servana/src/App.css` - Global styles
- `web_servana/tailwind.config.js` - Tailwind configuration
