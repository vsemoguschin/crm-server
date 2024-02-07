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
app.use(
  '/api',
  async (req, res, next) => {
    await sequelize.authenticate();
    next();
  },
  router,
);
app.use(errorHandling);

const start = async () => {
  try {
    // await sequelize.drop();
    // await sequelize.authenticate();
    // await sequelize.sync({ alter: true, force: true });

    // await presets.createRoles();
    // await presets.createAdmin();
    // await presets.createWorkSpaces();
    // await presets.createStages();
    // await presets.createMarketPlaces();
    // const delivery = await Delivery.findOne({
    //   where: { id: 1 },
    //   attributes: ['id'],
    // });
    // const deliveryId = delivery.dataValues.id
    // const deals = await Deal.findAll({
    //   // where: {
    //   //   '$order.deliveryId$ ':deliveryId
    //   //   '$order.workSpaceId$ ':workSpaceId
    //   // },
    //   attributes: ['title'],
    //   include: [{
    //     model: Client,
    //     attributes: ['chatLink']
    //   },
    //   // model: Order,
    //   // attributes: ['name'],
    //   // where: {
    //   //   '$orders.deliveryId$': 1,
    //     // }
    //   ]
    // });
    // console.log(deals[0]);
    app.listen(PORT, () => console.log(`${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
