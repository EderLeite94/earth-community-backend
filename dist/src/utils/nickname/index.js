"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueNickname = void 0;
const index_1 = __importDefault(require("../../models/users/index"));
const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const generateUniqueNickname = async (firstName, surname) => {
    const baseNickname = `${firstName}${surname}`;
    let nickname = baseNickname;
    let unique = false;
    let counter = 0;
    while (!unique && counter < 100) {
        const existingUser = await index_1.default.findOne({ 'info.nickName': nickname });
        if (!existingUser) {
            unique = true;
        }
        else {
            // Adicionar números e letras ao nickname
            let randomString = '';
            const randomNumber = Math.floor(Math.random() * 100000);
            for (let i = 0; i < 5; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                randomString += characters[randomIndex];
            }
            nickname = `${baseNickname}-${randomString}${randomNumber}`;
        }
        counter++;
    }
    if (!unique) {
        throw new Error('Failed to generate a unique nickname');
    }
    return nickname;
};
exports.generateUniqueNickname = generateUniqueNickname;
//# sourceMappingURL=index.js.map