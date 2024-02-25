/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import Link from '../Link';
import Card from 'react-bootstrap/Card';
import styles from './HomeProducts.module.scss';

interface Product {
  _id: string;
  images?: string;
  name: string;
  price: number;
  description?: string;
  categoryid?: string;
}

export default function HomeProducts() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${serverUrl}/product`);

      if (response.status === 404) {
        setProducts([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className={styles.sectionCards}>
      <div className={styles.h1}>
        <h1>Nossos Produtos</h1>
      </div>
      <div className={styles.boxWrapper}>
        {Array.isArray(products) && products.slice(0, 3).map(product => {
          return (
            <div key={product._id} className={styles.container}>
              <Card className={styles.cart}>
                <Card.Img
                  className={styles.cardImage}
                  src={`${serverUrl}/images/product/${product.images}`}
                />
                <Card.Body className={styles.cardBody}>
                  <Card.Title className={styles.cardTitle}>
                    {product.name}
                  </Card.Title>
                  <Link
                    texto="COMPRAR"
                    redirect={`product/${product._id}`}
                    className={styles.btn}
                  />
                </Card.Body>
              </Card>
            </div>
          );
        })}
        {products.length <= 0 && (
          <h1>Nenhum item cadastrado até o momento...</h1>
        )}
      </div>
    </section>
  );
}
