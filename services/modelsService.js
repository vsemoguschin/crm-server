const ApiError = require('../error/apiError');
const { Op } = require("sequelize");//for test


class ModelsController {
    getModelFields(model) {
        let fields = [];
        // console.log(model);
        for (const key in model) {
            if (model[key].fullName) {
                fields.push({
                    field: model[key].fieldName,
                    name: model[key].fullName,
                    type: model[key].fieldType,
                    required: model[key].allowNull == false ? true : false,
                    validate: model[key].validateFields || 'no',
                })
            }
        };
        // console.log(fields);
        return fields;
    }
    async checkFields(model, body) {
        let requiredFields = {};
        for (const key in model) {
            //сборка только обязательных полей
            if (body[key] && model[key].allowNull !== true) {
                requiredFields[key] = body[key];
            };
            //проверка на все обязательные поля
            if (!requiredFields[key] //есть ли ключ
                && model[key].allowNull == false) {//если он обязательный
                console.log('no ' + key);
                throw ApiError.BadRequest('Что то забыл', key)
            }
        };
        for (const key in requiredFields) {
            if (model[key].fieldType === 'number') {
                const field = +requiredFields[key];
                if (isNaN(field)) {
                    console.log('wrong type', key);
                    throw ApiError.BadRequest('Неверный тип')
                }
            }
            if (model[key].fieldType == 'string' && typeof requiredFields[key] !== 'string') {
                console.log('wrong type', key);
                throw ApiError.BadRequest('Неверный тип')
            }
            if (model[key].fieldType == 'boolean' && requiredFields[key] !== 'true' && requiredFields[key] !== 'false') {
                console.log('wrong type', key);
                throw ApiError.BadRequest('Неверный тип')
            }
            if (model[key].validateFields && !model[key].validateFields.includes(requiredFields[key])) {
                console.log('not valid', key);
                throw ApiError.BadRequest('Неверный выбор')
            }
        }
        console.log('yeap!');
        // console.log(requiredFields);
        return requiredFields
    }
    async checkUpdates(model, body, allowUpdate) {
        // console.log(model, body, allowUpdate);
        let allowedFielsds = {};
        //найти поля в body
        for (let i = 0; i < allowUpdate.length; i++) {
            if (body[allowUpdate[i]] !== undefined && body[allowUpdate[i]] !== '') {
                allowedFielsds[allowUpdate[i]] = body[allowUpdate[i]]
            };
        }
        // console.log(allowedFielsds);
        //проверить типы
        // console.log(model);
        for (const key in allowedFielsds) {
            // console.log(model[key]);
            if (model[key].fieldType === 'number') {
                const field = +allowedFielsds[key];
                if (isNaN(field)) {
                    console.log('wrong type', key);
                    throw ApiError.BadRequest('Неверный тип')
                }
            }
            if (model[key].fieldType == 'string' && typeof allowedFielsds[key] !== 'string') {
                console.log('wrong type', key);
                throw ApiError.BadRequest('Неверный тип')
            }
            if (model[key].fieldType == 'boolean' && requiredFields[key] !== 'true' && requiredFields[key] !== 'false') {
                console.log('wrong type', key);
                throw ApiError.BadRequest('Неверный тип')
            }
            if (model[key].validateFields && !model[key].validateFields.includes(body[key])) {
                console.log('wrong choice', key);
                throw ApiError.BadRequest('Неверный выбор')
            }
        }
        return allowedFielsds
    }
    async searchFilter(modelFieldsKeys, body) {
        let search = {
            [Op.and]: []
        };
        for (let i = 0; i < modelFieldsKeys.length; i++) {
            // console.log(body[modelFieldsKeys[i]]);
            if (body[modelFieldsKeys[i]]) {
                // console.log(modelFieldsKeys[i]);
                search[Op.and].push({
                    [modelFieldsKeys[i]]: {
                        [Op.iRegexp]: body[modelFieldsKeys[i]]
                    }
                })
            }
        }
        // console.log(search);
        return search
    }
}

module.exports = new ModelsController();
