"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error("Usuário não autenticado autenticado!");
    }
    const token = authHeader.split(' ')[1];
    return token;
};
exports.default = getToken;
