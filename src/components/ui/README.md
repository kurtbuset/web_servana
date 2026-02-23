# UI Components

Reusable UI components for consistent styling and behavior across the application.

## Components

### PanelHeader.jsx
Header component for panels with title, icon, and optional action button.

**Props:**
- `icon` (Component) - Icon component (from react-feather)
- `title` (string) - Header title
- `actionButton` (ReactNode) - Optional action button
- `children` (ReactNode) - Additional content below header
- `className` (string) - Additional CSS classes

**Usage:**
```jsx
<PanelHeader
  icon={Users}
  title="Roles"
  actionButton={<button>Add</button>}
>
  <SearchBar />
</PanelHeader>
```

---

### EmptyState.jsx
Empty state component with icon, title, and description.

**Props:**
- `icon` (Component) - Icon component
- `title` (string) - Empty state title
- `description` (string) - Optional description
- `iconSize` (number) - Icon size (default: 48)
- `isDark` (boolean) - Theme mode

**Usage:**
```jsx
<EmptyState
  icon={Users}
  title="No roles found"
  description="Create a new role to get started"
  isDark={isDark}
/>
```

---

### LoadingState.jsx
Loading state component with spinner and message.

**Props:**
- `message` (string) - Loading message (default: "Loading...")
- `className` (string) - Additional CSS classes

**Usage:**
```jsx
<LoadingState message="Loading roles..." />
```

---

### SplitPanel.jsx
Two-panel layout component for list/detail views.

**Props:**
- `leftPanel` (ReactNode) - Left panel content
- `rightPanel` (ReactNode) - Right panel content
- `showLeft` (boolean) - Show left panel on mobile (default: true)
- `className` (string) - Additional CSS classes

**Usage:**
```jsx
<SplitPanel
  leftPanel={<RolesList />}
  rightPanel={<RoleDetails />}
  showLeft={!selectedRole}
/>
```

---

### BackButton.jsx
Back button for mobile navigation.

**Props:**
- `onClick` (function) - Click handler
- `isDark` (boolean) - Theme mode
- `title` (string) - Button title (default: "Back")

**Usage:**
```jsx
<BackButton
  onClick={() => setSelectedRole(null)}
  isDark={isDark}
/>
```

---

### DetailHeader.jsx
Header for detail panels with back button, title, and actions.

**Props:**
- `title` (string) - Header title
- `subtitle` (string) - Optional subtitle
- `onBack` (function) - Back button handler
- `actions` (ReactNode) - Action buttons/controls
- `isDark` (boolean) - Theme mode
- `className` (string) - Additional CSS classes

**Usage:**
```jsx
<DetailHeader
  title={role.name}
  subtitle={`${permissions.length} permissions enabled`}
  onBack={() => setSelectedRole(null)}
  actions={<ToggleSwitch checked={role.active} />}
  isDark={isDark}
/>
```

## Benefits

- **Consistency**: Same UI patterns across all screens
- **Reusability**: Use in any screen that needs these patterns
- **Maintainability**: Update styling in one place
- **Responsive**: Built-in mobile/desktop handling
- **Theme Support**: Automatic dark/light mode support
- **Type Safety**: Clear prop interfaces

## Usage in Screens

These components are used in:
- RolesScreen
- ManageAgentsScreen
- DepartmentScreen
- MacrosScreen
- And more...

---

### ProfilePicture.jsx
Simple, lightweight profile picture component.

**Props:**
- `src` (string) - Image source URL
- `alt` (string) - Alt text (default: "Profile")
- `size` (string) - Size: xs, sm, md, lg, xl, 2xl, 3xl, 4xl (default: "md")
- `showStatus` (boolean) - Show online/offline indicator
- `isOnline` (boolean) - Online status
- `border` (boolean) - Show border
- `borderColor` (string) - Border color (default: "white")
- `shadow` (boolean) - Add shadow
- `hover` (boolean) - Enable hover scale effect
- `className` (string) - Additional CSS classes
- `onClick` (function) - Click handler
- `useImageUtils` (boolean) - Use getProfilePictureUrl utility (default: true)

**Usage:**
```jsx
<ProfilePicture
  src={user.profile_picture}
  alt={user.name}
  size="lg"
  showStatus
  isOnline={user.is_active}
  border
  shadow
  hover
/>
```

---

### Avatar.jsx
Advanced avatar component with initials fallback and badges.

**Props:**
- `src` (string) - Image source URL
- `alt` (string) - Alt text (default: "Profile")
- `name` (string) - User name for initials fallback
- `size` (string) - Size: xs, sm, md, lg, xl, 2xl, 3xl, 4xl (default: "md")
- `shape` (string) - Shape: circle, square, rounded (default: "circle")
- `showStatus` (boolean) - Show online/offline indicator
- `isOnline` (boolean) - Online status
- `badge` (string|number) - Badge content (e.g., notification count)
- `border` (boolean) - Show border
- `borderColor` (string) - Border color (default: "white")
- `borderWidth` (number) - Border width (default: 2)
- `ring` (boolean) - Show ring around avatar
- `ringColor` (string) - Ring color (default: "#6237A0")
- `shadow` (boolean) - Add shadow
- `hover` (boolean) - Enable hover effects
- `className` (string) - Additional CSS classes
- `onClick` (function) - Click handler
- `useImageUtils` (boolean) - Use getProfilePictureUrl utility (default: true)
- `fallbackInitials` (boolean) - Show initials when no image (default: true)

**Usage:**
```jsx
<Avatar
  src={user.profile_picture}
  name={user.full_name}
  size="xl"
  shape="circle"
  showStatus
  isOnline={user.is_active}
  badge={3}
  ring
  shadow
  hover
  onClick={() => viewProfile(user)}
/>
```

**Fallback Behavior:**
- If `src` is provided: Shows image
- If no `src` and `fallbackInitials=true`: Shows initials from `name` or `alt`
- If no `src` and `fallbackInitials=false`: Shows default user icon

## Avatar vs ProfilePicture

**Use ProfilePicture when:**
- You need a simple image display
- You have the image URL
- You don't need fallback behavior
- Performance is critical (lighter component)

**Use Avatar when:**
- You need initials fallback
- You want badges/counters
- You need different shapes
- You want ring effects
- You need more customization options

---

### SortButton.jsx
Reusable alphabetical sort button with three states.

**Props:**
- `sortBy` (string) - Current sort state: 'default', 'alphabetical', 'reverse' (default: 'default')
- `onSortChange` (function) - Callback when sort state changes
- `className` (string) - Additional CSS classes
- `isDark` (boolean) - Dark mode flag (optional)

**Sort States:**
- `default` - No sorting applied (inactive icon)
- `alphabetical` - A-Z sorting (up arrow, active)
- `reverse` - Z-A sorting (down arrow, active)

**Usage:**
```jsx
const [sortBy, setSortBy] = useState('default');

<SortButton 
  sortBy={sortBy} 
  onSortChange={setSortBy}
  isDark={isDark}
/>
```

**In Table Headers:**
```jsx
<th className="py-2 px-2 text-left font-semibold">
  <div className="flex items-center gap-2">
    <span>Name</span>
    <SortButton 
      sortBy={sortBy} 
      onSortChange={setSortBy}
      isDark={isDark}
    />
  </div>
</th>
```

**Sorting Logic Example:**
```jsx
const sortedData = [...data].sort((a, b) => {
  switch (sortBy) {
    case 'alphabetical':
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    case 'reverse':
      return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
    case 'default':
    default:
      return 0; // Original order
  }
});
```

**Features:**
- Three-state cycle: default → alphabetical → reverse → default
- Visual feedback with color-coded icons
- Accessible with proper ARIA labels
- Hover effects
- Consistent styling across the app
