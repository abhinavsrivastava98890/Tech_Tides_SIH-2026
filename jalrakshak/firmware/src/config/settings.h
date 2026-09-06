// ============================================================
// Jalrakshak — Smart Water Purification System
// config/settings.h — Timing, device identity, and runtime settings.
// ============================================================
#pragma once

// ── DEVICE IDENTITY ──────────────────────────────────────────
#define DEVICE_ID               "JR-UNIT-001"
#define FIRMWARE_VERSION        "1.1.0"

// ── TIMING CONFIGURATION (all in milliseconds) ───────────────
// How often to read sensors during normal operation
#define SENSOR_READ_INTERVAL_MS         2000    // 2 seconds

// How often to send telemetry to the backend
#define TELEMETRY_INTERVAL_MS           10000   // 10 seconds

// ── SENSOR VALIDATION SETTINGS ───────────────────────────────
// Number of ADC samples to average per reading (reduces noise)
#define ADC_SAMPLE_COUNT                10

// Number of consecutive stuck readings before raising sensor fault
#define SENSOR_STUCK_THRESHOLD          5

// ── ALERT SETTINGS ───────────────────────────────────────────
// Minimum time between repeat alerts of the same type (anti-spam)
#define ALERT_COOLDOWN_MS               300000  // 5 minutes
#define ALERT_BUFFER_SIZE               20

// ── COMMUNICATION SETTINGS ───────────────────────────────────
// WiFi connection timeout
#define WIFI_CONNECT_TIMEOUT_MS         15000   // 15 seconds

// Backend API request timeout
#define API_REQUEST_TIMEOUT_MS          8000    // 8 seconds

// ── DEBUG SETTINGS ───────────────────────────────────────────
// Set to 1 to enable verbose serial debug output.
#define DEBUG_VERBOSE                   1

// Set to 1 to enable simulated sensor values
#define SIMULATE_SENSORS                0
