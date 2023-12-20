const allows = ["KD", "RR", "ROP", "MOP", "ADMIN", "ROV", "MOV"];
class DopsPermissions {
    check(requester) {
        return allows.some(role => role == requester);
    }
}
module.exports = new DopsPermissions();


