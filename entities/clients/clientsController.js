const { Client, User } = require("../association");
const { Op } = require("sequelize");
const getPagination = require("../../utils/getPagination");
const getPaginationData = require("../../utils/getPaginationData");
const removeNotAllowedFields = require("../../utils/removeNotAllowedFields");
const { getEmptyFieldsForError } = require("../../utils/getEmptyFiledsForError");

class ClientController {
  constructor() {
    this.fields = [
      "fullName",
      "phone",
      "type",
      "field",
      "info",
      "gender",
      "city",
    ]; // Разрешенные поля для изменения
    this.createFields = [
      "fullName",
      "phone",
      "type",
      "field",
      "info",
      "gender",
      "city",
      "owner",
      "userId"
    ]; // Разрешенные поля для создания
    this.update = this.update.bind(this);
    this.create = this.create.bind(this);
  }

  async create(req, res, next) {
    console.log(req.body);
    const client = await Client.create(
      removeNotAllowedFields(req.body, this.createFields)
    );
    return res.json(client);
  }

  //получение конкретного клиента по id
  async getOne(req, res, next) {
    // get-запрос, получаем данные из param
    const { id } = req.params;
    try {
      const client = await Client.findOne({ where: { id } });
      // клиенты и их сделки
      return res.json(client);
    } catch (e) {
      next(e);
    }
  }

  //получения всех клиентов по заданным параметрам
  async getList(req, res, next) {
    // get-запрос передаем query параметры
    try {
      const {
        pageSize,
        pageNumber,
        key, // название поля сортировки
        order: queryOrder, // порядок
        fieldSearch, // 
        fieldSearchValue,
      } = req.query;

      const whereNameOrPhone = {
        [Op.and]: [
          [{ isDeleted: null }],
          {
            [Op.or]: [
              {
                fullName: {
                  [Op.iRegexp]: fieldSearchValue,
                },
              },
              {
                phone: {
                  [Op.iRegexp]: fieldSearchValue,
                },
              },
            ],
          },
        ],
      };

      const whereAnother = {
        [Op.and]: [
          { isDeleted: null },
          {
            [fieldSearch]: {
              [Op.iRegexp]: fieldSearchValue,
            },
          },
        ],
      };

      const order = queryOrder ? [[key, queryOrder]] : ["createdAt"];

      const { limit, offset } = getPagination(pageNumber, pageSize);

      const seqData = {
        order,
        where: { [Op.and]: [{ isDeleted: null }] },
        limit: limit,
        offset: offset,
      };

      if (fieldSearch && fieldSearchValue) {
        seqData.where =
          fieldSearch === "fullName"
            ? whereNameOrPhone
            : fieldSearch
            ? whereAnother
            : undefined;
      }

      const clients = await Client.findAndCountAll(seqData);
      const response = getPaginationData(
        clients,
        pageNumber,
        pageSize,
        "clients"
      );
      return res.json(response || []);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Что-то пошло не так" });
    }
  }

  //обновляем данные клиента
  async update(req, res) {
    // patch-запрос  в теле запроса(body) передаем строку(raw) в формате JSON
    const { id } = req.params;
    const body = req.body;
    const updates = removeNotAllowedFields(body, this.fields);
    const client = await Client.update(updates, { where: { id: id } });
    return res.json(client);
  }

  //удалить клиента
  async delete(req, res) {
    try {
      const { id } = req.params;
      await Client.update({ isDeleted: true }, { where: { id: id } });
      return res.json({ message: "OK" });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Ошибка удаения. Обратитесь к администратору." });
    }
  }
}

module.exports = new ClientController();
