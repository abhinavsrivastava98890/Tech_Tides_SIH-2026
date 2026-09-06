// ============================================================
// Jalrakshak — main.cpp
// Hardware Scaled-Down Version (Monitoring Node)
// ============================================================
#include <Arduino.h>
#include "config/settings.h"
#include "config/pins.h"
#include "communication_manager/wifi_manager.h"
#include "communication_manager/telemetry_client.h"
#include "alert_manager/led_alert.h"
#include "alert_manager/buzzer_alert.h"
#include "alert_manager/alert_engine.h"
#include "sensor_manager/tds_sensor.h"
#include "sensor_manager/turbidity_sensor.h"
#include "sensor_manager/temp_sensor.h"
#include "state_machine/state_machine.h"
#include "water_quality_engine/quality_engine.h"
#include "fault_manager/fault_manager.h"

unsigned long _lastSensorReadMs = 0;
unsigned long _lastTelemetryMs  = 0;

void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println("\n\n===========================================");
    Serial.printf(" JALRAKSHAK FIRMWARE v%s (Monitoring Node)\n", FIRMWARE_VERSION);
    Serial.println("===========================================\n");

    // Initialize core systems
    LED_Init();
    Buzzer_Init();
    AlertEngine_Init();
    FaultManager_Init();

    // Initialize Sensors
    TDS_Init();
    Turbidity_Init();
    Temp_Init();
    
    // Connect to Network
    WiFiManager_Init();

    // Start State Machine
    StateMachine_Init();
}

void loop() {
    unsigned long now = millis();

    // -- 1. NON-BLOCKING SYSTEM UPDATES --
    Buzzer_Update();
    LED_Update();
    AlertEngine_Update();
    StateMachine_Run();

    // -- 2. SENSOR ACQUISITION --
    if (now - _lastSensorReadMs >= SENSOR_READ_INTERVAL_MS) {
        _lastSensorReadMs = now;
        
        WaterSnapshot snapshot;
        snapshot.timestamp   = now;
        snapshot.temperature = Temp_Read();
        snapshot.tds         = TDS_Read(snapshot.temperature.isValid ? snapshot.temperature.value : 25.0f);
        snapshot.turbidity   = Turbidity_Read();

        // Feed to quality engine
        QualityEngine_Evaluate(snapshot);
    }

    // -- 3. TELEMETRY TRANSMISSION --
    if (now - _lastTelemetryMs >= TELEMETRY_INTERVAL_MS) {
        _lastTelemetryMs = now;
        
        // Take ONE snapshot to avoid double reading (Fixes Bug 3)
        SensorReading tempReading = Temp_Read();
        SensorReading tdsReading  = TDS_Read(tempReading.isValid ? tempReading.value : 25.0f);
        SensorReading turbReading = Turbidity_Read();

        String payload = "{";
        payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
        payload += "\"systemState\":\"" + StateMachine_GetStateName() + "\",";
        payload += "\"sensors\":{";
        payload += "\"ph\":-1.0,"; 
        payload += "\"tds\":" + String(tdsReading.isValid ? tdsReading.value : -1.0) + ",";
        payload += "\"turbidityOut\":" + String(turbReading.isValid ? turbReading.value : -1.0) + ",";
        payload += "\"turbidityRaw\":-1.0,";
        payload += "\"flowIn\":-1.0,";
        payload += "\"flowOut\":-1.0,";
        payload += "\"temperature\":" + String(tempReading.isValid ? tempReading.value : -1.0);
        payload += "},";
        payload += "\"actuators\":{";
        payload += "\"pumpOn\":false,";
        payload += "\"uvOn\":false";
        payload += "}";
        payload += "}";

        TelemetryClient_PushData(payload);
    }
}
