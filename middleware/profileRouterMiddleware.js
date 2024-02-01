const checkFormat = require('../checking/checkFormat');
const uuid = require('uuid');

const updateFields = ['email', 'fullName', 'roleName', 'info', 'avatar'];
class ProfileRouterMiddleware {
  updateProfile(req, res, next) {
    try {
      const requester = req.user.id;
      if (req.files?.img) {
        //проверка формата изображения
        const imgFormat = checkFormat(req.files.img.name);
        if (!imgFormat) {
          throw ApiError.BadRequest('Не верный формат изображения');
        }
        req.body.avatar = 'user_' + uuid.v4() + imgFormat;
      }
      req.updateFields = updateFields;
      if (req.body.password && req.body.oldPassword) {
        req.updateFields.push('password')
      }
      next()
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new ProfileRouterMiddleware();
