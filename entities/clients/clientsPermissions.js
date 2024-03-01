const ApiError = require('../../error/apiError');

const PERMISSIONS = {
  ['ADMIN']: true,
  ['G']: true,
  ['KD']: true,
  ['DO']: true,
  ['ROP']: true,
  ['MOP']: true,
  ['ROV']: true,
  ['MOV']: true,
};

module.exports = function checkPermissions(requesterRole) {
  if (!PERMISSIONS[requesterRole]) {
    console.log(false, 'no acces');
    throw ApiError.Forbidden('Нет доступа');
  }
  return;
};
