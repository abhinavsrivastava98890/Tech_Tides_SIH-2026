const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.post('/', alertController.addAlert);
router.get('/active', alertController.getActiveAlerts);
router.put('/:id/resolve', alertController.resolveAlert);

module.exports = router;
