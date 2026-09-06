// ============================================================
// Jalrakshak — wifi_manager.cpp
// Non-blocking Wi-Fi management.
// SSID and Password are read from NVS (Preferences) for security.
// ============================================================
#include "wifi_manager.h"
#include <Preferences.h>

static Preferences _prefs;
static String _ssid = "";
static String _pass = "";
static unsigned long _lastConnectAttemptMs = 0;
static const unsigned long RECONNECT_INTERVAL_MS = 10000;
static bool _wasConnected = false;

static void _loadCredentials() {
    _prefs.begin("jalrakshak", true);
    _ssid = _prefs.getString("wifi_ssid", "Abhinav");     // CHANGE THIS to your Mobile Hotspot Name
    _pass = _prefs.getString("wifi_pass", "abhinavv");   // CHANGE THIS to your Hotspot Password
    _prefs.end();
}

void WiFiManager_Init() {
    Serial.println("[WIFI] Initializing Wi-Fi manager...");
    _loadCredentials();
    
    if (_ssid.length() == 0) {
        Serial.println("[WIFI] WARNING: No SSID configured in NVS!");
        return;
    }

    WiFi.mode(WIFI_STA);
    WiFi.disconnect(true);
    delay(100);

    Serial.printf("[WIFI] Connecting to SSID: %s\n", _ssid.c_str());
    WiFi.begin(_ssid.c_str(), _pass.c_str());
    _lastConnectAttemptMs = millis();
}

void WiFiManager_Update() {
    if (_ssid.length() == 0) return;

    bool currentConnected = (WiFi.status() == WL_CONNECTED);

    // Handle connection state changes
    if (currentConnected && !_wasConnected) {
        Serial.printf("[WIFI] Connected! IP: %s\n", WiFi.localIP().toString().c_str());
        _wasConnected = true;
    } else if (!currentConnected && _wasConnected) {
        Serial.println("[WIFI] Connection lost! Will attempt to reconnect.");
        _wasConnected = false;
    }

    // Non-blocking reconnect loop
    if (!currentConnected) {
        unsigned long now = millis();
        if (now - _lastConnectAttemptMs >= RECONNECT_INTERVAL_MS) {
            Serial.println("[WIFI] Attempting reconnection...");
            WiFi.disconnect();
            WiFi.begin(_ssid.c_str(), _pass.c_str());
            _lastConnectAttemptMs = now;
        }
    }
}

bool WiFiManager_IsConnected() {
    return WiFi.status() == WL_CONNECTED;
}

String WiFiManager_GetIP() {
    if (WiFiManager_IsConnected()) {
        return WiFi.localIP().toString();
    }
    return "0.0.0.0";
}

String WiFiManager_GetSSID() {
    return _ssid;
}
