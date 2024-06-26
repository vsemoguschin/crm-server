//Проверяем токен на валидность
const tokenService = require('../services/tokenService');
const ApiError = require('../error/apiError');
const { User } = require('../entities/users/usersModel');
const { Op } = require('sequelize');

module.exports = async function (req, res, next) {
  // console.log(req);
  try {
    const authorizationHeader = req.headers.authorization;
    // console.log(req.headers.authorization, 2121212);
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    // console.log(userData, 213454678);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    const currentUser = await User.findOne({
      //выдавать актуальные role и fullName
      where: {
        id: userData.id,
        [Op.and]: { deletedAt: null },
      },
    });
    // console.log(currentUser);
    if (!currentUser) {
      return next(ApiError.BadRequest('Пользователь не найден'));
    }
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    userData.workSpaceId = currentUser.workSpaceId || 0;
    userData.groupId = currentUser.groupId || 0;
    req.requester = userData;
    next();
  } catch (e) {
    console.log(e);
    return next(ApiError.UnauthorizedError());
  }
};
