import Header from "../components/Header";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import ProductsList from "../components/ProductsList";

export default function Products() {
  return (
    <>
      <Header />
      <Navigation title="PRODUTOS" />
      <ProductsList />
      <Footer />
    </>
  );
}