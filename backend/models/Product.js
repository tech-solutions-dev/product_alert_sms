const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');
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
      references: { model: "Categories", key: "id" },
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
        console.log("Before save hook triggered for product:", product.name);
        console.log(`Expiry Date: ${product.expiryDate}`);
        console.log(`Current Status: ${product.status}`);
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
      afterSave: (product) => {
        console.log("Product saved, updating status...");
        console.log(`New status:${product.status} with expiry ${product.expiryDate}`);
        // product.status = getProductStatus(product.expiryDate);
        // return product.save();
      },
    },
    // toJSON: {
    //   virtuals: true,
    //   getters: true,
    // },
    // toObject: {
    //   virtuals: true,
    //   getters: true,
    // },
  }
);

Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;
