# LoadingSpinner Component

A reusable loading component with consistent styling across the Servana web application.

## Usage

```jsx
import LoadingSpinner from './components/LoadingSpinner';

// Full page loading
<LoadingSpinner variant="page" message="Loading application..." />

// Inline loading
<LoadingSpinner message="Loading data..." />

// Table loading
<LoadingSpinner variant="table" message="Loading records..." />

// Button loading
<LoadingSpinner variant="button" message="Saving..." size="sm" />
```

## Props

- `variant` (string): 'page' | 'inline' | 'table' | 'button' (default: 'inline')
- `message` (string): Custom loading message (default: 'Loading...')
- `size` (string): 'sm' | 'md' | 'lg' (default: 'md')

## Variants

### Page
Full-screen loading with Servana branding. Used for initial app loading, authentication, etc.

### Inline
Standard loading spinner with message. Used for general loading states.

### Table
Designed to fit within table rows. Spans full width of table.

### Button
Compact loading for buttons. Includes spinner and text inline.

## Styling

Uses Tailwind CSS with Servana's brand color (#6237A0) for consistency across the application.