const ApiError = require("../error/apiError");

function isJson(req) {
    try {
        JSON.parse(req);
    } catch (e) {
        throw ApiError.BadRequest('wrong');
    }
    const obj = JSON.parse(req);
    if ((!!obj) && (obj.constructor === Array)) {
        console.log('array');
        return 'array'
    }
    if ((!!obj) && (obj.constructor === Object)) {
        console.log('object');
        return 'object'
    }
    throw ApiError.BadRequest('wrong');
}

module.exports = isJson();