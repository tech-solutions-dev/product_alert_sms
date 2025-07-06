const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const reportRoutes = require('./reports');
const backupRoutes = require('./backups');
const dashboardRoutes = require('./dashboard');
const barcodeRoutes = require('./barcode');
const uploadRoutes = require('./uploads');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/reports', reportRoutes);
router.use('/backups', backupRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/barcode', barcodeRoutes);
router.use('/uploads', uploadRoutes);

module.exports = router;
