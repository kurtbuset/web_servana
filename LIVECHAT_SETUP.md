# LiveChat Widget Setup & Troubleshooting

## ✅ Current Status

The LiveChat widget code has been properly added to `web_servana/index.html` with:
- License ID: `19540394`
- Integration: `manual_channels`
- Product: `livechat`

## 🔍 Why It Might Not Appear

### Most Common Reasons:

1. **License Not Active** (Most likely)
   - Your LiveChat account might be on trial/expired
   - License needs to be activated in LiveChat dashboard
   - Check: https://www.livechat.com/

2. **Browser Cache**
   - Old version of page is cached
   - Solution: Hard refresh (`Ctrl+Shift+R` or `Cmd+Shift+R`)

3. **Ad Blocker**
   - Extensions like uBlock Origin, AdBlock Plus block LiveChat
   - Solution: Disable temporarily or whitelist your domain

4. **Widget Hidden in Settings**
   - Widget visibility might be turned off in LiveChat dashboard
   - Check: LiveChat Dashboard → Settings → Chat Widget

## 🧪 Testing Steps

### Step 1: Test with Standalone Page
Navigate to: `http://localhost:5173/test-livechat.html`

This diagnostic page will:
- ✅ Check if LiveChat script loads
- ✅ Verify license configuration
- ✅ Test network connectivity
- ✅ Show detailed error messages

### Step 2: Check Browser Console
1. Open your app: `http://localhost:5173`
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Type: `window.LiveChatWidget`
   - Should show an object (not `undefined`)
5. Type: `window.__lc.license`
   - Should show: `19540394`

### Step 3: Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Refresh the page
3. Filter by: `livechat`
4. Look for: `tracking.js`
   - ✅ Status 200 = Good
   - ❌ Status 404/403 = Problem with license
   - ❌ Blocked = Ad blocker or firewall

### Step 4: Manually Open Widget
In browser console, try:
```javascript
window.LiveChatWidget.call('maximize');
```
If this opens the widget, it means it's loaded but hidden.

## 🔧 Quick Fixes

### Fix 1: Clear Cache & Hard Refresh
```bash
# Windows/Linux
Ctrl + Shift + R

# Mac
Cmd + Shift + R
```

### Fix 2: Disable Ad Blocker
- Temporarily disable all browser extensions
- Test in Incognito/Private mode

### Fix 3: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
# or
yarn dev
```

### Fix 4: Check LiveChat Account
1. Go to: https://www.livechat.com/
2. Log in to your account
3. Navigate to: **Settings** → **Installation**
4. Verify:
   - ✅ License is active
   - ✅ License number matches: `19540394`
   - ✅ Widget is set to "Visible"
   - ✅ No URL restrictions blocking localhost

## 📋 Verification Checklist

- [ ] LiveChat account is active (not trial expired)
- [ ] License `19540394` is correct and active
- [ ] Widget visibility is ON in LiveChat dashboard
- [ ] No ad blockers enabled
- [ ] Browser cache cleared
- [ ] Dev server restarted
- [ ] Tested in incognito mode
- [ ] Console shows no errors
- [ ] Network tab shows `tracking.js` loaded (Status 200)
- [ ] `window.LiveChatWidget` is defined

## 🎯 Expected Behavior

When working correctly, you should see:
1. A small chat bubble in the bottom-right corner
2. The bubble appears 2-3 seconds after page load
3. Clicking it opens the chat window
4. Console shows: `window.LiveChatWidget` as an object

## 🆘 Still Not Working?

### Option 1: Test with Different License
Try the official LiveChat demo license to verify the code works:
```javascript
window.__lc.license = 12345678; // Demo license
```

### Option 2: Contact LiveChat Support
- Email: support@livechat.com
- Live Chat: https://www.livechat.com/help/
- Provide:
  - Your license ID: `19540394`
  - Error messages from console
  - Screenshot of Network tab

### Option 3: Check Account Status
Common issues:
- Trial period expired
- Payment method declined
- Account suspended
- License transferred to different account

## 📁 Files Modified

- `web_servana/index.html` - Main HTML with LiveChat code
- `web_servana/public/test-livechat.html` - Diagnostic test page
- `web_servana/LIVECHAT_TROUBLESHOOTING.md` - Detailed troubleshooting
- `web_servana/LIVECHAT_SETUP.md` - This file

## 🔗 Useful Links

- LiveChat Dashboard: https://www.livechat.com/
- Installation Guide: https://www.livechat.com/help/install-livechat/
- API Documentation: https://developers.livechat.com/
- Status Page: https://status.livechat.com/

## 💡 Pro Tips

1. **Always test in incognito mode first** - Eliminates cache/extension issues
2. **Check the Network tab** - Shows exactly what's loading/failing
3. **Use the test page** - `test-livechat.html` provides detailed diagnostics
4. **Verify license in dashboard** - Most issues are account-related, not code-related
