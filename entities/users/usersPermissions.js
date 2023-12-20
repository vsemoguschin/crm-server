const allows = {
  ADMIN: ["ADMIN", "KD", "RR", "ROP", "MOP", "ROV", "MOV", "ROD", "DEZ",],
  KD: ["RR", "ROP", "MOP"],
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


