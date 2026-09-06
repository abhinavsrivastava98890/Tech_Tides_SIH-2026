// ============================================================
// Jalrakshak — fault_manager.h
// ============================================================
#pragma once
#include <Arduino.h>

enum class FaultCode {
    NONE = 0,
    SENSOR_COMM_FAIL,
    WATER_QUALITY_WARNING,
    WATER_QUALITY_CRITICAL,
    WIFI_DISCONNECTED,
    BACKEND_UNREACHABLE,
    SYSTEM_INTERNAL_ERROR
};

void FaultManager_Init();
void FaultManager_Raise(FaultCode code);
void FaultManager_Clear(FaultCode code);
bool FaultManager_IsFaultActive(FaultCode code);
FaultCode FaultManager_GetMostSevereActive();
String FaultManager_GetDescription(FaultCode code);
