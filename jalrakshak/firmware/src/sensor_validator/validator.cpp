// ============================================================
// Jalrakshak — sensor_validator/validator.cpp
// ============================================================
#include "validator.h"
#include "../config/thresholds.h"
#include <math.h>

SensorReading Validator_Check(
    SensorReading reading,
    float         minPlausible,
    float         maxPlausible,
    float         lastValue,
    float         maxDelta,
    uint8_t*      stuckHistory
) {
    // Step 1: If sensor already flagged COMM_FAIL, propagate as-is
    if (reading.status == SensorStatus::COMM_FAIL) {
        reading.isValid = false;
        return reading;
    }

    // Step 2: Plausible range check
    if (reading.value < minPlausible || reading.value > maxPlausible) {
        reading.isValid = false;
        reading.status  = SensorStatus::RANGE_ERROR;
        Serial.printf("[VALIDATOR] RANGE_ERROR on %s: %.2f (plausible: %.1f–%.1f)\n",
                      reading.sensor_id.c_str(), reading.value,
                      minPlausible, maxPlausible);
        if (stuckHistory) *stuckHistory = 0; // Reset stuck counter on error
        return reading;
    }

    // Step 3: Delta check (skip if maxDelta == 0)
    if (maxDelta > 0.0f) {
        float delta = fabsf(reading.value - lastValue);
        if (lastValue != 0.0f && delta > maxDelta) {
            reading.isValid = false;
            reading.status  = SensorStatus::DELTA_ERROR;
            Serial.printf("[VALIDATOR] DELTA_ERROR on %s: jumped %.2f in one cycle (max %.2f)\n",
                          reading.sensor_id.c_str(), delta, maxDelta);
            return reading;
        }
    }

    // Step 4: Stuck value check (skip if stuckHistory is nullptr)
    if (stuckHistory != nullptr) {
        if (fabsf(reading.value - lastValue) < 0.001f) {
            (*stuckHistory)++;
        } else {
            *stuckHistory = 0;
        }

        if (*stuckHistory >= SENSOR_STUCK_THRESHOLD) {
            reading.isValid = false;
            reading.status  = SensorStatus::STUCK;
            Serial.printf("[VALIDATOR] STUCK on %s: value=%.2f unchanged for %d cycles\n",
                          reading.sensor_id.c_str(), reading.value, *stuckHistory);
            return reading;
        }
    }

    // All checks passed
    reading.isValid = true;
    reading.status  = SensorStatus::OK;
    return reading;
}

// ── CONVENIENCE WRAPPERS ─────────────────────────────────────

SensorReading Validator_pH(SensorReading r, float lastPH, uint8_t* stuck) {
    return Validator_Check(r,
        SENSOR_PH_MIN_PLAUSIBLE, SENSOR_PH_MAX_PLAUSIBLE,
        lastPH, SENSOR_PH_MAX_DELTA_PER_CYCLE, stuck);
}

SensorReading Validator_TDS(SensorReading r, float lastTDS, uint8_t* stuck) {
    return Validator_Check(r,
        SENSOR_TDS_MIN_PPM_PLAUSIBLE, SENSOR_TDS_MAX_PPM_PLAUSIBLE,
        lastTDS, SENSOR_TDS_MAX_DELTA_PPM_PER_CYCLE, stuck);
}

SensorReading Validator_Turbidity(SensorReading r, float lastTurb, uint8_t* stuck) {
    return Validator_Check(r,
        SENSOR_TURB_MIN_NTU_PLAUSIBLE, SENSOR_TURB_MAX_NTU_PLAUSIBLE,
        lastTurb, SENSOR_TURB_MAX_DELTA_NTU_PER_CYCLE, stuck);
}

SensorReading Validator_Temp(SensorReading r, float lastTemp, uint8_t* stuck) {
    return Validator_Check(r,
        SENSOR_TEMP_MIN_C_PLAUSIBLE, SENSOR_TEMP_MAX_C_PLAUSIBLE,
        lastTemp, SENSOR_TEMP_MAX_DELTA_C_PER_CYCLE, stuck);
}

SensorReading Validator_Flow(SensorReading r, float lastFlow, uint8_t* stuck) {
    return Validator_Check(r,
        SENSOR_FLOW_MIN_LPM_PLAUSIBLE, SENSOR_FLOW_MAX_LPM_PLAUSIBLE,
        lastFlow, SENSOR_FLOW_MAX_DELTA_LPM_PER_CYCLE, stuck);
}
