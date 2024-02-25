"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CategoryController_1 = __importDefault(require("../controllers/CategoryController"));
// middlewares
const verify_token_1 = __importDefault(require("../middlewares/verify-token"));
const verify_admin_1 = __importDefault(require("../middlewares/verify-admin"));
const routes = (0, express_1.Router)();
routes.post('/', verify_token_1.default, verify_admin_1.default, CategoryController_1.default.createCategory);
routes.get('/', CategoryController_1.default.listCategories);
routes.get('/:id', verify_token_1.default, verify_admin_1.default, CategoryController_1.default.getOne);
routes.put('/:id', verify_token_1.default, verify_admin_1.default, CategoryController_1.default.updateCategory);
routes.delete('/:id', verify_token_1.default, verify_admin_1.default, CategoryController_1.default.deleteCategory);
exports.default = routes;
