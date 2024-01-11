const allows = {
  ['ADMIN']: ["ADMIN", "KD", "DO", "ROP", "MOP", "ROV", "MOV", "ROD", "DEZ", 'FRZ'],
  ['KD']: ['DO', 'ROP', 'MOP', 'ROV', 'MOV', 'ROD', 'DIZ'],
  ['DO']: ['ROP', 'MOP'],
  ['ROP']: ["MOP"],
  ['MOP']: [],
  ['DIZ']: [],
};

class RolesPermissions {
  createUser(requester, roleRequest) {
    return allows[requester].some(role => role === roleRequest)
  }
  getListOfUsers(requester) {
    return allows[requester];
  }
  updateUser(requester) {
    return allows[requester];
  }
}

module.exports = new RolesPermissions();


