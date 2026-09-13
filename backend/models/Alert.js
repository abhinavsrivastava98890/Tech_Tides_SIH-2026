const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        index: true
    },
    alertId: {
        type: String,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    faultCode: {
        type: Number,
        required: true
    },
    faultName: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['NORMAL', 'WARNING', 'HIGH', 'CRITICAL', 'UNKNOWN'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    resolved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
