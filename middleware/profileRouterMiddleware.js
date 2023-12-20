const checkUserEmailAndPassword = require("../utils/checkUserEmailAndPassword");

class ProfileRouterMiddleware {
  updateProfile(req, res, next) {
    const { password, email, avatar } = req.body;
    const errorData = checkUserEmailAndPassword(email, password);
    if (errorData) {
      return res.status(400).json(errorData);
    }
    req.newUser = {
      email,
      password,
      avatar,
    };
    next();
  }
}

module.exports = new ProfileRouterMiddleware();
