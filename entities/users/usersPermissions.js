const ApiError = require('../../error/apiError');

class UsersPermissions {
  create(req, res, next) {
    const rolesAcces = {
      ['ADMIN']: ['KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'LAM', 'MASTER', 'PACKER'],
      ['G']: ['KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'MASTER', 'PACKER'],
      ['KD']: ['DO', 'ROP', 'MOP', 'ROV', 'MOV'],
      //commercial
      ['DO']: ['ROP', 'MOP'],
      ['ROP']: ['MOP'],
      //production
      ['DP']: ['RP', 'FRZ', 'MASTER', 'PACKER'],
      ['RP']: ['FRZ', 'MASTER', 'PACKER'],
    };
    try {
      const requesterRole = req.requester.role;
      const req_role = req.body.role; //переданная роль
      if (!req_role) {
        console.log(false, 'no role');
        throw ApiError.BadRequest('Нет роли', 'role');
      }
      if (!rolesAcces[requesterRole] || !rolesAcces[requesterRole].includes(req_role)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      return;
    } catch (e) {
      next(e);
    }
  }
  getOne(req, res, next) {
    const rolesAcces = {
      ['ADMIN']: ['KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'LAM', 'MASTER', 'PACKER'],
      ['G']: ['KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'MASTER', 'PACKER'],
      ['KD']: ['DO', 'ROP', 'MOP', 'ROV', 'MOV'],
      //commercial
      ['DO']: ['ROP', 'MOP'],
      ['ROP']: ['MOP'],
      //production
      ['DP']: ['RP', 'FRZ', 'MASTER', 'PACKER'],
      ['RP']: ['FRZ', 'MASTER', 'PACKER'],
    };
    try {
      let { id, userId } = req.params;
      id = userId || id;
      const requesterRole = 'MOP';
      //параметры по умолчанию, сортировка по доступным ролям
      const searchParams = {
        where: { id, '$role.shortName$': rolesAcces[requesterRole] },
        include: ['role', 'membership', 'avatar', 'groups'],
      };

      if (req.baseUrl.includes('/orders')) {
        //условие получения себя для добавления исполнителя к заказу
        console.log('executors');
      }
      if (req.baseUrl.includes('/deals')) {
        //условие получения пользователя для добавления участника к сделки
        console.log('sallers');
      }

      return searchParams;
    } catch (e) {
      throw ApiError.BadRequest(e);
    }
  }
}

module.exports = new UsersPermissions();
