import Header from './shared/header';
import Footer from './shared/footer';
import { Outlet } from 'react-router-dom';
import Banner from './shared/banner';
import AuthContextProvider from '../context/authContext';
import CartContextProvider from '../context/cartContext';
export default function Layout() {
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <Banner />
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </CartContextProvider>
    </AuthContextProvider>
  );
}
