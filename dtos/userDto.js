module.exports = class UserDto {
  id;
  email;
  role;
  fullName;
  workSpace;
  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.fullName = model.fullName;
    this.workSpace = model.workSpaceId;
    this.role = model.role.dataValues.shortName;
  }
};
