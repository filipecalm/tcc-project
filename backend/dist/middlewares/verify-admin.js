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
const get_token_1 = __importDefault(require("../helpers/get-token"));
const token_decoded_1 = __importDefault(require("../helpers/token-decoded"));
const models_1 = require("../models");
const verifyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, get_token_1.default)(req);
        const { id } = (0, token_decoded_1.default)(token);
        const user = yield models_1.User.findById(id);
        if (!user) {
            throw new Error(`Usuário não encontrado`);
        }
        if (user.role !== 'admin') {
            throw new Error(`Operação não permitida!`);
        }
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(403).json({ message: error.message });
        }
        return res.status(403).json({ message: "Ocorreu um erro desconhecido" });
    }
});
exports.default = verifyAdmin;
