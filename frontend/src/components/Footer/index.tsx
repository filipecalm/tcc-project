import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Link from '../Link';
import logo from '../../assets/images/Livraria.png';
import styles from './Footer.module.scss';

function Footer() {

  interface Category {
    _id: string;
    name: string;
  }
  
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/category`);
      const categories = await response.json() as Category[];
      const limitedCategories = categories.slice(0, 5);
      setCategories(limitedCategories);
    };
  
    fetchCategories();
  }, []);
  
  return (
    <footer className={styles.footer}>
      <div>
        <img className={styles.logo} src={logo} alt="" />
      </div>
      <div className={styles.linksWrapper}>
        <div>
          <h5 className={styles.h5}>Institucional</h5>
          <ul className={styles.links}>
            <li>
              <Link texto='Início' redirect='/' />
            </li>
            <li>
              <Link texto='Clientes' redirect='/' />
            </li>
            <li><Link texto='Sobre' redirect='sobre' />
            </li>
          </ul>
        </div>
        <div >
          <h5 className={styles.h5}>Linhas</h5>
          <ul className={styles.links}>
            {categories.map((category) => (
              <li key={category._id}>
                <Link texto={category.name} redirect='/' />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.icons}>
        <p className={styles.h5}>Siga Nossas Redes Sociais</p>
        <ul>
          <li><FaFacebook /></li>
          <li><FaInstagram /></li>
          <li><FaLinkedin /></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;