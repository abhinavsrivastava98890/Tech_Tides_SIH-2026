// ============================================================
// Jalrakshak — communication_manager/wifi_manager.h
// Handles non-blocking Wi-Fi connection and reconnection.
// ============================================================
#pragma once
#include <Arduino.h>
#include <WiFi.h>

void WiFiManager_Init();
// Must be called in loop() to handle non-blocking reconnects
void WiFiManager_Update();
bool WiFiManager_IsConnected();
String WiFiManager_GetIP();
String WiFiManager_GetSSID();
