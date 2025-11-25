const express = require('express');
const router = express.Router();

// Import route modules
const proposalRoutes = require('./proposals');

// Health check
router.get('/', (req, res) => {
  res.json({ message: 'API v1', version: '1.0.0' });
});

// Mount routes
router.use('/proposals', proposalRoutes);

module.exports = router;

