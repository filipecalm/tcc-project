"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrdersProductSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product'
    },
    amount: {
        type: Number,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    orderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Orders'
    }
});
const OrdersProduct = mongoose_1.default.model('OrdersProduct', OrdersProductSchema);
exports.default = OrdersProduct;
