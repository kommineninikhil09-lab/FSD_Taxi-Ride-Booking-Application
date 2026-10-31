import { Link } from 'react-router-dom';
import { NAV_LINKS } from './Navbar.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <h3 className="footer__brand">🚕 Book_A_Taxi</h3>
          <p>Fast, safe and affordable rides — anytime, anywhere.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul className="footer__list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
            <li>
              <Link to="/book">Book a Ride</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Get in Touch</h4>
          <ul className="footer__list">
            <li>📞 +91 98765 43210</li>
            <li>✉️ support@bookataxi.com</li>
            <li>📍 Hyderabad, India</li>
          </ul>
        </div>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} Book_A_Taxi. All rights reserved.</p>
    </footer>
  );
}
