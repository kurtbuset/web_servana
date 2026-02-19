# Screen Header Standardization - Complete ✅

## Summary

Created a reusable `ScreenHeader` component that all management screens now use for consistent layout and easy global adjustments.

## Problem Solved

**Before:** Each screen had its own header implementation with slight variations in:
- Spacing (gap-2, gap-3, mb-3, mb-4)
- Layout structure (flex-col vs flex-row on mobile)
- Button styling
- Search bar width
- Title sizes

**After:** All screens use the same `ScreenHeader` component, ensuring:
- ✅ Identical layout across all screens
- ✅ Single source of truth for header styling
- ✅ Easy to adjust alignment globally
- ✅ Consistent spacing and behavior

## New Component Created

### `ScreenHeader.jsx`

Located at: `web_servana/src/components/ScreenHeader.jsx`

**Features:**
- Standardized title on the left
- Search bar and optional action button on the right
- Consistent spacing and alignment
- Responsive layout
- Support for disabled states with tooltips
- Optional search bar (can be hidden)

**Props:**
```javascript
{
  title: string,                    // Screen title
  searchValue: string,               // Search input value
  onSearchChange: function,          // Search change handler
  searchPlaceholder: string,         // Search placeholder (default: "Search...")
  isDark: boolean,                   // Theme mode
  action: {                          // Optional action button
    label: string,                   // Button label
    onClick: function,               // Click handler
    disabled: boolean,               // Disabled state
    disabledTooltip: string         // Tooltip when disabled
  },
  showSearch: boolean               // Show search bar (default: true)
}
```

## Usage Examples

### With Search and Action Button
```jsx
<ScreenHeader
  title="Manage Admins"
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Search admins..."
  isDark={isDark}
  action={{
    label: "+ Add Admin",
    onClick: openAddModal,
    disabled: !canEdit,
    disabledTooltip: "You don't have permission to edit"
  }}
/>
```

### Search Only (No Button)
```jsx
<ScreenHeader
  title="Change Roles"
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Search users..."
  isDark={isDark}
/>
```

### No Search (Title Only)
```jsx
<ScreenHeader
  title="Dashboard"
  showSearch={false}
  isDark={isDark}
/>
```

## Screens Updated

All management screens now use `ScreenHeader`:

### 1. Manage Admins
```jsx
<ScreenHeader
  title="Manage Admins"
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Search admins..."
  isDark={isDark}
  action={{
    label: "+ Add Admin",
    onClick: openAddModal,
    disabled: false
  }}
/>
```

### 2. Departments
```jsx
<ScreenHeader
  title="Departments"
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Search departments..."
  isDark={isDark}
  action={{
    label: "+ Add Department",
    onClick: handleOpenAddModal,
    disabled: !canEditDepartment,
    disabledTooltip: "You don't have permission to edit departments"
  }}
/>
```

### 3. Change Roles
```jsx
<ScreenHeader
  title="Change Roles"
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Search users..."
  isDark={isDark}
/>
```

### 4. Accounts (Manage Agents)
```jsx
<ScreenHeader
  title="Accounts"
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Search agents..."
  isDark={isDark}
  action={{
    label: "Add Account",
    onClick={onAddAgent},
    disabled: !canCreateAccount,
    disabledTooltip: "You don't have permission to create accounts"
  }}
/>
```

## Standardized Layout Structure

All screens now follow this exact structure:

```jsx
<Layout>
  <ScreenContainer>
    <div className="p-3 sm:p-4 flex flex-col h-full">
      {/* Header Section */}
      <ScreenHeader
        title="Screen Title"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search..."
        isDark={isDark}
        action={{
          label: "+ Add Item",
          onClick: handleAdd,
          disabled: !canEdit,
          disabledTooltip: "No permission"
        }}
      />

      {/* Table Container */}
      <div className="flex-1 overflow-hidden">
        {/* Table content */}
      </div>
    </div>
  </ScreenContainer>
</Layout>
```

## Benefits

### Easy Global Adjustments
Now you can adjust ALL screen headers by editing just ONE file:
- Change spacing: Edit `gap-3` and `mb-4` in `ScreenHeader.jsx`
- Change title size: Edit `text-lg sm:text-xl` in `ScreenHeader.jsx`
- Change search width: Edit `sm:w-56 md:w-64` in `ScreenHeader.jsx`
- Change button style: Edit button classes in `ScreenHeader.jsx`

### Consistency
✅ All screens have identical header layout
✅ Same spacing everywhere
✅ Same responsive behavior
✅ Same button styling
✅ Same search bar width

### Maintainability
✅ Single source of truth
✅ Easier to update
✅ Less code duplication
✅ Clear component API

### Developer Experience
✅ Simple to use
✅ Clear props interface
✅ Consistent patterns
✅ Easy to add new screens

## Standardized Spacing

The `ScreenHeader` component uses:
- **Container Gap**: `gap-3` (12px between title and search/button)
- **Margin Bottom**: `mb-4` (16px below header)
- **Flex Shrink**: `flex-shrink-0` (header doesn't shrink)
- **Search/Button Gap**: `gap-2` (8px between search and button)
- **Title Size**: `text-lg sm:text-xl font-bold`
- **Search Width**: `flex-1 sm:w-56 md:w-64`
- **Button**: `flex-shrink-0` (maintains size)

## Responsive Behavior

### Mobile (< 640px)
- Title stacks on top
- Search and button in horizontal row below
- Search takes available space (`flex-1`)
- Button maintains fixed width (`flex-shrink-0`)

### Tablet/Desktop (≥ 640px)
- Title on left
- Search and button on right
- Search has fixed width (`w-56 md:w-64`)
- Button maintains fixed width

## Future Enhancements

Potential improvements to `ScreenHeader`:
1. Support for multiple action buttons
2. Support for dropdown menus
3. Support for filters/tabs
4. Support for custom left content
5. Support for breadcrumbs integration

## Related Components

- **Layout** - Main layout wrapper with sidebar and navbar
- **ScreenContainer** - Container for screen content
- **SearchBar** - Search input component
- **ToggleSwitch** - Centralized toggle component

## Diagnostics

All files pass without errors or warnings.

## How to Adjust Alignment

To adjust the header alignment across ALL screens:

1. **Open**: `web_servana/src/components/ScreenHeader.jsx`
2. **Edit** the main container div:
   ```jsx
   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 flex-shrink-0">
   ```
3. **Adjust**:
   - `gap-3` → Change spacing between title and search/button
   - `mb-4` → Change margin below header
   - `sm:items-center` → Change vertical alignment
   - `sm:justify-between` → Change horizontal distribution

4. **Save** and all screens update automatically!

---

**Last Updated:** 2024
**Status:** Complete
**Screens Using ScreenHeader:** 4 (Manage Admins, Departments, Change Roles, Accounts)
**Component Location:** `web_servana/src/components/ScreenHeader.jsx`
