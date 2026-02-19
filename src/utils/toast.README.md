# Toast Notification Utility

A reusable toast notification utility that wraps react-toastify with consistent styling and easy-to-use methods.

## Features

- Simple, consistent API across the application
- Pre-configured with sensible defaults
- Support for success, error, warning, info, and loading states
- Promise-based notifications for async operations
- Dark mode support (automatic via react-toastify)
- Customizable options per notification
- TypeScript-friendly

## Installation

The utility is already set up. Just import and use:

```javascript
import toast from '../../utils/toast';
// or
import { showSuccess, showError } from '../../utils/toast';
```

## Basic Usage

### Success Notification

```javascript
import toast from '../../utils/toast';

// Simple success message
toast.success("Department created successfully!");

// With custom duration
toast.success("Changes saved!", { autoClose: 2000 });
```

### Error Notification

```javascript
// Simple error message
toast.error("Failed to delete item");

// With custom options
toast.error("Network error occurred", { 
  autoClose: 5000,
  position: "bottom-center"
});
```

### Warning Notification

```javascript
toast.warning("This action cannot be undone");
```

### Info Notification

```javascript
toast.info("New updates available");
```

## Advanced Usage

### Loading State

```javascript
// Show loading toast
const toastId = toast.loading("Saving changes...");

// Later, update it to success
toast.update(toastId, {
  render: "Changes saved successfully!",
  type: "success",
  isLoading: false,
  autoClose: 3000
});

// Or update to error
toast.update(toastId, {
  render: "Failed to save changes",
  type: "error",
  isLoading: false,
  autoClose: 3000
});
```

### Promise-Based Notifications

Perfect for async operations:

```javascript
const saveData = async () => {
  const promise = api.saveData(data);
  
  toast.promise(promise, {
    pending: "Saving data...",
    success: "Data saved successfully!",
    error: "Failed to save data"
  });
  
  return promise;
};
```

### Dismiss Notifications

```javascript
// Dismiss a specific toast
const toastId = toast.success("Message");
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismissAll();
```

## Real-World Examples

### Example 1: CRUD Operations

```javascript
import toast from '../../utils/toast';

// Create
const handleCreate = async () => {
  try {
    await createDepartment(name);
    toast.success("Department created successfully!");
  } catch (error) {
    toast.error("Failed to create department");
  }
};

// Update
const handleUpdate = async () => {
  const toastId = toast.loading("Updating...");
  
  try {
    await updateDepartment(id, data);
    toast.update(toastId, {
      render: "Department updated!",
      type: "success",
      isLoading: false,
      autoClose: 3000
    });
  } catch (error) {
    toast.update(toastId, {
      render: "Update failed",
      type: "error",
      isLoading: false,
      autoClose: 3000
    });
  }
};

// Delete
const handleDelete = async () => {
  try {
    await deleteDepartment(id);
    toast.success("Department deleted");
  } catch (error) {
    toast.error("Failed to delete department");
  }
};
```

### Example 2: Form Validation

```javascript
const handleSubmit = async (formData) => {
  // Validation
  if (!formData.name.trim()) {
    toast.warning("Please enter a name");
    return;
  }
  
  if (formData.name.length < 3) {
    toast.warning("Name must be at least 3 characters");
    return;
  }
  
  // Submit
  try {
    await submitForm(formData);
    toast.success("Form submitted successfully!");
  } catch (error) {
    toast.error(error.message || "Submission failed");
  }
};
```

### Example 3: Permission Checks

```javascript
const handleAction = () => {
  if (!hasPermission) {
    toast.error("You don't have permission to perform this action");
    return;
  }
  
  // Proceed with action
  performAction();
};
```

### Example 4: Network Operations

```javascript
const fetchData = async () => {
  const promise = api.getData();
  
  toast.promise(promise, {
    pending: "Loading data...",
    success: "Data loaded successfully!",
    error: {
      render({ data }) {
        // Access error data
        return data?.message || "Failed to load data";
      }
    }
  });
  
  return promise;
};
```

### Example 5: Bulk Operations

```javascript
const handleBulkDelete = async (ids) => {
  const toastId = toast.loading(`Deleting ${ids.length} items...`);
  
  try {
    await Promise.all(ids.map(id => deleteItem(id)));
    
    toast.update(toastId, {
      render: `Successfully deleted ${ids.length} items`,
      type: "success",
      isLoading: false,
      autoClose: 3000
    });
  } catch (error) {
    toast.update(toastId, {
      render: "Some items failed to delete",
      type: "error",
      isLoading: false,
      autoClose: 4000
    });
  }
};
```

## Configuration Options

All toast methods accept an optional `options` object:

```javascript
{
  position: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left",
  autoClose: 3000, // milliseconds, or false to disable
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light" | "dark" | "colored",
  transition: Bounce | Slide | Zoom | Flip,
}
```

### Custom Position

```javascript
toast.success("Message", { position: "bottom-center" });
```

### Disable Auto Close

```javascript
toast.info("Important message", { autoClose: false });
```

### Custom Duration

```javascript
toast.success("Quick message", { autoClose: 1000 });
toast.error("Important error", { autoClose: 10000 });
```

## Migration from Direct react-toastify

### Before

```javascript
import { toast } from 'react-toastify';

toast.success("Success message", {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});
```

### After

```javascript
import toast from '../../utils/toast';

toast.success("Success message");
// Defaults are already configured!
```

## Best Practices

1. **Use appropriate toast types**
   - `success` - For successful operations
   - `error` - For failures and errors
   - `warning` - For warnings and cautions
   - `info` - For informational messages
   - `loading` - For ongoing operations

2. **Keep messages concise**
   ```javascript
   // Good
   toast.success("Department created");
   
   // Too verbose
   toast.success("The department has been successfully created and saved to the database");
   ```

3. **Use promise-based toasts for async operations**
   ```javascript
   // Good - automatic state management
   toast.promise(saveData(), {
     pending: "Saving...",
     success: "Saved!",
     error: "Failed"
   });
   
   // Less ideal - manual state management
   const toastId = toast.loading("Saving...");
   try {
     await saveData();
     toast.update(toastId, { ... });
   } catch { ... }
   ```

4. **Provide context in error messages**
   ```javascript
   // Good
   toast.error("Failed to delete department");
   
   // Too generic
   toast.error("Error occurred");
   ```

5. **Don't spam toasts**
   ```javascript
   // Bad - creates multiple toasts
   items.forEach(item => {
     toast.success(`Deleted ${item.name}`);
   });
   
   // Good - single summary toast
   toast.success(`Deleted ${items.length} items`);
   ```

## Common Patterns

### Pattern 1: Try-Catch with Toast

```javascript
const handleAction = async () => {
  try {
    await performAction();
    toast.success("Action completed");
  } catch (error) {
    toast.error(error.message || "Action failed");
  }
};
```

### Pattern 2: Conditional Success Messages

```javascript
const handleSave = async (isEdit) => {
  try {
    await saveData();
    toast.success(isEdit ? "Updated successfully" : "Created successfully");
  } catch (error) {
    toast.error("Save failed");
  }
};
```

### Pattern 3: Multi-Step Operations

```javascript
const handleMultiStep = async () => {
  const toastId = toast.loading("Step 1: Validating...");
  
  try {
    await validate();
    toast.update(toastId, { render: "Step 2: Processing..." });
    
    await process();
    toast.update(toastId, { render: "Step 3: Saving..." });
    
    await save();
    toast.update(toastId, {
      render: "All steps completed!",
      type: "success",
      isLoading: false,
      autoClose: 3000
    });
  } catch (error) {
    toast.update(toastId, {
      render: `Failed: ${error.message}`,
      type: "error",
      isLoading: false,
      autoClose: 4000
    });
  }
};
```

## Styling

The toast notifications automatically adapt to your app's theme (light/dark mode) through react-toastify's built-in theme support.

To customize toast styles globally, modify the ToastContainer in your main App component:

```javascript
import { ToastContainer } from 'react-toastify';

<ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="dark" // or "light" or "colored"
/>
```

## API Reference

| Method | Parameters | Description |
|--------|------------|-------------|
| `toast.success(message, options)` | message: string, options?: object | Show success notification |
| `toast.error(message, options)` | message: string, options?: object | Show error notification |
| `toast.warning(message, options)` | message: string, options?: object | Show warning notification |
| `toast.info(message, options)` | message: string, options?: object | Show info notification |
| `toast.loading(message, options)` | message?: string, options?: object | Show loading notification, returns toast ID |
| `toast.update(toastId, config)` | toastId: string\|number, config: object | Update existing toast |
| `toast.dismiss(toastId)` | toastId?: string\|number | Dismiss specific toast |
| `toast.dismissAll()` | - | Dismiss all toasts |
| `toast.promise(promise, messages, options)` | promise: Promise, messages: object, options?: object | Promise-based notification |

## Troubleshooting

**Toast not showing?**
- Ensure ToastContainer is rendered in your App component
- Check that react-toastify CSS is imported

**Toast appears but no styling?**
- Import react-toastify CSS: `import 'react-toastify/dist/ReactToastify.css';`

**Toast doesn't auto-close?**
- Check if `autoClose: false` is set
- Verify autoClose duration is reasonable (> 0)

## Examples in Codebase

See these files for real-world usage:
- `web_servana/src/views/departments/DepartmentScreen.jsx`
- `web_servana/src/views/auto-replies/AutoRepliesScreen.jsx`
- `web_servana/src/views/agents/ManageAgentsScreen.jsx`
- `web_servana/src/hooks/useDepartments.js`
