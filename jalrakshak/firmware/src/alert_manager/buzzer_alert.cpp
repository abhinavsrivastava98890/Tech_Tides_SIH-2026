// ============================================================
// Jalrakshak — buzzer_alert.cpp
// ============================================================
#include "buzzer_alert.h"
#include "../config/pins.h"
#include <Arduino.h>

static int _alertLevel = 0;
static unsigned long _lastToggleMs = 0;
static bool _buzzerState = false;

void Buzzer_Init() {
    pinMode(PIN_BUZZER, OUTPUT);
    digitalWrite(PIN_BUZZER, LOW);
    _alertLevel = 0;
    Serial.println("[BUZZER] Initialized.");
}

void Buzzer_SetAlertLevel(int level) {
    _alertLevel = level;
    if (_alertLevel == 0) {
        digitalWrite(PIN_BUZZER, LOW);
        _buzzerState = false;
    }
}

void Buzzer_Update() {
    if (_alertLevel == 0) return;

    unsigned long now = millis();
    int toggleDelay = (_alertLevel == 1) ? 1000 : 250; // Slow beep for warning, fast for critical

    if (now - _lastToggleMs >= toggleDelay) {
        _buzzerState = !_buzzerState;
        digitalWrite(PIN_BUZZER, _buzzerState ? HIGH : LOW);
        _lastToggleMs = now;
    }
}
