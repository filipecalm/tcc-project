"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const messages_1 = __importDefault(require("../constants/messages"));
const createUserToken = (user, res) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.JWT_TOKEN_SECRET || 'projetotcc';
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }, secret);
    res.status(200).json({
        message: messages_1.default.SUCCESS.USER.LOGGED,
        token: token,
        userId: user.id,
        email: user.email,
        role: user.role
    });
});
exports.default = createUserToken;
