const Alert = require('../models/Alert');

// POST /api/alerts
exports.addAlert = async (req, res) => {
    try {
        const alertData = new Alert(req.body);
        await alertData.save();
        res.status(201).json({ success: true, message: 'Alert saved' });
    } catch (error) {
        console.error('Error saving alert:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
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
