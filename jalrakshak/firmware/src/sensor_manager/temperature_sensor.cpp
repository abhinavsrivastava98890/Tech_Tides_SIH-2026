// ============================================================
// Jalrakshak — temperature_sensor.cpp
// DS18B20 waterproof temperature sensor on OneWire.
// Uses non-blocking conversion to avoid 750ms blocking delay.
// ============================================================
#include "temperature_sensor.h"
#include "../config/pins.h"
#include <OneWire.h>
#include <DallasTemperature.h>

static OneWire          _oneWire(PIN_TEMP_SENSOR);
static DallasTemperature _ds18b20(&_oneWire);

void Temperature_Init() {
    _ds18b20.begin();
    _ds18b20.setResolution(12); // 12-bit = 0.0625°C resolution
    _ds18b20.setWaitForConversion(false); // Non-blocking mode

    int deviceCount = _ds18b20.getDeviceCount();
    if (deviceCount == 0) {
        Serial.println("[TEMP] WARNING: No DS18B20 found on OneWire bus!");
    } else {
        Serial.printf("[TEMP] DS18B20 initialized. Found %d device(s).\n", deviceCount);
    }
}

void Temperature_RequestConversion() {
    _ds18b20.requestTemperatures();
}

SensorReading Temperature_Read() {
    SensorReading reading;
    reading.sensor_id = "TEMP_WATER";
    reading.unit      = "C";
    reading.timestamp = millis();
    reading.isValid   = false;

    float tempC = _ds18b20.getTempCByIndex(0);

    // DEVICE_DISCONNECTED_C is returned when sensor not found
    if (tempC == DEVICE_DISCONNECTED_C || tempC == -127.0f) {
        reading.status  = SensorStatus::COMM_FAIL;
        reading.value   = -127.0f;
        Serial.println("[TEMP] ERROR: DS18B20 read failed (disconnected?).");
        return reading;
    }

    reading.value   = tempC;
    reading.status  = SensorStatus::OK;
    reading.isValid = true;
    return reading;
}

SensorReading Temperature_ReadBlocking() {
    _ds18b20.setWaitForConversion(true);
    _ds18b20.requestTemperatures();
    SensorReading r = Temperature_Read();
    _ds18b20.setWaitForConversion(false);
    return r;
}
