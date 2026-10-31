import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import FormField from '../components/FormField.jsx';
import { isValidEmail } from '../utils/validateBooking.js';

const EMPTY = { name: '', email: '', message: '' };

function validateContact(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Please enter your name.';
  if (!v.email.trim()) errors.email = 'Please enter your email.';
  else if (!isValidEmail(v.email)) errors.email = 'Please enter a valid email address.';
  if (v.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateContact(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSent(true);
      setValues(EMPTY);
    }
  };

  return (
    <>
      <PageHeader title="Contact Us" subtitle="We'd love to hear from you." />

      <section className="section">
        <div className="container two-col">
          <div className="card">
            <h2>Get in touch</h2>
            <ul className="contact-list">
              <li><strong>📞 Phone:</strong> +91 98765 43210</li>
              <li><strong>✉️ Email:</strong> support@bookataxi.com</li>
              <li><strong>📍 Office:</strong> 2nd Floor, Hitech City, Hyderabad, India</li>
              <li><strong>🕑 Support hours:</strong> 24 × 7</li>
            </ul>
            <p>
              Need a cab right away? <Link to="/book">Book a ride now</Link>.
            </p>
          </div>

          <form className="card form" onSubmit={handleSubmit} noValidate>
            <h2>Send us a message</h2>
            {sent && (
              <div className="alert alert--success" role="status">
                Thanks! Your message has been sent. We'll get back to you shortly.
              </div>
            )}
            <FormField label="Name" name="name" value={values.name} onChange={handleChange} error={errors.name} />
            <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} />
            <FormField label="Message" name="message" as="textarea" rows={5} value={values.message} onChange={handleChange} error={errors.message} />
            <button type="submit" className="btn btn--primary btn--block">Send Message</button>
          </form>
        </div>
      </section>
    </>
  );
}
