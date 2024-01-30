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
const get_token_1 = __importDefault(require("../helpers/get-token"));
const token_decoded_1 = __importDefault(require("../helpers/token-decoded"));
const messages_1 = __importDefault(require("../constants/messages"));
class CartController {
    static lists(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sales = yield models_1.Orders.find().populate({
                    path: 'OrdersProductId',
                    populate: {
                        path: 'productId',
                        model: 'Product'
                    }
                });
                res.status(200).json(sales);
            }
            catch (error) {
                res.status(500).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static listById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const sale = yield models_1.Orders.findById(id).populate({
                    path: 'OrdersProductId',
                    populate: {
                        path: 'productId',
                        model: 'Product'
                    }
                });
                res.status(200).json(sale);
            }
            catch (error) {
                res.status(500).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static listByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const orders = yield models_1.Orders.find({ userId: id }).populate({
                    path: 'OrdersProductId',
                    populate: { path: 'productId', model: 'Product' }
                });
                res.status(200).json(orders);
            }
            catch (error) {
                res.status(500).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static createCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, product: products } = req.body;
                let itens = [];
                let pricetotal = 0;
                const token = (0, get_token_1.default)(req);
                const decoded = (0, token_decoded_1.default)(token);
                yield Promise.all(products.map((product) => __awaiter(this, void 0, void 0, function* () {
                    const findProduct = yield models_1.Product.findById(product.productId);
                    if (!findProduct) {
                        throw new Error("Produto não encontrado.");
                    }
                    pricetotal += findProduct.price * product.amount;
                    const newItem = new models_1.OrdersProduct({
                        productId: product.productId,
                        amount: product.amount,
                        price: findProduct.price
                    });
                    const item = yield newItem.save();
                    if (typeof item.productId === 'undefined' ||
                        typeof item.amount === 'undefined' ||
                        typeof item.price === 'undefined' ||
                        typeof item.orderId === 'undefined') {
                        throw new Error("Item inválido.");
                    }
                    itens.push(item);
                })));
                const newsale = new models_1.Orders({
                    userId: userId ? userId : decoded.id,
                    priceTotal: pricetotal,
                    OrdersProductId: itens
                });
                const sale = yield newsale.save();
                res.status(201).json(sale);
            }
            catch (error) {
                res.status(500).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
    static deleteCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const orders = yield models_1.Orders.findById(id);
                if (!orders) {
                    return res.status(404).json({ message: "Pedido não encontrado." });
                }
                yield Promise.all(orders.OrdersProductId.map((ordersProductId) => __awaiter(this, void 0, void 0, function* () {
                    yield models_1.OrdersProduct.findByIdAndDelete(ordersProductId.toString());
                })));
                yield models_1.Orders.findByIdAndDelete(id);
                res.status(204).json();
            }
            catch (error) {
                res.status(500).json(messages_1.default.ERROR.ERROR_CATCH);
            }
        });
    }
}
exports.default = CartController;
