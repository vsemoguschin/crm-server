const allowsCreate = ["ADMIN", "KD", "RR", "ROP", "MOP", "ROV", "MOV"];
const allowsInteract = ['ADMIN','KD','RR','ROP','MOP','ROV','MOV','ROD','DIZ','DP','RP','FRZ','LAM','MASTER','PACKER',]
class OrdersPermissions {
    toCreate(requester) {
        return allowsCreate.some(role => role == requester);
    }
    toWatch(requester) {
        return allowsInteract.some(role => role == requester);
    }
}
module.exports = new OrdersPermissions();


