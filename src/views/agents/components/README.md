# ManageAgentsScreen Components

This directory contains extracted components from ManageAgentsScreen to improve maintainability and reduce file size.

## Components

### AgentDetailView.jsx
Displays detailed information about a selected agent including:
- Profile picture and basic info
- Email editing
- Password reset
- Department assignments
- Active status toggle
- Navigation to analytics view

**Props:**
- `agent` - The agent object
- `agentIndex` - Index of the agent in the list
- `onBack` - Function to navigate back to list view
- `onNavigateToAnalytics` - Function to navigate to analytics view
- `onNavigateToEditDept` - Function to navigate to edit department view
- `onUpdateAgent` - Function to update agent data
- `isDark` - Dark mode flag
- `hasPermission` - Permission check function
- `getProfilePictureUrl` - Function to get profile picture URL

### EditDepartmentView.jsx
Allows editing department assignments for an agent:
- Search and filter departments
- Assign/unassign departments
- Unsaved changes tracking
- Save/reset functionality

**Props:**
- `agent` - The agent object
- `departments` - Array of all departments
- `onBack` - Function to navigate back
- `onSave` - Function to save changes
- `onReset` - Function to reset changes
- `isDark` - Dark mode flag
- `shakeBar` - Shake animation trigger for unsaved changes bar

### AnalyticsView.jsx
Displays performance analytics for an agent:
- Total chats metric
- Average response time
- Satisfaction rate
- Resolved tickets count
- Weekly performance graph

**Props:**
- `agent` - The agent object
- `onBack` - Function to navigate back
- `isDark` - Dark mode flag

### AddAgentModal.jsx
Modal for adding a new agent:
- Email input
- Password input with visibility toggle
- Form validation
- Error handling

**Props:**
- `editForm` - Form state object with email and password
- `setEditForm` - Function to update form state
- `showPassword` - Boolean for password visibility
- `setShowPassword` - Function to toggle password visibility
- `modalError` - Error message string
- `setModalError` - Function to clear error
- `onClose` - Function to close modal
- `onSave` - Function to save new agent
- `isDark` - Dark mode flag

## Shared Components

### ToggleSwitch (../../components/ToggleSwitch.jsx)
Reusable toggle switch component used across multiple screens:
- ManageAgentsScreen (agent active status)
- RolesScreen (role active status)

**Props:**
- `checked` - Boolean state
- `onChange` - Change handler function
- `disabled` - Optional disabled state
- `size` - Optional size ("sm" or "md")

## File Structure
```
web_servana/src/views/agents/
├── ManageAgentsScreen.jsx (main component, ~600 lines)
└── components/
    ├── AgentDetailView.jsx (~250 lines)
    ├── EditDepartmentView.jsx (~150 lines)
    ├── AnalyticsView.jsx (~140 lines)
    ├── AddAgentModal.jsx (~120 lines)
    └── README.md (this file)
```

## Benefits
- Reduced main file size from ~1200 lines to ~600 lines
- Improved code organization and maintainability
- Easier to test individual components
- Better code reusability
- Clearer separation of concerns
