const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', auth, roleCheck(['admin', 'manager']), reportController.getAllReports);
router.post('/generate', auth, roleCheck(['admin', 'manager']), reportController.generateReport);
router.get('/:id', auth, roleCheck(['admin', 'manager']), reportController.getReportById);
module.exports = router;
