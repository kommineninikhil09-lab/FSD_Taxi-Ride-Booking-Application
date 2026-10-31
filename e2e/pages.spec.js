import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('TC-HOME-01: shows hero, features, steps and popular services', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('just a tap away');
    await expect(page.getByRole('heading', { name: 'Why ride with us?' })).toBeVisible();
    await expect(page.locator('.feature')).toHaveCount(4);
    await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible();
    await expect(page.locator('.step')).toHaveCount(3);
    await expect(page.locator('.service-card')).toHaveCount(3);
  });

  test('TC-HOME-02: hero "Book a Ride" goes to the booking page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.hero').getByRole('link', { name: 'Book a Ride' }).click();
    await expect(page).toHaveURL('/book');
  });

  test('TC-HOME-03: hero "Explore Services" and "View all services" go to services', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Explore Services' }).click();
    await expect(page).toHaveURL('/services');
    await page.goto('/');
    await page.getByRole('link', { name: 'View all services' }).click();
    await expect(page).toHaveURL('/services');
  });

  test('TC-HOME-04: CTA band button goes to the booking page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Book your taxi now' }).click();
    await expect(page).toHaveURL('/book');
  });

  test('TC-HOME-05: popular service card preselects that service on booking page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Book Premium Sedan' }).click();
    await expect(page).toHaveURL('/book?service=premium');
    await expect(page.locator('#service')).toHaveValue('premium');
  });
});

test.describe('About page', () => {
  test('TC-ABOUT-01: shows story, mission, stats and values', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: 'Our story' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Our Mission/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Our Vision/ })).toBeVisible();
    await expect(page.locator('.stat')).toHaveCount(4);
    await expect(page.getByRole('heading', { name: 'Our values' })).toBeVisible();
  });

  test('TC-ABOUT-02: links to services and booking', async ({ page }) => {
    await page.goto('/about');
    await page.getByRole('link', { name: 'See our services' }).click();
    await expect(page).toHaveURL('/services');
    await page.goto('/about');
    await page.locator('.section').getByRole('link', { name: 'Book a Ride' }).click();
    await expect(page).toHaveURL('/book');
  });
});

test.describe('Services page', () => {
  const SERVICES = [
    ['economy', 'Economy'],
    ['premium', 'Premium Sedan'],
    ['suv', 'SUV / Family'],
    ['airport', 'Airport Transfer'],
    ['outstation', 'Outstation'],
    ['rental', 'Hourly Rental'],
  ];

  test('TC-SERV-01: lists all 6 services with fares', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('.service-card')).toHaveCount(6);
    await expect(page.locator('.service-card__fare')).toHaveCount(6);
    for (const [, name] of SERVICES) {
      await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    }
  });

  for (const [id, name] of SERVICES) {
    test(`TC-SERV-02: "Book ${name}" preselects ${id} on the booking page`, async ({ page }) => {
      await page.goto('/services');
      await page.getByRole('link', { name: `Book ${name}` }).click();
      await expect(page).toHaveURL(`/book?service=${id}`);
      await expect(page.locator('#service')).toHaveValue(id);
      await expect(page.locator('.booking-aside')).toContainText(name);
    });
  }

  test('TC-SERV-03: "Contact Us" CTA goes to contact page', async ({ page }) => {
    await page.goto('/services');
    await page.getByRole('link', { name: 'Contact Us' }).click();
    await expect(page).toHaveURL('/contact');
  });
});

test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  const send = (page) => page.getByRole('button', { name: 'Send Message' }).click();

  test('TC-CONT-01: shows contact details and links to booking', async ({ page }) => {
    await expect(page.locator('.contact-list li')).toHaveCount(4);
    await page.getByRole('link', { name: 'Book a ride now' }).click();
    await expect(page).toHaveURL('/book');
  });

  test('TC-CONT-02: empty submit shows all required errors', async ({ page }) => {
    await send(page);
    await expect(page.locator('#name-error')).toHaveText('Please enter your name.');
    await expect(page.locator('#email-error')).toHaveText('Please enter your email.');
    await expect(page.locator('#message-error')).toHaveText('Message must be at least 10 characters.');
    await expect(page.locator('.alert--success')).toHaveCount(0);
  });

  test('TC-CONT-03: invalid email and short message are rejected', async ({ page }) => {
    await page.locator('#name').fill('Priya');
    await page.locator('#email').fill('priya@invalid');
    await page.locator('#message').fill('Hi');
    await send(page);
    await expect(page.locator('#email-error')).toHaveText('Please enter a valid email address.');
    await expect(page.locator('#message-error')).toBeVisible();
    await expect(page.locator('#name-error')).toHaveCount(0);
  });

  test('TC-CONT-04: error clears when the user edits the field', async ({ page }) => {
    await send(page);
    await expect(page.locator('#name-error')).toBeVisible();
    await page.locator('#name').fill('P');
    await expect(page.locator('#name-error')).toHaveCount(0);
  });

  test('TC-CONT-05: valid message shows success and resets form', async ({ page }) => {
    await page.locator('#name').fill('Priya');
    await page.locator('#email').fill('priya@example.com');
    await page.locator('#message').fill('I would like to know about corporate rides.');
    await send(page);
    await expect(page.locator('.alert--success')).toContainText('Your message has been sent');
    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
    await expect(page.locator('#message')).toHaveValue('');
  });
});
