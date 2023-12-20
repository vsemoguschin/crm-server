const allows = ["ADMIN", "KD", "RR", "ROP", "MOP", "ROV", "MOV"];
class DealsPermissions {
    check(requester) {
        return allows.some(role => role == requester);
    }
}
module.exports = new DealsPermissions();


