const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', auth, categoryController.getAllCategories);
router.get('/:id', auth, categoryController.getCategoryById);
router.post('/', auth, roleCheck(['admin', 'manager']), categoryController.createCategory);
router.put('/:id', auth, roleCheck(['admin', 'manager']), categoryController.updateCategory);
router.delete('/:id', auth, roleCheck(['admin', 'manager']), categoryController.deleteCategory);

module.exports = router;
