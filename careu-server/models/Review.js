const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Review = sequelize.define("Review", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    booking_id: { type: DataTypes.INTEGER, allowNull: false },
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    provider_id: { type: DataTypes.INTEGER, allowNull: false },
    rating : { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT },
    
});

module.exports = Review;