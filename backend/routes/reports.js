const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const reportsController = require('../controllers/reportsController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', auth, roleCheck(['admin', 'user']), reportController.getAllReports);
router.post('/generate', auth, roleCheck(['admin', 'user']), reportController.generateReport);

router.post('/products', auth, roleCheck(['admin', 'user']), reportsController.generateProductsReport);
module.exports = router;
