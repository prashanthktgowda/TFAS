const express = require('express');
const router = express.Router();
const fundsController = require('../controllers/fundsController');

// Define routes
router.get('/', fundsController.getFunds); // Get fund details
router.post('/allocate', fundsController.allocateFunds); // Allocate funds
router.post('/milestone', fundsController.completeMilestone); // Complete milestone

module.exports = router;