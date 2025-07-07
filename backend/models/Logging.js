const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Logging = sequelize.define('Logging', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  level: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
  meta: { type: DataTypes.JSON, allowNull: true },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { timestamps: false });

module.exports = Logging;
