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
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
const messages_1 = __importDefault(require("../constants/messages"));
// helpers
const create_user_token_1 = __importDefault(require("../helpers/create-user-token"));
const get_token_1 = __importDefault(require("../helpers/get-token"));
const token_decoded_1 = __importDefault(require("../helpers/token-decoded"));
class UserController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.headers.authorization) {
                    const users = yield models_1.User.find({}, { password: 0, confirmpassword: 0 });
                    res.status(200).json(users);
                }
                else {
                    res.status(401).json(messages_1.default.ERROR.ACCESS_DENIED);
                }
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield models_1.User.findById(id, { password: 0, confirmpassword: 0 });
                if (!user)
                    return res.status(404).json(messages_1.default.ERROR.USER.NOT_FOUND);
                res.status(200).json(user);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, confirmpassword, cpf, rg, birth, phone, gender } = req.body;
                if (password !== confirmpassword)
                    throw new Error(messages_1.default.ERROR.USER.PASS_ERROR);
                // verificar se o email existe no db
                const userExists = yield models_1.User.findOne({ email });
                if (userExists)
                    throw new Error(messages_1.default.ERROR.USER.EMAIL_ERROR);
                const salt = yield bcrypt_1.default.genSalt(12);
                const passwordBcrypt = yield bcrypt_1.default.hash(password, salt);
                let roleClient = 'client';
                // Se não houver admin no db, o primeiro usuário torna-se um admin
                const adminExists = yield models_1.User.count({ role: 'admin' });
                if (!adminExists) {
                    roleClient = 'admin';
                }
                const user = new models_1.User({
                    name,
                    email,
                    password: passwordBcrypt,
                    confirmpassword: passwordBcrypt,
                    role: roleClient,
                    cpf,
                    rg,
                    birth,
                    phone,
                    gender
                });
                const newUser = yield user.save();
                yield (0, create_user_token_1.default)(newUser, res);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static updatedUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, email, password, newpassword, confirmpassword, cpf, rg, birth, phone, gender } = req.body;
                if (newpassword && confirmpassword && newpassword !== confirmpassword) {
                    return res.status(400).json(messages_1.default.ERROR.USER.PASS_ERROR);
                }
                const user = yield models_1.User.findById(id);
                if (!user)
                    return res.status(404).json(messages_1.default.ERROR.USER.NOT_FOUND);
                if (password && user.password) {
                    const isMatch = yield bcrypt_1.default.compare(password, user.password);
                    if (!isMatch)
                        return res.status(401).json(messages_1.default.ERROR.ACCESS_DENIED);
                }
                if (email && email !== user.email) {
                    // Se o novo email é diferente do email atual, verifica se o email já existe no banco de dados
                    const emailExists = yield models_1.User.findOne({ email });
                    if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                        return res.status(400).json(messages_1.default.ERROR.USER.EMAIL_ERROR);
                    }
                }
                let passwordBcrypt;
                if (newpassword) {
                    const salt = yield bcrypt_1.default.genSalt(12);
                    passwordBcrypt = yield bcrypt_1.default.hash(newpassword, salt);
                }
                yield models_1.User.findByIdAndUpdate(id, {
                    name: name ? name : user.name,
                    email: email ? email : user.email,
                    password: passwordBcrypt ? passwordBcrypt : user.password,
                    cpf: cpf ? cpf : user.cpf,
                    rg: rg ? rg : user.rg,
                    birth: birth ? birth : user.birth,
                    phone: phone ? phone : user.phone,
                    gender: gender ? gender : user.gender
                });
                res.json(messages_1.default.SUCCESS.USER.UPDATED);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static registerAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, confirmpassword } = req.body;
                if (password !== confirmpassword)
                    throw new Error(messages_1.default.ERROR.USER.PASS_ERROR);
                // verificar se o email existe no db
                const userExists = yield models_1.User.findOne({ email });
                if (userExists)
                    throw new Error(messages_1.default.ERROR.USER.EMAIL_ERROR);
                const salt = yield bcrypt_1.default.genSalt(12);
                const passwordBcrypt = yield bcrypt_1.default.hash(password, salt);
                const roleADM = 'admin';
                const user = new models_1.User({
                    name,
                    email,
                    password: passwordBcrypt,
                    confirmpassword: passwordBcrypt,
                    role: roleADM
                });
                const newUser = yield user.save();
                yield (0, create_user_token_1.default)(newUser, res);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // verificar se o email existe no db
                const user = yield models_1.User.findOne({ email });
                if (!user)
                    throw new Error(messages_1.default.ERROR.USER.PASS_EMAIL);
                const checkPassword = bcrypt_1.default.compare(password, user.password);
                if (!checkPassword)
                    throw new Error(messages_1.default.ERROR.USER.PASS_ERROR);
                yield (0, create_user_token_1.default)(user, res);
            }
            catch (error) {
                res.status(401).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static checkUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.headers.authorization) {
                const token = (0, get_token_1.default)(req);
                const decoded = (0, token_decoded_1.default)(token);
                const currentUser = yield models_1.User.findById(decoded.id).select('-password -confirmpassword');
                res.status(200).send(currentUser);
            }
            else {
                res.status(401).json(messages_1.default.ERROR.ACCESS_DENIED);
            }
        });
    }
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield models_1.User.findById(id);
                if (!user)
                    return res.status(404).json(messages_1.default.ERROR.USER.NOT_FOUND);
                yield models_1.User.findByIdAndRemove(id);
                res.json(messages_1.default.SUCCESS.USER.DELETED);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static deleteCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // caso o usuário queira excluir a própria conta
            try {
                const { id } = req.params;
                const token = (0, get_token_1.default)(req);
                const decoded = (0, token_decoded_1.default)(token);
                // verifica se o id da requisição corresponde ao id do token
                if (decoded.id !== id) {
                    return res.status(401).json(messages_1.default.ERROR.ACCESS_DENIED);
                }
                const user = yield models_1.User.findByIdAndDelete(id);
                if (!user) {
                    return res.status(404).json(messages_1.default.ERROR.USER.NOT_FOUND);
                }
                res.json({ message: messages_1.default.SUCCESS.USER.DELETED });
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static listUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models_1.User.find();
                res.json(users);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
}
exports.default = UserController;
