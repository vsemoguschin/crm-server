require('dotenv').config(); //экспорт переменного окружения
const express = require('express');
require('dotenv').config(); //экспорт переменного окружения
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

const presets = require('./presets/presets');
const sequelize = require('./entities/db');
const router = require('./routes/index');
const errorHandling = require('./middleware/ErrorHandlingMiddleware');
const cookieParser = require('cookie-parser');

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
    // await sequelize.drop();
    await sequelize.authenticate();
    // await sequelize.sync({ alter: true, force: true });

    await presets.createAdmin();

    app.listen(PORT, () => console.log(`${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
