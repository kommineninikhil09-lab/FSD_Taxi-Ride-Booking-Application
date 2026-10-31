import { expect } from '@playwright/test';

const pad = (n) => String(n).padStart(2, '0');
export const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const hhmm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

// A booking that passes every validation rule.
export const VALID_BOOKING = {
  fullName: 'Rahul Sharma',
  phone: '9876543210',
  email: 'rahul@example.com',
  pickup: 'Hitech City',
  dropoff: 'Hyderabad Airport',
  date: isoDate(daysFromNow(1)),
  time: '10:30',
  service: 'airport',
  passengers: '2',
};

// Locates a booking/contact field by its id and the inline error rendered beneath it.
export const field = (page, name) => page.locator(`#${name}`);
export const fieldError = (page, name) => page.locator(`#${name}-error`);

export async function fillBooking(page, overrides = {}) {
  const v = { ...VALID_BOOKING, ...overrides };
  for (const name of ['fullName', 'phone', 'email', 'pickup', 'dropoff', 'date', 'time', 'passengers']) {
    await field(page, name).fill(v[name]);
  }
  await field(page, 'service').selectOption(v.service);
  await field(page, 'passengers').fill(v.passengers);
  if (v.terms !== false) await page.locator('#terms').check();
}

export async function submitBooking(page) {
  await page.getByRole('button', { name: 'Confirm Booking' }).click();
}

// On narrow viewports the nav links live behind the hamburger toggle.
export async function openNavIfCollapsed(page) {
  const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(page.locator('.navbar__links')).toHaveClass(/is-open/);
  }
}
