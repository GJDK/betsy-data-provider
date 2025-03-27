// // routes/dataRoutes.js
// const express = require('express');
// const router = express.Router();
// const dataController = require('../controllers/dataController');
// const getWinnerDataController = require('../controllers/getWinnerDataController');

// // Dynamic routes for GET and POST requests
// router.get('/:type/:id', dataController.handleGetRequest);
// router.post('/:type', dataController.handlePostRequest);

// router.get('/getWinner', getWinnerDataController.getWinner);

// module.exports = router;

// routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const getWinnerDataController = require('../controllers/getWinnerDataController'); // ✅ Use new controller

// Dynamic routes for mock data
// If you still have other routes using dataController, keep this
// const dataController = require('../controllers/dataController');

// Route for /getWinner - using the new controller
router.get('/getWinner', getWinnerDataController.getWinner);

module.exports = router;

