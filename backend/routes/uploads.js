const express = require('express');
const router = express.Router();
const multer = require('../config/multer');
const { auth } = require('../middleware/auth');

router.post('/', auth, multer.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.status(201).json({ file: req.file.filename });
});

module.exports = router;
