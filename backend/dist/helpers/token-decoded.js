"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const decodedToken = (token) => {
    const result = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN_SECRET);
    return result;
};
exports.default = decodedToken;
