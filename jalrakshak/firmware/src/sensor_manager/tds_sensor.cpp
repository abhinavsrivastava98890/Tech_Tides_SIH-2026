// ============================================================
// Jalrakshak — tds_sensor.cpp
// TDS/EC sensor with temperature compensation.
// ============================================================
#include "tds_sensor.h"
#include "../config/pins.h"
#include "../config/settings.h"

// TDS calibration factor (adjust with known TDS solution)
static const float TDS_FACTOR = 0.5f; // Typical K-value for cheap TDS probes

void TDS_Init() {
    analogSetPinAttenuation(PIN_TDS_SENSOR, ADC_11db);
    Serial.println("[TDS] TDS sensor initialized.");
}

SensorReading TDS_Read(float temperatureC) {
    SensorReading reading;
    reading.sensor_id = "TDS_OUT";
    reading.unit      = "ppm";
    reading.timestamp = millis();
    reading.isValid   = false;
    reading.status    = SensorStatus::COMM_FAIL;

    // Average multiple ADC samples
    long sum = 0;
    for (int i = 0; i < ADC_SAMPLE_COUNT; i++) {
        sum += analogRead(PIN_TDS_SENSOR);
        delay(2);
    }
    float rawAvg = (float)sum / ADC_SAMPLE_COUNT;
    float voltage = rawAvg * (3.3f / 4095.0f);

    // Temperature compensation formula
    // Compensates EC reading to 25°C reference temperature
    float compensationCoeff = 1.0f + 0.02f * (temperatureC - 25.0f);
    float compensatedVoltage = voltage / compensationCoeff;

    // Convert voltage to TDS (ppm)
    // Formula specific to most analog TDS probes
    float tds = (133.42f * compensatedVoltage * compensatedVoltage * compensatedVoltage
                - 255.86f * compensatedVoltage * compensatedVoltage
                + 857.39f * compensatedVoltage)
               * TDS_FACTOR;

    reading.value   = tds;
    reading.status  = SensorStatus::OK;
    reading.isValid = true;

    return reading;
}
