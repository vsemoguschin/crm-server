const { User, 
  WorkSpace, 
  workSpacesList, 
  stageList, 
  Stage } = require('../entities/association');
const { Role, rolesList } = require('../entities/roles/rolesModel');
const bcrypt = require('bcrypt');

class Presets {
  async createAdmin() {
    const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 3); //хешируем пароль
    return  await User.findOrCreate({
      where: { email: process.env.ADMIN_EMAIL },
      defaults: {
        email: process.env.ADMIN_EMAIL,
        fullName: process.env.ADMIN_NAME,
        password: hashPassword,
        avatar: '1.jpg',
        roleId: 1,
      }, paranoid: false
    });
  }
  async createRoles() {
    for (let i = 0; i < rolesList.length; i++) {
      await Role.findOrCreate({
        where: { shortName: rolesList[i].shortName },
        defaults: rolesList[i],
      });
    }
  }
  async createworkSpaces() {
    for (let i = 0; i < workSpacesList.length; i++) {
      await WorkSpace.findOrCreate({
        where: { name: workSpacesList[i].name },
        defaults: workSpacesList[i],
      });
    }
  }
  async createStages() {
    for (let i = 0; i < stageList.length; i++) {
      await Stage.findOrCreate({
        where: stageList[i],
        defaults: stageList[i],
      });
    }
  }
}

module.exports = new Presets();
