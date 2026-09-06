// ============================================================
// Jalrakshak — state_machine.cpp
// ============================================================
#include "state_machine.h"
#include "../config/settings.h"
#include "../fault_manager/fault_manager.h"
#include "../alert_manager/alert_engine.h"
#include "../water_quality_engine/quality_engine.h"
#include "../sensor_manager/tds_sensor.h"
#include "../sensor_manager/turbidity_sensor.h"
#include "../sensor_manager/temp_sensor.h"

static SystemState   _currentState  = SystemState::STATE_BOOT;
static SystemState   _previousState = SystemState::STATE_BOOT;
static unsigned long _stateEnteredAt = 0;

static void _enterState(SystemState next) {
    if (_currentState == next) return;

    _previousState  = _currentState;
    String oldName  = StateMachine_GetStateName(_previousState);
    String newName  = StateMachine_GetStateName(next);

    _currentState   = next;
    _stateEnteredAt = millis();

    Serial.printf("[SM] State transition: %s -> %s\n", oldName.c_str(), newName.c_str());
}

static unsigned long _timeInState() {
    return millis() - _stateEnteredAt;
}

// ── STATE HANDLERS ───────────────────────────────────────────

static void _handleBoot() {
    if (_timeInState() > 2000) {
        _enterState(SystemState::STATE_SELF_TEST);
    }
}

static void _handleSelfTest() {
    static int step = 0;
    static unsigned long lastStepMs = 0;

    if (_timeInState() == 0) {
        step = 0;
        lastStepMs = millis();
        Serial.println("[SM] Starting self-test sequence...");
    }

    if (millis() - lastStepMs >= 1000) {
        lastStepMs = millis();
        step++;

        switch (step) {
            case 1:
                Serial.println("  -> Testing Sensors...");
                Temp_Read();
                TDS_Read(25.0f);
                Turbidity_Read();
                break;
            case 2:
                Serial.println("  -> Self-test complete.");
                _enterState(SystemState::STATE_MONITORING);
                break;
        }
    }
}

static void _handleMonitoring() {
    // Check for critical faults (like backend unreachable for too long, or sensors completely dead)
    if (FaultManager_GetMostSevereActive() == FaultCode::SENSOR_COMM_FAIL) {
        _enterState(SystemState::STATE_FAULT);
        return;
    }
    
    // Check quality engine results
    if (QualityEngine_GetOverallQuality() == QualityLevel::CRITICAL) {
        // We stay in monitoring but the buzzer will be screaming
        // If we had a pump, we would stop it here.
    }
}

static void _handleFault() {
    static bool _entryDone = false;
    
    if (!_entryDone) {
        Serial.println("[SM] System entered FAULT state.");
        _entryDone = true;
    }

    // Attempt to recover if the fault clears
    if (FaultManager_GetMostSevereActive() == FaultCode::NONE) {
        Serial.println("[SM] Faults cleared. Returning to monitoring.");
        _entryDone = false;
        _enterState(SystemState::STATE_MONITORING);
    }
}

// ── PUBLIC API ───────────────────────────────────────────────

void StateMachine_Init() {
    _currentState   = SystemState::STATE_BOOT;
    _previousState  = SystemState::STATE_BOOT;
    _stateEnteredAt = millis();
    Serial.println("[SM] State machine initialized.");
}

void StateMachine_Run() {
    switch (_currentState) {
        case SystemState::STATE_BOOT:         _handleBoot(); break;
        case SystemState::STATE_SELF_TEST:    _handleSelfTest(); break;
        case SystemState::STATE_MONITORING:   _handleMonitoring(); break;
        case SystemState::STATE_FAULT:        _handleFault(); break;
    }
}

SystemState StateMachine_GetCurrentState() {
    return _currentState;
}

String StateMachine_GetStateName(SystemState state) {
    switch (state) {
        case SystemState::STATE_BOOT:         return "BOOT";
        case SystemState::STATE_SELF_TEST:    return "SELF_TEST";
        case SystemState::STATE_MONITORING:   return "MONITORING";
        case SystemState::STATE_FAULT:        return "FAULT";
        default:                              return "UNKNOWN";
    }
}

String StateMachine_GetStateName() {
    return StateMachine_GetStateName(_currentState);
}
