import { Product, Orders, OrdersProduct } from '../models';
import getToken from '../helpers/get-token';
import decodedToken from '../helpers/token-decoded';
import MESSAGE from '../constants/messages';
import mongoose from 'mongoose';

import { Request, Response } from 'express';

export interface IProduct {
  name: string;
  images: string;
  price: number;
  description: string;
  categoryid: mongoose.Types.ObjectId;
}

export interface IOrdersProduct {
  productsId?: mongoose.Types.ObjectId;
  amount: number;
  price: number;
  date?: Date;
  orderId?: mongoose.Types.ObjectId;
}

export interface IOrder {
  userId: mongoose.Types.ObjectId;
  priceTotal: number;
  OrdersProductId: mongoose.Types.ObjectId[];
}

export default class CartController {
  static async lists(req: Request, res: Response) {
    try {
      const sales: IOrder[] = await Orders.find().populate({
        path: 'OrdersProductId',
        populate: {
          path: 'productsId',
          model: 'Product'
        }
      })

      res.status(200).json(sales)
    } catch (error) {
      res.status(500).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async listById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const sale = await Orders.findById(id).populate({
        path: 'OrdersProductId',
        populate: {
          path: 'productsId',
          model: 'Product'
        }
      })
      res.status(200).json(sale)
    } catch (error) {
      res.status(500).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async listByUserId(req: Request, res: Response) {
    try {
      const { id } = req.params

      const orders = await Orders.find({ userId: id }).populate({
        path: 'OrdersProductId',
        populate: { path: 'productsId', model: 'Product' }
      })

      res.status(200).json(orders)
    } catch (error) {
      res.status(500).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async createCard(req: Request, res: Response) {
    try {
      const { userId, product: products } = req.body;
  
      let itens: IOrdersProduct[] = [];
      let pricetotal = 0;
  
      const token = getToken(req);
      const decoded = decodedToken(token);
  
      await Promise.all(
        products.map(async product => {
          const findProduct: IProduct | null = await Product.findById(product.productsId);
  
          if (!findProduct) {
            throw new Error("Produto não encontrado.");
          }
  
          pricetotal += findProduct.price * product.amount;
  
          const newItem = new OrdersProduct({
            productsId: product.productsId,
            amount: product.amount,
            price: findProduct.price
          });
  
          const item = await newItem.save();
  
          if (typeof item.productsId === 'undefined' ||
              typeof item.amount === 'undefined' ||
              typeof item.price === 'undefined' ||
              typeof item.orderId === 'undefined') {
            throw new Error("Item inválido.");
          }
  
          itens.push(item as IOrdersProduct);
        })
      );
  
      const newsale = new Orders({
        userId: userId ? userId : decoded.id,
        priceTotal: pricetotal,
        OrdersProductId: itens
      });
  
      const sale = await newsale.save();
  
      res.status(201).json(sale);
    } catch (error) {
      res.status(500).json(MESSAGE.ERROR.ERROR_CATCH);
    }
  }
  
  static async deleteCard(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orders = await Orders.findById(id);
  
      if (!orders) {
        return res.status(404).json({ message: "Pedido não encontrado." });
      }
  
      await Promise.all(
        orders.OrdersProductId.map(async ordersProductId => {
          await OrdersProduct.findByIdAndDelete(ordersProductId.toString());
        })
      );
  
      await Orders.findByIdAndDelete(id);
  
      res.status(204).json();
    } catch (error) {
      res.status(500).json(MESSAGE.ERROR.ERROR_CATCH);
    }
  }
  
}