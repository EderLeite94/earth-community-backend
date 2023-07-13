"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEmail = void 0;
function formatEmail(email) {
    const emailParts = email.split('@');
    const username = emailParts[0];
    const domain = emailParts[1];
    const visibleCharacters = 2; // Número de caracteres visíveis no início
    const hiddenCharacters = username.length - visibleCharacters; // Número de caracteres ocultos
    const hiddenPart = '*****';
    const formattedUsername = `${username.slice(0, visibleCharacters)}${hiddenPart}`;
    const formattedEmail = `${formattedUsername}@${domain}`;
    return formattedEmail;
}
exports.formatEmail = formatEmail;
//# sourceMappingURL=index.js.map