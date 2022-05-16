"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KasperUser = void 0;
class KasperUser {
    constructor(raw) {
        this.id = raw.id;
        this.name = raw.name;
        this.userRank = raw.userRank;
        this.createdDate = new Date();
    }
}
exports.KasperUser = KasperUser;
//# sourceMappingURL=user.js.map