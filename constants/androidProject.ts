
import { AndroidFile } from '../types';

export const ANDROID_FILES: AndroidFile[] = [
  {
    name: "github-action-build.yml",
    path: ".github/workflows/android.yml",
    language: "json",
    content: `name: Android CI/CD - Build APK

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew

    - name: Build with Gradle
      run: ./gradlew assembleDebug

    - name: Upload APK
      uses: actions/upload-artifact@v4
      with:
        name: Lente-Debug-APK
        path: app/build/outputs/apk/debug/app-debug.apk`
  },
  {
    name: "settings.gradle.kts",
    path: "settings.gradle.kts",
    language: "groovy",
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "Lente"
include(":app")`
  },
  {
    name: "build.gradle.kts (Project)",
    path: "build.gradle.kts",
    language: "groovy",
    content: `plugins {
    id("com.android.application") version "8.2.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.20" apply false
}`
  },
  {
    name: "build.gradle.kts (App)",
    path: "app/build.gradle.kts",
    language: "groovy",
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.lente.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.lente.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.4"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation(platform("androidx.compose:compose-bom:2023.10.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation("androidx.work:work-runtime-ktx:2.9.0")
    implementation("org.jsoup:jsoup:1.17.2")
    implementation("io.coil-kt:coil-compose:2.5.0")
    implementation("com.google.accompanist:accompanist-permissions:0.32.0")
}`
  },
  {
    name: "AndroidManifest.xml",
    path: "app/src/main/AndroidManifest.xml",
    language: "xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Permessi necessari -->
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.READ_CALL_LOG" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.INTERNET" />

    <!-- Per Android 10+ -->
    <uses-permission android:name="android.permission.READ_PRECISE_PHONE_STATE"
        tools:ignore="ProtectedPermissions" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Lente"
        android:theme="@style/Theme.Material3.DayNight"
        android:usesCleartextTraffic="true"
        tools:targetApi="31">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.Material3.DayNight">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <receiver
            android:name=".CallReceiver"
            android:enabled="true"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.PHONE_STATE" />
            </intent-filter>
        </receiver>

    </application>
</manifest>`
  },
  {
    name: "MainActivity.kt",
    path: "app/src/main/java/com/lente/app/MainActivity.kt",
    language: "kotlin",
    content: `package com.lente.app

import android.Manifest
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.workDataOf
import com.google.accompanist.permissions.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    OnboardingScreen()
                }
            }
        }
    }

    @OptIn(ExperimentalPermissionsApi::class)
    @Composable
    fun OnboardingScreen() {
        val permissions = listOf(
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.READ_CALL_LOG,
            Manifest.permission.POST_NOTIFICATIONS
        )
        val state = rememberMultiplePermissionsState(permissions)

        Column(
            modifier = Modifier.fillMaxSize().padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text("🔍 LENTE", style = MaterialTheme.typography.displayLarge)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                "Scopri chi ti chiama tramite WhatsApp", 
                textAlign = TextAlign.Center,
                style = MaterialTheme.typography.bodyLarge
            )
            Spacer(modifier = Modifier.height(32.dp))
            
            if (state.allPermissionsGranted) {
                SuccessContent()
            } else {
                Button(onClick = { state.launchMultiplePermissionRequest() }) {
                    Text("Concedi Permessi")
                }
            }
        }
    }

    @Composable
    fun SuccessContent() {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "✅ Tutto pronto!",
                style = MaterialTheme.typography.headlineMedium,
                color = MaterialTheme.colorScheme.primary
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Lente è attivo. Alla prossima chiamata persa vedrai la foto profilo WhatsApp del chiamante.",
                textAlign = TextAlign.Center,
                style = MaterialTheme.typography.bodyMedium
            )

            Spacer(modifier = Modifier.height(32.dp))

            // PULSANTE DI TEST CORRETTO
            Button(
                onClick = {
                    val testNumber = "+393331234567" // Numero WhatsApp per il test
                    val workRequest = OneTimeWorkRequestBuilder<WhatsAppScraperWorker>()
                        .setInputData(workDataOf("phone_number" to testNumber))
                        .build()
                    WorkManager.getInstance(applicationContext).enqueue(workRequest)
                    
                    Toast.makeText(
                        applicationContext,
                        "Test avviato per \$testNumber",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            ) {
                Text("🧪 Test Scraping")
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = { finish() }
            ) {
                Text("Chiudi App")
            }
        }
    }
}`
  },
  {
    name: "CallReceiver.kt",
    path: "app/src/main/java/com/lente/app/CallReceiver.kt",
    language: "kotlin",
    content: `package com.lente.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.TelephonyManager
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.workDataOf

class CallReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        DebugHelper.showDebug(context, "Receiver triggered!")
        
        if (intent.action != TelephonyManager.ACTION_PHONE_STATE_CHANGED) return

        val state = intent.getStringExtra(TelephonyManager.EXTRA_STATE)
        val number = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER)

        // Intercetta quando il telefono torna IDLE (chiamata persa o terminata)
        if (state == TelephonyManager.EXTRA_STATE_IDLE && !number.isNullOrBlank()) {
            val workRequest = OneTimeWorkRequestBuilder<WhatsAppScraperWorker>()
                .setInputData(workDataOf("phone_number" to number))
                .build()
            WorkManager.getInstance(context).enqueue(workRequest)
        }
    }
}`
  },
  {
    name: "WhatsAppScraperWorker.kt",
    path: "app/src/main/java/com/lente/app/WhatsAppScraperWorker.kt",
    language: "kotlin",
    content: `package com.lente.app

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jsoup.Jsoup
import java.net.URL

class WhatsAppScraperWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    companion object {
        private const val TAG = "WhatsAppScraper"
    }

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        try {
            val phoneNumber = inputData.getString("phone_number") ?: return@withContext Result.failure()
            
            Log.d(TAG, "Scraping WhatsApp per: \$phoneNumber")

            val cleanNumber = phoneNumber.replace(Regex("[^0-9+]"), "")
            val waUrl = "https://wa.me/\$cleanNumber"
            
            val doc = Jsoup.connect(waUrl)
                .userAgent("Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36")
                .timeout(10000)
                .followRedirects(true)
                .get()

            // STRATEGIA DI FALLBACK PER ESTRARRE LA FOTO
            var imageUrl = ""
            var displayName = cleanNumber

            // Metodo 1: Open Graph meta tag
            imageUrl = doc.select("meta[property=og:image]").attr("content")
            displayName = doc.select("meta[property=og:title]").attr("content")
                .replace(" on WhatsApp", "")
                .replace(" su WhatsApp", "")

            // Metodo 2: Fallback se meta tag vuoti
            if (imageUrl.isBlank()) {
                imageUrl = doc.select("img.profile-pic, img[alt*=profile], img[alt*=foto]")
                    .attr("src")
                Log.d(TAG, "Fallback metodo 2: \$imageUrl")
            }

            // Metodo 3: Qualsiasi immagine valida
            if (imageUrl.isBlank()) {
                val allImages = doc.select("img[src]")
                for (img in allImages) {
                    val src = img.attr("abs:src")
                    if (src.contains("http") && !src.contains("icon") && !src.contains("logo")) {
                        imageUrl = src
                        break
                    }
                }
            }

            Log.d(TAG, "Trovato: \$displayName, Foto: \$imageUrl")

            val bitmap = if (imageUrl.isNotBlank()) downloadImage(imageUrl) else null

            NotificationHelper.showWhatsAppNotification(
                context = applicationContext,
                phoneNumber = cleanNumber,
                displayName = displayName.ifBlank { cleanNumber },
                profileImage = bitmap
            )

            Result.success()

        } catch (e: Exception) {
            Log.e(TAG, "Errore scraping completo", e)
            
            // Mostra comunque una notifica base
            val phoneNumber = inputData.getString("phone_number") ?: "Sconosciuto"
            NotificationHelper.showWhatsAppNotification(
                context = applicationContext,
                phoneNumber = phoneNumber,
                displayName = "Contatto WhatsApp",
                profileImage = null
            )
            
            Result.failure()
        }
    }

    private fun downloadImage(url: String): Bitmap? {
        return try {
            val connection = URL(url).openConnection()
            connection.setRequestProperty("User-Agent", "Mozilla/5.0")
            connection.connectTimeout = 8000
            connection.readTimeout = 8000
            val inputStream = connection.getInputStream()
            BitmapFactory.decodeStream(inputStream)
        } catch (e: Exception) {
            Log.e(TAG, "Errore download immagine", e)
            null
        }
    }
}`
  },
  {
    name: "DebugHelper.kt",
    path: "app/src/main/java/com/lente/app/DebugHelper.kt",
    language: "kotlin",
    content: `package com.lente.app

import android.content.Context
import android.util.Log
import android.widget.Toast

object DebugHelper {
    fun showDebug(context: Context, message: String) {
        Log.d("LENTE_DEBUG", message)
        Toast.makeText(context, message, Toast.LENGTH_LONG).show()
    }
}`
  },
  {
    name: "NotificationHelper.kt",
    path: "app/src/main/java/com/lente/app/NotificationHelper.kt",
    language: "kotlin",
    content: `package com.lente.app

import android.app.*
import android.content.*
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat

object NotificationHelper {
    private const val CHANNEL_ID = "lente_whatsapp_calls"

    fun showWhatsAppNotification(context: Context, phoneNumber: String, name: String, image: Bitmap?) {
        createChannel(context)
        
        val intent = Intent(Intent.ACTION_VIEW).apply { 
            data = Uri.parse("https://wa.me/\$phoneNumber") 
        }
        val pendingIntent = PendingIntent.getActivity(
            context, 0, intent, PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_menu_call)
            .setContentTitle("Chiamata persa (WhatsApp)")
            .setContentText(name)
            .setLargeIcon(image)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .addAction(android.R.drawable.ic_menu_send, "Apri Chat", pendingIntent)

        if (image != null) {
            builder.setStyle(NotificationCompat.BigPictureStyle().bigPicture(image))
        }

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(1001, builder.build())
    }

    private fun createChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID, "Chiamate Lente", NotificationManager.IMPORTANCE_HIGH
            )
            val manager = context.getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }
}`
  }
];
