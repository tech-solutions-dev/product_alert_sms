const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const UserCategory = require('./UserCategory');
const Backup = require('./Backup');
const Logging = require('./Logging');

User.belongsToMany(Category, { through: UserCategory, foreignKey: 'userId', as: 'categories' });
Category.belongsToMany(User, { through: UserCategory, foreignKey: 'categoryId', as: 'users' });

Category.hasMany(Product, { 
  foreignKey: 'categoryId',
  onDelete: 'CASCADE',
  hooks: true
});
Product.belongsTo(Category, { 
  foreignKey: 'categoryId',
  onDelete: 'CASCADE'
});

module.exports = {
  User,
  Category,
  Product,
  UserCategory,
  Backup,
  Logging,
};
