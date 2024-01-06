module.exports = class OrderDto {
  constructor(model) {
    this.fieldsForCreate = {
      name: model.name,
      deadline: model.deadline,
      neonWidth: model.neonWidth || 6,
      neonLength: model.neonLength,
      trackNumber: model.trackNumber,
      boardWidth: model.boardWidth,
      boardHeight: model.boardHeight,
      wireLength: model.wireLength,
      count: model.count,
      deliveryType: model.deliveryType,
      holeType: model.holeType,
      fittings: model.fittings,
      dimer: model.dimer || false,
      smart: model.smart || false,
      street: model.street || false,
      acrylic: model.acrylic || false,
      laminate: model.laminate || false,
      dealId: model.dealId,
    };
    this.fieldsForSearch = {
      dealId: model.dealId,
      userId: model.userId,
      dimer: model.dimer,
      smart: model.smart,
      street: model.street,
      acrylic: model.acrylic,
      laminate: model.laminate,
    };
  }
  check() {
    for (const field in this.fieldsForCreate) {
      if (field === 'trackNumber') continue;
      if (this.fieldsForCreate[field] == undefined) {
        console.log(false, field);
        return false;
      }
    }
    return { ...this.fieldsForCreate };
  }
};
