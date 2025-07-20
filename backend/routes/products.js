const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', auth, productController.getAllProducts);
router.get('/:id', auth, productController.getProductById);
router.post('/', auth, roleCheck(['admin']), productController.createProduct);
router.put('/:id', auth, roleCheck(['admin']), productController.updateProduct);
router.delete('/:id', auth, roleCheck(['admin']), productController.deleteProduct);

module.exports = router;
