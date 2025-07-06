const express = require('express');
const router = express.Router();
const barcodeService = require('../services/barcodeService');
const { auth } = require('../middleware/auth');

router.post('/scan', auth, async (req, res) => {
  try {
    const { barcode } = req.body;
    const product = await barcodeService.scanBarcode(barcode);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Barcode scan failed', error: err.message });
  }
});

module.exports = router;
