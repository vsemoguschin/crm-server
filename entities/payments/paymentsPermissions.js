const allows = ["KD", "RR", "ROP", "MOP", "ADMIN", "ROV", "MOV"];
class PaymentsPermissions {
    check(requester) {
        return allows.some(role => role == requester);
    }
}
module.exports = new PaymentsPermissions();


