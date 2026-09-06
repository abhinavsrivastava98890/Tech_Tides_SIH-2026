// ============================================================
// Jalrakshak — fault_manager.cpp
// ============================================================
#include "fault_manager.h"
#include <Arduino.h>

static bool _activeFaults[10]; 

void FaultManager_Init() {
    for (int i = 0; i < 10; i++) {
        _activeFaults[i] = false;
    }
    Serial.println("[FAULT] Fault manager initialized.");
}

void FaultManager_Raise(FaultCode code) {
    if (code == FaultCode::NONE) return;
    _activeFaults[(int)code] = true;
}

void FaultManager_Clear(FaultCode code) {
    if (code == FaultCode::NONE) return;
    _activeFaults[(int)code] = false;
}

bool FaultManager_IsFaultActive(FaultCode code) {
    if (code == FaultCode::NONE) return false;
    return _activeFaults[(int)code];
}

FaultCode FaultManager_GetMostSevereActive() {
    if (_activeFaults[(int)FaultCode::SYSTEM_INTERNAL_ERROR]) return FaultCode::SYSTEM_INTERNAL_ERROR;
    if (_activeFaults[(int)FaultCode::WATER_QUALITY_CRITICAL]) return FaultCode::WATER_QUALITY_CRITICAL;
    if (_activeFaults[(int)FaultCode::SENSOR_COMM_FAIL]) return FaultCode::SENSOR_COMM_FAIL;
    if (_activeFaults[(int)FaultCode::WATER_QUALITY_WARNING]) return FaultCode::WATER_QUALITY_WARNING;
    if (_activeFaults[(int)FaultCode::BACKEND_UNREACHABLE]) return FaultCode::BACKEND_UNREACHABLE;
    if (_activeFaults[(int)FaultCode::WIFI_DISCONNECTED]) return FaultCode::WIFI_DISCONNECTED;
    return FaultCode::NONE;
}

String FaultManager_GetDescription(FaultCode code) {
    switch (code) {
        case FaultCode::NONE: return "No Fault";
        case FaultCode::SENSOR_COMM_FAIL: return "Sensor Communication Failure";
        case FaultCode::WATER_QUALITY_WARNING: return "Water Quality Warning";
        case FaultCode::WATER_QUALITY_CRITICAL: return "Water Quality Critical";
        case FaultCode::WIFI_DISCONNECTED: return "Wi-Fi Disconnected";
        case FaultCode::BACKEND_UNREACHABLE: return "Backend Server Unreachable";
        case FaultCode::SYSTEM_INTERNAL_ERROR: return "Internal System Error";
        default: return "Unknown Fault";
    }
}
