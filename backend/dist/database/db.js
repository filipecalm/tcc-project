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
exports.connectToDatabase = void 0;
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        let dbConnectionString;
        if (process.env.NODE_ENV === 'dev') {
            dbConnectionString = `${process.env.DB_DIALECT}://127.0.0.1:${process.env.MONGODB_PORT}/${process.env.DB_NAME}`;
        }
        else if (process.env.NODE_ENV === 'prod') {
            dbConnectionString = process.env.DB_CONNECTION;
        }
        else {
            throw new Error('O ambiente não está definido corretamente');
        }
        try {
            yield mongoose_1.default.connect(dbConnectionString);
            console.log(`Conectou ao MongoDB usando a string de conexão: ${dbConnectionString}`);
        }
        catch (err) {
            console.error('Erro ao conectar com o MongoDB:', err);
        }
    });
}
exports.connectToDatabase = connectToDatabase;
exports.default = mongoose_1.default;
