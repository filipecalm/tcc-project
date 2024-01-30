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
const models_1 = require("../models");
const messages_1 = __importDefault(require("../constants/messages"));
class CategoryController {
    static createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                if (!name) {
                    return res.status(400).json(messages_1.default.ERROR.CATEGORY.EMPTY_NAME_ERROR);
                }
                const nameExists = yield models_1.Category.findOne({ name });
                if (nameExists) {
                    return res.status(400).json(messages_1.default.ERROR.CATEGORY.NAME_ALREADY_EXISTS);
                }
                const category = new models_1.Category({
                    name
                });
                const NewCategory = yield category.save();
                res.status(200).json(NewCategory);
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
                const category = yield models_1.Category.findById(id);
                res.status(200).json(category);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static listCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const list = yield models_1.Category.find();
                if (!list) {
                    res.status(404).json({ error: "Falha ao recuperar as categorias" });
                    return;
                }
                res.status(200).json(list);
            }
            catch (error) {
                res.status(500).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name } = req.body;
                if (!name) {
                    return res.status(400).json(messages_1.default.ERROR.CATEGORY.EMPTY_NAME_ERROR);
                }
                const existingCategory = yield models_1.Category.findOne({ name });
                if (existingCategory && existingCategory._id.toString() != id) {
                    return res.status(400).json(messages_1.default.ERROR.CATEGORY.NAME_ALREADY_EXISTS);
                }
                yield models_1.Category.findByIdAndUpdate(id, { name });
                res.status(201).json(messages_1.default.SUCCESS.CATEGORY.UPDATED);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleteById = yield models_1.Category.findByIdAndRemove(id);
                if (!deleteById) {
                    return res.status(404).json(messages_1.default.ERROR.CATEGORY.DELETE);
                }
                res.json(messages_1.default.SUCCESS.CATEGORY.DELETED);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
}
exports.default = CategoryController;
