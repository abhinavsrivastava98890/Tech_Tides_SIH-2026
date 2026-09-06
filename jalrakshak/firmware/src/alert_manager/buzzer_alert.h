// ============================================================
// Jalrakshak — buzzer_alert.h
// Controls the buzzer for audible alerts.
// ============================================================
#pragma once

void Buzzer_Init();
void Buzzer_SetAlertLevel(int level); // 0 = OFF, 1 = WARNING, 2 = CRITICAL
void Buzzer_Update();
