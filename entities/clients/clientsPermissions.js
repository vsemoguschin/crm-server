const allows = ["ADMIN", "KD", "RR", "ROP", "MOP", "ROV", "MOV"];
class ClientPermissions {
  check(requester) {
    return allows.some((role) => role == requester);
  }
}
module.exports = new ClientPermissions();
