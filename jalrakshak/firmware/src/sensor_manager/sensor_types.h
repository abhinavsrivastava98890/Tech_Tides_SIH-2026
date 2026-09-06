// ============================================================
// Jalrakshak — Smart Water Purification System
// sensor_manager/sensor_types.h
// ============================================================
#pragma once
#include <Arduino.h>

// ── SENSOR STATUS CODES ──────────────────────────────────────
enum class SensorStatus {
    OK,             // Reading is valid and within expected range
    COMM_FAIL,      // Sensor did not respond (no ACK, timeout)
    RANGE_ERROR,    // Value outside physically plausible range
    DELTA_ERROR,    // Value jumped impossibly fast between readings
    STUCK,          // Value has been identical for too many cycles
    NOT_INITIALIZED // Sensor has not been initialized yet
};

// ── WATER QUALITY CLASSIFICATION ─────────────────────────────
enum class QualityLevel {
    NORMAL,
    WARNING,
    HIGH,
    CRITICAL
};

// ── PRIMARY SENSOR READING STRUCT ────────────────────────────
struct SensorReading {
    float        value;        // The measured value
    String       unit;         // e.g. "NTU", "ppm", "°C"
    String       sensor_id;    // Unique sensor identifier string
    unsigned long timestamp;   // millis() at time of reading
    bool         isValid;      // True only if all validation checks passed
    SensorStatus status;       // Detailed status code

    // Constructor — defaults to invalid
    SensorReading()
        : value(0.0f), unit(""), sensor_id(""),
          timestamp(0), isValid(false),
          status(SensorStatus::NOT_INITIALIZED) {}
};

// ── WATER SNAPSHOT ───────────────────────────────────────
// A complete timestamped measurement of water.
struct WaterSnapshot {
    unsigned long timestamp;
    SensorReading tds;
    SensorReading turbidity;
    SensorReading temperature;
};

