import Header from './shared/header';
import Footer from './shared/footer';
import { Outlet } from 'react-router-dom';
export default function Layout() {
  return (
    <>
      <Banner />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
