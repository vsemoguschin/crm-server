const uuid = require('uuid');
const path = require('path');
const Order = require('../association');

class OrdersController {
    async getOne(req, res, next) {
        try {
            const { new_order } = req;
            const { preview } = new_order;
            const { img } = req.files;
            const order = await Order.create(new_order);
            const filePath = 'orders/' + preview;
            fs.writeFileSync('public/' + filePath, img.data, err => {
                if (err) {
                    throw ApiError.BadRequest('Wrong');
                };
            });
            return res.json(order);
        } catch (e) {
            next(e)
        }
    }
    async getAll(req, res, next) {
        res.json('all orders');
        //сортировка по дате
    }
    async create(req, res, next) {
        const { name, description } = req.body;
        const { img } = req.files;
        const fileName = uuid.v4() + '.jpg';
        img.mv(path.resolve(__dirname, '..', 'static', fileName))
        res.json('create');
    }
}

module.exports = new OrdersController();