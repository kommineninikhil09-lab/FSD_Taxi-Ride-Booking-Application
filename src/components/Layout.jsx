import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ScrollToTop from './ScrollToTop.jsx';

// Wraps every page so the navbar and footer stay consistent across the site.
export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
