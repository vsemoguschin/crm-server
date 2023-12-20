const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  info: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: true },
  owner: { type: DataTypes.JSON, allowNull: false },
  ownersList: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: { type: DataTypes.STRING },
});

module.exports = User;
