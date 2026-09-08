// ============================================================
// JALRAKSHAK — Smart Water Purification Monitoring System
// Firmware v2.0 (Single-File Architecture)
// ============================================================
// 
// SYSTEM OVERVIEW:
//   Inlet Tank  →  [Turbidity + Temperature sensors]
//        ↓
//   Flow Sensor →  [Pulse counting, L/min]
//        ↓
//   Filtration  →  (RO/UV/Sediment)
//        ↓
//   Post-Filter →  [pH + TDS sensors]
//        ↓
//   Outlet Tank →  Clean water
//
// OUTPUTS:
//   • I2C LCD 16x2  — Cycles through sensor readings
//   • RGB LED       — Green (OK), Yellow (Warning), Red (Critical)
//   • Active Buzzer — Beep patterns for alerts
//   • WiFi HTTP     — Sends telemetry + alerts to Express.js backend
//                     Backend triggers Twilio SMS/Call on CRITICAL alerts
//
// HARDWARE PINS:
//   Turbidity  → GPIO 34 (Analog)    pH Sensor → GPIO 32 (Analog)
//   TDS Sensor → GPIO 35 (Analog)    DS18B20   → GPIO 4  (OneWire)
//   Flow Sensor→ GPIO 13 (Interrupt)  Buzzer    → GPIO 14 (Digital)
//   LED Red    → GPIO 25              LED Green → GPIO 26
//   LED Blue   → GPIO 27              LCD SDA   → GPIO 21
//   LCD SCL    → GPIO 22
// ============================================================

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ============================================================
// SECTION 1: PIN DEFINITIONS
// ============================================================

// Analog Sensors (use ADC1 pins only — ADC2 conflicts with WiFi)
#define PIN_TURBIDITY       34    // Inlet tank turbidity sensor
#define PIN_TDS             35    // Post-filtration TDS sensor
#define PIN_PH              32    // Post-filtration pH sensor

// Digital Sensors
#define PIN_TEMPERATURE     4     // DS18B20 OneWire data (4.7kΩ pull-up to 3.3V)
#define PIN_FLOW_SENSOR     13    // YF-S201 flow sensor signal (interrupt)

// Outputs
#define PIN_LED_RED         25    // RGB LED red channel (220Ω resistor)
#define PIN_LED_GREEN       26    // RGB LED green channel (220Ω resistor)
#define PIN_LED_BLUE        27    // RGB LED blue channel (220Ω resistor)
#define PIN_BUZZER          14    // Active buzzer (HIGH = ON)

// I2C LCD uses default ESP32 I2C pins: SDA=21, SCL=22

// ============================================================
// SECTION 2: CONFIGURATION
// ============================================================

// --- Device Identity ---
#define DEVICE_ID           "JR-UNIT-001"
#define FIRMWARE_VERSION    "2.0.0"

// --- WiFi Credentials (change to your hotspot) ---
const char* WIFI_SSID       = "Abhinav";
const char* WIFI_PASSWORD   = "abhinavv";

// --- Backend API URL (change to your laptop's IP) ---
const char* BACKEND_URL     = "http://10.204.62.230:5000/api";

// --- Timing Intervals (milliseconds) ---
#define SENSOR_READ_INTERVAL    2000    // Read sensors every 2 seconds
#define TELEMETRY_INTERVAL      10000   // Send data to backend every 10 seconds
#define LCD_CYCLE_INTERVAL      3000    // Switch LCD display every 3 seconds
#define WIFI_RECONNECT_INTERVAL 10000   // Retry WiFi every 10 seconds
#define ALERT_COOLDOWN_MS       300000  // 5 minutes between repeat alerts

// --- ADC Settings ---
#define ADC_RESOLUTION      4095.0
#define VREF                3.3
#define ADC_SAMPLES         10    // Average this many samples per reading

// --- pH Calibration (adjust with pH 4/7/10 buffer solutions) ---
#define PH_NEUTRAL_VOLTAGE  2.5   // Voltage at pH 7.0
#define PH_VOLTS_PER_UNIT   0.18  // Voltage change per pH unit

// --- Flow Sensor Calibration (YF-S201) ---
#define FLOW_CALIBRATION    7.5   // Pulses per liter per minute

// --- Water Quality Thresholds ---
//                          NORMAL          WARNING             CRITICAL
// Turbidity (NTU):        ≤ 5             5 – 10              > 10
// Temperature (°C):       10 – 35         5–10 or 35–45       < 5 or > 45
// pH:                     6.5 – 8.5       5.5–6.5 or 8.5–9.5  < 5.5 or > 9.5
// TDS (ppm):              ≤ 300           300 – 500            > 500
// Flow (L/min):           ≥ 0.5           < 0.5                0 (no flow)

#define THRESH_TURB_WARN        5.0
#define THRESH_TURB_CRIT        10.0

#define THRESH_TEMP_NORMAL_MIN  10.0
#define THRESH_TEMP_NORMAL_MAX  35.0
#define THRESH_TEMP_WARN_MIN    5.0
#define THRESH_TEMP_WARN_MAX    45.0

#define THRESH_PH_NORMAL_MIN    6.5
#define THRESH_PH_NORMAL_MAX    8.5
#define THRESH_PH_WARN_MIN      5.5
#define THRESH_PH_WARN_MAX      9.5

#define THRESH_TDS_WARN         300.0
#define THRESH_TDS_CRIT         500.0

#define THRESH_FLOW_MIN         0.5   // Below this = warning (low flow)

// ============================================================
// SECTION 3: GLOBAL STATE
// ============================================================

// --- Hardware Objects ---
LiquidCrystal_I2C lcd(0x27, 16, 2);  // I2C address 0x27, 16 cols, 2 rows
OneWire oneWire(PIN_TEMPERATURE);
DallasTemperature ds18b20(&oneWire);

// --- Latest Sensor Readings ---
float g_turbidity   = 0.0;   // NTU
float g_temperature = 25.0;  // °C
float g_ph          = 7.0;   // pH units
float g_tds         = 0.0;   // ppm
float g_flowRate    = 0.0;   // L/min

// --- Flow Sensor Interrupt Counter ---
volatile unsigned long g_flowPulseCount = 0;
unsigned long g_lastFlowCalcMs = 0;

// --- Timing Trackers ---
unsigned long g_lastSensorReadMs   = 0;
unsigned long g_lastTelemetryMs    = 0;
unsigned long g_lastLCDCycleMs     = 0;
unsigned long g_lastWiFiAttemptMs  = 0;

// --- LCD Display State (0-4, cycles through 5 screens) ---
int g_lcdScreen = 0;

// --- Alert State ---
// Severity levels: 0 = NORMAL, 1 = WARNING, 2 = CRITICAL
int g_alertSeverity = 0;
String g_alertMessage = "";

// --- Alert Cooldown Tracking (one per fault type) ---
unsigned long g_lastAlertTime_turbidity  = 0;
unsigned long g_lastAlertTime_temp       = 0;
unsigned long g_lastAlertTime_ph         = 0;
unsigned long g_lastAlertTime_tds        = 0;
unsigned long g_lastAlertTime_flow       = 0;

// --- Buzzer State (non-blocking beep) ---
bool g_buzzerOn = false;
unsigned long g_lastBuzzerToggleMs = 0;

// --- Alert Counter (for unique alert IDs) ---
unsigned long g_alertCounter = 0;

// ============================================================
// SECTION 4: FORWARD DECLARATIONS
// ============================================================

// Sensors
float readTurbidity();
float readTemperature();
float readPH();
float readTDS(float temperatureC);
void  calculateFlowRate();
int   averageAnalogRead(int pin);

// Alert Engine
int   checkThresholds();
void  updateBuzzer(int severity);
void  setRGBLed(int severity);

// LCD
void  updateLCD();

// WiFi & HTTP
void  connectWiFi();
void  wifiReconnectCheck();
void  sendTelemetry();
void  sendAlert(int severity, const String& faultName, const String& message);

// Flow ISR
void IRAM_ATTR flowPulseISR();

// ============================================================
// SECTION 5: SENSOR READING FUNCTIONS
// ============================================================

// --- Helper: Average multiple ADC samples to reduce noise ---
int averageAnalogRead(int pin) {
    long sum = 0;
    for (int i = 0; i < ADC_SAMPLES; i++) {
        sum += analogRead(pin);
        delay(2);
    }
    return sum / ADC_SAMPLES;
}

// --- Turbidity Sensor (Inlet Tank) ---
// DFRobot SEN0189-style: voltage inversely proportional to turbidity
float readTurbidity() {
    int raw = averageAnalogRead(PIN_TURBIDITY);
    float voltage = raw * (VREF / ADC_RESOLUTION);

    float ntu;
    if (voltage < 2.5) {
        ntu = 3000.0;  // Very turbid / sensor saturated
    } else {
        // Polynomial approximation from sensor datasheet
        ntu = -1120.4 * voltage * voltage + 5742.3 * voltage - 4352.9;
        if (ntu < 0) ntu = 0;
    }
    return ntu;
}

// --- DS18B20 Temperature Sensor (Inlet Tank) ---
float readTemperature() {
    ds18b20.requestTemperatures();
    float tempC = ds18b20.getTempCByIndex(0);

    // Check for disconnected sensor
    if (tempC == DEVICE_DISCONNECTED_C || tempC < -50.0) {
        Serial.println("[TEMP] ERROR: DS18B20 disconnected or read failed!");
        return g_temperature;  // Return last known good value
    }
    return tempC;
}

// --- pH Sensor (Post-Filtration) ---
// Linear approximation — MUST calibrate with pH 4/7/10 buffers
float readPH() {
    int raw = averageAnalogRead(PIN_PH);
    float voltage = raw * (VREF / ADC_RESOLUTION);

    float ph = 7.0 + ((PH_NEUTRAL_VOLTAGE - voltage) / PH_VOLTS_PER_UNIT);
    if (ph < 0) ph = 0;
    if (ph > 14) ph = 14;
    return ph;
}

// --- TDS Sensor (Post-Filtration) ---
// Temperature-compensated reading using DFRobot formula
float readTDS(float temperatureC) {
    int raw = averageAnalogRead(PIN_TDS);
    float voltage = raw * (VREF / ADC_RESOLUTION);

    // Temperature compensation to 25°C reference
    float compensationCoeff = 1.0 + 0.02 * (temperatureC - 25.0);
    float compensatedVoltage = voltage / compensationCoeff;

    // Polynomial conversion (voltage → ppm)
    float tds = (133.42 * compensatedVoltage * compensatedVoltage * compensatedVoltage
                - 255.86 * compensatedVoltage * compensatedVoltage
                + 857.39 * compensatedVoltage) * 0.5;

    if (tds < 0) tds = 0;
    return tds;
}

// --- Flow Rate Calculation (from ISR pulse count) ---
// Called every SENSOR_READ_INTERVAL to calculate L/min
void calculateFlowRate() {
    unsigned long now = millis();
    unsigned long elapsed = now - g_lastFlowCalcMs;

    if (elapsed > 0) {
        // Disable interrupts briefly to read volatile counter safely
        noInterrupts();
        unsigned long pulses = g_flowPulseCount;
        g_flowPulseCount = 0;
        interrupts();

        // Convert pulses to L/min
        // Formula: flowRate = (pulses / calibrationFactor) / (elapsed / 60000)
        g_flowRate = (pulses / FLOW_CALIBRATION) * (60000.0 / elapsed);
    }
    g_lastFlowCalcMs = now;
}

// ============================================================
// SECTION 6: ALERT ENGINE
// ============================================================

// --- Check all thresholds, return worst severity ---
// Returns: 0 = NORMAL, 1 = WARNING, 2 = CRITICAL
int checkThresholds() {
    int worst = 0;  // Start with NORMAL
    g_alertMessage = "";

    // -- Turbidity Check --
    if (g_turbidity > THRESH_TURB_CRIT) {
        worst = 2;
        g_alertMessage = "Turbidity CRITICAL: " + String(g_turbidity, 1) + " NTU";
    } else if (g_turbidity > THRESH_TURB_WARN) {
        if (worst < 1) worst = 1;
        if (g_alertMessage.length() == 0)
            g_alertMessage = "Turbidity HIGH: " + String(g_turbidity, 1) + " NTU";
    }

    // -- Temperature Check --
    if (g_temperature < THRESH_TEMP_WARN_MIN || g_temperature > THRESH_TEMP_WARN_MAX) {
        worst = 2;
        g_alertMessage = "Temperature CRITICAL: " + String(g_temperature, 1) + " C";
    } else if (g_temperature < THRESH_TEMP_NORMAL_MIN || g_temperature > THRESH_TEMP_NORMAL_MAX) {
        if (worst < 1) worst = 1;
        if (g_alertMessage.length() == 0)
            g_alertMessage = "Temperature WARNING: " + String(g_temperature, 1) + " C";
    }

    // -- pH Check --
    if (g_ph < THRESH_PH_WARN_MIN || g_ph > THRESH_PH_WARN_MAX) {
        worst = 2;
        g_alertMessage = "pH CRITICAL: " + String(g_ph, 2);
    } else if (g_ph < THRESH_PH_NORMAL_MIN || g_ph > THRESH_PH_NORMAL_MAX) {
        if (worst < 1) worst = 1;
        if (g_alertMessage.length() == 0)
            g_alertMessage = "pH WARNING: " + String(g_ph, 2);
    }

    // -- TDS Check --
    if (g_tds > THRESH_TDS_CRIT) {
        worst = 2;
        g_alertMessage = "TDS CRITICAL: " + String(g_tds, 0) + " ppm";
    } else if (g_tds > THRESH_TDS_WARN) {
        if (worst < 1) worst = 1;
        if (g_alertMessage.length() == 0)
            g_alertMessage = "TDS WARNING: " + String(g_tds, 0) + " ppm";
    }

    // -- Flow Check --
    if (g_flowRate == 0.0) {
        // No flow could be pump off — only warn, don't go critical
        if (worst < 1) worst = 1;
        if (g_alertMessage.length() == 0)
            g_alertMessage = "Flow WARNING: No water flow detected";
    } else if (g_flowRate < THRESH_FLOW_MIN) {
        if (worst < 1) worst = 1;
        if (g_alertMessage.length() == 0)
            g_alertMessage = "Flow LOW: " + String(g_flowRate, 2) + " L/min";
    }

    return worst;
}

// --- Buzzer Control (non-blocking beep patterns) ---
void updateBuzzer(int severity) {
    if (severity == 0) {
        // NORMAL — buzzer OFF
        digitalWrite(PIN_BUZZER, LOW);
        g_buzzerOn = false;
        return;
    }

    // Determine beep interval based on severity
    unsigned long beepInterval = (severity == 2) ? 250 : 1000;  // CRITICAL=fast, WARNING=slow

    unsigned long now = millis();
    if (now - g_lastBuzzerToggleMs >= beepInterval) {
        g_buzzerOn = !g_buzzerOn;
        digitalWrite(PIN_BUZZER, g_buzzerOn ? HIGH : LOW);
        g_lastBuzzerToggleMs = now;
    }
}

// --- RGB LED Control based on severity ---
void setRGBLed(int severity) {
    switch (severity) {
        case 0:  // NORMAL — solid GREEN
            analogWrite(PIN_LED_RED, 0);
            analogWrite(PIN_LED_GREEN, 255);
            analogWrite(PIN_LED_BLUE, 0);
            break;
        case 1:  // WARNING — solid YELLOW
            analogWrite(PIN_LED_RED, 255);
            analogWrite(PIN_LED_GREEN, 255);
            analogWrite(PIN_LED_BLUE, 0);
            break;
        case 2:  // CRITICAL — solid RED
            analogWrite(PIN_LED_RED, 255);
            analogWrite(PIN_LED_GREEN, 0);
            analogWrite(PIN_LED_BLUE, 0);
            break;
    }
}

// ============================================================
// SECTION 7: LCD DISPLAY (5 screens, auto-cycle)
// ============================================================

void updateLCD() {
    lcd.setCursor(0, 0);

    switch (g_lcdScreen) {
        case 0:  // Turbidity
            lcd.print("Turbidity:      ");
            lcd.setCursor(0, 1);
            lcd.print(String(g_turbidity, 1) + " NTU        ");
            break;

        case 1:  // TDS
            lcd.print("TDS Value:      ");
            lcd.setCursor(0, 1);
            lcd.print(String(g_tds, 0) + " ppm        ");
            break;

        case 2:  // Temperature
            lcd.print("Temperature:    ");
            lcd.setCursor(0, 1);
            lcd.print(String(g_temperature, 1) + " C          ");
            break;

        case 3:  // pH
            lcd.print("pH Level:       ");
            lcd.setCursor(0, 1);
            lcd.print(String(g_ph, 2) + "            ");
            break;

        case 4:  // Flow + Status
            lcd.print("Flow:           ");
            lcd.setCursor(0, 1);
            String statusLine = String(g_flowRate, 1) + "L/m ";
            if (g_alertSeverity == 0) statusLine += "OK    ";
            else if (g_alertSeverity == 1) statusLine += "WARN  ";
            else statusLine += "ALERT!";
            lcd.print(statusLine);
            break;
    }
}

// ============================================================
// SECTION 8: WIFI & HTTP COMMUNICATION
// ============================================================

// --- Connect to WiFi (blocking, used at boot) ---
void connectWiFi() {
    Serial.printf("[WIFI] Connecting to '%s'...\n", WIFI_SSID);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi Connecting");
    lcd.setCursor(0, 1);
    lcd.print(WIFI_SSID);

    WiFi.mode(WIFI_STA);
    WiFi.disconnect(true);
    delay(100);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    unsigned long startMs = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startMs < 15000) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();

    if (WiFi.status() == WL_CONNECTED) {
        Serial.printf("[WIFI] Connected! IP: %s\n", WiFi.localIP().toString().c_str());
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("WiFi Connected!");
        lcd.setCursor(0, 1);
        lcd.print(WiFi.localIP().toString());
        delay(2000);
    } else {
        Serial.println("[WIFI] Connection FAILED. Will retry in background.");
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("WiFi FAILED!");
        lcd.setCursor(0, 1);
        lcd.print("Retrying...");
        delay(2000);
    }
    lcd.clear();
}

// --- Non-blocking WiFi reconnect check ---
void wifiReconnectCheck() {
    if (WiFi.status() == WL_CONNECTED) return;

    unsigned long now = millis();
    if (now - g_lastWiFiAttemptMs >= WIFI_RECONNECT_INTERVAL) {
        g_lastWiFiAttemptMs = now;
        Serial.println("[WIFI] Attempting reconnection...");
        WiFi.disconnect();
        WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    }
}

// --- Send Telemetry Data to Backend ---
void sendTelemetry() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[HTTP] Cannot send telemetry — WiFi not connected.");
        return;
    }

    // Determine system state string
    String systemState = "NORMAL";
    if (g_alertSeverity == 1) systemState = "WARNING";
    else if (g_alertSeverity == 2) systemState = "CRITICAL";

    // Build JSON payload (matches backend Telemetry model exactly)
    String payload = "{";
    payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
    payload += "\"systemState\":\"" + systemState + "\",";
    payload += "\"sensors\":{";
    payload += "\"ph\":" + String(g_ph, 2) + ",";
    payload += "\"tds\":" + String(g_tds, 1) + ",";
    payload += "\"turbidityOut\":" + String(g_turbidity, 1) + ",";
    payload += "\"turbidityRaw\":-1.0,";
    payload += "\"flowIn\":" + String(g_flowRate, 2) + ",";
    payload += "\"flowOut\":-1.0,";
    payload += "\"temperature\":" + String(g_temperature, 1);
    payload += "},";
    payload += "\"actuators\":{";
    payload += "\"pumpOn\":false,";
    payload += "\"uvOn\":false";
    payload += "}";
    payload += "}";

    // HTTP POST
    HTTPClient http;
    String url = String(BACKEND_URL) + "/telemetry";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-device-id", DEVICE_ID);

    int httpCode = http.POST(payload);
    if (httpCode >= 200 && httpCode < 300) {
        Serial.printf("[HTTP] Telemetry sent OK (%d)\n", httpCode);
    } else {
        Serial.printf("[HTTP] Telemetry FAILED (HTTP %d): %s\n", httpCode, http.getString().c_str());
    }
    http.end();
}

// --- Send Alert to Backend (triggers Twilio SMS/Call for CRITICAL) ---
void sendAlert(int severity, const String& faultName, const String& message) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[HTTP] Cannot send alert — WiFi not connected.");
        return;
    }

    // Generate unique alert ID
    g_alertCounter++;
    String alertId = "ALT-" + String(millis()) + "-" + String(g_alertCounter);

    // Map severity to string (must match backend Alert model enum)
    String severityStr = "WARNING";
    int faultCode = 2;  // WATER_QUALITY_WARNING
    if (severity == 2) {
        severityStr = "CRITICAL";
        faultCode = 3;  // WATER_QUALITY_CRITICAL
    }

    // Build JSON payload (matches backend Alert model exactly)
    String payload = "{";
    payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
    payload += "\"alertId\":\"" + alertId + "\",";
    payload += "\"faultCode\":" + String(faultCode) + ",";
    payload += "\"faultName\":\"" + faultName + "\",";
    payload += "\"severity\":\"" + severityStr + "\",";
    payload += "\"message\":\"" + message + "\"";
    payload += "}";

    // HTTP POST
    HTTPClient http;
    String url = String(BACKEND_URL) + "/alerts";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-device-id", DEVICE_ID);

    int httpCode = http.POST(payload);
    if (httpCode >= 200 && httpCode < 300) {
        Serial.printf("[HTTP] Alert sent OK (%d) — %s\n", httpCode, severityStr.c_str());
    } else {
        Serial.printf("[HTTP] Alert FAILED (HTTP %d)\n", httpCode);
    }
    http.end();
}

// ============================================================
// SECTION 9: FLOW SENSOR INTERRUPT SERVICE ROUTINE
// ============================================================

void IRAM_ATTR flowPulseISR() {
    g_flowPulseCount++;
}

// ============================================================
// SECTION 10: setup()
// ============================================================

void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println("\n\n===========================================");
    Serial.printf(" JALRAKSHAK FIRMWARE v%s\n", FIRMWARE_VERSION);
    Serial.println(" Smart Water Purification Monitor");
    Serial.println("===========================================\n");

    // --- Initialize ADC ---
    analogReadResolution(12);

    // --- Initialize Sensor Pins ---
    pinMode(PIN_TURBIDITY, INPUT);
    pinMode(PIN_TDS, INPUT);
    pinMode(PIN_PH, INPUT);

    // --- Initialize Flow Sensor with Interrupt ---
    pinMode(PIN_FLOW_SENSOR, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(PIN_FLOW_SENSOR), flowPulseISR, RISING);
    g_lastFlowCalcMs = millis();
    Serial.println("[FLOW] Flow sensor initialized on GPIO 13 (interrupt).");

    // --- Initialize RGB LED ---
    pinMode(PIN_LED_RED, OUTPUT);
    pinMode(PIN_LED_GREEN, OUTPUT);
    pinMode(PIN_LED_BLUE, OUTPUT);
    analogWrite(PIN_LED_RED, 0);
    analogWrite(PIN_LED_GREEN, 0);
    analogWrite(PIN_LED_BLUE, 0);
    Serial.println("[LED] RGB LED initialized.");

    // --- Initialize Buzzer ---
    pinMode(PIN_BUZZER, OUTPUT);
    digitalWrite(PIN_BUZZER, LOW);
    Serial.println("[BUZZER] Buzzer initialized on GPIO 14.");

    // --- Initialize DS18B20 Temperature Sensor ---
    ds18b20.begin();
    ds18b20.setResolution(12);  // 12-bit = 0.0625°C resolution
    int tempDeviceCount = ds18b20.getDeviceCount();
    if (tempDeviceCount == 0) {
        Serial.println("[TEMP] WARNING: No DS18B20 found on OneWire bus!");
    } else {
        Serial.printf("[TEMP] DS18B20 initialized. Found %d device(s).\n", tempDeviceCount);
    }

    // --- Initialize I2C LCD ---
    lcd.init();
    lcd.backlight();
    lcd.setCursor(0, 0);
    lcd.print("  JALRAKSHAK  ");
    lcd.setCursor(0, 1);
    lcd.print(" Water Monitor ");
    delay(2000);
    lcd.clear();
    Serial.println("[LCD] 16x2 I2C LCD initialized.");

    // --- Connect to WiFi ---
    connectWiFi();

    Serial.println("\n[SYSTEM] All systems initialized. Entering main loop.\n");
}

// ============================================================
// SECTION 11: loop()
// ============================================================

void loop() {
    unsigned long now = millis();

    // ----------------------------------------------------------
    // 1. SENSOR READING (every 2 seconds)
    // ----------------------------------------------------------
    if (now - g_lastSensorReadMs >= SENSOR_READ_INTERVAL) {
        g_lastSensorReadMs = now;

        // Read all sensors
        g_temperature = readTemperature();
        g_turbidity   = readTurbidity();
        g_ph          = readPH();
        g_tds         = readTDS(g_temperature);
        calculateFlowRate();

        // Print to Serial Monitor for debugging
        Serial.printf("[SENSORS] Turb: %.1f NTU | Temp: %.1f C | pH: %.2f | TDS: %.0f ppm | Flow: %.2f L/min\n",
                      g_turbidity, g_temperature, g_ph, g_tds, g_flowRate);

        // Check thresholds and update alert severity
        g_alertSeverity = checkThresholds();

        // Update RGB LED based on severity
        setRGBLed(g_alertSeverity);

        // Send alert to backend if severity > 0 (with cooldown)
        if (g_alertSeverity >= 1) {
            // Determine fault name based on which sensor triggered
            String faultName = (g_alertSeverity == 2) ? "WATER_QUALITY_CRITICAL" : "WATER_QUALITY_WARNING";

            // Simple cooldown: only send if enough time has passed
            // Using a single cooldown tracker for simplicity
            static unsigned long lastAlertSentMs = 0;
            if (now - lastAlertSentMs >= ALERT_COOLDOWN_MS) {
                lastAlertSentMs = now;
                sendAlert(g_alertSeverity, faultName, g_alertMessage);
                Serial.printf("[ALERT] >> %s: %s\n",
                              (g_alertSeverity == 2) ? "CRITICAL" : "WARNING",
                              g_alertMessage.c_str());
            }
        }
    }

    // ----------------------------------------------------------
    // 2. BUZZER UPDATE (runs every loop iteration for smooth beeping)
    // ----------------------------------------------------------
    updateBuzzer(g_alertSeverity);

    // ----------------------------------------------------------
    // 3. LCD DISPLAY CYCLE (every 3 seconds)
    // ----------------------------------------------------------
    if (now - g_lastLCDCycleMs >= LCD_CYCLE_INTERVAL) {
        g_lastLCDCycleMs = now;
        g_lcdScreen = (g_lcdScreen + 1) % 5;  // Cycle through 5 screens
        updateLCD();
    }

    // ----------------------------------------------------------
    // 4. TELEMETRY TRANSMISSION (every 10 seconds)
    // ----------------------------------------------------------
    if (now - g_lastTelemetryMs >= TELEMETRY_INTERVAL) {
        g_lastTelemetryMs = now;
        sendTelemetry();
    }

    // ----------------------------------------------------------
    // 5. WIFI AUTO-RECONNECT
    // ----------------------------------------------------------
    wifiReconnectCheck();

    // Small delay to keep loop responsive
    delay(50);
}
