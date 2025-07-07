const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', auth, roleCheck(['admin']), backupController.getAllBackups);
router.post('/create', auth, roleCheck(['admin']), backupController.createBackup);
router.post('/restore/:backupId', auth, roleCheck(['admin']), backupController.restoreBackup);

module.exports = router;
