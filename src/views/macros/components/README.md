# Macros Components

This directory contains extracted components from MacrosClientsScreen and MacrosAgentsScreen to improve maintainability and reduce file size.

## Components

### DepartmentSidebar.jsx
Displays a filterable list of departments for macro filtering.

**Features:**
- Department search functionality
- @everyone option for global macros
- Active/inactive department indicators
- Selected department highlighting
- Responsive design

**Props:**
- `departments` - List of departments
- `selectedDepartment` - Currently selected department
- `onSelectDepartment` - Handler for department selection
- `searchQuery` - Department search query
- `onSearchChange` - Handler for search input change
- `loading` - Loading state
- `isDark` - Dark mode flag

### MacroTable.jsx
Displays a table of macros with sorting, editing, and actions.

**Features:**
- Sortable columns (alphabetical, reverse, newest)
- Inline editing with Edit icon
- Active/inactive toggle
- Department display
- Transfer and delete actions
- Empty state handling
- Hover effects

**Props:**
- `macros` - List of macros to display
- `departments` - List of departments
- `sortBy` - Current sort option
- `onSortChange` - Handler for sort change
- `onEdit` - Handler for editing a macro
- `onToggleActive` - Handler for toggling macro active status
- `onTransfer` - Handler for transferring macro to another department
- `onDelete` - Handler for deleting a macro
- `searchQuery` - Current search query
- `isDark` - Dark mode flag

## File Structure
```
web_servana/src/views/macros/
├── MacrosClientsScreen.jsx (main component, ~620 lines)
├── MacrosAgentsScreen.jsx (main component, ~599 lines)
└── components/
    ├── DepartmentSidebar.jsx (~95 lines)
    ├── MacroTable.jsx (~180 lines)
    └── README.md (this file)
```

## Benefits
- Reduced MacrosClientsScreen from ~806 lines to ~620 lines (23% reduction)
- Reduced MacrosAgentsScreen from ~785 lines to ~599 lines (24% reduction)
- Improved code organization and maintainability
- Reusable components across both Client and Agent macro screens
- Easier to test individual components
- Better separation of concerns
- Consistent UI across macro screens
- Single source of truth for department filtering and table display

## Usage Example

```jsx
import DepartmentSidebar from './components/DepartmentSidebar';
import MacroTable from './components/MacroTable';

// In MacrosClientsScreen or MacrosAgentsScreen
<DepartmentSidebar
  departments={departments}
  selectedDepartment={selectedDepartment}
  onSelectDepartment={setSelectedDepartment}
  searchQuery={departmentSearchQuery}
  onSearchChange={setDepartmentSearchQuery}
  loading={loading}
  isDark={isDark}
/>

<MacroTable
  macros={sortedReplies}
  departments={departments}
  sortBy={sortBy}
  onSortChange={setSortBy}
  onEdit={(reply) => {
    setCurrentEditId(reply.id);
    setEditText(reply.text);
    setIsModalOpen(true);
  }}
  onToggleActive={handleToggleActive}
  onTransfer={(reply) => {
    // Handle transfer logic
  }}
  onDelete={(id) => {
    // Handle delete logic
  }}
  searchQuery={searchQuery}
  isDark={isDark}
/>
```

## Notes
- Both components are designed to work with both Client and Agent macro screens
- The components handle their own styling and hover effects
- Department filtering logic remains in the parent component
- Modal components (Add/Edit, Transfer, Delete) remain in the parent screens as they contain complex state management
