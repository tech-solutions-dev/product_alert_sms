const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.get('/', auth, dashboardController.getDashboardOverview);

module.exports = router;
