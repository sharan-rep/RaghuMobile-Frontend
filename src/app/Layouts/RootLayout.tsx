import { Outlet, useLocation } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';

export default function RootLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isLoginPage && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
}
