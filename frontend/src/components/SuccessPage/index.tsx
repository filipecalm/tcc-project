/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SuccessPage.module.scss';
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

export default function SuccessPage() {
  const { id } = useParams();
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [order, setOrder] = useState<Order>();
  const toast = useToast();

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${serverUrl}/cart/${id}`);
      const data = await response.json();
      setOrder(data);
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
    fetchOrder();
  }, [id]);

  return (
    <main className={styles.main}>
      <div className={styles.h1}>
        <h1>Compra realizada com sucesso ;)</h1>
      </div>
      <div className={styles.description}>
        {order?.OrdersProductId.map(orderProduct => (
          <div key={orderProduct._id}>
            <div className={styles.name}>
              <div className={styles.image}>
                <img
                  src={`${serverUrl}/images/product/${orderProduct.productId.images}`}
                  alt={orderProduct.productId.name}
                />
              </div>
              <h3>NOME: {orderProduct.productId.name}</h3>
              <h3>QTD: {orderProduct.amount}</h3>
              <h3>
                DATA: {new Date(orderProduct.date).toLocaleString('en-GB')}
              </h3>
              <h3>R$ {orderProduct.productId.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
          </div>
        ))}
        <div className={styles.sun}>
          <h3>TOTAL R$ {order?.priceTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>
      </div>
    </main>
  );
}


