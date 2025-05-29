const express = require('express');
const router = express.Router();

// Simple test route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Test route working'
  });
});

// Test route with parameter
router.get('/test/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Test route with ID working',
    id: req.params.id
  });
});

module.exports = router;