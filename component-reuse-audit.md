# Component Reuse Audit — web_servana

## Existing Reusable Components (already built)

| Component | Location | Purpose |
|---|---|---|
| `Modal.jsx` | `src/components/Modal.jsx` | Generic modal — sizes sm/md/lg/xl, variants primary/secondary/danger |
| `Avatar.jsx` | `src/components/ui/Avatar.jsx` | Full-featured avatar with status, badge, ring |
| `ProfilePicture.jsx` | `src/components/ui/ProfilePicture.jsx` | Simpler avatar variant |
| `SearchBar.jsx` | `src/components/SearchBar.jsx` | Search input with clear button |
| `EmptyState.jsx` | `src/components/ui/EmptyState.jsx` | Empty state with icon/message |
| `LoadingState.jsx` | `src/components/ui/LoadingState.jsx` | Loading spinner with message |
| `Tooltip.jsx` | `src/components/ui/Tooltip.jsx` | Positioned tooltip |
| `Toast.jsx` | `src/components/ui/Toast.jsx` | Notification toast |
| `SortButton.jsx` | `src/components/ui/SortButton.jsx` | A-Z/Z-A sort toggle |
| `DetailHeader.jsx` | `src/components/ui/DetailHeader.jsx` | Header with back button + actions |
| `Pagination.jsx` | `src/components/ui/Pagination.jsx` | Full pagination suite |
| `StatCard.jsx` | `src/views/dashboard/components/StatCard.jsx` | Metric card — exists but isolated to dashboard |

---

## Duplicated Inline Patterns (should use or create components)

### 1. Table Row Hover Effect — 5 files
Identical `onMouseEnter/Leave` handlers copied across:
- `DepartmentTableRow.jsx` lines 18–23
- `AdminTableRow.jsx` lines 20–25
- `UserRoleTableRow.jsx` lines 19–24
- `AutoReplyTableRow.jsx` lines 22–27
- `MacroTable.jsx` lines 75–80

**Recommended fix:** Create `<HoverTableRow>` component or a `useTableRowHover` hook.

---

### 2. Inline Badges — 6 files
Pattern: `px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700`
- `AgentDetailView.jsx` line 77
- `ProfileHeader.jsx` lines 38–50
- `DashboardHeader.jsx` lines 38–50
- `QueuesList.jsx` lines 15–16, 40–42
- `AutoReplyTableRow.jsx` line 57
- `MacroTable.jsx` line 110

**Recommended fix:** Create shared `<Badge>` component.

---

### 3. Icon Buttons — 4 files
Pattern: `p-1 rounded hover:text-[#6237A0] transition-colors` with inline hover background
- `DepartmentTableRow.jsx` lines 30–52
- `AdminTableRow.jsx` lines 45–81
- `AutoReplyTableRow.jsx` lines 34–43
- `MacroTable.jsx` lines 87–96

**Recommended fix:** Create shared `<IconButton>` component.

---

### 4. Form Inputs — 3 files
Pattern: `focus:outline-none focus:ring-2 focus:ring-[#6237A0]` with label + icon
- `AddAgentModal.jsx` lines 42–76
- `LoginForm.jsx` lines 30–74
- `DepartmentModal.jsx` lines 42–54

**Recommended fix:** Create shared `<FormInput>` component.

---

### 5. Custom Modal Overlays — 2 files (Modal.jsx already exists)
- `AddAgentModal.jsx` lines 29–30 — reimplements overlay/backdrop
- `MobileDepartmentFilter.jsx` lines 44–141 — reimplements slide-up modal

**Recommended fix:** Refactor to use existing `Modal.jsx`.

---

### 6. Stat Cards — AgentDetailView.jsx
- Lines 173–220 duplicate 4 stat card blocks inline
- `StatCard.jsx` already exists in `src/views/dashboard/components/` but is not shared

**Recommended fix:** Move `StatCard.jsx` to `src/components/ui/` and use it in `AgentDetailView.jsx`.

---

## New Components to Create

| Priority | Component | Replaces |
|---|---|---|
| High | `Badge.jsx` | Inline `px-2 py-1 rounded-full` badges |
| High | `IconButton.jsx` | Inline icon buttons with hover states |
| Medium | `HoverTableRow.jsx` or `useTableRowHover` | Repeated table row hover handlers |
| Medium | `FormInput.jsx` | Labeled inputs with icon + purple ring |

---

## Files with Highest Refactoring Impact

1. `src/views/agents/components/AgentDetailView.jsx` — badges, stat cards, info display
2. `src/views/dashboard/components/DashboardHeader.jsx` — role/department badges
3. `src/views/settings/components/AdminTableRow.jsx` — icon buttons
4. `src/views/queues/components/QueuesList.jsx` — inline badges
5. `src/views/settings/components/MacroTable.jsx` — hover rows + icon buttons
