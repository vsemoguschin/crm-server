const authService = require('../services/authService');
const ApiError = require('../error/apiError');

class AuthController {
  async login(req, res, next) {
    //POST-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw ApiError.BadRequest('Забыл что то указать');
      }

      const userData = await authService.login(email, password);
      // console.log(userData);
      // res.cookie('accessToken', userData.accessToken, {
      //   maxAge: 10 * 24 * 60 * 60 * 1000,
      //   httpOnly: true,
      //   sameSite: 'None',
      //   secure: false,
      // });
      // res.cookie('refreshToken', userData.refreshToken, {
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   httpOnly: true,
      //   sameSite: 'None',
      //   secure: false,
      // });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    //POST-запрос
    try {
      const { refreshToken } = req.cookies;
      // return res.json(refreshToken)
      const token = await authService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    //GET-запрос
    try {
      const { refreshToken } = req.body;
      console.log(req.body, 1213446999);
      console.log(refreshToken, 2132424);

      const userData = await authService.refresh(refreshToken);
      console.log(refreshToken, 32324242);
      // res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();
