const uuid = require("uuid");
const path = require("path");
const { Order } = require("../association");

class OrdersController {
  async getOne(req, res, next) {
    try {
      const { new_order } = req;
      const { preview } = new_order;
      const { img } = req.files;
      const order = await Order.create(new_order);
      const filePath = "orders/" + preview;
      fs.writeFileSync("public/" + filePath, img.data, (err) => {
        if (err) {
          throw ApiError.BadRequest("Wrong");
        }
      });
      return res.json(order);
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const {
      pageSize,
      pageNumber,
      key, //?
      order: queryOrder,
      fieldSearch,
      fieldSearchValue,
    } = req.query;
    const requesterId = req.user.id;
    const { limit, offset } = getPagination(pageNumber, pageSize);

    try {
      const order = queryOrder ? [[key, queryOrder]] : ["createdAt"];

      const whereFilters = fieldSearch
        ? {
            [Op.and]: [
              {
                [fieldSearch]: {
                  [Op.iRegexp]: fieldSearchValue,
                },
              },
            ],
          }
        : {};

      const squelizeBody = {
        where: { ...whereFilters },
        order,
        limit,
        offset,
      };

      const orders = await Order.findAndCountAll(squelizeBody);

      const response = getPaginationData(
        orders,
        pageNumber,
        pageSize,
        "orders"
      );
      return res.json(response);
    } catch (e) {
      next(e);
    }
    //сортировка по дате
  }
  async create(req, res, next) {
    const { name, description } = req.body;
    const { img } = req.files;
    const fileName = uuid.v4() + ".jpg";
    img.mv(path.resolve(__dirname, "..", "static", fileName));
    res.json("create");
  }
}

module.exports = new OrdersController();
