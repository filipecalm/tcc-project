import Link from '../Link';
import ModalLogin from '../ModalLogin';
import styles from './Header.module.scss';
import { useState, useEffect } from 'react';
import { ChakraProvider } from "@chakra-ui/react"
import logo from '../../assets/images/Livraria.png';
import { FiShoppingCart, FiUser, FiAlignJustify } from 'react-icons/fi';

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin = false }: HeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const isAdminUser = localStorage.getItem('isAdmin') === 'true';

  const storageProducts = localStorage.getItem('cartProducts');
  const cartProducts = storageProducts ? JSON.parse(storageProducts) : [];
  const totalProductsInCart = cartProducts.length;

  const handleLogOut = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAdmin');
    setIsUserLoggedIn(false);
  };

  useEffect(() => {
    setIsUserLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    localStorage.getItem('userData')
  }, [isModalOpen]);

  const RegularHeader = () => {
    return (
      <>
        <header className={styles.header}>
          <div className={styles.logoWrapper}>
            <Link redirect="/">
              <img className={styles.logo} src={logo} alt="" />
            </Link>
          </div>
          <div className={styles.linksWrapper}>
            <Link texto="Home" redirect="/" />
            <Link texto="Produtos" redirect="/product" />
            <Link texto="Sobre" redirect="/sobre" />
          </div>

          <nav className={styles.navWrapper}>
            <ul className={styles.iconsWrapper}>
              <li>
                <ChakraProvider>
                </ChakraProvider>
              </li>
              <li>
                <a title="Produtos" href="/cart" className={styles.countWrapper}>
                  <FiShoppingCart size={30}/>
                  {totalProductsInCart > 0 && (
                    <span className={styles.cartItemCount}>
                      {totalProductsInCart}
                    </span>
                  )}
                </a>
              </li>
              <li>
                <div className={styles.alignMenuItems}>
                  {isUserLoggedIn ? (
                    <div className={styles.alignMenuItems}>
                      <Link
                        className={styles.alignMenuItems}
                        redirect="/editprofile"
                      >
                        <FiUser  size={30}/>
                        <span>Minha conta</span>
                      </Link>
                      <Link redirect="/cart">
                        <span>Meus pedidos</span>
                      </Link>
                      {isAdminUser && (
                        <Link redirect="/admin">
                          <span>Painel Administrativo</span>
                        </Link>
                      )}
                      <Link onClick={handleLogOut} redirect="/">
                        Sair
                      </Link>
                    </div>
                  ) : (
                    <button className={styles.loginButton} onClick={() => setIsModalOpen(true)}>Login</button>
                  )}
                </div>
              </li>
              <ModalLogin isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
            </ul>
            <ul className={styles.iconsWrapperMobile}>
              <li onClick={() => setShowMobileMenu(!showMobileMenu)}>
                <FiAlignJustify size={30}/>
              </li>
            </ul>
          </nav>
        </header>
        {showMobileMenu && (
          <div className={styles.mobileMenu}>
            <ul>
              <li>
                <Link texto="Home" redirect="/" />
              </li>
              <li>
                <Link texto="Produtos" redirect="/loja" />
              </li>
              <li>
                <Link texto="Sobre" redirect="/sobre" />
              </li>
            </ul>
          </div>
        )}
      </>
    );
  };

  const AdminHeader = () => {
    return (
      <>
        <header className={styles.header}>
          <div className={styles.logoWrapper}>
            <Link redirect="/">
              <img className={styles.logo} src={logo} alt="" />
            </Link>
          </div>
          <nav className={styles.navWrapper}>
            <ul className={styles.iconsWrapper}>
              <li>
                <ChakraProvider>
                </ChakraProvider>
              </li>
              <li><Link texto="Home" redirect="/" /></li>
              <li><Link texto="Painel Administrativo" redirect="/admin" /></li>
              <li>
                <Link onClick={handleLogOut} redirect="/">
                  Sair
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      </>
    );
  };

  return <>{isAdmin ? <AdminHeader /> : <RegularHeader />}</>;
}
