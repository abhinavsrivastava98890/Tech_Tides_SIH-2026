// ============================================================
// Jalrakshak — tds_sensor.h
// Interface for TDS/EC analog sensor.
// ============================================================
#pragma once
#include "sensor_types.h"

void          TDS_Init();
// Pass current water temperature for compensation (from DS18B20)
SensorReading TDS_Read(float temperatureC);
