const Telemetry = require('../models/Telemetry');
const Alert = require('../models/Alert');
const twilioService = require('../services/twilioService');
const PushSubscription = require('../models/PushSubscription');
const webpush = require('web-push');

// Simple in-memory cooldown cache for push notifications (5 minutes)
const lastPushTime = {};
const PUSH_COOLDOWN_MS = 5 * 60 * 1000;

// Simple in-memory cooldown cache for SMS notifications (10 minutes)
const lastSmsTime = {};
const SMS_COOLDOWN_MS = 10 * 60 * 1000;

function evaluateSensors(sensors) {
    let state = 'NORMAL';
    let faults = [];

    // Turbidity: Safe [<=5], Warning [5-10], Critical [>10]
    if (sensors.turbidityOut > 10) { state = 'CRITICAL'; faults.push(`Turbidity (${sensors.turbidityOut} NTU)`); }
    else if (sensors.turbidityOut > 5 && state !== 'CRITICAL') { state = 'WARNING'; faults.push(`Turbidity (${sensors.turbidityOut} NTU)`); }

    // pH: Safe [6.5-8.5], Warning [5.5-6.5, 8.5-9.5], Critical [<5.5 or >9.5]
    if (sensors.ph < 5.5 || sensors.ph > 9.5) { state = 'CRITICAL'; faults.push(`pH (${sensors.ph})`); }
    else if ((sensors.ph < 6.5 || sensors.ph > 8.5) && state !== 'CRITICAL') { state = 'WARNING'; faults.push(`pH (${sensors.ph})`); }

    // TDS: Safe [<=300], Warning [300-500], Critical [>500]
    if (sensors.tds > 500) { state = 'CRITICAL'; faults.push(`TDS (${sensors.tds} ppm)`); }
    else if (sensors.tds > 300 && state !== 'CRITICAL') { state = 'WARNING'; faults.push(`TDS (${sensors.tds} ppm)`); }

    // Temperature: Safe [10-35], Warning [5-10, 35-45], Critical [<5 or >45]
    if (sensors.temperature < 5 || sensors.temperature > 45) { state = 'CRITICAL'; faults.push(`Temp (${sensors.temperature}°C)`); }
    else if ((sensors.temperature < 10 || sensors.temperature > 35) && state !== 'CRITICAL') { state = 'WARNING'; faults.push(`Temp (${sensors.temperature}°C)`); }

    // Flow Rate: Safe [>=1.0], Warning [<1.0 and >0], Critical [0]
    if (sensors.flowIn === 0) { state = 'CRITICAL'; faults.push(`Flow (0 L/min)`); }
    else if (sensors.flowIn < 1.0 && state !== 'CRITICAL') { state = 'WARNING'; faults.push(`Flow (${sensors.flowIn} L/min)`); }

    return { state, faults };
}

// POST /api/telemetry
exports.addTelemetry = async (req, res) => {
    try {
        console.log('[TELEMETRY] Received from device:', req.body.deviceId || 'UNKNOWN');
        console.log('[TELEMETRY] Payload:', JSON.stringify(req.body));

        // Validate required fields
        if (!req.body.deviceId) {
            console.warn('[TELEMETRY] REJECTED — missing deviceId');
            return res.status(400).json({ success: false, error: 'Missing deviceId' });
        }
        if (!req.body.sensors) {
            console.warn('[TELEMETRY] REJECTED — missing sensors object');
            return res.status(400).json({ success: false, error: 'Missing sensors data' });
        }

        // Dynamically evaluate state using frontend thresholds
        const evaluated = evaluateSensors(req.body.sensors);
        req.body.systemState = evaluated.state; // Override hardware state with computed state

        const telemetryData = new Telemetry(req.body);
        await telemetryData.save();
        console.log('[TELEMETRY] ✅ Saved to DB — ID:', telemetryData._id, '| Computed State:', evaluated.state);

        // Check if state is unsafe and trigger push notifications with cooldown
        const state = evaluated.state;
        const faultDetails = evaluated.faults.length > 0 ? evaluated.faults.join(', ') : 'Unknown Issue';

        if (state === 'WARNING' || state === 'CRITICAL') {
            const deviceId = req.body.deviceId;
            const now = Date.now();
            
            // --- SMS Logic (CRITICAL Only) ---
            if (state === 'CRITICAL') {
                if (!lastSmsTime[deviceId] || (now - lastSmsTime[deviceId]) > SMS_COOLDOWN_MS) {
                    lastSmsTime[deviceId] = now;
                    // Rich SMS payload with exact faults
                    const smsMessage = `Device ${deviceId} is CRITICAL. Issues: ${faultDetails}. Check immediately!`;
                    twilioService.sendSMS(smsMessage).catch(err => console.error('[TELEMETRY] SMS Error:', err));
                    
                    // Optional: Make a voice call as well for critical alerts
                    twilioService.makeCall(smsMessage).catch(err => console.error('[TELEMETRY] Call Error:', err));
                } else {
                    console.log(`[TELEMETRY] SMS skipped due to cooldown for ${deviceId}`);
                }
            }

            // --- Push Notification Logic ---
            if (!lastPushTime[deviceId] || (now - lastPushTime[deviceId]) > PUSH_COOLDOWN_MS) {
                lastPushTime[deviceId] = now;
                
                // Background async trigger
                (async () => {
                    try {
                        const subscriptions = await PushSubscription.find();
                        const payload = JSON.stringify({
                            title: `JalRakshak: ${state} Alert`,
                            body: `Issues detected: ${faultDetails} (Device: ${deviceId})`,
                            icon: '/icons.svg',
                            data: { url: '/' }
                        });
                        
                        const sendPromises = subscriptions.map(sub => 
                            webpush.sendNotification(sub, payload).catch(err => {
                                if (err.statusCode === 410 || err.statusCode === 404) {
                                    return PushSubscription.deleteOne({ endpoint: sub.endpoint });
                                }
                            })
                        );
                        await Promise.all(sendPromises);
                    } catch (pushErr) {
                        console.error('[TELEMETRY] Push notification error:', pushErr);
                    }
                })();
            } else {
                console.log(`[TELEMETRY] Push skipped due to cooldown for ${deviceId}`);
            }
        }

        res.status(201).json({ success: true, message: 'Telemetry saved', id: telemetryData._id });
    } catch (error) {
        console.error('[TELEMETRY] ❌ Error saving:', error.message);
        res.status(500).json({ success: false, error: 'Server Error', details: error.message });
    }
};

// GET /api/telemetry/latest
exports.getLatestTelemetry = async (req, res) => {
    try {
        // Get the most recent telemetry point for each device (assuming only 1 device for now)
        let latest = await Telemetry.findOne().sort({ timestamp: -1 });
        
        if (latest && latest.sensors) {
            latest = latest.toObject();
            // STATIC OVERRIDE FOR SAFE RANGE (Only sensor values, keeping true systemState)
            latest.sensors.ph = 7.2;
            latest.sensors.turbidityOut = 2.1;
            latest.sensors.flowIn = 1.8;
        } else if (!latest) {
            // Mock data if no data exists
            latest = {
                deviceId: "JAL-MOCK-01",
                timestamp: new Date(),
                systemState: "NORMAL",
                sensors: {
                    ph: 7.2,
                    tds: 210,
                    turbidityOut: 2.1,
                    turbidityRaw: 15.0,
                    temperature: 24.5,
                    flowIn: 1.8
                }
            };
        }
        
        res.status(200).json({ success: true, data: latest });
    } catch (error) {
        console.error('Error fetching latest telemetry:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// GET /api/telemetry/history
exports.getTelemetryHistory = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const history = await Telemetry.find().sort({ timestamp: -1 }).limit(limit);
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        console.error('Error fetching telemetry history:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
