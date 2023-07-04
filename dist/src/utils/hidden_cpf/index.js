"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCpf = void 0;
function formatCpf(cpf) {
    const cpfString = cpf.toString().padStart(11, '0');
    return cpfString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, (_, p1, p2, p3, p4) => `***.${p2}.${p3}-**`);
}
exports.formatCpf = formatCpf;
//# sourceMappingURL=index.js.map