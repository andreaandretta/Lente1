# 📲 Outgoing Call Interceptor - "Click to Chat" Feature

## 🎯 Overview

LENTE now intercepts **outgoing calls** and suggests using WhatsApp instead! This is the perfect solution for users who want to message someone on WhatsApp without saving their number in contacts.

---

## 💡 The Problem We Solve

**User Pain Point:**
> "I want to message someone on WhatsApp, but I don't want to save their number in my contacts. How do I do this?"

**LENTE Solution:**
> Just dial the number and press "Call" - LENTE will pop up and ask: **"Do you want to write on WhatsApp instead?"**

---

## 🏗️ Architecture

### Flow Diagram:

```
User dials number on phone dialer
    ↓
User presses "Call" button
    ↓
📡 Android OutgoingCallReceiver detects NEW_OUTGOING_CALL
    ↓
🚀 LENTE app opens on top (MainActivity)
    ↓
📲 MainActivity sends number to WebView
    ↓
⚛️ React receives via window.handleOutgoingCall()
    ↓
🎨 Modal appears: "STAI CHIAMANDO..."
    ↓
💬 User clicks "Scrivi su WhatsApp"
    ↓
✅ Opens wa.me/{number} → WhatsApp app/web
```

---

## 🔧 Technical Implementation

### Android Side

#### 1. **OutgoingCallReceiver.kt**
```kotlin
class OutgoingCallReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_NEW_OUTGOING_CALL) {
            val phoneNumber = intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER)

            // Launch MainActivity with the outgoing number
            val launchIntent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
                putExtra("EXTRA_OUTGOING_NUMBER", phoneNumber)
            }
            context.startActivity(launchIntent)
        }
    }
}
```

#### 2. **AndroidManifest.xml**
```xml
<!-- Permission to intercept outgoing calls -->
<uses-permission android:name="android.permission.PROCESS_OUTGOING_CALLS" />

<!-- Receiver registration -->
<receiver android:name=".OutgoingCallReceiver" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.NEW_OUTGOING_CALL" />
    </intent-filter>
</receiver>
```

#### 3. **MainActivity.kt**
```kotlin
override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    handleIntent(intent)
}

private fun handleIntent(intent: Intent?) {
    intent?.getStringExtra("EXTRA_OUTGOING_NUMBER")?.let { outgoingNumber ->
        webView.post {
            webView.evaluateJavascript(
                "window.handleOutgoingCall('$outgoingNumber')",
                null
            )
        }
        Toast.makeText(this, "STAI CHIAMANDO: $outgoingNumber", Toast.LENGTH_SHORT).show()
    }
}
```

### React Side

#### 1. **IncomingCallHandler.tsx**
```typescript
// Global function for outgoing calls
window.handleOutgoingCall = (phoneNumber: string) => {
    console.log('[LENTE] Received OUTGOING call from Android:', phoneNumber);

    const callInfo: CallInfo = {
        phoneNumber: phoneNumber,
        timestamp: Date.now(),
        profilePhoto: null,
        callType: 'outgoing',  // 👈 Important!
    };

    setCurrentCall(callInfo);
    setIsModalVisible(true);
};
```

#### 2. **CallNotificationModal.tsx**
The modal adapts based on `callType`:

| Aspect | Incoming | Outgoing |
|--------|----------|----------|
| **Title** | "CHIAMATA IN CORSO" | "STAI CHIAMANDO..." |
| **Subtitle** | "Chiamata rilevata" | "Vuoi scrivere su WhatsApp invece?" |
| **Icon Color** | Green (🟢) | Blue (🔵) |
| **Button Text** | "Apri WhatsApp" | "Scrivi su WhatsApp" |
| **Message** | "Profilo trovato..." | "Evita la chiamata! Scrivi direttamente..." |

---

## 🧪 Testing

### Method 1: Development Testing Panel (Easiest)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open the app** in browser

3. **Use the Call Tester panel** (bottom-right corner):
   - Enter a phone number
   - Click **"Outgoing"** button (blue)
   - Modal appears: "STAI CHIAMANDO..."

4. **Test console commands:**
   ```javascript
   // Incoming call (green)
   window.handleIncomingCall('+393471234567')

   // Outgoing call (blue)
   window.handleOutgoingCall('+393471234567')
   ```

### Method 2: Real Android Device

1. **Build and install the app:**
   ```bash
   npm run build:android
   cd android
   ./gradlew assembleDebug
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

2. **Grant permissions:**
   - READ_PHONE_STATE
   - READ_CALL_LOG
   - PROCESS_OUTGOING_CALLS

3. **Test the flow:**
   - Open the **phone dialer** (system dialer, not LENTE)
   - Type a phone number (e.g., +393471234567)
   - Press the **green "Call" button**
   - **LENTE should open on top of the dialer**
   - Modal appears: "STAI CHIAMANDO..."
   - Click "Scrivi su WhatsApp"
   - WhatsApp opens with the number ready to chat!

---

## 📱 Expected User Experience

### Visual Result:

```
╔═══════════════════════════════════════╗
║   🔵 STAI CHIAMANDO...                ║
║   Vuoi scrivere su WhatsApp invece?   ║
║                                       ║
║        👤 [Generic Icon]              ║
║                                       ║
║   Numero che stai chiamando:          ║
║   +39 347 1234567                     ║
║                                       ║
║   💡 Suggerimento WhatsApp            ║
║   Evita la chiamata! Scrivi           ║
║   direttamente su WhatsApp senza      ║
║   salvare il numero in rubrica.       ║
║                                       ║
║   [💚 Scrivi su WhatsApp]    [❌]     ║
║                                       ║
║   ℹ️ OutgoingCallReceiver attivo      ║
╚═══════════════════════════════════════╝
```

### Click Flow:
1. User clicks **"Scrivi su WhatsApp"**
2. Opens `https://wa.me/393471234567`
3. On Android: WhatsApp app opens directly
4. On Desktop: WhatsApp Web opens in browser
5. User can start chatting **without saving the contact**

---

## 🎨 Visual Differences: Incoming vs Outgoing

| Feature | Incoming Call | Outgoing Call |
|---------|---------------|---------------|
| **Icon Color** | 🟢 Green | 🔵 Blue |
| **Title** | CHIAMATA IN CORSO | STAI CHIAMANDO... |
| **Subtitle** | Chiamata rilevata da Android | Vuoi scrivere su WhatsApp invece? |
| **Number Label** | Numero chiamante | Numero che stai chiamando |
| **WhatsApp Box** | "WhatsApp Quick Access" | "💡 Suggerimento WhatsApp" |
| **WhatsApp Message** | "Clicca per aprire..." | "Evita la chiamata! Scrivi..." |
| **Button Text** | Apri WhatsApp | Scrivi su WhatsApp |
| **Border Color** | Green | Blue |

---

## ⚠️ Important Notes

### Permissions
The `PROCESS_OUTGOING_CALLS` permission:
- **Deprecated in Android 10 (API 29+)** but still works
- For Android 10+, use `android.permission.CALL_LOG` as an alternative
- LENTE requests both permissions for maximum compatibility

### Call Not Blocked
- The system call **is NOT blocked** or canceled
- LENTE just opens on top of the dialer
- User can still proceed with the call if they dismiss the modal
- This is intentional - we suggest WhatsApp, but don't force it

### Battery & Performance
- The receiver is lightweight and battery-friendly
- Only activates when user initiates a call
- No background polling or listening

---

## 🚀 Business Use Case

### Target Users:
1. **Business owners** who get many requests via phone but prefer WhatsApp
2. **Customer service reps** who want to avoid traditional phone calls
3. **Anyone** who wants to message unknown numbers on WhatsApp without saving them

### Competitive Advantage:
Apps like **"Click to Chat"** have **10M+ downloads** on Play Store with this exact feature. LENTE now has:
- ✅ Incoming call detection (see who's calling)
- ✅ Outgoing call interception (suggest WhatsApp)
- ✅ Beautiful UI with animations
- ✅ Seamless WhatsApp integration

---

## 🐛 Troubleshooting

### Modal doesn't appear when dialing
**Check:**
1. Is PROCESS_OUTGOING_CALLS permission granted?
2. Is OutgoingCallReceiver registered in AndroidManifest.xml?
3. Check logcat: `adb logcat | grep LENTE`

### WhatsApp doesn't open
**Check:**
1. Is WhatsApp installed on the device?
2. Is the number format correct? (should include country code: +39...)
3. Try opening wa.me/{number} in browser manually

### Permission denied
**Solution:**
- Go to Settings → Apps → LENTE → Permissions
- Manually grant "Phone" and "Call Logs" permissions

---

## 📊 Files Modified/Created

| File | Type | Purpose |
|------|------|---------|
| `app/src/main/java/com/lente/app/OutgoingCallReceiver.kt` | New | Intercepts outgoing calls |
| `app/src/main/AndroidManifest.xml` | Modified | Added permission + receiver |
| `app/src/main/java/com/lente/app/MainActivity.kt` | Modified | Handles outgoing number intent |
| `components/IncomingCallHandler.tsx` | Modified | Added `handleOutgoingCall()` |
| `components/CallNotificationModal.tsx` | Modified | Dynamic UI based on call type |
| `components/CallTestingPanel.tsx` | Modified | Added "Outgoing" test button |

---

## 🎉 Summary

**Before:**
- ❌ User had to save unknown numbers to contact them on WhatsApp
- ❌ No quick way to switch from call to message

**After:**
- ✅ User dials number → LENTE suggests WhatsApp
- ✅ One click opens WhatsApp chat
- ✅ No need to save contact
- ✅ Beautiful, intuitive UI

**This is the killer feature that makes LENTE a must-have app!** 🚀
