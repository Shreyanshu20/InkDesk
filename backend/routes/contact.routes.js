const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// get contact form email 
router.post('/send-message', contactController.sendMessage);

module.exports = router;