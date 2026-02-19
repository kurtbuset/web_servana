# Avatar Component Migration Guide

This guide shows how to replace existing profile picture code with the new reusable Avatar/ProfilePicture components.

## Before & After Examples

### Example 1: Simple Profile Picture

**Before:**
```jsx
import { getProfilePictureUrl } from "../../utils/imageUtils";

<img
  src={getProfilePictureUrl(agent.profile_picture)}
  alt="Profile"
  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
/>
```

**After:**
```jsx
import { ProfilePicture } from "../../components/ui";

<ProfilePicture
  src={agent.profile_picture}
  alt="Profile"
  size="sm"
/>
```

---

### Example 2: Profile Picture with Status

**Before:**
```jsx
<div className="relative">
  <img
    src={getProfilePictureUrl(user.profile_picture)}
    alt={user.name}
    className="w-12 h-12 rounded-full object-cover border-2 border-[#6237A0]"
  />
  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
    user.is_active ? 'bg-green-500' : 'bg-gray-400'
  }`} style={{ borderColor: 'var(--card-bg)' }}></div>
</div>
```

**After:**
```jsx
<ProfilePicture
  src={user.profile_picture}
  alt={user.name}
  size="lg"
  showStatus
  isOnline={user.is_active}
  border
  borderColor="#6237A0"
/>
```

---

### Example 3: Large Profile Picture with Shadow

**Before:**
```jsx
<img
  src={getProfilePictureUrl(user.profile_picture)}
  alt="Profile"
  className="w-28 h-28 rounded-full object-cover ring-4 ring-white/30"
/>
```

**After:**
```jsx
<ProfilePicture
  src={user.profile_picture}
  alt="Profile"
  size="4xl"
  border
  borderColor="white"
  shadow
/>
```

---

### Example 4: Avatar with Initials Fallback

**Before:**
```jsx
<img
  src={user.profile_picture || "profile_picture/DefaultProfile.jpg"}
  alt={user.name}
  className="w-10 h-10 rounded-full object-cover"
/>
```

**After:**
```jsx
<Avatar
  src={user.profile_picture}
  name={user.full_name}
  alt={user.name}
  size="md"
/>
```

---

### Example 5: Avatar with Badge

**Before:**
```jsx
<div className="relative">
  <img
    src={getProfilePictureUrl(user.profile_picture)}
    alt={user.name}
    className="w-12 h-12 rounded-full object-cover"
  />
  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 min-w-[16px] flex items-center justify-center">
    {unreadCount}
  </div>
</div>
```

**After:**
```jsx
<Avatar
  src={user.profile_picture}
  name={user.full_name}
  size="lg"
  badge={unreadCount}
/>
```

---

### Example 6: Clickable Avatar with Hover

**Before:**
```jsx
<img
  src={getProfilePictureUrl(user.profile_picture)}
  alt={user.name}
  className="w-10 h-10 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform"
  onClick={() => viewProfile(user)}
/>
```

**After:**
```jsx
<Avatar
  src={user.profile_picture}
  name={user.full_name}
  size="md"
  hover
  onClick={() => viewProfile(user)}
/>
```

---

### Example 7: Square Avatar

**Before:**
```jsx
<img
  src={getProfilePictureUrl(user.profile_picture)}
  alt={user.name}
  className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-lg"
/>
```

**After:**
```jsx
<Avatar
  src={user.profile_picture}
  name={user.full_name}
  size="xl"
  shape="rounded"
  border
  shadow
/>
```

---

## Size Reference

| Size | Dimensions | Use Case |
|------|-----------|----------|
| xs   | 24px (6)  | Tiny icons, compact lists |
| sm   | 32px (8)  | Dense tables, small cards |
| md   | 40px (10) | Default size, most lists |
| lg   | 48px (12) | Prominent lists, cards |
| xl   | 64px (16) | Profile headers, modals |
| 2xl  | 80px (20) | Large profile displays |
| 3xl  | 96px (24) | Hero sections |
| 4xl  | 112px (28)| Full profile pages |

## Migration Checklist

- [ ] Replace `<img>` tags with `<ProfilePicture>` or `<Avatar>`
- [ ] Remove `getProfilePictureUrl` imports (handled automatically)
- [ ] Replace size classes with `size` prop
- [ ] Replace status indicator divs with `showStatus` and `isOnline` props
- [ ] Replace border classes with `border` and `borderColor` props
- [ ] Replace shadow classes with `shadow` prop
- [ ] Replace hover classes with `hover` prop
- [ ] Add `name` prop for Avatar initials fallback
- [ ] Test all profile pictures display correctly
- [ ] Verify status indicators work
- [ ] Check responsive behavior

## Benefits

✅ Consistent styling across the app
✅ Automatic image URL processing
✅ Built-in status indicators
✅ Initials fallback (Avatar)
✅ Badge support (Avatar)
✅ Less code to maintain
✅ Easier to update globally
✅ Better accessibility
