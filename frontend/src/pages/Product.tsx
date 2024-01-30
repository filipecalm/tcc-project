import Header from "../components/Header";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import ProductList from "../components/ProductList";


export default function Product() {
  return (
    <>
      <Header />
      <Navigation title="PRODUTO" />
      <ProductList />
      <Footer />
    </>
  );
}