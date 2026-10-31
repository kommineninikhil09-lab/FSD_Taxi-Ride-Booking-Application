import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard.jsx';
import { SERVICES } from '../data/services.js';

const FEATURES = [
  { icon: '⚡', title: 'Quick Pickups', text: 'A driver at your door in minutes, day or night.' },
  { icon: '🛡️', title: 'Safe & Verified', text: 'Background-checked drivers and live ride tracking.' },
  { icon: '💰', title: 'Transparent Fares', text: 'Know your fare upfront — no hidden charges.' },
  { icon: '🕑', title: '24/7 Support', text: 'Our team is always here when you need help.' },
];

const STEPS = [
  { n: 1, title: 'Enter your trip', text: 'Tell us where you are and where you want to go.' },
  { n: 2, title: 'Pick a service', text: 'Choose Economy, Premium, SUV, Airport and more.' },
  { n: 3, title: 'Enjoy the ride', text: 'Your driver arrives on time — sit back and relax.' },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <h1>
              Your ride, <span className="highlight">just a tap away</span>
            </h1>
            <p>
              Book_A_Taxi connects you with reliable drivers for city rides, airport transfers and
              outstation trips — fast, safe and affordable.
            </p>
            <div className="hero__actions">
              <Link to="/book" className="btn btn--primary btn--lg">Book a Ride</Link>
              <Link to="/services" className="btn btn--ghost btn--lg">Explore Services</Link>
            </div>
          </div>
          <div className="hero__art" aria-hidden="true">🚖</div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Why ride with us?</h2>
          <div className="grid grid--4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card feature">
                <div className="feature__icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <h2 className="section__title">How it works</h2>
          <div className="grid grid--3">
            {STEPS.map((s) => (
              <div key={s.n} className="step">
                <span className="step__num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Popular services</h2>
          <div className="grid grid--3">
            {SERVICES.slice(0, 3).map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
          <div className="center">
            <Link to="/services" className="btn btn--primary">View all services</Link>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <h2>Ready to go somewhere?</h2>
          <Link to="/book" className="btn btn--dark btn--lg">Book your taxi now</Link>
        </div>
      </section>
    </>
  );
}
