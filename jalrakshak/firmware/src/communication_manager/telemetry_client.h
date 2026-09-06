// ============================================================
// Jalrakshak — communication_manager/telemetry_client.h
// Handles HTTP POST requests to the backend for telemetry and alerts.
// ============================================================
#pragma once
#include <Arduino.h>
#include "../sensor_manager/sensor_types.h"
#include "../alert_manager/alert_engine.h"

void TelemetryClient_Init();

// Push periodic telemetry snapshot
bool TelemetryClient_PushTelemetry(
    float ph, float tds, float turbOut, float turbRaw,
    float flowIn, float flowOut, float temp,
    const String& currentState,
    bool pumpOn, bool uvOn
);

// Push an immediate alert
bool TelemetryClient_PushAlert(
    const String& alertId,
    FaultCode faultCode,
    AlertSeverity severity,
    const String& message
);
