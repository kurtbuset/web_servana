# Departments Components

Reusable components extracted from DepartmentScreen.jsx for better maintainability and organization.

## Components

### DepartmentsTable.jsx
Main table component displaying the list of departments.

**Props:**
- `departments` (array) - Array of department objects
- `loading` (boolean) - Loading state
- `error` (string) - Error message
- `searchQuery` (string) - Current search query
- `canEditDepartment` (boolean) - Whether current user can edit departments
- `isDark` (boolean) - Theme mode
- `onEdit` (function) - Handler for editing department
- `onToggleStatus` (function) - Handler for toggling department status

**Usage:**
```jsx
<DepartmentsTable
  departments={filteredDepartments}
  loading={loading}
  error={error}
  searchQuery={searchQuery}
  canEditDepartment={canEditDepartment}
  isDark={isDark}
  onEdit={handleEdit}
  onToggleStatus={handleToggle}
/>
```

---

### DepartmentTableRow.jsx
Individual row component in the departments table.

**Props:**
- `department` (object) - Department object
- `canEditDepartment` (boolean) - Whether current user can edit departments
- `isDark` (boolean) - Theme mode
- `onEdit` (function) - Handler for editing
- `onToggleStatus` (function) - Handler for toggling status

**Usage:**
```jsx
<DepartmentTableRow
  department={dept}
  canEditDepartment={canEditDepartment}
  isDark={isDark}
  onEdit={() => onEdit(dept)}
  onToggleStatus={() => onToggleStatus(dept.dept_id, dept.dept_is_active)}
/>
```

---

### DepartmentModal.jsx
Modal for adding new departments or editing existing ones.

**Props:**
- `isOpen` (boolean) - Modal visibility
- `isEdit` (boolean) - Whether in edit mode
- `departmentName` (string) - Department name value
- `canEditDepartment` (boolean) - Whether current user can edit departments
- `isDark` (boolean) - Theme mode
- `onNameChange` (function) - Name change handler
- `onSave` (function) - Save handler
- `onClose` (function) - Close handler

**Usage:**
```jsx
<DepartmentModal
  isOpen={isModalOpen}
  isEdit={currentEditId !== null}
  departmentName={editText}
  canEditDepartment={canEditDepartment}
  isDark={isDark}
  onNameChange={setEditText}
  onSave={handleSave}
  onClose={() => setIsModalOpen(false)}
/>
```

---

## Reusable Components Used

- **LoadingState** from `components/ui` - Loading indicator
- **ToggleSwitch** from `components/ToggleSwitch` - Reusable toggle switch for status
- **Modal** from `components/Modal` - Base modal component
- **SearchBar** from `components/SearchBar` - Search input component

## Benefits

✅ **Modularity**: Each component handles a specific UI section
✅ **Reusability**: Components can be used in other department management screens
✅ **Maintainability**: Easier to update and test individual components
✅ **Cleaner Code**: Main DepartmentScreen.jsx is much more readable
✅ **Consistent Styling**: Uses centralized ToggleSwitch component
✅ **Consistent Layout**: Matches ChangeRolesScreen layout with thinner borders

## File Structure

```
departments/
├── DepartmentScreen.jsx       # Main screen component
└── components/
    ├── DepartmentsTable.jsx   # Table container
    ├── DepartmentTableRow.jsx # Individual table row
    ├── DepartmentModal.jsx    # Add/Edit modal
    └── README.md              # This file
```

## Layout Consistency

The DepartmentScreen now uses the same layout pattern as ChangeRolesScreen:
- Same header structure with title and search bar
- Same table styling with thinner borders
- Same hover effects
- Same responsive behavior
- Consistent spacing and padding

## Toggle Switch Consistency

By using the centralized `ToggleSwitch` component:
- ✅ Consistent toggle appearance across all screens
- ✅ Single source of truth for toggle styling
- ✅ Easy to update toggle design globally
- ✅ Reduced code duplication

Screens using ToggleSwitch:
- ChangeRolesScreen
- ManageAdmin
- AutoRepliesScreen
- DepartmentScreen

## Code Reduction

- **Before**: ~250 lines in single file
- **After**: ~100 lines in main file + 3 focused components
- **Improvement**: 60% reduction in main file complexity

## Diagnostics

All files pass without errors or warnings.
