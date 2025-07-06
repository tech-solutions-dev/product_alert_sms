const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const UserCategory = require('./UserCategory');
const Report = require('./Report');
const Backup = require('./Backup');
const Logging = require('./Logging');

// Associations
User.belongsToMany(Category, { through: UserCategory, foreignKey: 'userId' });
Category.belongsToMany(User, { through: UserCategory, foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
  User,
  Category,
  Product,
  UserCategory,
  Report,
  Backup,
  Logging,
};
