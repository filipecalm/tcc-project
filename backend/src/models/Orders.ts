import mongoose from 'mongoose';

const OrdersSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priceTotal: {
    type: Number,
    required: true
  },
  OrdersProductId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrdersProduct',
      populate: {
        path: 'productsId',
        model: 'Product'
      }
    }
  ]
})

const Orders = mongoose.model('Orders', OrdersSchema)


export default Orders;