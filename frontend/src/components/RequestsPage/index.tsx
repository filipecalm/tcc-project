/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import styles from './RequestsPage.module.scss';
import { useToast } from '@chakra-ui/react';

interface Product {
  description: string;
  name: string;
  price: number;
  images: string;
}

interface OrdersProducts {
  _id: string;
  amount: number;
  date: string;
  productId: Product;
}

interface Order {
  _id: string;
  priceTotal: number;
  OrdersProductId: [OrdersProducts];
}

export default function RequestsPage() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const userId = localStorage.getItem('userId');
  const [orders, setOrders] = useState<Order[]>([]);
  const toast = useToast()

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${serverUrl}/cart/user/${userId}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast({
        title: 'Ocorreu um erro ao processar a requisição.',
        description: 'Por favor, tente novamente mais tarde.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className={styles.container}>
      {orders.map(order => {
        return (
          <div className={styles.box}>
            <div className={styles.description}>
              <div className={styles.order}>
                <h3>PEDIDO Nº {order._id} </h3>
              </div>
              {order.OrdersProductId.map(orderProduct => (
                <div>
                  <h4>NOME: {orderProduct.productId.name}</h4>
                  <h4>QTD: {orderProduct.amount}</h4>
                  <h4>DATA: {new Date(orderProduct.date).toLocaleString('en-GB')}</h4>
                  <h4>
                    R${' '}
                    {orderProduct.productId.price.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </h4>
                </div>
              ))}
              <div className={styles.total}>
                <h3>
                  TOTAL R${' '}
                  {order.priceTotal.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}{' '}
                </h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}