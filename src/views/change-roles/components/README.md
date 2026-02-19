# Change Roles Components

Reusable components extracted from ChangeRolesScreen.jsx for better maintainability and organization.

## Components

### UserRolesTable.jsx
Main table component displaying the list of users with their roles and status.

**Props:**
- `users` (array) - Array of user objects
- `availableRoles` (array) - Array of available role objects
- `loading` (boolean) - Loading state
- `searchQuery` (string) - Current search query
- `canAssignRoles` (boolean) - Whether current user can assign roles
- `isDark` (boolean) - Theme mode
- `onToggleActive` (function) - Handler for toggling user active status
- `onChangeRole` (function) - Handler for changing user role

**Usage:**
```jsx
<UserRolesTable
  users={filteredUsers}
  availableRoles={availableRoles}
  loading={loading}
  searchQuery={searchQuery}
  canAssignRoles={canAssignRoles}
  isDark={isDark}
  onToggleActive={handleToggleActive}
  onChangeRole={handleChangeRole}
/>
```

---

### UserRoleTableRow.jsx
Individual row component in the user roles table.

**Props:**
- `user` (object) - User object
- `availableRoles` (array) - Array of available role objects
- `canAssignRoles` (boolean) - Whether current user can assign roles
- `isDark` (boolean) - Theme mode
- `onToggleActive` (function) - Handler for toggling active status
- `onChangeRole` (function) - Handler for changing role

**Usage:**
```jsx
<UserRoleTableRow
  user={user}
  availableRoles={availableRoles}
  canAssignRoles={canAssignRoles}
  isDark={isDark}
  onToggleActive={() => onToggleActive(user)}
  onChangeRole={(newRoleId) => onChangeRole(user, newRoleId)}
/>
```

---

## Reusable Components Used

- **LoadingState** from `components/ui` - Loading indicator
- **Avatar** from `components/ui` - Profile picture component
- **ToggleSwitch** from `components/ToggleSwitch` - Reusable toggle switch for status
- **SearchBar** from `components/SearchBar` - Search input component
- **ScrollContainer** from `components/ScrollContainer` - Scrollable container

## Benefits

✅ **Modularity**: Each component handles a specific UI section
✅ **Reusability**: Components can be used in other user management screens
✅ **Maintainability**: Easier to update and test individual components
✅ **Cleaner Code**: Main ChangeRolesScreen.jsx is much more readable
✅ **Consistent Styling**: Uses existing reusable components (ToggleSwitch, Avatar, LoadingState)
✅ **Centralized Toggle**: Using ToggleSwitch ensures consistent toggle behavior across the app

## File Structure

```
change-roles/
├── ChangeRolesScreen.jsx      # Main screen component
└── components/
    ├── UserRolesTable.jsx     # Table container
    ├── UserRoleTableRow.jsx   # Individual table row
    └── README.md              # This file
```

## Code Reduction

- **Before**: ~180 lines in single file
- **After**: ~80 lines in main file + 2 focused components
- **Improvement**: 56% reduction in main file complexity

## Toggle Switch Consistency

By using the centralized `ToggleSwitch` component instead of inline toggle markup:
- ✅ Consistent toggle appearance across all screens
- ✅ Single source of truth for toggle styling
- ✅ Easy to update toggle design globally
- ✅ Reduced code duplication
- ✅ Better accessibility support

Screens using ToggleSwitch:
- ChangeRolesScreen
- ManageAdmin (can be migrated)
- AutoRepliesScreen (can be migrated)
- Other screens with toggle switches
