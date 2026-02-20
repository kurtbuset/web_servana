# Toast Notification System

A modern, reusable toast notification system with support for light and dark modes.

## Components

### Toast
The base toast component that displays individual notifications.

**Props:**
- `type` (string): Type of toast - 'success', 'error', 'warning', or 'info'
- `title` (string): Bold title text
- `message` (string): Main message content
- `onClose` (function): Callback when close button is clicked
- `isDark` (boolean): Whether to use dark mode styling

### ToastContainer
The container component that manages toast positioning and animations.

**Props:**
- `isDark` (boolean): Whether to use dark mode styling

## Usage

### Basic Usage

```javascript
import toast from '../utils/toast';

// Success notification
toast.success("Case file successfully updated.");

// Error notification
toast.error("Document upload failed - try again.");

// Warning notification
toast.warning("Deadline approaching - review needed.");

// Info notification
toast.info("New legal update available.");
```

### Advanced Usage

```javascript
// Custom duration
toast.success("Saved!", { autoClose: 2000 });

// Prevent auto-close
toast.error("Critical error", { autoClose: false });

// Custom position
toast.info("Message", { position: "bottom-right" });

// Loading state
const toastId = toast.loading("Processing...");
// Later update it
toast.update(toastId, {
  render: "Complete!",
  type: "success",
  isLoading: false,
  autoClose: 3000
});

// Promise-based
toast.promise(
  fetchData(),
  {
    pending: "Loading data...",
    success: "Data loaded successfully!",
    error: "Failed to load data"
  }
);
```

## Setup

The ToastContainer is already set up in `AppNavigation.jsx` and will automatically use the current theme (light/dark mode).

## Styling

The toast notifications automatically adapt to:
- Light mode: White background with colored borders
- Dark mode: Dark background with colored borders and glowing effects

Each toast type has its own color scheme:
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Yellow/Orange (#f59e0b)
- **Info**: Blue (#3b82f6)

## Features

- ✅ Modern, clean design
- ✅ Light and dark mode support
- ✅ Auto-dismiss with progress bar
- ✅ Manual close button
- ✅ Smooth animations
- ✅ Draggable
- ✅ Pause on hover
- ✅ Accessible
- ✅ Responsive
- ✅ Icon indicators for each type

## API Reference

### toast.success(message, options)
Shows a success notification with a green checkmark icon.

### toast.error(message, options)
Shows an error notification with a red X icon. Auto-closes after 4 seconds by default.

### toast.warning(message, options)
Shows a warning notification with a yellow triangle icon.

### toast.info(message, options)
Shows an info notification with a blue info icon.

### toast.loading(message, options)
Shows a loading notification. Returns a toast ID for later updates.

### toast.update(toastId, config)
Updates an existing toast (useful for loading states).

### toast.dismiss(toastId)
Dismisses a specific toast.

### toast.dismissAll()
Dismisses all active toasts.

### toast.promise(promise, messages, options)
Automatically handles loading, success, and error states for a promise.

## Options

All toast methods accept an optional `options` object:

```javascript
{
  position: "top-right",      // Position on screen
  autoClose: 3000,            // Auto-close delay in ms (false to disable)
  hideProgressBar: false,     // Hide/show progress bar
  closeOnClick: true,         // Close on click
  pauseOnHover: true,         // Pause auto-close on hover
  draggable: true,            // Allow dragging
  progress: undefined,        // Custom progress value
}
```

## Migration from Old Toast

If you're using the old toast system, the API remains the same:

```javascript
// Old way (still works)
import toast from '../utils/toast';
toast.success("Message");

// New way (same API, better design)
import toast from '../utils/toast';
toast.success("Message");
```

No code changes needed - just enjoy the new design!
