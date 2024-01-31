/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Link from '../Link';
import styles from './ProductsList.module.scss';

interface Product {
  _id: string;
  images?: string;
  name: string;
  price: number;
  description?: string;
  categoryid?: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function ProductsList() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const productsPerPage = 15;
  const pagesCount = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const currentProducts = products
    ? Array.isArray(products) && products.slice(
      currentPage * productsPerPage,
      (currentPage + 1) * productsPerPage
    )
    : [];

  const fetchProducts = async () => {
    fetch(`${serverUrl}/product`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  };

  const fetchProductsByCategory = async () => {
    fetch(`${serverUrl}/product/category/${id}`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  };

  const fetchCategories = async () => {
    fetch(`${serverUrl}/category`)
      .then(response => response.json())
      .then(data => {
        setCategories(data);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    if (id) fetchProductsByCategory();
    else fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.form}>
          <h5>GÊNEROS</h5>
          <div className={styles.formCheckItem}>
            <select
              title='Categorias'
              value={id}
              onChange={(event) => {
                const categoryId = event.target.value;
                if (categoryId) {
                  window.location.href = `/product/category/${categoryId}`;
                } else {
                  window.location.href = "/product";
                }
              }}
            >
              <option className={styles.form} value="">Categoria</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <div className={styles.grid}>
        {Array.isArray(products) && products.length > 0 &&
          Array.isArray(currentProducts) && currentProducts.map((product, index) => {
            return (
              <div className={styles.image} key={`${product._id}_${index}`}>
                <Link redirect={`/product/${product._id}`}>
                  <img
                    title="Produto"
                    alt="Imagem do produto"
                    className={styles.image}
                    src={`${serverUrl}/images/product/${product.images}`}
                  />
                </Link>
                <h3 className={styles.h3}> {product.name} </h3>
                <p className={styles.p}>
                  R${' '}
                  {product.price.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <Link redirect={`/product/${product._id}`} className={styles.btn}>
                  COMPRAR
                </Link>
              </div>
            );
          })
        }
      </div>

      <div className={styles.pagination}>
        {pagesCount > 1 && (
          <button
            type='button'
            title="icon"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            <FaChevronLeft />
          </button>
        )}
        <span className={styles.span}>
          {currentPage + 1} de {pagesCount ? Math.max(pagesCount, 1) : currentPage + 1}
        </span>
        {pagesCount > 1 && (
          <button
            type='button'
            title="icon"
            onClick={handleNextPage}
            disabled={currentPage === pagesCount - 1}
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}
