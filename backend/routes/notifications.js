const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const PushSubscription = require('../models/PushSubscription');
const dotenv = require('dotenv');

dotenv.config();

// Configure web-push with VAPID details
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@jalrakshak.in',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Route to subscribe a client
router.post('/subscribe', async (req, res) => {
  try {
    const subscription = req.body;
    
    // Check if subscription already exists based on endpoint
    const existingSub = await PushSubscription.findOne({ endpoint: subscription.endpoint });
    if (!existingSub) {
      await PushSubscription.create(subscription);
    }

    res.status(201).json({ success: true, message: 'Subscription saved successfully.' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Route for testing notifications
router.post('/test', async (req, res) => {
  try {
    const payload = JSON.stringify({
      title: 'JalRakshak Alert',
      body: 'This is a test push notification from JalRakshak.',
      icon: '/icons.svg',
      data: { url: '/' }
    });

    const subscriptions = await PushSubscription.find();
    
    const sendPromises = subscriptions.map(sub => {
      return webpush.sendNotification(sub, payload).catch(err => {
        console.error('Error sending notification, removing subscription:', err);
        if (err.statusCode === 410 || err.statusCode === 404) {
          return PushSubscription.deleteOne({ endpoint: sub.endpoint });
        }
      });
    });

    await Promise.all(sendPromises);

    res.status(200).json({ success: true, message: `Sent test notification to ${subscriptions.length} devices.` });
  } catch (error) {
    console.error('Error in test push:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
