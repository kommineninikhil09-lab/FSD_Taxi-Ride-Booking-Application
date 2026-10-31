import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

const STATS = [
  { value: '50K+', label: 'Happy riders' },
  { value: '2,000+', label: 'Verified drivers' },
  { value: '25', label: 'Cities served' },
  { value: '4.8★', label: 'Average rating' },
];

const VALUES = [
  { icon: '🤝', title: 'Customer First', text: 'Every decision starts with what makes your ride better.' },
  { icon: '🛡️', title: 'Safety Always', text: 'Verified drivers, SOS support and real-time trip sharing.' },
  { icon: '🌱', title: 'Sustainability', text: 'Growing our fleet of CNG and electric vehicles every year.' },
];

export default function About() {
  return (
    <>
      <PageHeader title="About Us" subtitle="Moving people, connecting cities." />

      <section className="section">
        <div className="container two-col">
          <div>
            <h2>Our story</h2>
            <p>
              Book_A_Taxi started with a simple idea: getting a cab should be easy, safe and fairly
              priced. What began as a small fleet in one city has grown into a trusted network of
              professional drivers serving thousands of riders every day.
            </p>
            <p>
              We combine smart technology with a human touch — from instant booking and live
              tracking to round-the-clock customer support.
            </p>
          </div>
          <div className="card mission">
            <h3>🎯 Our Mission</h3>
            <p>To make every journey comfortable, reliable and affordable for everyone.</p>
            <h3>👁️ Our Vision</h3>
            <p>To be the most trusted mobility partner in every city we serve.</p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container grid grid--4">
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <span className="stat__value">{s.value}</span>
              <span className="stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Our values</h2>
          <div className="grid grid--3">
            {VALUES.map((v) => (
              <div key={v.title} className="card feature">
                <div className="feature__icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
          <div className="center">
            <Link to="/services" className="btn btn--outline">See our services</Link>{' '}
            <Link to="/book" className="btn btn--primary">Book a Ride</Link>
          </div>
        </div>
      </section>
    </>
  );
}
