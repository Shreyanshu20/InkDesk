const express = require('express');
const router = express.Router();
const { 
  processVoiceCommand, 
  logVoiceSearch 
} = require('../controllers/voiceSearch.controller');

// Process voice command
router.post('/process', processVoiceCommand);

// Log voice search analytics
router.post('/analytics', logVoiceSearch);

module.exports = router;