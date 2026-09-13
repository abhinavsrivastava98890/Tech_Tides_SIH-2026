const Alert = require('../models/Alert');
const twilioService = require('../services/twilioService');

// POST /api/alerts
exports.addAlert = async (req, res) => {
    try {
        console.log('[ALERT] Received from device:', req.body.deviceId || 'UNKNOWN');
        console.log('[ALERT] Payload:', JSON.stringify(req.body));

        // Validate required fields
        if (!req.body.deviceId || !req.body.alertId || !req.body.severity || !req.body.message) {
            console.warn('[ALERT] REJECTED — missing required fields');
            return res.status(400).json({ success: false, error: 'Missing required alert fields' });
        }

        const alertData = new Alert(req.body);
        await alertData.save();
        console.log('[ALERT] ✅ Saved to DB — ID:', alertData._id, 'Severity:', alertData.severity);
        
        // Trigger Twilio SMS and Voice Call for severe alerts
        if (alertData.severity === 'CRITICAL') {
            const message = `Critical Alert Detected. Fault Name: ${alertData.faultName}. Message: ${alertData.message}`;
            await twilioService.sendSMS(message);
            await twilioService.makeCall(message);
        } else if (alertData.severity === 'HIGH') {
            const message = `High Alert Detected. Fault Name: ${alertData.faultName}. Message: ${alertData.message}`;
            await twilioService.sendSMS(message);
        }

        res.status(201).json({ success: true, message: 'Alert saved', id: alertData._id });
    } catch (error) {
        console.error('[ALERT] ❌ Error saving:', error.message);
        res.status(500).json({ success: false, error: 'Server Error', details: error.message });
    }
};

// GET /api/alerts/active
exports.getActiveAlerts = async (req, res) => {
    try {
        const activeAlerts = await Alert.find({ resolved: false }).sort({ timestamp: -1 });
        res.status(200).json({ success: true, data: activeAlerts });
    } catch (error) {
        console.error('Error fetching active alerts:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// PUT /api/alerts/:id/resolve
exports.resolveAlert = async (req, res) => {
    try {
        const alert = await Alert.findOneAndUpdate(
            { alertId: req.params.id }, 
            { resolved: true }, 
            { new: true }
        );
        if (!alert) {
            return res.status(404).json({ success: false, message: 'Alert not found' });
        }
        res.status(200).json({ success: true, data: alert });
    } catch (error) {
        console.error('Error resolving alert:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
