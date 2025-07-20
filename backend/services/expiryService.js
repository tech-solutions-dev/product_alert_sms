const { Product, Category, User, UserCategory } = require('../models');
const { Op } = require('sequelize');
const emailService = require('./emailService');

// Product status constants
const PRODUCT_STATUS = {
  FRESH: 'Fresh',
  EXPIRING: 'Expiring Soon',
  EXPIRED: 'Expired'
};

// Check for products expiring soon and expired products, update their status and send notifications
exports.checkExpiries = async () => {
  const now = new Date();
  const warningDays = parseInt(process.env.EXPIRY_WARNING_DAYS || '30');
  const warningDate = new Date();
  warningDate.setDate(now.getDate() + warningDays);

  try {
    // Find products that will expire within the warning period
    const expiringProducts = await Product.findAll({
      where: {
        expiryDate: { 
          [Op.between]: [now, warningDate]
        },
        status: { 
          [Op.ne]: PRODUCT_STATUS.EXPIRING 
        }
      },
      include: [{
        model: Category,
        include: [{
          model: UserCategory,
          include: [{
            model: User,
            attributes: ['id', 'email', 'username']
          }]
        }]
      }]
    });

    // Find products that have expired
    const expiredProducts = await Product.findAll({
      where: {
        expiryDate: { 
          [Op.lt]: now 
        },
        status: { 
          [Op.ne]: PRODUCT_STATUS.EXPIRED 
        }
      },
      include: [{
        model: Category,
        include: [{
          model: UserCategory,
          include: [{
            model: User,
            attributes: ['id', 'email', 'username']
          }]
        }]
      }]
    });

    // Process expiring products
    for (const product of expiringProducts) {
      // Update product status
      await product.update({ status: PRODUCT_STATUS.EXPIRING });

      // Get users managing this category
      const users = product.Category?.UserCategories?.map(uc => uc.User).filter(Boolean) || [];
      
      if (users.length > 0) {
        // Send notifications to all users managing this category
        await emailService.sendExpiryAlert(product, users, {
          daysToExpiry: Math.ceil((new Date(product.expiryDate) - now) / (1000 * 60 * 60 * 24)),
          type: 'expiring'
        });
      }
    }

    // Process expired products
    for (const product of expiredProducts) {
      // Update product status
      await product.update({ status: PRODUCT_STATUS.EXPIRED });

      // Get users managing this category
      const users = product.Category?.UserCategories?.map(uc => uc.User).filter(Boolean) || [];
      
      if (users.length > 0) {
        // Send notifications to all users managing this category
        await emailService.sendExpiryAlert(product, users, {
          type: 'expired'
        });
      }
    }

    console.log(`Processed ${expiringProducts.length} expiring products and ${expiredProducts.length} expired products`);
    return {
      expiring: expiringProducts.length,
      expired: expiredProducts.length
    };
  } catch (error) {
    console.error('Error in checkExpiries:', error);
    throw error;
  }
};

// Update product status based on expiry date
exports.updateProductStatus = async (product) => {
  const now = new Date();
  const expiryDate = new Date(product.expiryDate);
  const warningDays = parseInt(process.env.EXPIRY_WARNING_DAYS || '30');
  const warningDate = new Date();
  warningDate.setDate(now.getDate() + warningDays);

  let newStatus;
  if (expiryDate < now) {
    newStatus = PRODUCT_STATUS.EXPIRED;
  } else if (expiryDate <= warningDate) {
    newStatus = PRODUCT_STATUS.EXPIRING;
  } else {
    newStatus = PRODUCT_STATUS.FRESH;
  }

  if (product.status !== newStatus) {
    await product.update({ status: newStatus });
  }

  return newStatus;
};
