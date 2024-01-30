import { useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '../Link';
import styles from './Cart.module.scss';

interface CartProduct {
  cartId: string;
  _id: string;
  images: string;
  alt: string;
  name: string;
  price: number;
}

export default function Cart() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const toast = useToast();
  const navigate = useNavigate();

  const localStorageItems = localStorage.getItem('cartProducts');
  const cartProducts = localStorageItems ? JSON.parse(localStorageItems) : [];

  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState<CartProduct[]>(cartProducts);

  const token = localStorage.getItem('token');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const removeProduct = (cartId: string) => {
    const updatedItems = cartItems?.filter(item => item.cartId !== cartId);

    setCartItems(updatedItems);
    localStorage.setItem('cartProducts', JSON.stringify(updatedItems));

    const newTotal = updatedItems.reduce(
      (acc, item) => acc + (item.price ?? 0),
      0
    );
    setTotal(newTotal);
  };

  const createOrder = () => {
    if (!token || !isLoggedIn) {
      toast({
        title: 'Usuário não autenticado.',
        description:
          'Por favor, faça seu login ou cadastre-se antes de prosseguir com a compra.',
        status: 'error',
        duration: 9000,
        isClosable: true
      });
      return;
    }

    const orderItems = cartProducts.map((product: CartProduct) => ({
      productId: product._id,
      amount: 1
    }));
    const data = { product: orderItems };

    fetch(`${serverUrl}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        toast({
          title: 'Sucesso.',
          description: 'Compra realizada com sucesso, obrigado.',
          status: 'success',
          duration: 9000,
          isClosable: true
        });
        localStorage.removeItem('cartProducts');
        navigate(`/success/${data._id}`);
      })
      .catch(error => {
        toast({
          title: 'Oops.',
          description: 'Ocorreu um erro, por favor tente novamente.',
          status: 'error',
          duration: 9000,
          isClosable: true
        });
      });
  };

  useEffect(() => {
    const initialTotal = cartItems.reduce(
      (acc, item) => acc + (item.price ?? 0),
      0
    );
    setTotal(initialTotal);
  }, [cartItems]);

  return (
    <main className={styles.shoppingCart}>
      <div className={styles.cart}>
        {cartItems.map(product => {
          const { cartId, images, name, price } = product;
          return (
            <div key={cartId} className={styles.boxCart}>
              <div className={styles.image}>
                <img src={`${serverUrl}/images/product/${images}`} alt="" />
              </div>
              <div className={styles.text}>
                <h3>{name}</h3>
                <p>R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}</p>
                <button
                  className={styles.btnStyle}
                  onClick={() => removeProduct(product.cartId)}
                >
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.price}>
        <div className={styles.sun}>
          <h1>Total</h1>
          <p>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div>
          <Link
            texto={
              isLoggedIn
                ? 'Finalizar compra'
                : 'Faça seu login para finalizar a compra'
            }
            className={styles.btn}
            onClick={createOrder}
          />
        </div>
        <div>
          <Link
            texto="Adicionar mais itens"
            redirect="/product"
            className={styles.btn}
          />
        </div>
      </div>
    </main>
  );
}
