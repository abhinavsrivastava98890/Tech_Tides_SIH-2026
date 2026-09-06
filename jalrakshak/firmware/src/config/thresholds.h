// ============================================================
// Jalrakshak — Smart Water Purification System
// config/thresholds.h — ALL configurable quality thresholds.
//
// IMPORTANT DISCLAIMER:
// Values below are PROJECT-SPECIFIC working thresholds set by
// the engineering team for this system demonstration. They are
// NOT certified drinking-water safety limits. Consult applicable
// water-quality standards (BIS 10500, WHO Guidelines, etc.) for
// any real-world deployment.
//
// Adjust these values based on your calibrated sensors and
// project requirements BEFORE deployment.
// ============================================================
#pragma once

// ──────────────────────────────────────────────────────────────
// SECTION 1: SENSOR PLAUSIBILITY RANGES
// These are the physically possible limits for each sensor.
// A reading outside these ranges = sensor fault, NOT bad water.
// ──────────────────────────────────────────────────────────────

#define SENSOR_PH_MIN_PLAUSIBLE         0.0f
#define SENSOR_PH_MAX_PLAUSIBLE         14.0f

#define SENSOR_TDS_MIN_PPM_PLAUSIBLE    0.0f
#define SENSOR_TDS_MAX_PPM_PLAUSIBLE    5000.0f

#define SENSOR_TURB_MIN_NTU_PLAUSIBLE   0.0f
#define SENSOR_TURB_MAX_NTU_PLAUSIBLE   1000.0f

#define SENSOR_TEMP_MIN_C_PLAUSIBLE     0.0f
#define SENSOR_TEMP_MAX_C_PLAUSIBLE     60.0f

#define SENSOR_FLOW_MIN_LPM_PLAUSIBLE   0.0f
#define SENSOR_FLOW_MAX_LPM_PLAUSIBLE   30.0f

// Max allowed change between consecutive readings (delta check).
// A jump larger than this in one cycle = suspect reading.
#define SENSOR_PH_MAX_DELTA_PER_CYCLE       2.0f
#define SENSOR_TDS_MAX_DELTA_PPM_PER_CYCLE  500.0f
#define SENSOR_TURB_MAX_DELTA_NTU_PER_CYCLE 200.0f
#define SENSOR_TEMP_MAX_DELTA_C_PER_CYCLE   5.0f
#define SENSOR_FLOW_MAX_DELTA_LPM_PER_CYCLE 10.0f

// Number of consecutive identical readings = stuck sensor fault
#define SENSOR_STUCK_COUNT_THRESHOLD    5

// ──────────────────────────────────────────────────────────────
// SECTION 2: OUTPUT WATER QUALITY DECISION THRESHOLDS
// Applied to TREATED water after UV. Used for PASS/WARN/FAIL.
// ──────────────────────────────────────────────────────────────

// pH Thresholds (output water)
#define THRESH_OUT_PH_WARN_LOW          6.5f     // Below this = WARNING
#define THRESH_OUT_PH_WARN_HIGH         8.5f     // Above this = WARNING
#define THRESH_OUT_PH_CRIT_LOW          5.5f     // Below this = CRITICAL/FAIL
#define THRESH_OUT_PH_CRIT_HIGH         9.5f     // Above this = CRITICAL/FAIL

// TDS / EC Thresholds (output water, in ppm)
#define THRESH_OUT_TDS_NORMAL_PPM       200.0f   // Below = NORMAL
#define THRESH_OUT_TDS_WARNING_PPM      400.0f   // 200–400 = WARNING
#define THRESH_OUT_TDS_CRITICAL_PPM     600.0f   // Above = FAIL

// Output Turbidity Thresholds (NTU)
#define THRESH_OUT_TURB_NORMAL_NTU      1.0f     // Below = NORMAL
#define THRESH_OUT_TURB_WARNING_NTU     4.0f     // 1–4 = WARNING
#define THRESH_OUT_TURB_CRITICAL_NTU    10.0f    // Above = FAIL

// ──────────────────────────────────────────────────────────────
// SECTION 3: RAW WATER CLASSIFICATION THRESHOLDS
// Used to classify incoming water and log baseline condition.
// Does NOT stop treatment — used for data classification only.
// ──────────────────────────────────────────────────────────────

// Raw Turbidity Levels (NTU)
#define THRESH_RAW_TURB_NORMAL_NTU      5.0f
#define THRESH_RAW_TURB_HIGH_NTU        50.0f
#define THRESH_RAW_TURB_CRITICAL_NTU    200.0f

// Raw TDS Levels (ppm)
#define THRESH_RAW_TDS_NORMAL_PPM       500.0f
#define THRESH_RAW_TDS_HIGH_PPM         1000.0f
#define THRESH_RAW_TDS_CRITICAL_PPM     2000.0f

// ──────────────────────────────────────────────────────────────
// SECTION 4: SYSTEM / PROCESS THRESHOLDS
// ──────────────────────────────────────────────────────────────

// Tank levels (as percentage of capacity, 0–100%)
#define THRESH_RAW_TANK_LOW_PCT         20.0f    // Pump stops if raw tank below this
#define THRESH_CLEAN_TANK_FULL_PCT      90.0f    // Pump stops if clean tank above this

// Flow rates
#define THRESH_MIN_FLOW_CONFIRM_LPM     0.5f     // Flow must exceed this to confirm pump running
#define THRESH_NORMAL_FLOW_LPM          2.0f     // Expected flow during normal treatment

// TDS Reduction (for performance logging only — NOT a pass/fail criterion)
#define THRESH_TDS_REDUCTION_GOOD_PCT   60.0f    // Log as "good RO performance"
#define THRESH_TDS_REDUCTION_POOR_PCT   30.0f    // Log as "poor RO performance" (membrane alert)
