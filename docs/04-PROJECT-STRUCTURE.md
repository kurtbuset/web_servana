# Project Structure

## Directory Overview

```
web_servana/
├── docs/                          # Documentation
├── public/                        # Static assets
│   └── images/                    # Images and icons
├── src/                           # Source code
│   ├── api/                       # API client configuration
│   ├── components/                # Reusable components
│   │   ├── chat/                  # Chat-specific components
│   │   ├── ui/                    # UI component library
│   │   ├── Layout.jsx             # Main layout wrapper
│   │   ├── Modal.jsx              # Modal component
│   │   ├── SearchBar.jsx          # Search input
│   │   ├── Sidebar/               # Navigation sidebar
│   │   ├── ToggleSwitch.jsx       # Toggle component
│   │   └── TopNavbar.jsx          # Top navigation
│   ├── constants/                 # Constants and configs
│   │   └── routes.js              # Route definitions
│   ├── context/                   # React Context providers
│   │   ├── ThemeContext.jsx       # Theme management
│   │   ├── UnsavedChangesContext.jsx
│   │   └── UserContext.jsx        # User state
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.js             # Authentication
│   │   ├── useChat.js             # Chat functionality
│   │   ├── useDepartments.js      # Department management
│   │   ├── useQueues.js           # Queue management
│   │   └── useRoles.js            # Role management
│   ├── styles/                    # Global styles
│   │   ├── Animations.css         # Animation keyframes
│   │   └── GridLayout.css         # Grid layout utilities
│   ├── utils/                     # Utility functions
│   │   └── toast.js               # Toast notifications
│   ├── views/                     # Screen/page components
│   │   ├── agents/                # Agent management
│   │   ├── auto-replies/          # Auto-reply management
│   │   ├── change-roles/          # Role assignment
│   │   ├── chat/                  # Chat interface
│   │   ├── dashboard/             # Dashboard
│   │   ├── departments/           # Department management
│   │   ├── login/                 # Login screen
│   │   ├── macros/                # Macro management
│   │   ├── manage-admin/          # Admin management
│   │   ├── profile/               # User profile
│   │   ├── queues/                # Queue management
│   │   └── roles/                 # Role management
│   ├── App.css                    # Global app styles
│   ├── App.jsx                    # Root component
│   ├── index.css                  # Base styles
│   └── main.jsx                   # Entry point
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tailwind.config.js             # Tailwind configuration
└── vite.config.js                 # Vite configuration
```

## Key Directories

### `/src/components`
Reusable components used across multiple views.

**Subdirectories:**
- `chat/` - Chat-specific components (TypingIndicator, etc.)
- `ui/` - Generic UI components (Avatar, LoadingState, etc.)
- `Sidebar/` - Navigation sidebar components

**Key Files:**
- `Layout.jsx` - Main layout wrapper with sidebar and navbar
- `Modal.jsx` - Reusable modal component
- `ToggleSwitch.jsx` - Centralized toggle switch component

### `/src/views`
Screen/page components organized by feature.

Each view directory typically contains:
- Main screen component (e.g., `LoginScreen.jsx`)
- `/components` subdirectory for view-specific components
- `README.md` documenting the view and its components

**Example Structure:**
```
views/
└── login/
    ├── LoginScreen.jsx           # Main screen
    └── components/
        ├── LoginForm.jsx         # Form component
        ├── LoginHeader.jsx       # Header component
        └── README.md             # Documentation
```

### `/src/hooks`
Custom React hooks for business logic.

**Naming Convention:** `use[Feature].js`

**Examples:**
- `useAuth.js` - Authentication logic
- `useChat.js` - Chat functionality
- `useDepartments.js` - Department CRUD operations

### `/src/context`
React Context providers for global state.

**Key Contexts:**
- `UserContext` - Current user data and permissions
- `ThemeContext` - Theme (light/dark) management
- `UnsavedChangesContext` - Unsaved changes tracking

### `/src/api`
API client configuration and interceptors.

### `/src/constants`
Application constants and configuration.

**Key Files:**
- `routes.js` - Route path definitions

### `/src/styles`
Global CSS files and utilities.

**Key Files:**
- `Animations.css` - Reusable animation keyframes
- `GridLayout.css` - Grid layout utilities

### `/src/utils`
Utility functions and helpers.

**Key Files:**
- `toast.js` - Toast notification helper

## File Naming Conventions

### Components
- **PascalCase** for component files: `LoginScreen.jsx`, `UserTable.jsx`
- **camelCase** for utility files: `toast.js`, `formatDate.js`

### Directories
- **kebab-case** for feature directories: `auto-replies/`, `change-roles/`
- **camelCase** for utility directories: `utils/`, `hooks/`

### CSS Files
- **PascalCase** for component-specific: `GridLayout.css`
- **camelCase** for global: `index.css`

## Import Conventions

### Absolute Imports
Use relative imports from `src/`:
```javascript
import api from '../../api';
import { useAuth } from '../../hooks/useAuth';
```

### Component Imports
```javascript
// UI components
import { Avatar, LoadingState } from '../../components/ui';

// Feature components
import LoginForm from './components/LoginForm';
```

### Style Imports
```javascript
import '../../App.css';
import '../../styles/GridLayout.css';
```

## Component Organization

### View Components
Each view follows this pattern:
```
view-name/
├── ViewNameScreen.jsx           # Main screen component
└── components/
    ├── ComponentOne.jsx         # Sub-component
    ├── ComponentTwo.jsx         # Sub-component
    └── README.md                # Component documentation
```

### Reusable Components
Located in `/src/components/ui/`:
```
ui/
├── Avatar.jsx
├── LoadingState.jsx
├── EmptyState.jsx
├── index.js                     # Barrel export
└── README.md                    # Component library docs
```

## Best Practices

### 1. Component Location
- **Reusable across app** → `/src/components/ui/`
- **Feature-specific** → `/src/views/[feature]/components/`
- **Chat-specific** → `/src/components/chat/`

### 2. Documentation
- Add README.md to component directories
- Document props and usage examples
- Keep documentation up-to-date

### 3. File Size
- Keep components under 300 lines
- Extract sub-components when needed
- Use custom hooks for complex logic

### 4. Imports
- Group imports by type (React, libraries, local)
- Use barrel exports for component libraries
- Avoid circular dependencies

## Next Steps

- Review [Component Architecture](./05-COMPONENT-ARCHITECTURE.md)
- Explore [UI Components](./08-UI-COMPONENTS.md)
- Read [Styling Guide](./10-STYLING-GUIDE.md)
