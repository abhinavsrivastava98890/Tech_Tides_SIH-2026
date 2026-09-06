// ============================================================
// Jalrakshak — temperature_sensor.h
// Waterproof DS18B20 on OneWire bus.
// ============================================================
#pragma once
#include "sensor_types.h"

void          Temperature_Init();
// Non-blocking: call Temperature_RequestConversion(), wait
// at least 750ms, then call Temperature_Read().
void          Temperature_RequestConversion();
SensorReading Temperature_Read();
// Blocking convenience wrapper (use only during setup/self-test)
SensorReading Temperature_ReadBlocking();
