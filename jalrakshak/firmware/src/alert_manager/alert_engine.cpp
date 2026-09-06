// ============================================================
// Jalrakshak — alert_manager/alert_engine.cpp
// Dispatches alerts to the correct channels based on severity.
// ============================================================
#include "alert_engine.h"
#include "led_alert.h"
#include "buzzer_alert.h"
#include "../communication_manager/telemetry_client.h"
#include "../config/settings.h"

static const int MAX_ALERTS = 20;
static Alert         _alertBuffer[MAX_ALERTS];
static int           _alertCount      = 0;
static Alert         _lastAlert;
static bool          _hasUnresolved   = false;

struct CooldownEntry {
    FaultCode     fault;
    unsigned long lastAlertMs;
};
static CooldownEntry _cooldowns[MAX_ALERTS];
static int           _cooldownCount = 0;

static bool _isInCooldown(FaultCode fault) {
    for (int i = 0; i < _cooldownCount; i++) {
        if (_cooldowns[i].fault == fault) {
            return (millis() - _cooldowns[i].lastAlertMs) < ALERT_COOLDOWN_MS;
        }
    }
    return false;
}

static void _updateCooldown(FaultCode fault) {
    for (int i = 0; i < _cooldownCount; i++) {
        if (_cooldowns[i].fault == fault) {
            _cooldowns[i].lastAlertMs = millis();
            return;
        }
    }
    if (_cooldownCount < MAX_ALERTS) {
        _cooldowns[_cooldownCount++] = { fault, millis() };
    }
}

static String _generateAlertId() {
    return "ALT-" + String(millis());
}

void AlertEngine_Init() {
    _alertCount    = 0;
    _cooldownCount = 0;
    _hasUnresolved = false;
    Serial.println("[ALERT] Alert engine initialized.");
}

void AlertEngine_Raise(FaultCode fault, AlertSeverity severity, const String& message) {
    if (severity == AlertSeverity::NORMAL) return;
    if (_isInCooldown(fault)) {
        Serial.printf("[ALERT] Suppressed (cooldown): %s\n", message.c_str());
        return;
    }

    _updateCooldown(fault);

    Alert alert;
    alert.alertId     = _generateAlertId();
    alert.timestamp   = millis();
    alert.severity    = severity;
    alert.eventType   = fault;
    alert.message     = message;
    alert.acknowledged = false;
    alert.resolved     = false;

    _alertBuffer[_alertCount % MAX_ALERTS] = alert;
    _alertCount++;
    _lastAlert    = alert;
    _hasUnresolved = true;

    Serial.printf("[ALERT] %s — %s: %s\n",
                  AlertEngine_SeverityToString(severity).c_str(),
                  FaultManager_GetDescription(fault).c_str(),
                  message.c_str());

    // ── DISPATCH TO CHANNELS BASED ON SEVERITY ────────────────
    if (severity >= AlertSeverity::WARNING) {
        LED_SetSeverity(severity);
        Buzzer_SetAlertLevel((severity == AlertSeverity::CRITICAL) ? 2 : 1);
    }
    
    // Push alert to backend
    TelemetryClient_PushAlert(alert.alertId, fault, severity, message);
}

void AlertEngine_Resolve(FaultCode fault) {
    for (int i = 0; i < min(_alertCount, MAX_ALERTS); i++) {
        if (_alertBuffer[i].eventType == fault && !_alertBuffer[i].resolved) {
            _alertBuffer[i].resolved = true;
        }
    }
    _hasUnresolved = false;
    for (int i = 0; i < min(_alertCount, MAX_ALERTS); i++) {
        if (!_alertBuffer[i].resolved) { _hasUnresolved = true; break; }
    }
    
    if (!_hasUnresolved) {
        Buzzer_SetAlertLevel(0); // Turn off buzzer if all resolved
    }
}


void AlertEngine_Update() {
    // Currently, dispatch is synchronous in Raise().
    // This function can be extended for queued/async dispatch.
}

Alert AlertEngine_GetLastAlert() { return _lastAlert; }
bool  AlertEngine_HasUnresolved() { return _hasUnresolved; }

String AlertEngine_SeverityToString(AlertSeverity severity) {
    switch (severity) {
        case AlertSeverity::NORMAL:   return "NORMAL";
        case AlertSeverity::WARNING:  return "WARNING";
        case AlertSeverity::HIGH:     return "HIGH";
        case AlertSeverity::CRITICAL: return "CRITICAL";
        default:                      return "UNKNOWN";
    }
}
