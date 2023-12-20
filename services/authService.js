const ApiError = require("../error/apiError");
const User = require("../entities/users/usersModel");
const tokenService = require("../services/tokenService");
const UserDto = require("../dtos/userDto");
const bcrypt = require("bcrypt");

class AuthController {
  async login(email, password) {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден");
    }

    const comparePassword = bcrypt.compareSync(password, user.password); //сравниваем пароли
    if (!comparePassword) {
      throw ApiError.BadRequest("Неверный логин или пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDataBase = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDataBase) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findOne({ where: { id: userData.id } });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}

module.exports = new AuthController();
