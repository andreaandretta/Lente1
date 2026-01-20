package com.lente.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import android.widget.Toast

/**
 * OutgoingCallReceiver - Intercetta le chiamate in USCITA
 *
 * Quando l'utente compone un numero e preme "Chiama",
 * questo receiver si attiva e apre LENTE mostrando il numero.
 *
 * L'app chiederà: "Vuoi scrivere su WhatsApp invece?"
 */
class OutgoingCallReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Toast.makeText(context, "LENTE: Intercettazione partita!", Toast.LENGTH_LONG).show()
        if (intent.action == Intent.ACTION_NEW_OUTGOING_CALL) {
            // Estrai il numero dalla chiamata in uscita
            val phoneNumber = intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER)

            Log.d("LENTE", "Outgoing call detected: $phoneNumber")

            if (!phoneNumber.isNullOrEmpty()) {
                // Lancia MainActivity con il numero
                val launchIntent = Intent(context, MainActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
                    putExtra("EXTRA_OUTGOING_NUMBER", phoneNumber)
                }
                context.startActivity(launchIntent)
            }
        }
    }
}
