# 📞 Incoming Call Handler - Testing Guide

## 🎯 Overview

The LENTE app now has a complete system for handling incoming calls from Android and displaying them in the React WebView. This document explains how to test it.

---

## 🏗️ Architecture

### Android Side (MainActivity.kt)
```kotlin
// When a call is detected, Android calls:
webView.evaluateJavascript(
    "window.handleIncomingCall('$incomingNumber')",
    null
)
```

### React Side (IncomingCallHandler.tsx)
```typescript
// The React app exposes a global function:
window.handleIncomingCall = (phoneNumber: string) => {
    // Show modal with caller info
    // Attempt WhatsApp lookup
    // Provide "Open WhatsApp" button
}
```

---

## 🧪 Testing Methods

### Method 1: Development Mode Testing Panel (Easiest)

When running in dev mode (`npm run dev`), you'll see a **Call Tester** panel in the bottom-right corner:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open the app** in your browser (http://localhost:5173)

3. **Use the Call Tester panel:**
   - Click one of the preset numbers (Italiano, USA, UK)
   - Or type a custom number in the input field
   - Click **"Simula Chiamata"**
   - The call notification modal will appear!

### Method 2: Browser Console (Manual Testing)

1. **Open the app** in your browser
2. **Open Developer Tools** (F12)
3. **Run this in the console:**
   ```javascript
   window.handleIncomingCall('+393471234567')
   ```
4. The call notification modal should appear immediately!

### Method 3: Real Android Device/Emulator

1. **Build the Android app:**
   ```bash
   npm run build:android
   ./gradlew assembleDebug
   ```

2. **Install on device/emulator:**
   ```bash
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Grant permissions:**
   - READ_PHONE_STATE
   - READ_CALL_LOG

4. **Make a real phone call** to the device

5. **Expected behavior:**
   - Toast appears: "CHIAMATA DA: +39..."
   - WebView modal appears with:
     - "CHIAMATA IN CORSO" header
     - Phone number displayed
     - "Apri WhatsApp" button
     - Dismiss button

---

## 📱 Expected Visual Result

When a call is detected, you should see:

```
┌─────────────────────────────────────┐
│  🟢 CHIAMATA IN CORSO               │
│                                     │
│     [Profile Photo or Icon]         │
│                                     │
│  Numero chiamante:                  │
│  +39 347 1234567                    │
│                                     │
│  ℹ️ WhatsApp Quick Access           │
│  Clicca per aprire la chat          │
│                                     │
│  [Apri WhatsApp] [X]                │
└─────────────────────────────────────┘
```

---

## 🔍 WhatsApp Integration

### Option A: WhatsApp Photo Lookup (Attempted)
The system **tries** to fetch the profile photo from WhatsApp Web, but:
- ⚠️ Requires user to be logged into WhatsApp Web
- ⚠️ CORS blocks direct access
- ⚠️ Only works in iframe (limited functionality)

**Result:** This usually fails gracefully and falls back to Option B.

### Option B: WhatsApp Quick Link (Fallback - Always Works)
- Shows a generic avatar/icon
- Provides a button to open `wa.me/{phoneNumber}`
- On Android WebView: Opens WhatsApp app directly
- On Desktop: Opens WhatsApp Web in browser

---

## 🐛 Troubleshooting

### "window.handleIncomingCall is not defined"
**Solution:** Make sure `IncomingCallHandler` component is mounted in `App.tsx`.

```typescript
// App.tsx should have:
<IncomingCallHandler />
```

### Modal doesn't appear
**Check:**
1. Browser console for errors
2. React DevTools - is `IncomingCallHandler` rendered?
3. Try calling from console: `window.handleIncomingCall('+39123')`

### Android Toast shows number but WebView doesn't
**Check:**
1. Is the React app loaded in the WebView?
2. Check `adb logcat | grep LENTE` for logs
3. Verify JavaScript is enabled in WebView:
   ```kotlin
   webView.settings.javaScriptEnabled = true
   ```

### WhatsApp button doesn't work
**This is expected if:**
- The number is not on WhatsApp
- The number is invalid
- WebView blocks `window.open()`

**Solution:** Test with a known WhatsApp number.

---

## 📝 Files Created

| File | Purpose |
|------|---------|
| `components/IncomingCallHandler.tsx` | Main logic, registers `window.handleIncomingCall()` |
| `components/CallNotificationModal.tsx` | UI for the call notification modal |
| `components/CallTestingPanel.tsx` | Dev mode testing panel (bottom-right) |
| `App.tsx` | Updated to include IncomingCallHandler |
| `MainActivity.kt` | Updated to send caller ID to WebView |

---

## 🚀 Next Steps

1. **Test in dev mode** using the CallTestingPanel
2. **Build and test on Android** with real phone calls
3. **Customize the UI** (colors, layout, animations)
4. **Add local contacts database** to show names instead of just numbers
5. **Implement call history** to show recent calls

---

## 💡 Console Debugging

To check if the system is working:

```javascript
// Check if function exists
console.log(typeof window.handleIncomingCall); // Should be "function"

// Test with a number
window.handleIncomingCall('+393471234567');

// Check React state (in browser DevTools)
// Look for IncomingCallHandler component in React DevTools
```

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check `adb logcat` for Android errors
3. Verify all permissions are granted
4. Make sure JavaScript is enabled in WebView

**Happy Testing! 🎉**
