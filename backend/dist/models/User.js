"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    newpassword: {
        type: String,
        trim: true
    },
    confirmPassword: {
        type: String,
        trim: true
    },
    role: {
        type: String,
    },
    cpf: {
        type: String,
        trim: true
    },
    rg: {
        type: String,
        trim: true
    },
    birth: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        trim: true
    }
});
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
