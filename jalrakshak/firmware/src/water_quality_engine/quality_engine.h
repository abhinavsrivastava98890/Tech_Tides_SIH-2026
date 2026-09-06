// ============================================================
// Jalrakshak — water_quality_engine/quality_engine.h
// ============================================================
#pragma once
#include "../sensor_manager/sensor_types.h"

void QualityEngine_Evaluate(const WaterSnapshot& snapshot);
QualityLevel QualityEngine_GetOverallQuality();
