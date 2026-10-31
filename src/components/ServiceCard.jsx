import { Link } from 'react-router-dom';

export default function ServiceCard({ service, showFare = false }) {
  return (
    <article className="card service-card">
      <div className="service-card__icon" aria-hidden="true">{service.icon}</div>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      {showFare && (
        <p className="service-card__fare">
          From <strong>₹{service.baseFare}</strong> + ₹{service.perKm}/km · up to {service.maxPassengers} riders
        </p>
      )}
      <Link to={`/book?service=${service.id}`} className="btn btn--outline">
        Book {service.name}
      </Link>
    </article>
  );
}
