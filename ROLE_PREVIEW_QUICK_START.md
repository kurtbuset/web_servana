# Role Preview Mode - Quick Start Guide

## What is Role Preview Mode?

Role Preview Mode lets you see exactly what users with a specific role can access in your application - just like Discord's "View Server As Role" feature!

## How to Use

### Step 1: Navigate to Roles
Go to **Roles & Permissions** from the sidebar

### Step 2: Find a Role
Browse the list of roles on the left side

### Step 3: Open Role Menu
Click the **three-dot menu (•••)** next to any role

### Step 4: Start Preview
Click **"View Server As Role"** from the dropdown menu

### Step 5: Explore
- A purple banner appears at the top showing you're in preview mode
- Navigate around the app to see what this role can access
- Features the role can't access will be hidden or disabled

### Step 6: Exit Preview
Click the **"Exit Preview"** button in the banner when you're done

## Visual Guide

```
┌─────────────────────────────────────────────────────┐
│  👁️ Preview Mode: Viewing as [Agent]  [Exit Preview] │ ← Banner
└─────────────────────────────────────────────────────┘

Roles & Permissions
├── Admin                    [•••] ← Click here
│   ├── View Server As Role  ← Then click this
│   └── Copy Role ID
├── Agent                    [•••]
└── Client                   [•••]
```

## Example Use Cases

### 1. Testing New Roles
Create a new role and preview it to ensure permissions are configured correctly

### 2. Troubleshooting Access Issues
User reports they can't see a feature? Preview their role to see what they see

### 3. Training & Documentation
Show team members what different roles can do without creating test accounts

### 4. Security Audits
Verify that sensitive features are properly restricted for certain roles

## Tips

- **Quick Copy**: Use "Copy Role ID" for API testing or debugging
- **Multiple Previews**: Exit and enter different roles to compare permissions
- **Real-Time**: Changes to role permissions take effect immediately in preview mode
- **Safe Testing**: Preview mode is read-only - you can't accidentally modify data

## Keyboard Shortcuts (Coming Soon)

- `Ctrl/Cmd + Shift + P` - Quick preview mode toggle
- `Esc` - Exit preview mode

## Need Help?

If you encounter issues:
1. Check that you have role management permissions
2. Refresh the page and try again
3. Check browser console for error messages
4. Contact your system administrator

---

**Note**: Preview mode only affects what you can see, not what you can actually do. Your actual permissions remain unchanged.
