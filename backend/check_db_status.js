require('dotenv').config();
const mongoose = require('mongoose');
const Telemetry = require('./models/Telemetry');
const Alert = require('./models/Alert');
const connectDB = require('./config/db');

async function checkData() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const telemetryCount = await Telemetry.countDocuments();
        console.log(`\nTotal Telemetry Records: ${telemetryCount}`);
        
        if (telemetryCount > 0) {
            const latestTelemetry = await Telemetry.findOne().sort({ timestamp: -1 });
            console.log('Latest Telemetry Data:');
            console.log(JSON.stringify(latestTelemetry, null, 2));
        }

        const alertCount = await Alert.countDocuments();
        console.log(`\nTotal Alert Records: ${alertCount}`);
        
        if (alertCount > 0) {
            const latestAlert = await Alert.findOne().sort({ timestamp: -1 });
            console.log('Latest Alert Data:');
            console.log(JSON.stringify(latestAlert, null, 2));
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnection closed.');
    }
}

checkData();
