"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_token_1 = __importDefault(require("../helpers/get-token"));
const token_decoded_1 = __importDefault(require("../helpers/token-decoded"));
const messages_1 = __importDefault(require("../constants/messages"));
const checkToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json(messages_1.default.ERROR.ACCESS_DENIED);
    }
    const token = (0, get_token_1.default)(req);
    if (!token) {
        return res.status(401).json(messages_1.default.ERROR.ACCESS_DENIED);
    }
    try {
        const verify = (0, token_decoded_1.default)(token);
        req.body.user = verify;
        next();
    }
    catch (err) {
        return res.status(400).json(messages_1.default.ERROR.ACCESS_DENIED);
    }
};
exports.default = checkToken;
