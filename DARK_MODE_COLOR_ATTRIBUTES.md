# Dark Mode Color Attributes

Complete breakdown of all dark mode colors with HEX, RGB, HSL values and usage descriptions.

---

## 🌙 Core Dark Mode Theme Variables

### Background Colors

#### --bg-primary: `#2a2a2a`
```
HEX:  #2a2a2a
RGB:  rgb(42, 42, 42)
HSL:  hsl(0, 0%, 16%)
RGBA: rgba(42, 42, 42, 1)

Description: Main background color for dark mode
Usage: Primary container backgrounds, main app background
Contrast: Medium-dark gray, provides good base for content
```

#### --bg-secondary: `#1e1e1e`
```
HEX:  #1e1e1e
RGB:  rgb(30, 30, 30)
HSL:  hsl(0, 0%, 12%)
RGBA: rgba(30, 30, 30, 1)

Description: Secondary/darker background
Usage: Sidebar, nested containers, recessed areas
Contrast: Darker than primary, creates depth hierarchy
```

#### --bg-tertiary: `#3a3a3a`
```
HEX:  #3a3a3a
RGB:  rgb(58, 58, 58)
HSL:  hsl(0, 0%, 23%)
RGBA: rgba(58, 58, 58, 1)

Description: Tertiary/lighter background
Usage: Elevated elements, hover states, input fields
Contrast: Lighter than primary, for raised surfaces
```

---

### Text Colors

#### --text-primary: `#f5f5f5`
```
HEX:  #f5f5f5
RGB:  rgb(245, 245, 245)
HSL:  hsl(0, 0%, 96%)
RGBA: rgba(245, 245, 245, 1)

Description: Primary text color
Usage: Main headings, body text, important content
Contrast Ratio: ~13:1 on #2a2a2a (Excellent - AAA)
Readability: High contrast, easy to read
```

#### --text-secondary: `#d1d1d1`
```
HEX:  #d1d1d1
RGB:  rgb(209, 209, 209)
HSL:  hsl(0, 0%, 82%)
RGBA: rgba(209, 209, 209, 1)

Description: Secondary/muted text
Usage: Labels, descriptions, metadata, timestamps
Contrast Ratio: ~9:1 on #2a2a2a (Excellent - AAA)
Readability: Good contrast, suitable for secondary info
```

---

### Border & Divider Colors

#### --border-color: `#4a4a4a`
```
HEX:  #4a4a4a
RGB:  rgb(74, 74, 74)
HSL:  hsl(0, 0%, 29%)
RGBA: rgba(74, 74, 74, 1)

Description: Border and divider color
Usage: Card borders, input borders, dividing lines
Contrast: Subtle but visible separation
Visual Weight: Light enough to not dominate, strong enough to define
```

---

### Card & Surface Colors

#### --card-bg: `#2a2a2a`
```
HEX:  #2a2a2a
RGB:  rgb(42, 42, 42)
HSL:  hsl(0, 0%, 16%)
RGBA: rgba(42, 42, 42, 1)

Description: Card background color
Usage: Modal backgrounds, card components, panels
Note: Same as --bg-primary for consistency
```

#### --input-bg: `#3a3a3a`
```
HEX:  #3a3a3a
RGB:  rgb(58, 58, 58)
HSL:  hsl(0, 0%, 23%)
RGBA: rgba(58, 58, 58, 1)

Description: Input field background
Usage: Text inputs, textareas, select dropdowns
Note: Same as --bg-tertiary, slightly elevated
```

---

### Scrollbar Colors

#### --scrollbar-track-bg: `#2a2a2a`
```
HEX:  #2a2a2a
RGB:  rgb(42, 42, 42)
HSL:  hsl(0, 0%, 16%)
RGBA: rgba(42, 42, 42, 1)

Description: Scrollbar track background
Usage: Background of scrollbar track
```

#### Scrollbar Thumb: `rgba(255, 255, 255, 0.2)`
```
HEX:  N/A (transparent white)
RGB:  rgb(255, 255, 255)
HSL:  hsl(0, 0%, 100%)
RGBA: rgba(255, 255, 255, 0.2)

Description: Scrollbar thumb (20% opacity white)
Usage: Draggable scrollbar element
Opacity: 20% for subtle appearance
```

#### Scrollbar Thumb Hover: `rgba(255, 255, 255, 0.3)`
```
HEX:  N/A (transparent white)
RGB:  rgb(255, 255, 255)
HSL:  hsl(0, 0%, 100%)
RGBA: rgba(255, 255, 255, 0.3)

Description: Scrollbar thumb on hover (30% opacity)
Usage: Hover state for scrollbar
Opacity: 30% for increased visibility
```

---

## 🎨 Additional Dark Mode Colors

### Gray Scale Variations

#### Darkest: `#1e1e1e`
```
HEX:  #1e1e1e
RGB:  rgb(30, 30, 30)
HSL:  hsl(0, 0%, 12%)
Usage: Deepest backgrounds, sidebar
```

#### Dark: `#2a2a2a`
```
HEX:  #2a2a2a
RGB:  rgb(42, 42, 42)
HSL:  hsl(0, 0%, 16%)
Usage: Main backgrounds, cards
```

#### Medium Dark: `#3a3a3a`
```
HEX:  #3a3a3a
RGB:  rgb(58, 58, 58)
HSL:  hsl(0, 0%, 23%)
Usage: Inputs, elevated surfaces
```

#### Medium: `#4a4a4a`
```
HEX:  #4a4a4a
RGB:  rgb(74, 74, 74)
HSL:  hsl(0, 0%, 29%)
Usage: Borders, disabled states
```

#### Medium Light: `#5a5a5a`
```
HEX:  #5a5a5a
RGB:  rgb(90, 90, 90)
HSL:  hsl(0, 0%, 35%)
Usage: Hover states, secondary buttons
```

#### Light: `#6a6a6a`
```
HEX:  #6a6a6a
RGB:  rgb(106, 106, 106)
HSL:  hsl(0, 0%, 42%)
Usage: Subtle highlights, tertiary elements
```

---

## 🎯 Button Colors (Dark Mode)

### Secondary Button Background: `#4a4a4a`
```
HEX:  #4a4a4a
RGB:  rgb(74, 74, 74)
HSL:  hsl(0, 0%, 29%)
RGBA: rgba(74, 74, 74, 1)

Description: Secondary button background
Usage: Cancel buttons, neutral actions
```

### Secondary Button Hover: `#5a5a5a`
```
HEX:  #5a5a5a
RGB:  rgb(90, 90, 90)
HSL:  hsl(0, 0%, 35%)
RGBA: rgba(90, 90, 90, 1)

Description: Secondary button hover state
Usage: Hover effect for secondary buttons
Brightness: +6% from base
```

### Disabled Button Background: `#4a4a4a`
```
HEX:  #4a4a4a
RGB:  rgb(74, 74, 74)
HSL:  hsl(0, 0%, 29%)
RGBA: rgba(74, 74, 74, 1)

Description: Disabled button background
Usage: Inactive/disabled buttons
```

### Disabled Button Text: `#9ca3af`
```
HEX:  #9ca3af
RGB:  rgb(156, 163, 175)
HSL:  hsl(220, 13%, 65%)
RGBA: rgba(156, 163, 175, 1)

Description: Disabled button text color
Usage: Text on disabled buttons
Contrast: Low contrast to indicate disabled state
```

---

## 🌈 Overlay & Transparency Colors

### White Overlays (Dark Mode)

#### Very Subtle: `rgba(255, 255, 255, 0.02)`
```
RGBA: rgba(255, 255, 255, 0.02)
Opacity: 2%
Usage: Very subtle hover effects, barely visible highlights
```

#### Subtle Hover: `rgba(255, 255, 255, 0.06)`
```
RGBA: rgba(255, 255, 255, 0.06)
Opacity: 6%
Usage: Hover states on dark backgrounds
```

#### Light Overlay: `rgba(255, 255, 255, 0.1)`
```
RGBA: rgba(255, 255, 255, 0.1)
Opacity: 10%
Usage: Selected states, active items
```

#### Medium Overlay: `rgba(255, 255, 255, 0.2)`
```
RGBA: rgba(255, 255, 255, 0.2)
Opacity: 20%
Usage: Scrollbar thumb, prominent overlays
```

#### Strong Overlay: `rgba(255, 255, 255, 0.3)`
```
RGBA: rgba(255, 255, 255, 0.3)
Opacity: 30%
Usage: Hover on scrollbar, strong highlights
```

---

## 🎨 Purple Variations (Dark Mode Specific)

### Purple Text (Dark Mode): `#c4b5fd`
```
HEX:  #c4b5fd
RGB:  rgb(196, 181, 253)
HSL:  hsl(253, 95%, 85%)
RGBA: rgba(196, 181, 253, 1)

Description: Light purple for text on dark backgrounds
Usage: Purple text, links, accents
Contrast: High contrast on dark backgrounds
```

### Purple Background (Dark Mode): `rgba(139, 92, 246, 0.15)`
```
Base HEX: #8B5CF6
RGBA: rgba(139, 92, 246, 0.15)
Opacity: 15%

Description: Transparent purple background
Usage: Department badges, tag backgrounds
```

### Purple Border (Dark Mode): `rgba(139, 92, 246, 0.4)`
```
Base HEX: #8B5CF6
RGBA: rgba(139, 92, 246, 0.4)
Opacity: 40%

Description: Transparent purple border
Usage: Badge borders, accent borders
```

---

## 📊 Status Colors (Dark Mode Optimized)

### Success Green: `#10b981`
```
HEX:  #10b981
RGB:  rgb(16, 185, 129)
HSL:  hsl(160, 84%, 39%)
RGBA: rgba(16, 185, 129, 1)

Description: Success/online indicator
Contrast: Excellent on dark backgrounds
Visibility: Highly visible, positive association
```

### Error Red: `#ef4444`
```
HEX:  #ef4444
RGB:  rgb(239, 68, 68)
HSL:  hsl(0, 84%, 60%)
RGBA: rgba(239, 68, 68, 1)

Description: Error/danger indicator
Contrast: Excellent on dark backgrounds
Visibility: Highly visible, warning association
```

### Warning Orange: `#f59e0b`
```
HEX:  #f59e0b
RGB:  rgb(245, 158, 11)
HSL:  hsl(38, 92%, 50%)
RGBA: rgba(245, 158, 11, 1)

Description: Warning/pending indicator
Contrast: Excellent on dark backgrounds
Visibility: Highly visible, caution association
```

### Info Blue: `#3b82f6`
```
HEX:  #3b82f6
RGB:  rgb(59, 130, 246)
HSL:  hsl(217, 91%, 60%)
RGBA: rgba(59, 130, 246, 1)

Description: Info/neutral indicator
Contrast: Excellent on dark backgrounds
Visibility: Highly visible, informational
```

---

## 🎭 Shadow & Depth (Dark Mode)

### Card Shadow (Dark Mode)
```
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 
            0 1px 2px 0 rgba(0, 0, 0, 0.2);

Description: Subtle shadow for cards
Color: Black with 30% and 20% opacity
Usage: Card elevation, subtle depth
```

### Elevated Shadow (Dark Mode)
```
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 
            0 4px 6px -2px rgba(0, 0, 0, 0.3);

Description: Medium shadow for elevated elements
Color: Black with 40% and 30% opacity
Usage: Modals, dropdowns, popovers
```

### Large Shadow (Dark Mode)
```
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 
            0 10px 10px -5px rgba(0, 0, 0, 0.4);

Description: Strong shadow for prominent elements
Color: Black with 50% and 40% opacity
Usage: Large modals, important overlays
```

---

## 🔍 Contrast Ratios (WCAG Compliance)

### Text on Backgrounds

```
#f5f5f5 on #2a2a2a: 13.1:1  ✅ AAA (Excellent)
#d1d1d1 on #2a2a2a: 9.2:1   ✅ AAA (Excellent)
#9ca3af on #2a2a2a: 5.1:1   ✅ AA (Good)
#6b7280 on #2a2a2a: 3.2:1   ⚠️ AA Large Text Only

#f5f5f5 on #1e1e1e: 15.8:1  ✅ AAA (Excellent)
#d1d1d1 on #1e1e1e: 11.1:1  ✅ AAA (Excellent)

#f5f5f5 on #3a3a3a: 10.2:1  ✅ AAA (Excellent)
#d1d1d1 on #3a3a3a: 7.2:1   ✅ AAA (Excellent)
```

### Brand Colors on Dark Backgrounds

```
#6237A0 on #2a2a2a: 3.8:1   ✅ AA (Good for large text)
#8B5CF6 on #2a2a2a: 5.2:1   ✅ AA (Good)
#c4b5fd on #2a2a2a: 10.8:1  ✅ AAA (Excellent)

White (#ffffff) on #6237A0: 7.2:1  ✅ AAA (Excellent)
```

---

## 💡 Usage Recommendations

### Layering System (Dark Mode)
```
Layer 0 (Deepest):    #1e1e1e  - Sidebar, recessed areas
Layer 1 (Base):       #2a2a2a  - Main content, cards
Layer 2 (Elevated):   #3a3a3a  - Inputs, hover states
Layer 3 (Borders):    #4a4a4a  - Dividers, outlines
Layer 4 (Highlights): #5a5a5a  - Active states, emphasis
```

### Text Hierarchy (Dark Mode)
```
Primary (Headings):   #f5f5f5  - Main content, titles
Secondary (Body):     #d1d1d1  - Descriptions, labels
Tertiary (Meta):      #9ca3af  - Timestamps, captions
Disabled:             #6b7280  - Inactive elements
```

### Interactive States (Dark Mode)
```
Default:    #3a3a3a
Hover:      #4a4a4a or rgba(255, 255, 255, 0.06)
Active:     #5a5a5a or rgba(255, 255, 255, 0.1)
Focus:      #6237A0 ring with 50% opacity
Disabled:   #4a4a4a with #9ca3af text
```

---

## 🎨 Quick Copy-Paste Reference

```css
/* Dark Mode Core Colors */
--bg-primary: #2a2a2a;        /* rgb(42, 42, 42) */
--bg-secondary: #1e1e1e;      /* rgb(30, 30, 30) */
--bg-tertiary: #3a3a3a;       /* rgb(58, 58, 58) */
--text-primary: #f5f5f5;      /* rgb(245, 245, 245) */
--text-secondary: #d1d1d1;    /* rgb(209, 209, 209) */
--border-color: #4a4a4a;      /* rgb(74, 74, 74) */

/* Dark Mode Grays */
--gray-darkest: #1e1e1e;      /* rgb(30, 30, 30) */
--gray-darker: #2a2a2a;       /* rgb(42, 42, 42) */
--gray-dark: #3a3a3a;         /* rgb(58, 58, 58) */
--gray-medium: #4a4a4a;       /* rgb(74, 74, 74) */
--gray-light: #5a5a5a;        /* rgb(90, 90, 90) */
--gray-lighter: #6a6a6a;      /* rgb(106, 106, 106) */

/* Dark Mode Overlays */
--overlay-subtle: rgba(255, 255, 255, 0.02);
--overlay-hover: rgba(255, 255, 255, 0.06);
--overlay-light: rgba(255, 255, 255, 0.1);
--overlay-medium: rgba(255, 255, 255, 0.2);
--overlay-strong: rgba(255, 255, 255, 0.3);
```
