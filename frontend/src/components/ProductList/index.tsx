import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as uuid from 'uuid';
import styles from './ProductList.module.scss';

interface Product {
  _id: string;
  images?: string;
  name: string;
  price: number;
  description?: string;
  categoryid?: string;
}

export default function ProductList() {
  const { id } = useParams();
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [product, setProduct] = useState<Product>();
  const navigate = useNavigate();

  const localStorageItems = localStorage.getItem('cartProducts');
  const cartItems = localStorageItems ? JSON.parse(localStorageItems) : [];

  const addToCart = () => {
    const productWithCartId = {
      ...product,
      cartId: uuid.v4(),
      amount: 1,
    };

    const updatedCartItems = [...cartItems, productWithCartId];
    localStorage.setItem('cartProducts', JSON.stringify(updatedCartItems));
    navigate('/cart');
  };

  const fetchProduct = useCallback(async () => {
    fetch(`${serverUrl}/product/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error(error));
  }, [id, serverUrl]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return (
    <div className={styles.container}>
      <>
        {product && (
          <div className={styles.box}>
            <div className={styles.image}>
              <img src={`${serverUrl}/images/product/${product.images}`} alt="" />
            </div>
            <div className={styles.description}>
              <div>
                <h1>{product.name}</h1>
              </div>
              <div>
                <h3>DESCRIÇÃO:</h3>
              </div>
              <div>
                <p>{product.description}</p>
              </div>
              <div>
                <h3>PREÇO:</h3>
              </div>
              <div>
                <p>R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <button className={styles.btn} onClick={() => addToCart()}>ADICIONAR AO CARRINHO</button>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}