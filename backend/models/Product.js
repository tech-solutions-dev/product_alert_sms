const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { getProductStatus } = require("../config/utils");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    barcode: { type: DataTypes.STRING, allowNull: true },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("DATE_ADD(NOW(), INTERVAL 30 DAY)"),
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { 
        model: "Categories", 
        key: "id",
      },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Fresh',
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeValidate: (product) => {
        if (product.expiryDate) {
          product.status = getProductStatus(product.expiryDate);
        }
      },
      beforeSave: (product) => {
        product.status = getProductStatus(product.expiryDate);
      },
      beforeBulkCreate: (products) => {
        products.forEach((product) => {
          product.status = getProductStatus(product.expiryDate);
        });
      },
      beforeUpdate: (product) => {
        product.status = getProductStatus(product.expiryDate);
      },
      beforeBulkUpdate: (options) => {
        if (options.attributes && options.attributes.expiryDate) {
          options.attributes.status = getProductStatus(options.attributes.expiryDate);
        }
      },
    },
  }
);

module.exports = Product;
