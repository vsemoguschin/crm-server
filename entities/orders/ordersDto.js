module.exports = class OrderDto {
    constructor(model) {
        this.feildsForCreate = {
            name: model.name,
            description: model.description,
            deadline: model.deadline,
            neonWidth: model.neonWidth || 6,
            neonLength: model.neonLength,
            boardWidth: model.boardWidth,
            boardHeight: model.boardHeight,
            wireLength: model.wireLength,
            holeType: model.holeType,
            fittings: model.fittings,
            dimer: model.dimer || false,
            smart: model.smart || false,
            street: model.street || false,
            acrylic: model.acrylic || false,
            laminate: model.laminate || false,
            
            dealId: model.dealId,
        };
        this.feildsForSearch = {
            dealId: model.dealId,
            userId: model.userId,
            dimer: model.dimer,
            smart: model.smart,
            street: model.street,
            acrylic: model.acrylic,
            laminate: model.laminate,
        }
    }
    check() {
        for (const feild in this.feildsForCreate) {
            if (this.feildsForCreate[feild] == undefined) {
                console.log(false);
                return false
            };
        };
        console.log({ ...this.feildsForCreate });
        return { ...this.feildsForCreate }
    }
}
