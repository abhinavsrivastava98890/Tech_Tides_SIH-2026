// ============================================================
// Jalrakshak — telemetry_client.cpp
// Sends JSON data to the backend via HTTP POST.
// ============================================================
#include "telemetry_client.h"
#include "wifi_manager.h"
#include "../config/settings.h"
#include <HTTPClient.h>
#include <Preferences.h>

static Preferences _prefs;
static String _backendUrl = "";

void TelemetryClient_Init() {
    _prefs.begin("jalrakshak", true);
    // CHANGE THIS: Replace 192.168.x.x with your laptop's IPv4 Address
    _backendUrl = _prefs.getString("backend_url", "http://10.204.62.230:5000/api");
    _prefs.end();
    Serial.printf("[TELEMETRY] Initialized. Backend URL: %s\n", _backendUrl.c_str());
}

static bool _postJSON(const String& endpoint, const String& jsonPayload) {
    if (!WiFiManager_IsConnected()) {
        Serial.println("[TELEMETRY] Cannot send data - WiFi not connected.");
        return false;
    }

    HTTPClient http;
    String fullUrl = _backendUrl + endpoint;
    
    http.begin(fullUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Simple basic auth or API key could be added here in headers
    http.addHeader("x-device-id", DEVICE_ID);

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
        // Successful request (or at least server responded)
        if (httpResponseCode >= 200 && httpResponseCode < 300) {
            Serial.printf("[TELEMETRY] POST %s -> Success (%d)\n", endpoint.c_str(), httpResponseCode);
            http.end();
            return true;
        } else {
            Serial.printf("[TELEMETRY] POST %s -> Failed (HTTP %d): %s\n", 
                          endpoint.c_str(), httpResponseCode, http.getString().c_str());
        }
    } else {
        Serial.printf("[TELEMETRY] POST %s -> Error: %s\n", endpoint.c_str(), http.errorToString(httpResponseCode).c_str());
    }

    http.end();
    return false;
}

bool TelemetryClient_PushTelemetry(
    float ph, float tds, float turbOut, float turbRaw,
    float flowIn, float flowOut, float temp,
    const String& currentState,
    bool pumpOn, bool uvOn
) {
    // Manually construct JSON to avoid heavy ArduinoJson library if memory is tight
    // Or use ArduinoJson (recommended for larger payloads, but simple concat works here)
    String payload = "{";
    payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
    payload += "\"sensors\":{";
    payload += "\"ph\":" + String(ph >= 0 ? ph : -1.0) + ",";
    payload += "\"tds\":" + String(tds >= 0 ? tds : -1.0) + ",";
    payload += "\"turbidityOut\":" + String(turbOut >= 0 ? turbOut : -1.0) + ",";
    payload += "\"turbidityRaw\":" + String(turbRaw >= 0 ? turbRaw : -1.0) + ",";
    payload += "\"flowIn\":" + String(flowIn >= 0 ? flowIn : -1.0) + ",";
    payload += "\"flowOut\":" + String(flowOut >= 0 ? flowOut : -1.0) + ",";
    payload += "\"temperature\":" + String(temp >= 0 ? temp : -1.0);
    payload += "},";
    payload += "\"actuators\":{";
    payload += "\"pumpOn\":" + String(pumpOn ? "true" : "false") + ",";
    payload += "\"uvOn\":" + String(uvOn ? "true" : "false");
    payload += "},";
    payload += "\"systemState\":\"" + currentState + "\"";
    payload += "}";

    return _postJSON("/telemetry", payload);
}

bool TelemetryClient_PushAlert(
    const String& alertId,
    FaultCode faultCode,
    AlertSeverity severity,
    const String& message
) {
    String payload = "{";
    payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
    payload += "\"alertId\":\"" + alertId + "\",";
    payload += "\"faultCode\":" + String((int)faultCode) + ",";
    payload += "\"faultName\":\"" + FaultManager_GetDescription(faultCode) + "\",";
    payload += "\"severity\":\"" + AlertEngine_SeverityToString(severity) + "\",";
    payload += "\"message\":\"" + message + "\"";
    payload += "}";

    return _postJSON("/alerts", payload);
}
