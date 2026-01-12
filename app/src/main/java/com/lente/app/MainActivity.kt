package com.lente.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
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

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private val PHONE_STATE_PERMISSION_REQUEST_CODE = 101

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        webView.webViewClient = WebViewClient()

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

        // Check if app was launched from OutgoingCallReceiver
        handleIntent(intent)
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
            else -> {
                // Ignore all other requests.
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
