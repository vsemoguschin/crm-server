const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// const statusesOld = ['created', 'process', 'done'];
// const statuses = ['created', 'process', 'done', 'readyToSend', 'sent', 'delivered'];
const statuses = ['Создана', 'Изготовление', 'Готов', 'Готов к отправке', 'Отправлен', 'Доставлен'];
const disconts = ['Без скидки', 'Желтая', 'ОПТ', 'Рассылка', 'Красная'];
const maketTypes = ['Дизайнерский', 'заготовка из базы', 'рекламный', 'визуализатор', 'из рассылки'];

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Название сделки' },
  price: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Стоимость без допов' }, // стоимость вывески без допа, но выводить еще вместе с допами общую
  status: { type: DataTypes.STRING, defaultValue: 'Создана', fieldType: 'string', validateFields: statuses, fullName: 'Статус' },
  deadline: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Дедлайн' },
  clothingMethod: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Метод закрытия' },
  description: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Описание' },
  source: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Источник сделки' },
  adTag: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'ТЕГ' },
  discont: { type: DataTypes.STRING, allowNull: false, validateFields: disconts, fieldType: 'string', fullName: 'Скидка' },
  sphere: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Сфера деятельности' },
  city: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Город' },
  region: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Регион' },
  cardLink: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Ссылка на карточку' },
  paid: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Оплачена?' },
  maketType: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', validateFields: maketTypes, fullName: 'Ссылка на карточку' },
};

//status заменить на isDone

const Deal = sequelize.define('deal', modelFields, {
  paranoid: true,
});

const Dealers = sequelize.define('dealUsers', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  part: { type: DataTypes.FLOAT, defaultValue: 1, fieldType: 'number', fullName: 'Доля сделки' },
  price: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Сумма' },
  payments: { type: DataTypes.INTEGER, fieldType: 'number', fullName: 'Выручка' },
});

//источники сделок
const DealSources = sequelize.define('dealSources', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Источник сделки' },
});

//общая таблица методов закрытия
const ClothingMethods = sequelize.define('clothingMethod', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, fieldType: 'string', fullName: 'Метод закрытия' },
});

//общая таблица тегов рекламных
const AdTags = sequelize.define('adTag', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, fieldType: 'string', fullName: 'Рекламный тег' },
});

//сферы деятельности
const Spheres = sequelize.define('spheres', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, fieldType: 'string', fullName: 'Сфера деятельности' },
});

//Даты изменения статуса
const DealDates = sequelize.define('dealDates', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  process: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'В процессе' },
  done: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Готов' },
  readyToSend: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Готов к отправке' },
  sent: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Отправлен' },
  delivered: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Доставлен' },
});

module.exports = {
  Deal,
  modelFields,
  Dealers,
  DealSources,
  ClothingMethods,
  AdTags,
  Spheres,
  DealDates,
};
