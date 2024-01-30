import Header from "../components/Header";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import Cart from "../components/Cart";

export default function Product() {
  return (
    <>
      <Header />
      <Navigation title="CARRINHO" />
      <Cart />
      <Footer />
    </>
  );
}