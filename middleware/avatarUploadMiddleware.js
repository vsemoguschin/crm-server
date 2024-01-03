const checkFormat = require('../checking/checkFormat');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');
const User = require('../entities/users/usersModel');

const url = process.env.IDEV ? `http://localhost:${process.env.PORT}/` : `http://${process.env.DB_HOST}:${process.env.PORT}/`;

class avatarUploadMiddleware {
  async uploadFile(req, res, next) {
    const { id } = req.baseUrl === '/api/profile' ? req.user : req.params;
    try {
      const { avatar: base64Data } = req.body;
      if (!base64Data) {
        next();
        return;
      }
      console.log('base64Data');
      const fileType = checkFormat(base64Data);
      if (!fileType) {
        return res.status(400).json('Ошибка загрузки файла. Обратитесь к администратору');
      }
      const fileName = `user_${uuidv4()}${fileType}`;
      const filePath = 'public/avatars/' + fileName;
      if (id) {
        const currentUser = await User.findOne({
          where: { id },
        });

        // Удаляю старый файл
        if (currentUser.dataValues.avatar) {
          // относительный путь
          const pathToLocalFile = path.join(currentUser.dataValues.avatar.replace(url, ''));
          fs.existsSync(pathToLocalFile, fs.constants.F_OK, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(err);
            fs.unlinkSync(pathToLocalFile);
          });
        }
      }

      // Записываю новый файл
      fs.writeFileSync(path.join(filePath), base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''), { recursive: true, encoding: 'base64' });

      // Путь относительно URL
      req.body.avatar = url + filePath;
      next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Ошибка загрузки файла' });
    }
  }
}

module.exports = new avatarUploadMiddleware();
