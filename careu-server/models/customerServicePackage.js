const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CustomerServicePackage = sequelize.define("CustomerServicePackage", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  customer_id: { type: DataTypes.INTEGER, allowNull: false },
  service_id: { type: DataTypes.INTEGER, allowNull: false },

  total_sessions: { type: DataTypes.INTEGER, defaultValue: 1 },
  used_sessions: { type: DataTypes.INTEGER, defaultValue: 0 },

  status: {
    type: DataTypes.ENUM("active", "expired"),
    defaultValue: "active",
  }
});

module.exports = CustomerServicePackage;
