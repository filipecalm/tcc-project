import { Product, Category } from '../models';
import { imageUpload } from '../helpers/image-upload';
import MESSAGE from '../constants/messages';
import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  images: string;
  price: number;
  description: string;
  categoryid: mongoose.Types.ObjectId;
}

export default class ProductController {
  static async createProduct(req: Request, res: Response) {
    try {
      const { name, price, description, categoryid } = req.body

      const category = await Category.findById(categoryid)

      if (!category) {
        return res.status(400).json(MESSAGE.ERROR.CATEGORY.NOT_FOUND)
      }

      const existingProduct = await Product.findOne({ name })

      if (existingProduct) {
        return res.status(400).json(MESSAGE.ERROR.PRODUCT.NAME_ALREADY_EXISTS)
      }

      if (!req.file) {
        return res.status(400).json({ message: "Arquivo não encontrado." });
      }   

      const product = new Product({
        name,
        images: req.file.filename,
        price,
        description,
        categoryid
      })

      const newProduct = await product.save()

      res.status(201).json(newProduct)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async listProducts(req: Request, res: Response) {
    try {
      const { categoryId } = req.query;
      let products;
      if (categoryId) {
        products = await Product.find({ categoryid: categoryId }).populate('categoryid');
      } else {
        products = await Product.find().populate('categoryid');
      }

      res.status(200).json(products);
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH);
    }
  }

  static async listProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      const list = await Product.findById(id).populate('categoryid')

      res.status(200).json(list)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async listProductsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
  
      const products = await Product.find({ categoryid: categoryId }).populate('categoryid');
  
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH);
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, price, description, categoryid } = req.body
      const images = req.file

      const updated = await Product.findByIdAndUpdate(
        id,
        {
          name,
          images: req.file ? req.file.filename : undefined,
          price,
          description,
          categoryid
        },
        { new: true }
      )

      if (!updated) {
        return res.status(404).json(MESSAGE.ERROR.PRODUCT.NOT_FOUND)
      }

      res.json(MESSAGE.SUCCESS.PRODUCT.UPDATED)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params

      const product = await Product.findById(id)

      if (!product) {
        return res.status(404).json(MESSAGE.ERROR.PRODUCT.NOT_FOUND)
      }

      const deleteProduct = await Product.findByIdAndDelete(id)

      res.json(MESSAGE.SUCCESS.PRODUCT.DELETED)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

}