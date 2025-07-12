const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', auth, roleCheck(['admin']), userController.getAllUsers);
router.post('/', auth, roleCheck(['admin']), userController.createUser);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, roleCheck(['admin']), userController.deleteUser);

module.exports = router;
