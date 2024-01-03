require('dotenv').config(); //экспорт переменного окружения
const express = require('express');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');

const sequelize = require('./entities/db');
const router = require('./routes/index');
const errorHandling = require('./middleware/ErrorHandlingMiddleware');
const cookieParser = require('cookie-parser');
const { User, Stage, stageList, WorkSpace, workSpacesList } = require('./entities/association');
const { where } = require('sequelize');
const { resolve6 } = require('dns/promises');

const PORT = process.env.PORT || 5000;

const app = express();

const createLog = (req, res, next) => {
  console.log(req.method, decodeURI(req.url));
  next();
};
// app.use(createLog);
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://95.163.231.166:8080'],
  }),
);

app.use(cookieParser());
app.use(
  express.json({
    limit: '2MB',
  }),
);
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(
  fileUpload({
    defCharset: 'utf8',
    defParamCharset: 'utf8',
  }),
);
app.use('/api', router);
app.use(errorHandling);

const start = async () => {
  try {
    const isDrop = false;
    if (isDrop) {
      await sequelize.drop();
      await sequelize.authenticate();
      await sequelize.sync({ alter: true, force: true, searchPath: 'public' });

      //создание стадий заказов
      for (let i = 0; i < stageList.length; i++) {
        await Stage.findOrCreate({
          where: { title: stageList[i].title, description: stageList[i].description },
          defaults: stageList[i],
        });
      }
      //создание отделений(города производств)
      for (let i = 0; i < workSpacesList.length; i++) {
        await WorkSpace.findOrCreate({
          where: { name: workSpacesList[i].name },
          defaults: workSpacesList[i],
        });
      }

      const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 3); //хешируем пароль
      const [admin, created] = await User.findOrCreate({
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
          workSpaceId: 1,
        },
      });
    } else {
      await sequelize.authenticate();
    }

    app.listen(PORT, () => console.log(`${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
const one = 6;
const two = 8;
const send = '8';
const res = send == 6 || send == 8 ? +send : false;

// console.log(res);

class TaskDto {
  constructor(model) {
    this.feildsForCreate = {
      // name: model.name == 6 || model.name == 8 ? + model.name : undefined
      name: model.name == undefined || model.name == 6 || model.name == 8 ? +model.name || 6 : undefined,
      // description: model.description,
      // deadline: model.deadline,
      // neonWidth: model.neonWidth || 6,
      // neonLength: model.neonLength,
      // boardWidth: model.boardWidth,
      // boardHeight: model.boardHeight,
      // wireLength: model.wireLength,
      // holeType: model.holeType,
      // fittings: model.fittings,
      // dimer: model.dimer || false,
      // smart: model.smart || false,
      // street: model.street || false,
      // acrylic: model.acrylic || false,
      // laminate: model.laminate || false,

      // dealId: model.dealId,
    };
  }

  check() {
    for (const feild in this.feildsForCreate) {
      if (this.feildsForCreate[feild] == undefined) {
        // console.log(false);
        return false;
      }
    }
    // console.log({ ...this.feildsForCreate });
    return { ...this.feildsForCreate };
  }
}

const task = new TaskDto({ name: 6 });
task.check();
