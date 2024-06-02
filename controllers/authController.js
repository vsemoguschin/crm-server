const authService = require('../services/authService');
const ApiError = require('../error/apiError');

class AuthController {
  async login(req, res, next) {
    //POST-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      // console.log(req.body);
      // return res.json({ message: 'login' });
      // return res.status(404).json({message: 'Неверный логин или пароль'})
      const { email, password } = req.body;
      if (!email || !password) {
        throw ApiError.BadRequest('Забыл что то указать');
      }

      const userData = await authService.login(email, password);
      // console.log(userData);
      res.cookie('accessToken', userData.accessToken, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'None',
        secure: false,
      });
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'None',
        secure: false,
      });
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
      const { refreshToken } = req.cookies;

      const userData = await authService.refresh(refreshToken);
      console.log(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();
