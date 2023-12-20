module.exports = class UserDto {
    id;
    email;
    role;
    fullName;
    ownersList;
    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.fullName = model.fullName;
        this.role = model.role;
        this.ownersList = model.ownersList;
    }
}