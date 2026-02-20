# Project Overview

## Introduction

Web Servana is a modern React-based customer service management platform built with Vite, React Router, and a component-driven architecture.

## Tech Stack

### Core Technologies
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### State Management
- **React Context API** - Global state management
- **Custom Hooks** - Business logic encapsulation

### Communication
- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time WebSocket communication

### UI & Styling
- **React Feather** - Icon library
- **Custom CSS Variables** - Theme system
- **Responsive Design** - Mobile-first approach

## Key Features

### 1. Authentication & Authorization
- Email/password authentication
- Role-based access control (RBAC)
- Permission-based UI rendering
- Secure token management

### 2. User Management
- Admin management
- Role assignment
- User status control
- Profile management

### 3. Department Management
- Create and edit departments
- Department-based organization
- Active/inactive status control

### 4. Agent Management
- Agent profiles
- Department assignments
- Performance analytics
- Status tracking

### 5. Chat System
- Real-time messaging
- Queue management
- Auto-replies
- Typing indicators
- Message history

### 6. Macros & Automation
- Quick response templates
- Client and agent macros
- Department-specific macros

### 7. Queues
- Queue management
- Priority handling
- Assignment rules

### 8. Roles & Permissions
- Granular permission system
- Custom role creation
- Permission inheritance

## Architecture Principles

### Component-Driven Development
- Reusable, modular components
- Single Responsibility Principle
- Composition over inheritance

### Separation of Concerns
- Business logic in custom hooks
- UI logic in components
- Styling in separate files

### Performance Optimization
- Code splitting
- Lazy loading
- Memoization where needed
- Efficient re-renders

### Accessibility
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Screen reader support

## Project Goals

1. **Maintainability** - Clean, organized, well-documented code
2. **Scalability** - Easy to add new features and components
3. **Performance** - Fast load times and smooth interactions
4. **User Experience** - Intuitive, responsive, accessible interface
5. **Developer Experience** - Clear patterns, helpful tooling, good documentation

## Design System

### Color Palette
- **Primary**: `#6237A0` (Purple)
- **Secondary**: `#7A4ED9` (Light Purple)
- **Accent**: `#8B5CF6` (Violet)

### Theme Support
- Light mode
- Dark mode
- CSS variables for dynamic theming

### Typography
- System fonts for performance
- Responsive font sizes
- Clear hierarchy

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Development Philosophy

### Code Quality
- Consistent code style
- Meaningful variable names
- Comprehensive comments
- Regular refactoring

### Testing Strategy
- Component testing
- Integration testing
- E2E testing for critical flows

### Documentation
- Inline code comments
- Component README files
- API documentation
- Architecture decision records

## Next Steps

- Read the [Setup Guide](./02-SETUP-GUIDE.md) to get started
- Explore the [Project Structure](./04-PROJECT-STRUCTURE.md)
- Review [Component Architecture](./05-COMPONENT-ARCHITECTURE.md)
