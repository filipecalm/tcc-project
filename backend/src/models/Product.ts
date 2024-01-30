import mongoose from 'mongoose';

interface IProduct {
  name: string;
  images: string;
  price: number;
  description: string;
  categoryid: mongoose.Types.ObjectId;
}

const ProductSchema = new mongoose.Schema<IProduct>({
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

const Product = mongoose.model<IProduct>('Product', ProductSchema)

export default Product;
