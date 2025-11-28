const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Service = sequelize.define("Service", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // ⭐ ประเภทบริการ
  is_package: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,    // false = บริการครั้งเดียว
  },

  // ⭐ จำนวนครั้งที่ใช้ได้ในแพ็กเกจ
  session_count: {
    type: DataTypes.INTEGER,
    allowNull: true,       
  },

  // ⭐ ราคาเดิม (ต่อครั้ง)
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  // ⭐ ราคาคอร์ส เช่น 10 ครั้ง ราคา 5000
  package_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Service;
