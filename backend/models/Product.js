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
      get() {
        return getProductStatus(this.expiryDate);
      },
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeValidate: (product, options) => {
        if (product.expiryDate) {
          product.status = getProductStatus(product.expiryDate);
        }
      },
      beforeSave: (product, options) => {
        product.status = getProductStatus(product.expiryDate);
      },
      beforeBulkCreate: (products, options) => {
        products.forEach((product) => {
          product.status = getProductStatus(product.expiryDate);
        });
      },
      beforeUpdate: (product, options) => {
        // console.log(product);
        if (product.changed("expiryDate")) {
          console.log("I am changed");
          product.status = getProductStatus(product.expiryDate);
          console.log("Status set to:", product.status);
        }
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
