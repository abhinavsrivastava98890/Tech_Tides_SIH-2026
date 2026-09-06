// ============================================================
// Jalrakshak — Smart Water Purification System
// config/pins.h — ALL hardware pin definitions in one place.
//
// Hardware scaled down to: ESP32, TDS, Turbidity, Temp, RGB LED, Buzzer.
// ============================================================
#pragma once

// ── ANALOG SENSOR INPUTS ────────────────────────────────────
// Use only ADC1 pins (32–39) for sensors when Wi-Fi is active.
#define PIN_TDS_SENSOR          35   // ADC1_CH7 — TDS/EC analog
#define PIN_TURBIDITY           32   // ADC1_CH4 — Turbidity analog

// ── DIGITAL / ONEWRITE SENSORS ──────────────────────────────
#define PIN_TEMP_SENSOR         4    // DS18B20 OneWire data bus

// ── RGB LED (common cathode — HIGH = ON) ─────────────────────
#define PIN_LED_RED             16
#define PIN_LED_GREEN           17
#define PIN_LED_BLUE            5

// ── BUZZER ───────────────────────────────────────────────────
#define PIN_BUZZER              13   // Active buzzer (HIGH = ON)

