// ============================================================
// Jalrakshak — sensor_validator/validator.h
// Validates SensorReading structs before they reach the
// decision engine. Catches range errors, comms failures,
// impossible delta jumps, and stuck/frozen sensor values.
// ============================================================
#pragma once
#include "../sensor_manager/sensor_types.h"

// Validate a reading against its expected plausible range.
// maxDelta: maximum allowed change from lastValue in one cycle.
//           Pass 0.0f to skip the delta check.
// stuckHistory: pointer to a counter tracking consecutive identical readings.
//               Pass nullptr to skip the stuck check.
SensorReading Validator_Check(
    SensorReading reading,
    float         minPlausible,
    float         maxPlausible,
    float         lastValue,
    float         maxDelta,
    uint8_t*      stuckHistory
);

// Convenience wrappers for each sensor type
SensorReading Validator_pH       (SensorReading r, float lastPH,   uint8_t* stuck);
SensorReading Validator_TDS      (SensorReading r, float lastTDS,  uint8_t* stuck);
SensorReading Validator_Turbidity(SensorReading r, float lastTurb, uint8_t* stuck);
SensorReading Validator_Temp     (SensorReading r, float lastTemp, uint8_t* stuck);
SensorReading Validator_Flow     (SensorReading r, float lastFlow, uint8_t* stuck);
