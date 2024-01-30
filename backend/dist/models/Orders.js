"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrdersSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    priceTotal: {
        type: Number,
        required: true
    },
    OrdersProductId: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'OrdersProduct',
            populate: {
                path: 'productId',
                model: 'Product'
            }
        }
    ]
});
const Orders = mongoose_1.default.model('Orders', OrdersSchema);
exports.default = Orders;
