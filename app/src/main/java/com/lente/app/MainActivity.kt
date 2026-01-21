
package com.lente.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import android.Manifest
import android.content.pm.PackageManager
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import android.telephony.PhoneStateListener
import android.telephony.TelephonyManager
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.BroadcastReceiver
import android.os.Build
import android.view.WindowManager
import android.util.Log
import android.webkit.WebResourceRequest
import android.net.Uri
import android.content.ActivityNotFoundException

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private val PHONE_STATE_PERMISSION_REQUEST_CODE = 101
    private val NOTIFICATION_PERMISSION_REQUEST_CODE = 102

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Ensure activity shows over lock screen and turns screen on
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                setShowWhenLocked(true)
                setTurnScreenOn(true)
            } else {
                @Suppress("DEPRECATION")
                window.addFlags(
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                )
            }
        } catch (e: Exception) {
            Log.e("LENTE", "Wake failed", e)
        }

        webView = WebView(this)
        setContentView(webView)

        // Set global application context for JS bridge
        AppContextHolder.appContext = applicationContext

        webView.webViewClient = object : WebViewClient() {
                        override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                                            val url = request?.url?.toString() ?: return false
                                                            
                                                                            // Intercept external URLs (WhatsApp, tel:, mailto:, etc.)
                                                                                            if (url.startsWith("https://wa.me/") || 
                                                                                                                url.startsWith("whatsapp://") ||
                                                                                                                                    url.startsWith("tel:") ||
                                                                                                                                                        url.startsWith("mailto:")) {
                                                                                                                                                                                
                                                                                                                                                                                                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                                                                                                                                                                                                                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                try {
                                                                                                                                                                                                                                                                                            startActivity(intent)
                                                                                                                                                                                                                                                                } catch (e: ActivityNotFoundException) {
                                                                                                                                                                                                                                                                                            // WhatsApp not installed - fallback to browser
                                                                                                                                                                                                                                                                                                                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                    return true  // Prevent WebView from loading the URL
                                                                                                                                                        }
                                                                                                                                                                        
                                                                                                                                                                                        return false  // Let WebView load internal URLs
                        }
        }
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                }
                                                                                                                                                        })
                        }
        }
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            loadWithOverviewMode = true
            useWideViewPort = true
            setSupportZoom(false)
            cacheMode = WebSettings.LOAD_DEFAULT
        }

        // Expose JS bridge to control foreground service from UI
        webView.addJavascriptInterface(LenteBridge(), "LenteBridge")

        // Handle back button for WebView navigation
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })

        // Load the React app from assets
        webView.loadUrl("file:///android_asset/index.html")

        // Check and request permissions
        if (checkPermissions()) {
            setupCallListener()
        } else {
            requestPermissions()
        }

        // Request notification permission on Android 13+
        requestNotificationPermissionIfNeeded()

        // Check if app was launched from OutgoingCallReceiver
        handleIntent(intent)

        // Start foreground service to keep call monitoring alive
        val serviceIntent = Intent(this, CallService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleIntent(intent)
    }

    private fun handleIntent(intent: Intent?) {
        intent?.getStringExtra("EXTRA_OUTGOING_NUMBER")?.let { outgoingNumber ->
            // Send outgoing number to WebView
            webView.post {
                webView.evaluateJavascript(
                    "window.handleOutgoingCall('$outgoingNumber')",
                    null
                )
            }
            Toast.makeText(this, "STAI CHIAMANDO: $outgoingNumber", Toast.LENGTH_SHORT).show()
        }
        intent?.getStringExtra("EXTRA_INCOMING_NUMBER")?.let { incomingNumber ->
            // Send incoming number to WebView
            webView.post {
                webView.evaluateJavascript(
                    "window.handleIncomingCall('$incomingNumber')",
                    null
                )
            }
            Toast.makeText(this, "CHIAMATA DA: $incomingNumber", Toast.LENGTH_SHORT).show()
        }
    }

    private fun checkPermissions(): Boolean {
        val readPhoneState = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED
        val readCallLog = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_CALL_LOG) == PackageManager.PERMISSION_GRANTED
        return readPhoneState && readCallLog
    }

    private fun requestPermissions() {
        ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.READ_PHONE_STATE, Manifest.permission.READ_CALL_LOG, Manifest.permission.ANSWER_PHONE_CALLS), PHONE_STATE_PERMISSION_REQUEST_CODE)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when (requestCode) {
            PHONE_STATE_PERMISSION_REQUEST_CODE -> {
                if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
                    setupCallListener()
                } else {
                    Toast.makeText(this, "Permissions denied. App may not function correctly.", Toast.LENGTH_SHORT).show()
                }
                return
            }
            NOTIFICATION_PERMISSION_REQUEST_CODE -> {
                // No-op; if denied, foreground notifications may be limited on Android 13+
                return
            }
            else -> {
                // Ignore all other requests.
            }
        }
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= 33) {
            val hasPost = ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
            if (!hasPost) {
                ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.POST_NOTIFICATIONS), NOTIFICATION_PERMISSION_REQUEST_CODE)
            }
        }
    }

    private fun setupCallListener() {
        val telephonyManager = getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        val phoneStateListener = object : PhoneStateListener() {
            override fun onCallStateChanged(state: Int, phoneNumber: String?) {
                super.onCallStateChanged(state, phoneNumber)
                when (state) {
                    TelephonyManager.CALL_STATE_RINGING -> {
                        Toast.makeText(this@MainActivity, "LENTE: Squillo rilevato!", Toast.LENGTH_LONG).show()
                        // Check for READ_CALL_LOG permission (required on Android 9+)
                        val hasCallLogPermission = ContextCompat.checkSelfPermission(
                            this@MainActivity,
                            Manifest.permission.READ_CALL_LOG
                        ) == PackageManager.PERMISSION_GRANTED

                        if (hasCallLogPermission && !phoneNumber.isNullOrEmpty()) {
                            // Capture the incoming number
                            val incomingNumber = phoneNumber

                            // Send the number to the WebView
                            runOnUiThread {
                                webView.evaluateJavascript(
                                    "window.handleIncomingCall('$incomingNumber')",
                                    null
                                )
                            }

                            // Update Toast to show the number
                            Toast.makeText(
                                this@MainActivity,
                                "CHIAMATA DA: $incomingNumber",
                                Toast.LENGTH_SHORT
                            ).show()
                        } else {
                            // Fallback if permission is missing or number is null
                            Toast.makeText(
                                this@MainActivity,
                                "CHIAMATA RILEVATA!",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }
                }
            }
        }
        telephonyManager.listen(phoneStateListener, PhoneStateListener.LISTEN_CALL_STATE)
    }
}

// JavaScript interface for WebView to control the foreground service
class LenteBridge : Any() {
    @JavascriptInterface
    fun startCallService() {
        // Use application context to avoid leaking activity
        val ctx = AppContextHolder.appContext ?: return
        val intent = Intent(ctx, CallService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ctx.startForegroundService(intent)
        } else {
            ctx.startService(intent)
        }
    }

    @JavascriptInterface
    fun stopCallService() {
        val ctx = AppContextHolder.appContext ?: return
        val intent = Intent(ctx, CallService::class.java)
        ctx.stopService(intent)
    }

    @JavascriptInterface
    fun isServiceRunning(): Boolean {
        return CallService.isRunning
    }
}

// Helper to provide application context in JS bridge
object AppContextHolder {
    var appContext: Context? = null
}
