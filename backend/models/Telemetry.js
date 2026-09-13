const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    sensors: {
        ph: { type: Number },
        tds: { type: Number },
        turbidityOut: { type: Number },
        turbidityRaw: { type: Number },
        flowIn: { type: Number },
        flowOut: { type: Number },
        temperature: { type: Number }
    },
    actuators: {
        pumpOn: { type: Boolean },
        uvOn: { type: Boolean }
    },
    systemState: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Telemetry', telemetrySchema);
