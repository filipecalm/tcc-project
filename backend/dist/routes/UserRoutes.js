"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
// middlewares
const verify_token_1 = __importDefault(require("../middlewares/verify-token"));
const verify_admin_1 = __importDefault(require("../middlewares/verify-admin"));
const create_1 = __importDefault(require("../validations/User/create"));
const login_1 = __importDefault(require("../validations/auth/login"));
const routes = (0, express_1.Router)();
routes.get('/me/:id', verify_token_1.default, UserController_1.default.getMe);
routes.get('/', verify_token_1.default, verify_admin_1.default, UserController_1.default.getAll);
routes.get('/:id', verify_token_1.default, UserController_1.default.getOne);
routes.post('/', UserController_1.default.register);
routes.put('/:id', verify_token_1.default, UserController_1.default.updatedUser);
routes.post('/registerAdmin', verify_token_1.default, verify_admin_1.default, create_1.default, UserController_1.default.registerAdmin);
routes.delete('/:id', verify_token_1.default, UserController_1.default.deleteUser);
routes.get('/check', UserController_1.default.checkUser);
routes.post('/login', login_1.default, UserController_1.default.login);
exports.default = routes;
