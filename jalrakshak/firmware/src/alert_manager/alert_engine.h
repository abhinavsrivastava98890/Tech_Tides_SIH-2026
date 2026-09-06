// ============================================================
// Jalrakshak — alert_manager/alert_engine.h
// Central alert severity engine with cooldown and deduplication.
// ============================================================
#pragma once
#include <Arduino.h>
#include "../fault_manager/fault_manager.h"

enum class AlertSeverity {
    NORMAL,    // No action
    WARNING,   // Display + LED
    HIGH,      // Display + LED + Speaker + App
    CRITICAL   // All channels: Display + LED + Speaker + SMS + Voice call + App
};

struct Alert {
    String        alertId;
    unsigned long timestamp;
    AlertSeverity severity;
    FaultCode     eventType;
    String        message;
    bool          acknowledged;
    bool          resolved;
};

void          AlertEngine_Init();
// Raise an alert if not in cooldown for this fault type
void          AlertEngine_Raise(FaultCode fault, AlertSeverity severity, const String& message);
// Resolve alert for a given fault type
void          AlertEngine_Resolve(FaultCode fault);
// Update — processes cooldowns and dispatches to channels
void          AlertEngine_Update();
// Get last raised alert (for display/telemetry)
Alert         AlertEngine_GetLastAlert();
bool          AlertEngine_HasUnresolved();
// Convert severity to string
String        AlertEngine_SeverityToString(AlertSeverity severity);
