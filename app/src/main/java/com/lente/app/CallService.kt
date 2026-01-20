package com.lente.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import android.telephony.PhoneStateListener
import android.telephony.TelephonyManager

class CallService : Service() {
    companion object {
        @Volatile
        var isRunning: Boolean = false
    }
    private val channelId = "lente_call_service_channel"
    private val notificationId = 1001

    private var telephonyManager: TelephonyManager? = null
    private var phoneStateListener: PhoneStateListener? = null
    private var outgoingReceiver: OutgoingCallReceiver? = null

    override fun onCreate() {
        super.onCreate()

        createNotificationChannel()
        val notification = buildPersistentNotification()
        startForeground(notificationId, notification)

        isRunning = true

        // Register dynamic receivers/listeners to keep monitoring even if app is backgrounded
        registerOutgoingCallReceiver()
        registerPhoneStateListener()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Keep service running; restart if killed
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        // Unregister listeners/receivers
        try {
            outgoingReceiver?.let { unregisterReceiver(it) }
        } catch (e: Exception) {
            // ignore
        }

        telephonyManager?.let { manager ->
            phoneStateListener?.let { listener ->
                manager.listen(listener, PhoneStateListener.LISTEN_NONE)
            }
        }

        phoneStateListener = null
        outgoingReceiver = null
        telephonyManager = null

        isRunning = false
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Lente Call Monitoring"
            val descriptionText = "Foreground monitoring to ensure call handling"
            val importance = NotificationManager.IMPORTANCE_LOW
            val channel = NotificationChannel(channelId, name, importance).apply {
                description = descriptionText
            }
            val notificationManager: NotificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun buildPersistentNotification(): Notification {
        val launchIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0
        )

        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("LENTE is active")
            .setContentText("Monitoring calls to prevent silent death")
            .setSmallIcon(android.R.drawable.stat_sys_phone_call)
            .setOngoing(true)
            .setContentIntent(pendingIntent)
            .build()
    }

    private fun registerOutgoingCallReceiver() {
        outgoingReceiver = OutgoingCallReceiver()
        val filter = IntentFilter(Intent.ACTION_NEW_OUTGOING_CALL)
        // Register dynamically so it remains active while service runs
        registerReceiver(outgoingReceiver, filter)
    }

    private fun registerPhoneStateListener() {
        telephonyManager = getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        phoneStateListener = object : PhoneStateListener() {
            override fun onCallStateChanged(state: Int, phoneNumber: String?) {
                super.onCallStateChanged(state, phoneNumber)
                when (state) {
                    TelephonyManager.CALL_STATE_RINGING -> {
                        // Relay incoming number to UI if available and bring app to foreground
                        val uiIntent = Intent(this@CallService, MainActivity::class.java).apply {
                            flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                                    Intent.FLAG_ACTIVITY_REORDER_TO_FRONT or
                                    Intent.FLAG_ACTIVITY_SINGLE_TOP or
                                    Intent.FLAG_ACTIVITY_CLEAR_TOP
                            if (!phoneNumber.isNullOrEmpty()) {
                                putExtra("EXTRA_INCOMING_NUMBER", phoneNumber)
                            }
                        }
                        startActivity(uiIntent)
                    }
                }
            }
        }
        telephonyManager?.listen(phoneStateListener, PhoneStateListener.LISTEN_CALL_STATE)
    }
}
