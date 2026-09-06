// ============================================================
// Jalrakshak — led_alert.cpp
// Non-blocking RGB LED control with pattern support.
// ============================================================
#include "led_alert.h"
#include "../config/pins.h"

static uint8_t    _r = 0, _g = 0, _b = 0;
static LEDPattern _pattern        = LEDPattern::SOLID;
static bool       _ledOn          = true;
static unsigned long _lastToggleMs = 0;

static void _applyLED(bool on) {
    if (on) {
        digitalWrite(PIN_LED_RED,   _r > 127 ? HIGH : LOW);
        digitalWrite(PIN_LED_GREEN, _g > 127 ? HIGH : LOW);
        digitalWrite(PIN_LED_BLUE,  _b > 127 ? HIGH : LOW);
    } else {
        digitalWrite(PIN_LED_RED,   LOW);
        digitalWrite(PIN_LED_GREEN, LOW);
        digitalWrite(PIN_LED_BLUE,  LOW);
    }
}

void LED_Init() {
    pinMode(PIN_LED_RED,   OUTPUT);
    pinMode(PIN_LED_GREEN, OUTPUT);
    pinMode(PIN_LED_BLUE,  OUTPUT);
    LED_Off();
    Serial.println("[LED] RGB LED initialized.");
}

void LED_SetColor(uint8_t r, uint8_t g, uint8_t b) {
    _r = r; _g = g; _b = b;
    _ledOn = true;
    _applyLED(true);
}

void LED_SetPattern(LEDPattern pattern) {
    _pattern      = pattern;
    _lastToggleMs = millis();
    _ledOn        = true;
}

// ── SYSTEM STATE → LED MAPPING ────────────────────────────────
// State name : Color        : Pattern
// BOOT        : White        : SOLID
// SELF_TEST   : White        : FAST_BLINK
// STANDBY     : Blue         : SLOW_PULSE
// FILTRATION  : Green        : SOLID
// UV_ACTIVE   : Purple       : SOLID
// LOW WATER   : Blue         : SLOW_PULSE
// TANK FULL   : Cyan         : SOLID
// WARNING     : Yellow       : SLOW_BLINK
// HIGH        : Orange       : FAST_BLINK
// CRITICAL    : Red          : RAPID_FLASH
// FAULT       : Red          : RAPID_FLASH
// PASS        : Green        : SOLID
// REJECT      : Red          : SOLID
void LED_SetSystemState(const String& stateName) {
    if (stateName == "BOOT" || stateName == "SELF_TEST") {
        LED_SetColor(255, 255, 255); // White
        LED_SetPattern(stateName == "SELF_TEST" ? LEDPattern::FAST_BLINK : LEDPattern::SOLID);
    } else if (stateName == "STANDBY" || stateName == "RAW_WATER_LOW") {
        LED_SetColor(0, 0, 255);     // Blue
        LED_SetPattern(LEDPattern::SLOW_PULSE);
    } else if (stateName == "FILTRATION" || stateName == "PASS") {
        LED_SetColor(0, 255, 0);     // Green
        LED_SetPattern(LEDPattern::SOLID);
    } else if (stateName == "UV_ACTIVE" || stateName == "UV_STARTING") {
        LED_SetColor(128, 0, 255);   // Purple
        LED_SetPattern(LEDPattern::SOLID);
    } else if (stateName == "CLEAN_TANK_FULL") {
        LED_SetColor(0, 255, 255);   // Cyan
        LED_SetPattern(LEDPattern::SOLID);
    } else if (stateName == "FAULT" || stateName == "CRITICAL" || stateName == "REJECT") {
        LED_SetColor(255, 0, 0);     // Red
        LED_SetPattern(LEDPattern::RAPID_FLASH);
    } else {
        LED_SetColor(255, 165, 0);   // Orange for unknown states
        LED_SetPattern(LEDPattern::FAST_BLINK);
    }
}

void LED_SetSeverity(AlertSeverity severity) {
    switch (severity) {
        case AlertSeverity::WARNING:
            LED_SetColor(255, 255, 0);   // Yellow
            LED_SetPattern(LEDPattern::SLOW_BLINK);
            break;
        case AlertSeverity::HIGH:
            LED_SetColor(255, 100, 0);   // Orange
            LED_SetPattern(LEDPattern::FAST_BLINK);
            break;
        case AlertSeverity::CRITICAL:
            LED_SetColor(255, 0, 0);     // Red
            LED_SetPattern(LEDPattern::RAPID_FLASH);
            break;
        default: break;
    }
}

void LED_Update() {
    if (_pattern == LEDPattern::SOLID) {
        _applyLED(true);
        return;
    }

    // Pattern timing intervals in ms
    uint16_t interval = 1000;
    switch (_pattern) {
        case LEDPattern::SLOW_PULSE:  interval = 1000; break;
        case LEDPattern::SLOW_BLINK:  interval = 500;  break;
        case LEDPattern::FAST_BLINK:  interval = 200;  break;
        case LEDPattern::RAPID_FLASH: interval = 100;  break;
        default: break;
    }

    unsigned long now = millis();
    if (now - _lastToggleMs >= interval) {
        _ledOn = !_ledOn;
        _lastToggleMs = now;
        _applyLED(_ledOn);
    }
}

void LED_Off() {
    _pattern = LEDPattern::SOLID;
    _r = _g = _b = 0;
    _applyLED(false);
}
