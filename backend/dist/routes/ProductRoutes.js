"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = __importDefault(require("../controllers/ProductController"));
// middlewares
const verify_token_1 = __importDefault(require("../middlewares/verify-token"));
const verify_admin_1 = __importDefault(require("../middlewares/verify-admin"));
const image_upload_1 = require("../helpers/image-upload");
const create_1 = __importDefault(require("../validations/Product/create"));
const routes = (0, express_1.Router)();
routes.get('/category/:categoryId', ProductController_1.default.listProductsByCategory);
routes.post('/', verify_token_1.default, verify_admin_1.default, image_upload_1.imageUpload.single('images'), create_1.default, ProductController_1.default.createProduct);
routes.get('/', ProductController_1.default.listProducts);
routes.get('/:id', ProductController_1.default.listProduct);
routes.put('/:id', verify_token_1.default, verify_admin_1.default, image_upload_1.imageUpload.single('images'), ProductController_1.default.updateProduct);
routes.delete('/:id', verify_token_1.default, verify_admin_1.default, ProductController_1.default.deleteProduct);
exports.default = routes;
