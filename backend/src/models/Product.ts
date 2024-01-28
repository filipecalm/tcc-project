import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  images: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  categoryid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
})

const Product = mongoose.model('Product', ProductSchema)

export default Product;
