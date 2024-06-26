const jwt = require('jsonwebtoken');
const TokenSchema = require('../entities/token/tokenModel');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.SECRET_KEY);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.SECRET_REFRESH_KEY);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await TokenSchema.findOne({ where: { userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await TokenSchema.create({ userId: userId, refreshToken: refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await TokenSchema.findOne({ where: { refreshToken } });
    tokenData.destroy();
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await TokenSchema.findOne({ where: { refreshToken } });
    // tokenData.destroy();
    return tokenData;
  }
}

module.exports = new TokenService();
