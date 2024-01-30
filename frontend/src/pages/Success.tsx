import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import SuccessPage from '../components/SuccessPage';

export default function Success() {
  return (
    <>
      <Header />
      <Navigation title="PEDIDO" />
      <SuccessPage />
      <Footer />
    </>
  );
}
