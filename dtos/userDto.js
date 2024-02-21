module.exports = class UserDto {
  id;
  email;
  role;
  fullName;
  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.fullName = model.fullName;
    this.role = model.role.dataValues.shortName;
  }
};
