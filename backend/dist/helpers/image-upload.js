"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const messages_1 = __importDefault(require("../constants/messages"));
const Storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        let folder = '';
        if (req.baseUrl.includes('product')) {
            folder = 'product';
        }
        cb(null, `public/images/${folder}`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +
            String(Math.floor(Math.random() * 1000)) +
            path_1.default.extname(file.originalname));
    }
});
const imageUpload = (0, multer_1.default)({
    storage: Storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error(messages_1.default.ERROR.UPLOAD_ERROR));
        }
        cb(null, true);
    }
});
exports.imageUpload = imageUpload;
