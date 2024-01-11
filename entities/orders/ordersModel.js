const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const holeType = ['window', 'wall', 'none'];
const fittings = ['dowel', 'cable', 'spaceHolders', 'none'];
const neonWidth = [6, 8];
const filials = ['SPB', 'MSK', 'KRD'];
const materials = ['polik', 'pvh'];

const allowedFeilds = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false }, //передать из title сделки? + номер
  description: { type: DataTypes.STRING, allowNull: true },
  preview: { type: DataTypes.STRING, allowNull: false },
  deadline: { type: DataTypes.STRING, allowNull: false },
  material: { type: DataTypes.STRING, defaultValue: 'polik' },
  neonWidth: { type: DataTypes.INTEGER, defaultValue: 6 },
  boardWidth: { type: DataTypes.INTEGER, allowNull: false },
  boardHeight: { type: DataTypes.INTEGER, allowNull: false },
  neonLength: { type: DataTypes.INTEGER, allowNull: false },
  count: { type: DataTypes.INTEGER, allowNull: false },
  deliveryType: { type: DataTypes.STRING, allowNull: false },
  trackNumber: { type: DataTypes.STRING },
  wireLength: { type: DataTypes.INTEGER, allowNull: false },
  dimer: { type: DataTypes.BOOLEAN, defaultValue: false },
  smart: { type: DataTypes.BOOLEAN, defaultValue: false },
  street: { type: DataTypes.BOOLEAN, defaultValue: false },
  paidDelivery: { type: DataTypes.BOOLEAN, defaultValue: false },
  acrylic: { type: DataTypes.BOOLEAN, defaultValue: false },
  laminate: { type: DataTypes.BOOLEAN, defaultValue: false },
  backlight: { type: DataTypes.BOOLEAN, defaultValue: false }, // подсветка
  holeType: { type: DataTypes.STRING },
  fittings: { type: DataTypes.STRING },
  milling: { type: DataTypes.JSON }, //id, fullName, img
};

const Order = sequelize.define('order', allowedFeilds);

module.exports = Order;
