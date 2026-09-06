// ============================================================
// Jalrakshak — turbidity_sensor.h
// Interface for turbidity sensors (×2: raw input + output).
// ============================================================
#pragma once
#include "sensor_types.h"

void          Turbidity_Init();
SensorReading Turbidity_Read();
