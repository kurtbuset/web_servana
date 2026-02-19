# RolesScreen Components

This directory contains extracted components from RolesScreen to improve maintainability and reduce file size.

## Components

### RoleItem.jsx
Displays a single role in the sidebar with expandable member list.

**Features:**
- Role name and permission count
- Active/inactive status indicator
- Expandable member list
- Toggle active status button
- Hover effects and selection state

**Props:**
- `role` - The role object
- `isSelected` - Whether this role is currently selected
- `onClick` - Handler for role selection
- `onToggleActive` - Handler for toggling role active status
- `canManage` - Whether user can manage roles
- `isExpanded` - Whether member list is expanded
- `members` - Array of members in this role
- `membersLoading` - Whether members are loading
- `membersError` - Error message if members failed to load
- `onToggleExpansion` - Handler for expanding/collapsing member list
- `isDark` - Dark mode flag

### MemberListItem.jsx
Displays a single member in the role's member list.

**Features:**
- Profile picture or initials
- Member name and email
- Active/inactive status
- Hover effects

**Props:**
- `member` - The member object
- `isDark` - Dark mode flag

### PermissionCategory.jsx
Groups related permissions under a category with an icon.

**Features:**
- Category icon and name
- List of permissions in the category
- Passes props to PermissionItem components

**Props:**
- `name` - Category name
- `icon` - Icon component for the category
- `permissions` - Array of permission objects
- `rolePermissions` - Array of enabled permission keys for the role
- `onTogglePermission` - Handler for toggling a permission
- `canManage` - Whether user can manage permissions
- `isDark` - Dark mode flag

### PermissionItem.jsx
Displays a single permission with its description and toggle.

**Features:**
- Permission name and description
- Toggle switch for enabling/disabling
- Hover effects
- Disabled state when user can't manage

**Props:**
- `permission` - Permission object with key and description
- `isEnabled` - Whether the permission is enabled
- `onToggle` - Handler for toggling the permission
- `canManage` - Whether user can manage permissions
- `isDark` - Dark mode flag

### PermissionToggle.jsx
Custom toggle switch for enabling/disabling permissions.

**Features:**
- Visual enabled/disabled states
- Check/X icons inside toggle
- Smooth animations
- Disabled state styling
- Focus ring for accessibility

**Props:**
- `state` - "enabled" or "disabled"
- `onChange` - Handler for toggle change
- `disabled` - Whether the toggle is disabled

## File Structure
```
web_servana/src/views/roles/
├── RolesScreen.jsx (main component, ~580 lines)
└── components/
    ├── RoleItem.jsx (~180 lines)
    ├── MemberListItem.jsx (~70 lines)
    ├── PermissionCategory.jsx (~40 lines)
    ├── PermissionItem.jsx (~35 lines)
    ├── PermissionToggle.jsx (~45 lines)
    └── README.md (this file)
```

## Benefits
- Reduced main file size from ~885 lines to ~580 lines (34% reduction)
- Improved code organization and maintainability
- Easier to test individual components
- Better code reusability
- Clearer separation of concerns
- Each component has a single responsibility

## Usage Example

```jsx
import RoleItem from "./components/RoleItem";
import PermissionCategory from "./components/PermissionCategory";

// In RolesScreen component
<RoleItem
  role={role}
  isSelected={selectedRole?.role_id === role.role_id}
  onClick={() => handleRoleSelect(role)}
  onToggleActive={() => handleToggleActive(role)}
  canManage={canManageRoles}
  isExpanded={expandedRoles.has(role.role_id)}
  members={roleMembers[role.role_id]}
  membersLoading={membersLoading[role.role_id]}
  membersError={membersError[role.role_id]}
  onToggleExpansion={handleToggleExpansion}
  isDark={isDark}
/>

<PermissionCategory
  name="Chat Permissions"
  icon={MessageSquare}
  permissions={chatPermissions}
  rolePermissions={selectedRole.permissions}
  onTogglePermission={handleTogglePermission}
  canManage={canManageRoles}
  isDark={isDark}
/>
```
