// ============================================================
// Jalrakshak — water_quality_engine/quality_engine.cpp
// ============================================================
#include "quality_engine.h"
#include "../config/thresholds.h"
#include "../alert_manager/alert_engine.h"

static QualityLevel _overallQuality = QualityLevel::NORMAL;

void QualityEngine_Evaluate(const WaterSnapshot& snapshot) {
    QualityLevel worstQuality = QualityLevel::NORMAL;

    // Check TDS
    if (snapshot.tds.isValid) {
        if (snapshot.tds.value > THRESHOLD_TDS_CRITICAL) {
            AlertEngine_Raise(FaultCode::WATER_QUALITY_CRITICAL, AlertSeverity::CRITICAL, "TDS is critically high: " + String(snapshot.tds.value) + " ppm");
            worstQuality = max(worstQuality, QualityLevel::CRITICAL);
        } else if (snapshot.tds.value > THRESHOLD_TDS_WARN_HIGH) {
            AlertEngine_Raise(FaultCode::WATER_QUALITY_WARNING, AlertSeverity::WARNING, "TDS is high: " + String(snapshot.tds.value) + " ppm");
            worstQuality = max(worstQuality, QualityLevel::WARNING);
        } else if (snapshot.tds.value < THRESHOLD_TDS_WARN_LOW) {
            AlertEngine_Raise(FaultCode::WATER_QUALITY_WARNING, AlertSeverity::WARNING, "TDS is unusually low: " + String(snapshot.tds.value) + " ppm");
            worstQuality = max(worstQuality, QualityLevel::WARNING);
        }
    }

    // Check Turbidity
    if (snapshot.turbidity.isValid) {
        if (snapshot.turbidity.value > THRESHOLD_TURBIDITY_CRITICAL) {
            AlertEngine_Raise(FaultCode::WATER_QUALITY_CRITICAL, AlertSeverity::CRITICAL, "Turbidity is critically high: " + String(snapshot.turbidity.value) + " NTU");
            worstQuality = max(worstQuality, QualityLevel::CRITICAL);
        } else if (snapshot.turbidity.value > THRESHOLD_TURBIDITY_WARN) {
            AlertEngine_Raise(FaultCode::WATER_QUALITY_WARNING, AlertSeverity::WARNING, "Turbidity is high: " + String(snapshot.turbidity.value) + " NTU");
            worstQuality = max(worstQuality, QualityLevel::WARNING);
        }
    }

    // Resolve if normal
    if (worstQuality == QualityLevel::NORMAL) {
        AlertEngine_Resolve(FaultCode::WATER_QUALITY_WARNING);
        AlertEngine_Resolve(FaultCode::WATER_QUALITY_CRITICAL);
    }

    _overallQuality = worstQuality;
}

QualityLevel QualityEngine_GetOverallQuality() {
    return _overallQuality;
}
