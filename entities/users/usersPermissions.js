const allows = {
  ADMIN: ["ADMIN", "KD", "DO", "ROP", "MOP", "ROV", "MOV", "ROD", "DEZ", //коммерческий и руководящие
  'FRZ'],
  KD: ["DO", "ROP", "MOP"],
  RR: ["ROP", "MOP"],
  ROP: ["MOP"],
  MOP: [],
  DIZ: [],
};

class RolesPermissions {
  createUser(requester, roleRequest) {
    if (allows[requester].some(role => role === roleRequest)) {
      return true
    }
  }
  getListOfUsers(requester) {
    return allows[requester];
  }
  updateUser(requester) {
    return allows[requester];
  }
}
module.exports = new RolesPermissions();


