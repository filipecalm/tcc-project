export interface Product {
  _id: string;
  name: string;
  images: string;
  price: number;
  description: string;
  categoryid: string;
}
  
export interface Category {
  _id: string;
  name: string;
}
  
export interface Order {
  _id: string;
  userId: string;
  priceTotal: number;
  OrdersProductId: [OrderProduct];
}
  
export interface OrderProduct {
  _id: string;
  amount: number;
  date: string;
  productsId: Product;
}
  
export interface DataProps {
  data: Product | Category | Order | undefined;
  [key: string]: any;
}