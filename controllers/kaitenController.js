const ApiError = require('../error/apiError');
const getCard = require('../services/getCard');

class KaitenController {
  async getCard(req, res, next) {
    try {
      // console.log(req.params.id);
      const datas = await getCard(req.params.id);
      // console.log(req.query.card_id);
      if (!datas) {
        return res.json('Nope');
        // throw ApiError.BadRequest('no cards found');
      }
      // const firstImageObject = datas.files.find((item) => {
      //   return item.url.toLowerCase().endsWith('.png') || item.url.toLowerCase().endsWith('.jpg');
      // });
      // console.log(datas.files);
      let firstImageObject = datas.files.find((item) => {
        // console.log(item);
        if (item.name.toLowerCase() === 'обложка.png') {
          return item.url;
        }
      });
      if (!firstImageObject) {
        firstImageObject = datas.files.reverse().find((item) => {
          return item.url.toLowerCase().endsWith('.png') || item.url.toLowerCase().endsWith('.jpg');
        });
      }

      const fileMaket = datas.files.find((item) => {
        return item.url.toLowerCase().endsWith('.cdr');
      });
      // console.log(1212313, datas.files);
      const preorder = {
        card_id: +datas.id,
        card_link: 'https://easyneonwork.kaiten.ru/' + datas.id,
        description: datas.description || '',
        preview: firstImageObject.url || '',
        status: 'new',
        maket: fileMaket.url || '',
      };
      return res.json(preorder);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new KaitenController();
