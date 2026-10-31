import { test, expect } from '@playwright/test';
import {
  VALID_BOOKING, field, fieldError, fillBooking, submitBooking, isoDate, hhmm, daysFromNow,
} from './helpers.js';

test.describe('Book a Ride — page & linking', () => {
  test('TC-BOOK-01: form renders all fields with defaults', async ({ page }) => {
    await page.goto('/book');
    for (const name of ['fullName', 'phone', 'email', 'pickup', 'dropoff', 'date', 'time', 'service', 'passengers', 'notes', 'terms']) {
      await expect(page.locator(`#${name}`)).toBeVisible();
    }
    await expect(field(page, 'passengers')).toHaveValue('1');
    await expect(field(page, 'service')).toHaveValue('');
    await expect(field(page, 'date')).toHaveAttribute('min', isoDate(new Date()));
    await expect(page.locator('.booking-aside')).toContainText('Choose a service');
  });

  test('TC-BOOK-02: sidebar updates when a service is selected', async ({ page }) => {
    await page.goto('/book');
    await field(page, 'service').selectOption('suv');
    const aside = page.locator('.booking-aside');
    await expect(aside).toContainText('SUV / Family');
    await expect(aside).toContainText('₹120');
    await expect(aside).toContainText('Up to 6 passengers');
    await expect(field(page, 'passengers')).toHaveAttribute('max', '6');
  });

  test('TC-BOOK-03: invalid ?service= query param is ignored', async ({ page }) => {
    await page.goto('/book?service=helicopter');
    await expect(field(page, 'service')).toHaveValue('');
  });

  test('TC-BOOK-04: sidebar links go to services and contact', async ({ page }) => {
    await page.goto('/book');
    await page.getByRole('link', { name: 'Compare services' }).click();
    await expect(page).toHaveURL('/services');
    await page.goto('/book');
    await page.getByRole('link', { name: 'Contact our support team' }).click();
    await expect(page).toHaveURL('/contact');
  });
});

test.describe('Book a Ride — validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/book');
  });

  test('TC-VAL-01: empty submit flags every required field and focuses the first', async ({ page }) => {
    await submitBooking(page);
    await expect(page.locator('.alert--error')).toHaveText('Please fix the 9 highlighted fields below.');
    await expect(fieldError(page, 'fullName')).toHaveText('Full name is required.');
    await expect(fieldError(page, 'phone')).toHaveText('Phone number is required.');
    await expect(fieldError(page, 'email')).toHaveText('Email is required.');
    await expect(fieldError(page, 'pickup')).toHaveText('Pickup location is required.');
    await expect(fieldError(page, 'dropoff')).toHaveText('Drop-off location is required.');
    await expect(fieldError(page, 'date')).toHaveText('Pickup date is required.');
    await expect(fieldError(page, 'time')).toHaveText('Pickup time is required.');
    await expect(fieldError(page, 'service')).toHaveText('Please select a service.');
    await expect(page.locator('.field--checkbox .field__error')).toHaveText('You must accept the terms to continue.');
    await expect(field(page, 'fullName')).toBeFocused();
    await expect(field(page, 'fullName')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toHaveCount(0);
  });

  test('TC-VAL-02: field is validated when it loses focus (blur)', async ({ page }) => {
    await field(page, 'email').fill('not-an-email');
    await expect(fieldError(page, 'email')).toHaveCount(0); // not touched yet
    await field(page, 'pickup').focus();
    await expect(fieldError(page, 'email')).toHaveText('Enter a valid email address.');
  });

  test('TC-VAL-03: error clears live once the field is corrected', async ({ page }) => {
    await submitBooking(page);
    await expect(fieldError(page, 'fullName')).toBeVisible();
    await field(page, 'fullName').fill('Rahul Sharma');
    await expect(fieldError(page, 'fullName')).toHaveCount(0);
    await expect(field(page, 'fullName')).toHaveAttribute('aria-invalid', 'false');
    await expect(page.locator('.alert--error')).toHaveText('Please fix the 8 highlighted fields below.');
  });

  const cases = [
    ['TC-VAL-04', 'name too short', { fullName: 'Al' }, 'fullName', 'Name must be at least 3 characters.'],
    ['TC-VAL-05', 'name with digits', { fullName: 'Rahul123' }, 'fullName', 'Name can only contain letters, spaces, dots and hyphens.'],
    ['TC-VAL-06', 'phone too short', { phone: '98765' }, 'phone', 'Enter a valid 10-digit mobile number.'],
    ['TC-VAL-07', 'phone starting with 1', { phone: '1234567890' }, 'phone', 'Enter a valid 10-digit mobile number.'],
    ['TC-VAL-08', 'phone with letters', { phone: '98765abcde' }, 'phone', 'Enter a valid 10-digit mobile number.'],
    ['TC-VAL-09', 'email without domain', { email: 'rahul@' }, 'email', 'Enter a valid email address.'],
    ['TC-VAL-10', 'email without TLD', { email: 'rahul@example' }, 'email', 'Enter a valid email address.'],
    ['TC-VAL-11', 'pickup too short', { pickup: 'AB' }, 'pickup', 'Please enter a more specific pickup location.'],
    ['TC-VAL-12', 'drop-off same as pickup (case-insensitive)', { pickup: 'Hitech City', dropoff: 'hitech city' }, 'dropoff', 'Drop-off must be different from pickup.'],
    ['TC-VAL-13', 'date in the past', { date: isoDate(daysFromNow(-1)) }, 'date', 'Pickup date cannot be in the past.'],
    ['TC-VAL-14', 'passengers over capacity', { service: 'economy', passengers: '5' }, 'passengers', 'Economy allows up to 4 passengers.'],
    ['TC-VAL-15', 'zero passengers', { passengers: '0' }, 'passengers', 'At least 1 passenger is required.'],
  ];

  for (const [id, label, overrides, name, message] of cases) {
    test(`${id}: rejects ${label}`, async ({ page }) => {
      await fillBooking(page, overrides);
      await submitBooking(page);
      await expect(fieldError(page, name)).toHaveText(message);
      await expect(page.locator('.alert--error')).toHaveText('Please fix the 1 highlighted field below.');
      await expect(field(page, name)).toBeFocused();
      await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toHaveCount(0);
    });
  }

  test('TC-VAL-16: pickup time less than 15 minutes from now is rejected', async ({ page }) => {
    const now = new Date();
    await fillBooking(page, { date: isoDate(now), time: hhmm(now) });
    await submitBooking(page);
    await expect(fieldError(page, 'time')).toHaveText('Pickup time must be at least 15 minutes from now.');
  });

  test('TC-VAL-17: phone with spaces/dashes is accepted', async ({ page }) => {
    await fillBooking(page, { phone: '98765-43210' });
    await submitBooking(page);
    await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
  });

  test('TC-VAL-18: notes longer than 200 characters are rejected, counter updates', async ({ page }) => {
    await fillBooking(page);
    await field(page, 'notes').fill('Need a child seat.');
    await expect(page.locator('.field__hint')).toHaveText('18/200 characters');
    await field(page, 'notes').fill('x'.repeat(201));
    await submitBooking(page);
    await expect(fieldError(page, 'notes')).toHaveText('Notes cannot exceed 200 characters.');
  });

  test('TC-VAL-19: terms must be accepted', async ({ page }) => {
    await fillBooking(page, { terms: false });
    await submitBooking(page);
    await expect(page.locator('.field--checkbox .field__error')).toHaveText('You must accept the terms to continue.');
    await page.locator('#terms').check();
    await expect(page.locator('.field--checkbox .field__error')).toHaveCount(0);
  });

  test('TC-VAL-20: changing service re-validates passengers', async ({ page }) => {
    await fillBooking(page, { service: 'economy', passengers: '6' });
    await submitBooking(page);
    await expect(fieldError(page, 'passengers')).toHaveText('Economy allows up to 4 passengers.');
    await field(page, 'service').selectOption('suv');
    await expect(fieldError(page, 'passengers')).toHaveCount(0);
  });

  test('TC-VAL-21: changing pickup re-validates drop-off', async ({ page }) => {
    await fillBooking(page, { pickup: 'Airport', dropoff: 'Airport' });
    await submitBooking(page);
    await expect(fieldError(page, 'dropoff')).toBeVisible();
    await field(page, 'pickup').fill('Hitech City');
    await expect(fieldError(page, 'dropoff')).toHaveCount(0);
  });

  test('TC-VAL-22: "Clear" button resets values and errors', async ({ page }) => {
    await field(page, 'fullName').fill('Rahul');
    await submitBooking(page);
    await expect(page.locator('.alert--error')).toBeVisible();
    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(field(page, 'fullName')).toHaveValue('');
    await expect(page.locator('.field__error')).toHaveCount(0);
    await expect(page.locator('.alert--error')).toHaveCount(0);
  });
});

test.describe('Book a Ride — successful booking', () => {
  test('TC-E2E-01: full journey from home page to confirmed booking', async ({ page }) => {
    await page.goto('/');
    await page.locator('.hero').getByRole('link', { name: 'Book a Ride' }).click();
    await expect(page).toHaveURL('/book');

    await fillBooking(page);
    await field(page, 'notes').fill('Two suitcases');
    await submitBooking(page);

    await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
    await expect(page.getByRole('heading', { name: `Thank you, ${VALID_BOOKING.fullName}!` })).toBeVisible();
    await expect(page.locator('.confirmation strong')).toHaveText(/^BAT-[A-Z0-9]+$/);

    const summary = page.locator('.summary');
    await expect(summary).toContainText('Airport Transfer');
    await expect(summary).toContainText(VALID_BOOKING.pickup);
    await expect(summary).toContainText(VALID_BOOKING.dropoff);
    await expect(summary).toContainText(`${VALID_BOOKING.date} at ${VALID_BOOKING.time}`);
    await expect(summary).toContainText(VALID_BOOKING.phone);
    await expect(summary).toContainText('Two suitcases');
    await expect(page.locator('.confirmation')).toContainText(VALID_BOOKING.email);
  });

  test('TC-E2E-02: service card → booking with preselected service → confirmation', async ({ page }) => {
    await page.goto('/services');
    await page.getByRole('link', { name: 'Book SUV / Family' }).click();
    await expect(field(page, 'service')).toHaveValue('suv');
    await fillBooking(page, { service: 'suv', passengers: '6' });
    await submitBooking(page);
    await expect(page.locator('.summary')).toContainText('SUV / Family');
    await expect(page.locator('.summary')).toContainText('6');
  });

  test('TC-E2E-03: "Book another ride" returns to an empty form', async ({ page }) => {
    await page.goto('/book');
    await fillBooking(page);
    await submitBooking(page);
    await page.getByRole('button', { name: 'Book another ride' }).click();
    await expect(page.getByRole('heading', { name: 'Book a Ride', level: 1 })).toBeVisible();
    await expect(field(page, 'fullName')).toHaveValue('');
    await expect(page.locator('.field__error')).toHaveCount(0);
  });

  test('TC-E2E-04: "Back to Home" from confirmation goes home', async ({ page }) => {
    await page.goto('/book');
    await fillBooking(page);
    await submitBooking(page);
    await page.getByRole('link', { name: 'Back to Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('TC-E2E-05: no console errors across a full booking journey', async ({ page }) => {
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    for (const path of ['/', '/about', '/services', '/contact', '/book']) await page.goto(path);
    await fillBooking(page);
    await submitBooking(page);
    await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
    expect(errors).toEqual([]);
  });
});
