# Profile Components

Reusable components extracted from Profile.jsx for better maintainability and organization.

## Components

### AnimatedBackground.jsx
Animated blob background elements for visual appeal.

**Props:**
- `isDark` (boolean) - Theme mode for color selection

**Usage:**
```jsx
<AnimatedBackground isDark={isDark} />
```

---

### InfoCard.jsx
Displays a single piece of profile information with an icon.

**Props:**
- `icon` (ReactNode) - SVG icon element
- `label` (string) - Field label
- `value` (string) - Field value
- `isDark` (boolean) - Theme mode

**Usage:**
```jsx
<InfoCard
  icon={<svg>...</svg>}
  label="Full Name"
  value="John Doe"
  isDark={isDark}
/>
```

---

### ProfileHeader.jsx
Profile header section with picture, name, email, and photo upload functionality.

**Props:**
- `profilePicture` (string) - Profile picture URL
- `profileData` (object) - Profile data object
- `fileName` (string) - Selected file name
- `imageUploaded` (boolean) - Whether image is uploaded
- `canManageProfile` (boolean) - Permission check
- `onFileChange` (function) - File selection handler
- `onSaveImage` (function) - Image save handler

**Usage:**
```jsx
<ProfileHeader
  profilePicture={profilePicture}
  profileData={profileData}
  fileName={fileName}
  imageUploaded={imageUploaded}
  canManageProfile={canManageProfile}
  onFileChange={handleFileChange}
  onSaveImage={handleSaveImage}
/>
```

---

### ProfileDetails.jsx
Grid of profile information cards (name, email, DOB, address).

**Props:**
- `profileData` (object) - Profile data object
- `isDark` (boolean) - Theme mode

**Usage:**
```jsx
<ProfileDetails profileData={profileData} isDark={isDark} />
```

---

### DepartmentsList.jsx
Grid of user's departments with click handlers.

**Props:**
- `departments` (array) - Array of department objects
- `isDark` (boolean) - Theme mode
- `onViewDepartment` (function) - Department click handler

**Usage:**
```jsx
<DepartmentsList
  departments={departments}
  isDark={isDark}
  onViewDepartment={handleViewDepartment}
/>
```

---

### EditProfileModal.jsx
Modal for editing profile information.

**Props:**
- `isOpen` (boolean) - Modal visibility
- `profileData` (object) - Profile data object
- `canManageProfile` (boolean) - Permission check
- `onClose` (function) - Close handler
- `onSave` (function) - Save handler
- `onProfileDataChange` (function) - Data change handler

**Usage:**
```jsx
<EditProfileModal
  isOpen={isEditModalOpen}
  profileData={profileData}
  canManageProfile={canManageProfile}
  onClose={() => setIsEditModalOpen(false)}
  onSave={handleSave}
  onProfileDataChange={setProfileData}
/>
```

---

### DepartmentMembersModal.jsx
Modal showing department members with stats.

**Props:**
- `selectedDepartment` (object) - Selected department object
- `departmentMembers` (array) - Array of member objects
- `loadingMembers` (boolean) - Loading state
- `onClose` (function) - Close handler

**Usage:**
```jsx
<DepartmentMembersModal
  selectedDepartment={selectedDepartment}
  departmentMembers={departmentMembers}
  loadingMembers={loadingMembers}
  onClose={() => setSelectedDepartment(null)}
/>
```

---

### LogoutConfirmModal.jsx
Confirmation modal for logout action.

**Props:**
- `isOpen` (boolean) - Modal visibility
- `onConfirm` (function) - Confirm handler
- `onCancel` (function) - Cancel handler

**Usage:**
```jsx
<LogoutConfirmModal
  isOpen={showLogoutConfirm}
  onConfirm={handleLogout}
  onCancel={() => setShowLogoutConfirm(false)}
/>
```

## Benefits

- **Modularity**: Each component handles a specific UI section
- **Reusability**: Components can be used in other profile-related screens
- **Maintainability**: Easier to update and test individual components
- **Cleaner Code**: Main Profile.jsx is much more readable
- **Type Safety**: Clear prop interfaces for each component
