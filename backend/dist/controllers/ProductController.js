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
class ProductController {
    static createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, price, description, categoryid } = req.body;
                const category = yield models_1.Category.findById(categoryid);
                if (!category) {
                    return res.status(400).json(messages_1.default.ERROR.CATEGORY.NOT_FOUND);
                }
                const existingProduct = yield models_1.Product.findOne({ name });
                if (existingProduct) {
                    return res.status(400).json(messages_1.default.ERROR.PRODUCT.NAME_ALREADY_EXISTS);
                }
                if (!req.file) {
                    return res.status(400).json({ message: "Arquivo não encontrado." });
                }
                const product = new models_1.Product({
                    name,
                    images: req.file.filename,
                    price,
                    description,
                    categoryid
                });
                const newProduct = yield product.save();
                res.status(201).json(newProduct);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static listProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.query;
                if (!categoryId) {
                    return res.status(404).json({ error: "Categoria não encontrada" });
                }
                let products;
                if (categoryId) {
                    products = yield models_1.Product.find({ categoryid: categoryId }).populate('categoryid');
                }
                else {
                    products = yield models_1.Product.find().populate('categoryid');
                }
                res.status(200).json(products);
            }
            catch (error) {
                console.error(error); // Logging do erro
                res.status(500).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static listProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const list = yield models_1.Product.findById(id).populate('categoryid');
                res.status(200).json(list);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static listProductsByCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const products = yield models_1.Product.find({ categoryid: categoryId }).populate('categoryid');
                res.status(200).json(products);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, price, description, categoryid } = req.body;
                const images = req.file;
                const updated = yield models_1.Product.findByIdAndUpdate(id, {
                    name,
                    images: req.file ? req.file.filename : undefined,
                    price,
                    description,
                    categoryid
                }, { new: true });
                if (!updated) {
                    return res.status(404).json(messages_1.default.ERROR.PRODUCT.NOT_FOUND);
                }
                res.json(messages_1.default.SUCCESS.PRODUCT.UPDATED);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const product = yield models_1.Product.findById(id);
                if (!product) {
                    return res.status(404).json(messages_1.default.ERROR.PRODUCT.NOT_FOUND);
                }
                const deleteProduct = yield models_1.Product.findByIdAndDelete(id);
                res.json(messages_1.default.SUCCESS.PRODUCT.DELETED);
            }
            catch (error) {
                res.status(400).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
}
exports.default = ProductController;
