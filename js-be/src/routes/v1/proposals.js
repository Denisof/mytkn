const express = require('express');
const router = express.Router();
const proposalController = require('../../controllers/proposalController');

router.get('/', proposalController.getAll);
router.get('/:proposalId', proposalController.getById);

module.exports = router;
