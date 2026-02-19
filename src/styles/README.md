# Reusable Styles

This directory contains shared CSS files used across multiple components and screens.

## Files

### GridLayout.css
Contains reusable layout and scrollbar styles:

- **Custom Scrollbar Styles**: Purple-themed scrollbar with hover effects
  - `.custom-scrollbar` - Standard scrollbar (6px width, purple theme)
  - `.custom-scrollbar-alt` - Alternative scrollbar (8px width, gray theme for chat/queue screens)

- **Grid Layout System**: Sidebar + content layout with responsive design
  - `.grid-layout` - Main grid container
  - `.grid-header` - Header section
  - `.grid-sidebar` - Sidebar section
  - `.grid-content` - Main content section
  - Responsive breakpoint at 768px for mobile devices

### Animations.css
Contains reusable animation keyframes and utility classes:

- **Keyframe Animations**:
  - `blob` - Organic blob movement (7s)
  - `float` - Vertical floating effect (3s)
  - `ping-slow` - Slow ping/pulse effect (3s)
  - `spin-slow` - Slow rotation (8s)
  - `fadeIn` - Fade in from transparent (0.2s)
  - `scaleIn` - Scale up with fade (0.3s)
  - `slideIn` - Slide down with fade (0.3s)

- **Utility Classes**:
  - `.animate-blob`
  - `.animate-float`
  - `.animate-ping-slow`
  - `.animate-spin-slow`
  - `.animate-fadeIn`
  - `.animate-scaleIn`
  - `.animate-slide-in`

- **Delay Utilities**:
  - `.animation-delay-2000` - 2 second delay
  - `.animation-delay-4000` - 4 second delay

## Usage

Import these files in your components:

```javascript
import "../../styles/GridLayout.css";
import "../../styles/Animations.css";
```

## Screens Using These Styles

- **GridLayout.css**: MacrosClientsScreen, MacrosAgentsScreen, ManageAdmin, QueuesScreen, Profile
- **Animations.css**: Profile, QueuesScreen, ManageAdmin

## Benefits

- **Consistency**: Same animations and scrollbar styles across the app
- **Maintainability**: Update styles in one place
- **Performance**: Styles loaded once and cached
- **Cleaner Code**: No inline `<style>` tags cluttering components
