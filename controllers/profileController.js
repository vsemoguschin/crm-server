const { User, modelFields: usersModelFields } = require('../entities/users/usersModel');
const ApiError = require('../error/apiError');
const modelsService = require('../services/modelsService');
const bcrypt = require('bcrypt');

class ProfileController {
  async getProfile(req, res) {
    try {
      // return res.status(401).send('sdasdasd');
      const user = await User.findOne({
        where: { id: req.requester.id },
        // attributes: { include: ['password'] },
        include: ['role'],
      });
      return res.json(user);
    } catch (error) {
      console.log(error);
      throw ApiError.BadRequest('Ошибка получения данных');
    }
  }

  async update(req, res, next) {
    const id = req.requester.id;
    try {
      const updates = await modelsService.checkUpdates([User, usersModelFields], req.body, req.updateFields);

      const user = await User.scope(['fullScope']).findOne({
        where: {
          id: id,
        },
      });
      // update password
      if (updates.password && req.body.oldPassword) {
        const comparePassword = bcrypt.compareSync(req.body.oldPassword, user.password); //сравниваем пароли
        if (!comparePassword) {
          throw ApiError.BadRequest('Неверный пароль');
        }
        updates.password = await bcrypt.hash(updates.password, 3);
      }

      await user.update(updates);
      await user.save();

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

console.log('http://localhost:5000/api/login'.endsWith('/login'));

module.exports = new ProfileController();
