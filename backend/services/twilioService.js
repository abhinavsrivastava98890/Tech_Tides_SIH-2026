const twilio = require('twilio');

// Load environment variables for Twilio
// Make sure you add these to your .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const notificationPhoneNumber = process.env.NOTIFICATION_PHONE_NUMBER;

let client;
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
} else {
    console.warn('Twilio credentials not found. SMS and Calls will be disabled.');
}

/**
 * Sends an SMS alert
 * @param {string} message - The alert message
 */
exports.sendSMS = async (message) => {
    if (!client) return;
    try {
        await client.messages.create({
            body: `[JALRAKSHAK ALERT]: ${message}`,
            from: twilioPhoneNumber,
            to: notificationPhoneNumber
        });
        console.log('SMS Alert sent successfully');
    } catch (error) {
        console.error('Failed to send Twilio SMS:', error);
    }
};

/**
 * Initiates an automated Voice Call
 * @param {string} message - The message to be spoken
 */
exports.makeCall = async (message) => {
    if (!client) return;
    try {
        // TwiML (Twilio Markup Language) to say the message using Text-to-Speech
        const twimlMessage = `
            <Response>
                <Say>Attention! This is an emergency alert from the Jal Rakshak system. ${message}</Say>
            </Response>
        `;
        
        await client.calls.create({
            twiml: twimlMessage,
            from: twilioPhoneNumber,
            to: notificationPhoneNumber
        });
        console.log('Voice Call Alert initiated successfully');
    } catch (error) {
        console.error('Failed to initiate Twilio Call:', error);
    }
};
