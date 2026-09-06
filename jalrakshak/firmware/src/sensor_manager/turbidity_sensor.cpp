// ============================================================
// Jalrakshak — turbidity_sensor.cpp
// Handles two turbidity sensors (raw water + output water).
// Assumes an analog sensor like the DFRobot SEN0189.
// ============================================================
#include "turbidity_sensor.h"
#include "../config/pins.h"
#include "../config/settings.h"

void Turbidity_Init() {
    analogSetPinAttenuation(PIN_TURBIDITY, ADC_11db);
    Serial.println("[TURBIDITY] Turbidity sensor initialized.");
}

SensorReading Turbidity_Read() {
    SensorReading reading;
    reading.unit      = "NTU";
    reading.timestamp = millis();
    reading.isValid   = false;
    reading.status    = SensorStatus::COMM_FAIL;
    reading.sensor_id = "TURBIDITY_OUT";

    // Average multiple ADC samples
    long sum = 0;
    for (int i = 0; i < ADC_SAMPLE_COUNT; i++) {
        sum += analogRead(PIN_TURBIDITY);
        delay(2);
    }
    float rawAvg = (float)sum / ADC_SAMPLE_COUNT;
    float voltage = rawAvg * (3.3f / 4095.0f);

    // DFRobot SEN0189 turbidity conversion (voltage → NTU)
    // This is an approximation based on the sensor datasheet.
    // NOTE: Calibrate with known turbidity standards for accuracy.
    float ntu;
    if (voltage < 2.5f) {
        // High turbidity (sensor output is inversely proportional)
        ntu = 3000.0f;
    } else {
        // Polynomial approximation from sensor datasheet
        ntu = -1120.4f * (voltage * voltage) + 5742.3f * voltage - 4353.8f;
    }

    if (ntu < 0) ntu = 0.0f;

    reading.value   = ntu;
    reading.status  = SensorStatus::OK;
    reading.isValid = true;

    return reading;
}
