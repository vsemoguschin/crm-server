const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const marketplaces = ["wb", "ozon"];
const types = ["ООО", "ИП", "Физ"]; // нко

const Client = sequelize.define("client", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  chatLink: { type: DataTypes.STRING },
  gender: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING }, // +регион +список
  type: { type: DataTypes.STRING }, // добавить тип клиента по ИП, ООО и т.д.
  sphere: { type: DataTypes.STRING },
  info: { type: DataTypes.STRING },
  isDeleted: { type: DataTypes.BOOLEAN },
});

(module.exports = Client), marketplaces;
