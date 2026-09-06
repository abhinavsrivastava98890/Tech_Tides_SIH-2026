const Telemetry = require('../models/Telemetry');
const Alert = require('../models/Alert');

// POST /api/telemetry
exports.addTelemetry = async (req, res) => {
    try {
        const telemetryData = new Telemetry(req.body);
        await telemetryData.save();
        res.status(201).json({ success: true, message: 'Telemetry saved' });
    } catch (error) {
        console.error('Error saving telemetry:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
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
