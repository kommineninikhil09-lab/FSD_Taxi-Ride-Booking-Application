import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import { SERVICES } from '../data/services.js';

export default function Services() {
  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="A ride for every need — pick the one that suits you best."
      />

      <section className="section">
        <div className="container">
          <div className="grid grid--3">
            {SERVICES.map((s) => (
              <ServiceCard key={s.id} service={s} showFare />
            ))}
          </div>
          <p className="note">
            * Fares shown are indicative. Final fare depends on distance, time and tolls.
          </p>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <h2>Have questions about a service?</h2>
          <Link to="/contact" className="btn btn--dark btn--lg">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
