import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section center not-found">
      <div className="container">
        <h1>404</h1>
        <p>Oops! Looks like this road doesn't exist.</p>
        <Link to="/" className="btn btn--primary">Back to Home</Link>
      </div>
    </section>
  );
}
