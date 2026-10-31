import { getServiceById } from '../data/services.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/; // 10-digit Indian mobile number
const NAME_RE = /^[A-Za-z][A-Za-z .'-]*$/;

export const isValidEmail = (email) => EMAIL_RE.test(email.trim());

// Today's date as YYYY-MM-DD in the user's local timezone (used for the date input's min).
export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const MIN_LEAD_MINUTES = 15;

// Validates a single booking field. `values` is passed so cross-field rules can run.
export function validateField(name, values) {
  const v = typeof values[name] === 'string' ? values[name].trim() : values[name];

  switch (name) {
    case 'fullName':
      if (!v) return 'Full name is required.';
      if (v.length < 3) return 'Name must be at least 3 characters.';
      if (!NAME_RE.test(v)) return 'Name can only contain letters, spaces, dots and hyphens.';
      return '';

    case 'phone':
      if (!v) return 'Phone number is required.';
      if (!PHONE_RE.test(v.replace(/[\s-]/g, ''))) return 'Enter a valid 10-digit mobile number.';
      return '';

    case 'email':
      if (!v) return 'Email is required.';
      if (!isValidEmail(v)) return 'Enter a valid email address.';
      return '';

    case 'pickup':
      if (!v) return 'Pickup location is required.';
      if (v.length < 3) return 'Please enter a more specific pickup location.';
      return '';

    case 'dropoff':
      if (!v) return 'Drop-off location is required.';
      if (v.length < 3) return 'Please enter a more specific drop-off location.';
      if (v.toLowerCase() === values.pickup.trim().toLowerCase())
        return 'Drop-off must be different from pickup.';
      return '';

    case 'date':
      if (!v) return 'Pickup date is required.';
      if (v < todayISO()) return 'Pickup date cannot be in the past.';
      return '';

    case 'time': {
      if (!v) return 'Pickup time is required.';
      if (!values.date || values.date < todayISO()) return ''; // date error already covers it
      const pickupAt = new Date(`${values.date}T${v}`);
      const earliest = new Date(Date.now() + MIN_LEAD_MINUTES * 60 * 1000);
      if (pickupAt < earliest)
        return `Pickup time must be at least ${MIN_LEAD_MINUTES} minutes from now.`;
      return '';
    }

    case 'service':
      if (!v) return 'Please select a service.';
      if (!getServiceById(v)) return 'Please select a valid service.';
      return '';

    case 'passengers': {
      const n = Number(v);
      if (!v) return 'Number of passengers is required.';
      if (!Number.isInteger(n) || n < 1) return 'At least 1 passenger is required.';
      const service = getServiceById(values.service);
      if (service && n > service.maxPassengers)
        return `${service.name} allows up to ${service.maxPassengers} passengers.`;
      return '';
    }

    case 'notes':
      if (v && v.length > 200) return 'Notes cannot exceed 200 characters.';
      return '';

    case 'terms':
      return values.terms ? '' : 'You must accept the terms to continue.';

    default:
      return '';
  }
}

export const BOOKING_FIELDS = [
  'fullName', 'phone', 'email', 'pickup', 'dropoff',
  'date', 'time', 'service', 'passengers', 'notes', 'terms',
];

// Validates the whole form; returns an object of { fieldName: message } for invalid fields only.
export function validateBooking(values) {
  return BOOKING_FIELDS.reduce((errors, field) => {
    const msg = validateField(field, values);
    if (msg) errors[field] = msg;
    return errors;
  }, {});
}
