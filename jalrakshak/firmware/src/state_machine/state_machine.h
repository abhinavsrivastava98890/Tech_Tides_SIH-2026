// ============================================================
// Jalrakshak — state_machine.h
// ============================================================
#pragma once
#include <Arduino.h>

enum class SystemState {
    STATE_BOOT,
    STATE_SELF_TEST,
    STATE_MONITORING,
    STATE_FAULT
};

void StateMachine_Init();
void StateMachine_Run();
SystemState StateMachine_GetCurrentState();
String StateMachine_GetStateName();
String StateMachine_GetStateName(SystemState state);
