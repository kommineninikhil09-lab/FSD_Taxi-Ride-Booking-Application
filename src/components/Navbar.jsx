import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={close}>
          <span aria-hidden="true">🚕</span> Book_A_Taxi
        </Link>

        <button
          className="navbar__toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__links ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={close}
              className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/book"
            onClick={close}
            className={({ isActive }) => `btn btn--primary navbar__cta ${isActive ? 'is-active' : ''}`}
          >
            Book a Ride
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
