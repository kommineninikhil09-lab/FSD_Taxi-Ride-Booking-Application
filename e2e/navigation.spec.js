import { test, expect } from '@playwright/test';
import { openNavIfCollapsed } from './helpers.js';

const PAGES = [
  { link: 'Home', path: '/', heading: /Your ride/ },
  { link: 'About Us', path: '/about', heading: 'About Us' },
  { link: 'Services', path: '/services', heading: 'Our Services' },
  { link: 'Contact', path: '/contact', heading: 'Contact Us' },
  { link: 'Book a Ride', path: '/book', heading: 'Book a Ride' },
];

const nav = (page) => page.getByRole('navigation', { name: 'Main navigation' });

test.describe('Navigation', () => {
  test('TC-NAV-01: every page has the navbar and footer', async ({ page }) => {
    for (const p of PAGES) {
      await page.goto(p.path);
      await expect(page.getByRole('heading', { level: 1, name: p.heading })).toBeVisible();
      await expect(page.locator('header.navbar')).toBeVisible();
      await expect(page.locator('footer.footer')).toBeVisible();
      await expect(page).toHaveTitle(/Book_A_Taxi/);
    }
  });

  test('TC-NAV-02: navbar links navigate to every page from every page', async ({ page }) => {
    for (const from of PAGES) {
      for (const to of PAGES) {
        await page.goto(from.path);
        await openNavIfCollapsed(page);
        await nav(page).getByRole('link', { name: to.link, exact: true }).click();
        await expect(page).toHaveURL(to.path);
        await expect(page.getByRole('heading', { level: 1, name: to.heading })).toBeVisible();
      }
    }
  });

  test('TC-NAV-03: the current page link is highlighted as active', async ({ page }) => {
    for (const p of PAGES) {
      await page.goto(p.path);
      const active = nav(page).locator('a.is-active');
      await expect(active).toHaveCount(1);
      await expect(active).toHaveText(p.link);
    }
  });

  test('TC-NAV-04: footer quick links navigate to every page', async ({ page }) => {
    for (const to of PAGES) {
      await page.goto('/contact');
      await page.locator('footer').getByRole('link', { name: to.link, exact: true }).click();
      await expect(page).toHaveURL(to.path);
    }
  });

  test('TC-NAV-05: brand logo returns to the homepage', async ({ page }) => {
    await page.goto('/services');
    await page.getByRole('link', { name: /Book_A_Taxi/ }).first().click();
    await expect(page).toHaveURL('/');
  });

  test('TC-NAV-06: direct URL / page refresh works on inner routes', async ({ page }) => {
    for (const p of PAGES) {
      await page.goto(p.path);
      await page.reload();
      await expect(page.getByRole('heading', { level: 1, name: p.heading })).toBeVisible();
    }
  });

  test('TC-NAV-07: unknown route shows 404 page with link home', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await page.getByRole('link', { name: 'Back to Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('TC-NAV-08: browser back/forward buttons work', async ({ page }) => {
    await page.goto('/');
    await openNavIfCollapsed(page);
    await nav(page).getByRole('link', { name: 'About Us' }).click();
    await openNavIfCollapsed(page);
    await nav(page).getByRole('link', { name: 'Services' }).click();
    await page.goBack();
    await expect(page).toHaveURL('/about');
    await page.goForward();
    await expect(page).toHaveURL('/services');
  });

  test('TC-NAV-09: page scrolls to top on navigation', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await page.locator('footer').getByRole('link', { name: 'About Us' }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });
});

test.describe('Mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('TC-NAV-10: hamburger opens the menu and closes it after navigation', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('.navbar__links');
    const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(links).toHaveClass(/is-open/);

    await nav(page).getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL('/services');
    await expect(links).not.toHaveClass(/is-open/);
  });
});
