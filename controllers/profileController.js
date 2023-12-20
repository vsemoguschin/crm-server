const User = require("../entities/users/usersModel");
const removeNotAllowedFields = require("../utils/removeNotAllowedFields");

class ProfileController {
  constructor() {
    this.updateFields = ["email", "password", "status", "avatar"];
    this.update = this.update.bind(this);
  }

  async getProfile(req, res) {
    if (!req.user.id) {
      return res.status(400).json({ message: "Нет доступа" });
    }

    try {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ["password"] },
      });
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Ошибка получения данных" });
    }
  }

  async update(req, res) {
    const id = req.user.id;
    if (!id) {
      return res.status(400).json({ message: "Нет доступа" });
    }

    try {
      const updates = removeNotAllowedFields(req.body, this.updateFields);
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 3);
      }

      await User.update(updates, { where: { id: id } });
      return res.json(updates);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Ошибка обновления данных" });
    }
  }
}

module.exports = new ProfileController();
