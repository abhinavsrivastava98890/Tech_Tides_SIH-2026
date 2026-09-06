// ============================================================
// Jalrakshak — led_alert.h
// RGB LED controller — visual status indicator.
// ============================================================
#pragma once
#include "alert_engine.h"

enum class LEDPattern {
    SOLID,
    SLOW_PULSE,   // 1s on / 1s off
    SLOW_BLINK,   // 500ms on / 500ms off
    FAST_BLINK,   // 200ms on / 200ms off
    RAPID_FLASH   // 100ms on / 100ms off
};

void LED_Init();
void LED_SetColor(uint8_t r, uint8_t g, uint8_t b);
void LED_SetPattern(LEDPattern pattern);
void LED_SetSeverity(AlertSeverity severity);
// Set LED based on system state name
void LED_SetSystemState(const String& stateName);
// Must be called every loop() — handles non-blocking blink timing
void LED_Update();
void LED_Off();
