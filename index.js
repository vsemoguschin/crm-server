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
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://95.163.231.166:80', 'http://176.57.214.58'],
  }),
);

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
app.use('/api', router);
app.use(
  '/api',
  // async (req, res, next) => {
  //   await sequelize.authenticate();
  //   next();
  // },
  router,
);
app.use(errorHandling);

const start = async () => {
  try {
    // await sequelize.drop();
    // await sequelize.authenticate();
    // await sequelize.sync({ alter: true, force: true });

    // await presets.createRoles();
    // await presets.createStartDatas();
    // await presets.createAdmin();
    // await presets.createUsers();
    // await presets.createWorkSpaces();
    // await presets.createGroups();
    // await presets.createMarketPlaces();
    // await presets.createDatas();
    // await presets.createLists();
    app.listen(PORT, () => console.log(`${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
