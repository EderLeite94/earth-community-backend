"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.now = void 0;
const now = () => {
    // Get current date/time in Brazil timezone
    const now = new Date(new Date().getTime() - (3 * 60 * 60 * 1000));
    return now;
};
exports.now = now;
//# sourceMappingURL=index.js.map