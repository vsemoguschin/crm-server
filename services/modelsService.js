const ApiError = require('../error/apiError');
const { Op } = require('sequelize');

class ModelsController {
  getModelFields(model) {
    const fields = [];
    // console.log(model);
    for (const key in model) {
      if (model[key].fullName) {
        fields.push({
          field: model[key].fieldName,
          name: model[key].fullName,
          type: model[key].fieldType,
          required: model[key].allowNull == false ? true : false,
          validate: model[key].validateFields || 'no',
        });
      }
    }
    // console.log(fields);
    return fields;
  }
  async checkFields(BDmodel, body) {
    const [Model, modelFields] = BDmodel;
    const requiredFields = {};
    for (const key in modelFields) {
      //сборка только обязательных полей
      if (body[key] && modelFields[key].allowNull !== true && modelFields[key].field !== 'id') {
        requiredFields[key] = body[key];
      }
      //проверка уникальных полей
      if (body[key] && modelFields[key].unique == true) {
        const check = await Model.findOne({ where: { [key]: body[key] } });
        if (check) {
          throw ApiError.BadRequest('Уже существует', key);
        }
        requiredFields[key] = body[key];
      }
      //проверка на все обязательные поля
      if (
        !requiredFields[key] && //есть ли ключ
        modelFields[key].allowNull == false
      ) {
        //если он обязательный
        console.log('no ' + key);
        throw ApiError.BadRequest('Что то забыл', key);
      }
    }
    for (const key in requiredFields) {
      // console.log(requiredFields[key]);
      if (modelFields[key].fieldType === 'number') {
        const field = +requiredFields[key];
        if (isNaN(field)) {
          console.log('wrong type', key);
          throw ApiError.BadRequest('Неверный тип', [key]);
        }
      }
      if (modelFields[key].fieldType == 'string' && typeof requiredFields[key] !== 'string') {
        console.log('wrong type', key);
        throw ApiError.BadRequest('Неверный тип', [key]);
      }
      if (modelFields[key].fieldType == 'boolean' && typeof requiredFields[key] !== 'boolean') {
        // if (modelFields[key].fieldType == 'boolean' && requiredFields[key] !== 'true' && requiredFields[key] !== 'false') {
        console.log('wrong type', key);
        throw ApiError.BadRequest('Неверный тип', [key]);
      }
      if (modelFields[key].validateFields && !modelFields[key].validateFields.includes(requiredFields[key])) {
        console.log('not valid', key);
        throw ApiError.BadRequest('Неверный выбор', [key]);
      }
    }
    console.log('yeap!');
    // console.log(requiredFields);
    return requiredFields;
  }
  async checkUpdates(BDmodel, body, allowUpdate) {
    // console.log(modelFields, body, allowUpdate);
    const [Model, modelFields] = BDmodel;
    const allowedFields = {};
    //найти поля в body
    //проверка обязательных полей
    for (let i = 0; i < allowUpdate.length; i++) {
      if (body[allowUpdate[i]] !== undefined && modelFields[allowUpdate[i]].allowNull == false && body[allowUpdate[i]] !== '') {
        allowedFields[allowUpdate[i]] = body[allowUpdate[i]];
      }
      if (body[allowUpdate[i]] && modelFields[allowUpdate[i]].unique == true) {
        const check = await Model.findOne({ where: { [allowUpdate[i]]: body[allowUpdate[i]] } });
        if (check) {
          throw ApiError.BadRequest('Уже существует', allowUpdate[i]);
        }
        allowedFields[allowUpdate[i]] = body[allowUpdate[i]];
      }
    }

    //проверка необязательных полей
    for (let i = 0; i < allowUpdate.length; i++) {
      if (body[allowUpdate[i]] !== undefined && modelFields[allowUpdate[i]].allowNull == undefined) {
        allowedFields[allowUpdate[i]] = body[allowUpdate[i]];
      }
    }
    //проверить типы
    // console.log(modelFields);
    for (const key in allowedFields) {
      // console.log(modelFields[key]);
      if (modelFields[key].fieldType === 'number') {
        const field = +allowedFields[key];
        if (isNaN(field)) {
          console.log('wrong type', key);
          throw ApiError.BadRequest('Неверный тип', [key]);
        }
      }
      if (modelFields[key].fieldType == 'string' && typeof allowedFields[key] !== 'string') {
        console.log('wrong type', key);
        throw ApiError.BadRequest('Неверный тип');
      }
      if (modelFields[key].fieldType == 'boolean' && typeof allowedFields[key] !== 'boolean') {
        console.log('wrong type', key);
        throw ApiError.BadRequest('Неверный тип');
      }
      if (modelFields[key].validateFields && !modelFields[key].validateFields.includes(body[key])) {
        console.log('wrong choice', key);
        throw ApiError.BadRequest('Неверный выбор');
      }
    }
    // console.log(allowedFields);
    return allowedFields;
  }
  async searchFilter(modelFieldsKeys, body) {
    const search = {
      [Op.and]: [],
    };
    for (let i = 0; i < modelFieldsKeys.length; i++) {
      // console.log(body[modelFieldsKeys[i]]);
      if (body[modelFieldsKeys[i]]) {
        // console.log(modelFieldsKeys[i]);
        search[Op.and].push({
          [modelFieldsKeys[i]]: {
            [Op.iRegexp]: body[modelFieldsKeys[i]],
          },
        });
      }
    }
    // console.log(search);
    return search;
  }
}

module.exports = new ModelsController();
