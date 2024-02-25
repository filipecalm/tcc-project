"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = require("express-jwt");
const express_validation_1 = require("express-validation");
const messages_1 = __importDefault(require("../constants/messages"));
exports.default = (error, req, res, next) => {
    if (error instanceof express_validation_1.ValidationError) {
        return res.status(error.statusCode).json(error);
    }
    if (error instanceof express_jwt_1.UnauthorizedError) {
        return res.status(error.status || 401).json({ message: messages_1.default.ERROR.ACCESS_DENIED });
    }
    if (process.env.NODE_ENV === 'dev') {
        return res.status(500).json({ message: messages_1.default.ERROR.ERROR_CATCH });
    }
    else {
        return res.status(500).json({ message: messages_1.default.ERROR.ERROR_CATCH });
    }
};
