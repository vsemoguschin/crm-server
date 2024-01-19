const { User, WorkSpace, workSpacesList, stageList, Stage } = require('../entities/association');
const bcrypt = require('bcrypt');

class Presets {
  async createAdmin() {
    const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 3); //хешируем пароль
    return await User.findOrCreate({
      where: { email: process.env.ADMIN_EMAIL },
      defaults: {
        email: process.env.ADMIN_EMAIL,
        role: process.env.ADMIN_ROLE,
        fullName: process.env.ADMIN_NAME,
        password: hashPassword,
        ownersList: [],
        owner: {
          id: 1,
          fullName: process.env.ADMIN_NAME,
          role: process.env.ADMIN_ROLE,
          ownersList: [],
        },
        avatar: '1.jpg',
      },
    });
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
