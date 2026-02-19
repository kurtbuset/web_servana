# Auto Replies Components

Reusable components extracted from AutoRepliesScreen.jsx for better maintainability and organization.

## Components

### AutoReplyTable.jsx
Main table component displaying the list of auto-replies.

**Props:**
- `replies` (array) - Array of auto-reply objects
- `allDepartments` (array) - Array of all departments
- `loading` (boolean) - Loading state
- `error` (string) - Error message
- `searchQuery` (string) - Current search query
- `isDark` (boolean) - Theme mode
- `onEdit` (function) - Handler for editing reply
- `onToggleStatus` (function) - Handler for toggling active status
- `onTransfer` (function) - Handler for transferring reply
- `onDelete` (function) - Handler for deleting reply

---

### AutoReplyTableRow.jsx
Individual row component in the auto-replies table.

**Props:**
- `reply` (object) - Auto-reply object
- `departmentName` (string) - Department name for display
- `isDark` (boolean) - Theme mode
- `onEdit` (function) - Handler for editing
- `onToggleStatus` (function) - Handler for toggling status
- `onTransfer` (function) - Handler for transferring
- `onDelete` (function) - Handler for deleting

---

### DepartmentSidebar.jsx
Desktop sidebar for filtering auto-replies by department.

**Props:**
- `allDepartments` (array) - Array of all departments
- `selectedDepartment` (string) - Currently selected department
- `departmentSearchQuery` (string) - Search query for departments
- `loading` (boolean) - Loading state
- `isDark` (boolean) - Theme mode
- `onSelectDepartment` (function) - Handler for selecting department
- `onSearchChange` (function) - Handler for search input change

---

### MobileDepartmentFilter.jsx
Mobile dropdown for filtering auto-replies by department.

**Props:**
- `allDepartments` (array) - Array of all departments
- `selectedDepartment` (string) - Currently selected department
- `departmentSearchQuery` (string) - Search query for departments
- `showMobileDeptFilter` (boolean) - Dropdown visibility
- `isDark` (boolean) - Theme mode
- `onToggle` (function) - Handler for toggling dropdown
- `onSelectDepartment` (function) - Handler for selecting department
- `onSearchChange` (function) - Handler for search input change

---

### EditReplyModal.jsx
Modal for editing an existing auto-reply message.

**Props:**
- `isOpen` (boolean) - Modal visibility
- `editText` (string) - Reply text value
- `isDark` (boolean) - Theme mode
- `onTextChange` (function) - Text change handler
- `onSave` (function) - Save handler
- `onClose` (function) - Close handler

---

### AddReplyModal.jsx
Modal for adding a new auto-reply with department selection.

**Props:**
- `isOpen` (boolean) - Modal visibility
- `editText` (string) - Reply text value
- `modalDepartment` (string) - Selected department
- `allDepartments` (array) - Array of all departments
- `isDark` (boolean) - Theme mode
- `onTextChange` (function) - Text change handler
- `onDepartmentChange` (function) - Department change handler
- `onSave` (function) - Save handler
- `onClose` (function) - Close handler

---

### TransferReplyModal.jsx
Modal for transferring a reply to another department with unsaved changes tracking.

**Props:**
- `isOpen` (boolean) - Modal visibility
- `transferToDept` (string) - Target department
- `allDepartments` (array) - Array of all departments
- `hasUnsavedChanges` (boolean) - Unsaved changes state
- `shakeBar` (number) - Shake animation trigger
- `isDark` (boolean) - Theme mode
- `onDepartmentChange` (function) - Department change handler
- `onTransfer` (function) - Transfer handler
- `onReset` (function) - Reset handler
- `onClose` (function) - Close handler

---

### DeleteReplyModal.jsx
Confirmation modal for deleting an auto-reply.

**Props:**
- `isOpen` (boolean) - Modal visibility
- `isDark` (boolean) - Theme mode
- `onDelete` (function) - Delete handler
- `onClose` (function) - Close handler

---

### InfoNote.jsx
Information banner explaining auto-reply department tagging behavior.

**Props:**
- `selectedDepartment` (string) - Currently selected department
- `isDark` (boolean) - Theme mode

---

## Benefits

✅ **Modularity**: Each component handles a specific UI section
✅ **Reusability**: Components can be used in other auto-reply management screens
✅ **Maintainability**: Easier to update and test individual components
✅ **Cleaner Code**: Main AutoRepliesScreen.jsx is much more readable
✅ **Separation of Concerns**: UI logic separated from business logic
✅ **Consistent Styling**: Uses existing reusable UI components (LoadingState)

## File Structure

```
auto-replies/
├── AutoRepliesScreen.jsx           # Main screen component
└── components/
    ├── AutoReplyTable.jsx          # Table container
    ├── AutoReplyTableRow.jsx       # Individual table row
    ├── DepartmentSidebar.jsx       # Desktop department filter
    ├── MobileDepartmentFilter.jsx  # Mobile department filter
    ├── EditReplyModal.jsx          # Edit modal
    ├── AddReplyModal.jsx           # Add modal
    ├── TransferReplyModal.jsx      # Transfer modal
    ├── DeleteReplyModal.jsx        # Delete confirmation modal
    ├── InfoNote.jsx                # Info banner
    └── README.md                   # This file
```

## Reusable Components Used

- `LoadingState` from `components/ui` - Loading indicator
- `Modal` from `components/Modal` - Base modal component
- `UnsavedChangesBar` from `components/UnsavedChangesBar` - Unsaved changes notification
- `SearchBar` from `components/SearchBar` - Search input component
- `GridLayout.css` from `styles/GridLayout.css` - Grid layout styles

## Code Reduction

- **Before**: ~819 lines in single file
- **After**: Significantly reduced main file + 9 focused components
- **Improvement**: Better organization and maintainability
