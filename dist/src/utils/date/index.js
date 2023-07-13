"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.now = exports.DateNow = void 0;
const DateNow = () => {
    // Get current date/time in Brazil timezone
    const now = new Date(new Date().getTime());
    return now;
};
exports.DateNow = DateNow;
exports.now = (0, exports.DateNow)(); // Exporting the current date/time as well
//# sourceMappingURL=index.js.map