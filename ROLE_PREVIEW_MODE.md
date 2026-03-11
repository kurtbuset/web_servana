# Role Preview Mode Feature

## Overview
The Role Preview Mode feature allows administrators to temporarily view the application with the permissions of a specific role, similar to Discord's "View Server As Role" feature. This helps administrators understand what access and capabilities different roles have without actually changing their own role.

## Features

### 1. Preview Mode Activation
- Click the three-dot menu (•••) next to any role in the Roles & Permissions screen
- Select "View Server As Role" to activate preview mode
- A prominent banner appears at the top showing you're in preview mode

### 2. Preview Banner
- Fixed banner at the top of the screen
- Shows the role name you're previewing
- "Exit Preview" button to return to normal mode
- Purple-themed design for clear visual distinction

### 3. Permission Simulation
- All permission checks use the preview role's permissions
- Navigation items, buttons, and features are shown/hidden based on preview permissions
- Provides accurate representation of what users with that role can see and do

### 4. Copy Role ID
- Additional option in the role menu to copy the role ID to clipboard
- Useful for debugging and API operations

## Technical Implementation

### Components

#### `RolePreviewContext.jsx`
- Manages preview mode state
- Fetches and stores role permissions
- Provides `hasPreviewPermission()` function
- Syncs preview permissions to `window.__rolePreviewPermissions` for global access

#### `RolePreviewBanner.jsx`
- Fixed banner component shown during preview mode
- Displays current preview role name
- Exit button to leave preview mode

#### `RolePreviewDropdown.jsx`
- Three-dot menu component for role options
- "View Server As Role" option
- "Copy Role ID" option
- Click-outside detection to close menu

#### Updated `UserContext.jsx`
- Modified `hasPermission()` to check preview permissions first
- Falls back to user's actual permissions when not in preview mode
- Accepts `usePreview` parameter (default: true)

### Usage in Components

```jsx
import { useRolePreview } from '../context/RolePreviewContext';

function MyComponent() {
  const { previewMode, previewRole, startPreview, exitPreview } = useRolePreview();
  
  // Start preview mode
  const handlePreview = async () => {
    await startPreview(roleId, roleName);
  };
  
  // Exit preview mode
  const handleExit = () => {
    exitPreview();
  };
  
  // Check if in preview mode
  if (previewMode) {
    console.log(`Previewing as: ${previewRole.name}`);
  }
}
```

### Permission Checking

The `hasPermission()` function in UserContext automatically uses preview permissions when in preview mode:

```jsx
import { useUser } from '../context/UserContext';

function MyComponent() {
  const { hasPermission } = useUser();
  
  // Automatically uses preview permissions if in preview mode
  const canViewChats = hasPermission('priv_can_view_message');
  
  // Force use of actual user permissions (bypass preview)
  const actualPermission = hasPermission('priv_can_view_message', false);
}
```

## Permission Mapping

The feature uses the following permission mapping:

| Permission Label | Database Column |
|-----------------|-----------------|
| Can view Chats | priv_can_view_message |
| Can Reply | priv_can_message |
| Can Manage Profile | priv_can_manage_profile |
| Can send Macros | priv_can_use_canned_mess |
| Can End Chat | priv_can_end_chat |
| Can Transfer Department | priv_can_transfer |
| Can Edit Department | priv_can_manage_dept |
| Can Assign Department | priv_can_assign_dept |
| Can Edit Roles | priv_can_manage_role |
| Can Assign Roles | priv_can_assign_role |
| Can Add Admin Accounts | priv_can_create_account |
| Can Edit Auto-Replies | priv_can_manage_auto_reply |

## User Experience

### Entering Preview Mode
1. Navigate to Roles & Permissions screen
2. Find the role you want to preview
3. Click the three-dot menu (•••) next to the role
4. Click "View Server As Role"
5. Preview mode activates with banner at top

### While in Preview Mode
- Banner shows current preview role
- All navigation and features reflect the preview role's permissions
- Restricted features are hidden or disabled
- Full simulation of the role's experience

### Exiting Preview Mode
- Click "Exit Preview" button in the banner
- Returns to your actual permissions
- Banner disappears

## Security Considerations

1. **Read-Only Preview**: Preview mode only affects what you can see, not what you can do
2. **No Data Modification**: Actions performed in preview mode still use your actual permissions
3. **Session-Based**: Preview mode is session-based and doesn't persist across page refreshes
4. **Permission Required**: Only users with role management permissions can access preview mode

## Future Enhancements

Potential improvements for future versions:

1. **Preview History**: Track recently previewed roles
2. **Quick Switch**: Switch between different role previews without exiting
3. **Comparison Mode**: View two roles side-by-side
4. **Preview Logs**: Log what actions would be available in preview mode
5. **Mobile Support**: Optimize preview mode for mobile devices
6. **Keyboard Shortcuts**: Add keyboard shortcuts for entering/exiting preview mode

## Troubleshooting

### Preview Mode Not Working
- Ensure you have role management permissions
- Check browser console for errors
- Verify role has valid permissions configured

### Permissions Not Updating
- Exit and re-enter preview mode
- Check if role permissions were recently modified
- Refresh the page to clear any cached data

### Banner Not Showing
- Check if `RolePreviewProvider` is properly wrapped in App.jsx
- Verify `RolePreviewBanner` is rendered in the component tree
- Check z-index conflicts with other fixed elements

## Related Files

- `web_servana/src/context/RolePreviewContext.jsx`
- `web_servana/src/components/RolePreviewBanner.jsx`
- `web_servana/src/components/RolePreviewDropdown.jsx`
- `web_servana/src/context/UserContext.jsx`
- `web_servana/src/views/roles/components/RoleItem.jsx`
- `web_servana/src/App.jsx`
