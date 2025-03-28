const express = require('express');
const router = express.Router();

// Import controllers
const getWinnerDataController = require('../controllers/getWinnerDataController');
const getTouchDownsDataController = require('../controllers/getTouchDownsDataController'); // ✅ Correct Import

// Define routes
router.get('/getWinner', getWinnerDataController.getWinner); // ✅ Working route
router.get('/getTouchDowns', getTouchDownsDataController.getTouchDowns); // ✅ Check for typos here!

module.exports = router;
