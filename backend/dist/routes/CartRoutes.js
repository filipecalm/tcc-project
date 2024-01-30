"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CartController_1 = __importDefault(require("../controllers/CartController"));
// middlewares
const verify_token_1 = __importDefault(require("../middlewares/verify-token"));
const routes = (0, express_1.Router)();
routes.get('/', CartController_1.default.lists);
routes.get('/:id', CartController_1.default.listById);
routes.get('/user/:id', CartController_1.default.listByUserId);
routes.post('/', verify_token_1.default, CartController_1.default.createCard);
routes.delete('/:id', verify_token_1.default, CartController_1.default.deleteCard);
exports.default = routes;
