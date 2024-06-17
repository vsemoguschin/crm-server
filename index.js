require('dotenv').config(); //экспорт переменного окружения
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

const sequelize = require('./entities/db');
const router = require('./routes/index');
const presets = require('./presets/presets');
const errorHandling = require('./middleware/ErrorHandlingMiddleware');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;

const app = express();

const createLog = (req, res, next) => {
  console.log(req.method, decodeURI(req.url));
  next();
};
app.use(cookieParser());

// app.use(createLog);
// app.use(
//   cors({
//     credentials: true,
//     origin: ['http://localhost:3000'],
//   }),
// );

app.use(
  express.json({
    limit: '5MB',
  }),
);

app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(
  fileUpload({
    defCharset: 'utf8',
    defParamCharset: 'utf8',
  }),
);

app.use(
  '/api',
  // async (req, res, next) => {
  //   await sequelize.authenticate();
  //   next();
  // },
  router,
);
// app.use('/profile', (req, res, next) => {
//   console.log(111111111111);
//   return res.status(401);
// });

app.use(errorHandling);

const start = async () => {
  try {
    // await sequelize.drop();
    // await sequelize.authenticate();
    // await sequelize.sync({ alter: true, force: true });

    // await presets.createRoles();
    // await presets.createStartDatas();
    // await presets.createLists();
    await presets.createDizDatas()
    app.listen(PORT, () => console.log(`${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
