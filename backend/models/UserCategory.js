const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserCategory = sequelize.define('UserCategory', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });

module.exports = UserCategory;
