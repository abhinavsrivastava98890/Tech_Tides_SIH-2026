const Telemetry = require('../models/Telemetry');
const Alert = require('../models/Alert');

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
        if (!req.body.systemState) {
            console.warn('[TELEMETRY] REJECTED — missing systemState');
            return res.status(400).json({ success: false, error: 'Missing systemState' });
        }

        const telemetryData = new Telemetry(req.body);
        await telemetryData.save();
        console.log('[TELEMETRY] ✅ Saved to DB — ID:', telemetryData._id);

        // Check if state is unsafe and trigger push notifications
        if (req.body.systemState === 'WARNING' || req.body.systemState === 'CRITICAL') {
            const PushSubscription = require('../models/PushSubscription');
            const webpush = require('web-push');
            
            // Background async trigger
            (async () => {
                try {
                    const subscriptions = await PushSubscription.find();
                    const payload = JSON.stringify({
                        title: `JalRakshak: ${req.body.systemState} Alert`,
                        body: `Contamination or system issue detected! Device: ${req.body.deviceId}`,
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
        const latest = await Telemetry.findOne().sort({ timestamp: -1 });
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
