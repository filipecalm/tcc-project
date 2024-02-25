import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Success from './pages/Success';
import Product from './pages/Product';
import Products from './pages/Products';
import Requests from './pages/Requests';
import Register from './pages/Register';
import AboutPage from './pages/AboutPage';
import EditProfile from './pages/EditProfile';
import Protected from './components/Protected';
import LoginStatusListener from './utils/utilLogin'

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isAdminUser = localStorage.getItem('isAdmin') === 'true';

  return (
    <BrowserRouter>
      <LoginStatusListener />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/category/:id" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route
          path="/success/:id"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <Success />
            </Protected>
          }
        />
        <Route
          path="/cart"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <Requests />
            </Protected>
          }
        />
        <Route
          path="/editprofile"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <EditProfile />
            </Protected>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <Protected isLoggedIn={isAdminUser}>
              <Admin />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;