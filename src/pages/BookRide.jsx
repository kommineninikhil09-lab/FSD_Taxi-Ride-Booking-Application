import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import FormField from '../components/FormField.jsx';
import { SERVICES, getServiceById } from '../data/services.js';
import { validateField, validateBooking, todayISO, BOOKING_FIELDS } from '../utils/validateBooking.js';

const initialValues = (service = '') => ({
  fullName: '',
  phone: '',
  email: '',
  pickup: '',
  dropoff: '',
  date: '',
  time: '',
  service,
  passengers: '1',
  notes: '',
  terms: false,
});

// Fields whose validity depends on another field, so they are re-checked together.
const DEPENDENTS = { pickup: ['dropoff'], date: ['time'], service: ['passengers'] };

export default function BookRide() {
  const [searchParams] = useSearchParams();
  const preselected = getServiceById(searchParams.get('service'))?.id ?? '';

  const [values, setValues] = useState(() => initialValues(preselected));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [booking, setBooking] = useState(null);

  const revalidate = (names, nextValues, nextTouched) => {
    setErrors((prev) => {
      const next = { ...prev };
      names.forEach((n) => {
        if (nextTouched[n]) next[n] = validateField(n, nextValues);
      });
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValues = { ...values, [name]: type === 'checkbox' ? checked : value };
    setValues(nextValues);
    revalidate([name, ...(DEPENDENTS[name] ?? [])], nextValues, touched);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const nextTouched = { ...touched, [name]: true };
    setTouched(nextTouched);
    revalidate([name], values, nextTouched);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateBooking(values);
    setErrors(errs);
    setTouched(Object.fromEntries(BOOKING_FIELDS.map((f) => [f, true])));

    const firstInvalid = BOOKING_FIELDS.find((f) => errs[f]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setBooking({
      ...values,
      id: `BAT-${Date.now().toString(36).toUpperCase()}`,
      serviceInfo: getServiceById(values.service),
    });
  };

  const handleReset = () => {
    setValues(initialValues());
    setErrors({});
    setTouched({});
    setBooking(null);
  };

  const fieldProps = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
  });

  const selectedService = getServiceById(values.service);
  const errorCount = Object.values(errors).filter(Boolean).length;

  if (booking) {
    return (
      <>
        <PageHeader title="Booking Confirmed" subtitle="Your taxi is on the way!" />
        <section className="section">
          <div className="container narrow">
            <div className="card confirmation">
              <div className="confirmation__icon" aria-hidden="true">✅</div>
              <h2>Thank you, {booking.fullName}!</h2>
              <p>Your booking ID is <strong>{booking.id}</strong>. A confirmation has been sent to {booking.email}.</p>
              <dl className="summary">
                <dt>Service</dt><dd>{booking.serviceInfo.icon} {booking.serviceInfo.name}</dd>
                <dt>From</dt><dd>{booking.pickup}</dd>
                <dt>To</dt><dd>{booking.dropoff}</dd>
                <dt>Pickup</dt><dd>{booking.date} at {booking.time}</dd>
                <dt>Passengers</dt><dd>{booking.passengers}</dd>
                <dt>Phone</dt><dd>{booking.phone}</dd>
                {booking.notes && (<><dt>Notes</dt><dd>{booking.notes}</dd></>)}
              </dl>
              <div className="confirmation__actions">
                <button className="btn btn--primary" onClick={handleReset}>Book another ride</button>
                <Link to="/" className="btn btn--outline">Back to Home</Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Book a Ride" subtitle="Fill in your trip details and we'll handle the rest." />

      <section className="section">
        <div className="container booking-layout">
          <form className="card form" onSubmit={handleSubmit} noValidate>
            {errorCount > 0 && Object.keys(touched).length === BOOKING_FIELDS.length && (
              <div className="alert alert--error" role="alert">
                Please fix the {errorCount} highlighted field{errorCount > 1 ? 's' : ''} below.
              </div>
            )}

            <fieldset>
              <legend>Your details</legend>
              <FormField label="Full Name *" placeholder="e.g. Rahul Sharma" autoComplete="name" {...fieldProps('fullName')} />
              <div className="form-row">
                <FormField label="Phone *" type="tel" placeholder="10-digit mobile" autoComplete="tel" maxLength={12} {...fieldProps('phone')} />
                <FormField label="Email *" type="email" placeholder="you@example.com" autoComplete="email" {...fieldProps('email')} />
              </div>
            </fieldset>

            <fieldset>
              <legend>Trip details</legend>
              <FormField label="Pickup Location *" placeholder="Where should we pick you up?" {...fieldProps('pickup')} />
              <FormField label="Drop-off Location *" placeholder="Where are you going?" {...fieldProps('dropoff')} />
              <div className="form-row">
                <FormField label="Pickup Date *" type="date" min={todayISO()} {...fieldProps('date')} />
                <FormField label="Pickup Time *" type="time" {...fieldProps('time')} />
              </div>
              <div className="form-row">
                <FormField label="Service *" as="select" {...fieldProps('service')}>
                  <option value="">-- Select a service --</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                  ))}
                </FormField>
                <FormField
                  label="Passengers *"
                  type="number"
                  min={1}
                  max={selectedService?.maxPassengers ?? 6}
                  {...fieldProps('passengers')}
                />
              </div>
              <FormField
                label="Notes for driver (optional)"
                as="textarea"
                rows={3}
                placeholder="Landmark, luggage, child seat..."
                hint={`${values.notes.length}/200 characters`}
                {...fieldProps('notes')}
              />
            </fieldset>

            <div className={`field field--checkbox ${errors.terms ? 'field--error' : ''}`}>
              <label>
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={values.terms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(errors.terms)}
                />
                I agree to the terms of service and cancellation policy *
              </label>
              <small className={errors.terms ? 'field__error' : 'field__msg'} role={errors.terms ? 'alert' : undefined}>
                {errors.terms}
              </small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn--primary btn--lg">Confirm Booking</button>
              <button type="button" className="btn btn--ghost-dark" onClick={handleReset}>Clear</button>
            </div>
          </form>

          <aside className="card booking-aside">
            <h3>Selected service</h3>
            {selectedService ? (
              <>
                <div className="service-card__icon">{selectedService.icon}</div>
                <h4>{selectedService.name}</h4>
                <p>{selectedService.description}</p>
                <p className="service-card__fare">
                  Base fare <strong>₹{selectedService.baseFare}</strong> + ₹{selectedService.perKm}/km
                  <br />Up to {selectedService.maxPassengers} passengers
                </p>
              </>
            ) : (
              <p>Choose a service to see fare details. <Link to="/services">Compare services</Link></p>
            )}
            <hr />
            <p className="small">Need help? <Link to="/contact">Contact our support team</Link>.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
