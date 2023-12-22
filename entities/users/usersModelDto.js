module.exports = class OrderDto {
    constructor(model) {
        this.feildsForCreate = {
            fullName: model.fullName,
            email: model.email,
            info: model.info || '',
            role: model.role,
            workSpaceId: model.workSpaceId || 1
        };
        this.feildsForSearch = {
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