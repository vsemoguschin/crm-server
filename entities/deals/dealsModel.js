const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const statuses = ['created', 'procces', 'done'];
const clothing_method = ['ping']; //уточнить

const Deal = sequelize.define('deal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  preview: { type: DataTypes.STRING, allowNull: false },
  sellDate: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false }, // стоимость вывески без допа, но выводить еще вместе с допами общую

  clothing_method: { type: DataTypes.STRING, allowNull: false },
  // source: { type: DataTypes.STRING, allowNull: false },
  // ad_link: { type: DataTypes.STRING, allowNull: false },
  // balace: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING },
  deadline: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
});

module.exports = Deal;
