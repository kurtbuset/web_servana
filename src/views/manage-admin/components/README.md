# Manage Admin Components

Reusable components extracted from ManageAdmin.jsx for better maintainability and organization.

## Components

### AdminTable.jsx
Main table component displaying the list of administrators.

**Props:**
- `agents` (array) - Array of admin objects
- `currentUserId` (number) - ID of the current logged-in user
- `loading` (boolean) - Loading state
- `error` (string) - Error message
- `searchQuery` (string) - Current search query
- `isDark` (boolean) - Theme mode
- `onViewProfile` (function) - Handler for viewing profile
- `onEdit` (function) - Handler for editing admin
- `onToggleStatus` (function) - Handler for toggling active status

**Usage:**
```jsx
<AdminTable
  agents={filteredAgents}
  currentUserId={currentUserId}
  loading={loading}
  error={error}
  searchQuery={searchQuery}
  isDark={isDark}
  onViewProfile={(agent) => setViewProfileModal(agent)}
  onEdit={openEditModal}
  onToggleStatus={toggleActiveStatus}
/>
```

---

### AdminTableRow.jsx
Individual row component in the admin table.

**Props:**
- `agent` (object) - Admin object
- `isSelf` (boolean) - Whether this is the current user
- `isDark` (boolean) - Theme mode
- `onViewProfile` (function) - Handler for viewing profile
- `onEdit` (function) - Handler for editing
- `onToggleStatus` (function) - Handler for toggling status

**Usage:**
```jsx
<AdminTableRow
  agent={agent}
  isSelf={agent.sys_user_id === currentUserId}
  isDark={isDark}
  onViewProfile={() => onViewProfile(agent)}
  onEdit={() => onEdit(agent)}
  onToggleStatus={() => onToggleStatus(agent.sys_user_id)}
/>
```

---

### AddEditAdminModal.jsx
Modal for adding new administrators or editing existing ones.

**Props:**
- `isOpen` (boolean) - Modal visibility
- `isEdit` (boolean) - Whether in edit mode
- `email` (string) - Email value
- `password` (string) - Password value
- `showPassword` (boolean) - Show/hide password
- `error` (string) - Error message
- `isDark` (boolean) - Theme mode
- `onEmailChange` (function) - Email change handler
- `onPasswordChange` (function) - Password change handler
- `onTogglePassword` (function) - Toggle password visibility
- `onSave` (function) - Save handler
- `onClose` (function) - Close handler

**Usage:**
```jsx
<AddEditAdminModal
  isOpen={isModalOpen}
  isEdit={currentEditId !== null}
  email={editEmail}
  password={editPassword}
  showPassword={showPassword}
  error={modalError}
  isDark={isDark}
  onEmailChange={(value) => {
    setEditEmail(value);
    if (modalError) setModalError(null);
  }}
  onPasswordChange={(value) => {
    setEditPassword(value);
    if (modalError) setModalError(null);
  }}
  onTogglePassword={() => setShowPassword(!showPassword)}
  onSave={saveAdmin}
  onClose={() => {
    setIsModalOpen(false);
    setModalError(null);
  }}
/>
```

---

### ViewProfileModal.jsx
Modal for viewing detailed admin profile information.

**Props:**
- `user` (object) - User/admin object
- `onClose` (function) - Close handler

**Usage:**
```jsx
<ViewProfileModal
  user={viewProfileModal}
  onClose={() => setViewProfileModal(null)}
/>
```

---

## Benefits

✅ **Modularity**: Each component handles a specific UI section
✅ **Reusability**: Components can be used in other admin management screens
✅ **Maintainability**: Easier to update and test individual components
✅ **Cleaner Code**: Main ManageAdmin.jsx is much more readable
✅ **Separation of Concerns**: UI logic separated from business logic
✅ **Type Safety**: Clear prop interfaces for each component

## File Structure

```
manage-admin/
├── ManageAdmin.jsx          # Main screen component
└── components/
    ├── AdminTable.jsx       # Table container
    ├── AdminTableRow.jsx    # Individual table row
    ├── AddEditAdminModal.jsx # Add/Edit modal
    ├── ViewProfileModal.jsx  # View profile modal
    └── README.md            # This file
```

## Code Reduction

- **Before**: ~600 lines in single file
- **After**: ~200 lines in main file + 4 focused components
- **Improvement**: 67% reduction in main file complexity
