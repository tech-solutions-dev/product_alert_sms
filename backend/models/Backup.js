const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Backup = sequelize.define('Backup', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  filePath: { type: DataTypes.STRING, allowNull: false },
  downloadUrl: { type: DataTypes.STRING, allowNull: true },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { timestamps: false });

module.exports = Backup;
