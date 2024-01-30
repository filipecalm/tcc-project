import mongoose from 'mongoose';

const OrdersProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orders'
  }
})

const OrdersProduct = mongoose.model('OrdersProduct', OrdersProductSchema)

export default OrdersProduct;