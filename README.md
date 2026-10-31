# 🚕 Book_A_Taxi — Taxi Ride Booking Front-end

Front-end starter code for **Book_A_Taxi**, a taxi ride booking website built with **React 19 + Vite + React Router**. It was generated with generative AI prompts (see [PROMPTS.md](PROMPTS.md)).

## Features
- **Homepage**: hero, features, "How it works", popular services and a call to action
- **About Us**, **Services** and **Contact** pages that share one design
- **Responsive navbar** (with a hamburger menu on mobile) and a footer that link every page
- **Book a Ride** page that can preselect a service from any service card (`/book?service=suv`)
- **Booking form validation**: inline errors, cross-field checks, focus on the first error and a confirmation screen
- Contact form with basic validation and a 404 page

## Getting Started
```bash
npm install
npm run dev        # starts http://localhost:5173
npm run build      # production build in /dist
npm run preview    # preview the production build
```

## End-to-End Tests
The site is tested end to end with [Playwright](https://playwright.dev). The tests drive your installed Google Chrome on a desktop viewport and a mobile (Pixel 7) viewport.

```bash
npm run test:e2e          # runs all tests (starts the dev server automatically)
npm run test:e2e:report   # opens the HTML report
```

| Suite | File | What it covers |
|-------|------|----------------|
| Navigation | `e2e/navigation.spec.js` | Every navbar link from every page, active-link highlight, footer links, logo, page refresh, 404 page, back/forward, scroll-to-top, mobile hamburger menu |
| Pages | `e2e/pages.spec.js` | Home sections and buttons, About content, all 6 services and their "Book" links, Contact form validation and success |
| Booking | `e2e/booking.spec.js` | Form fields, sidebar, every validation rule, re-checking linked fields, Clear button, full booking journeys through to confirmation, no console errors |

Result: **61 test cases × 2 viewports = 122 tests, all passing.**

## Folder Structure
```
Taxi Ride Booking Application/
├── index.html
├── package.json
├── vite.config.js
├── PROMPTS.md                 # AI prompts used for each step
├── playwright.config.js       # E2E test configuration
├── e2e/                       # Playwright end-to-end tests
└── src/
    ├── main.jsx               # entry point + BrowserRouter
    ├── App.jsx                # route definitions
    ├── components/
    │   ├── Layout.jsx         # Navbar + page outlet + Footer
    │   ├── Navbar.jsx         # main navigation (active link highlight)
    │   ├── Footer.jsx         # quick links & contact info
    │   ├── PageHeader.jsx     # shared inner-page banner
    │   ├── ServiceCard.jsx    # service tile linking to the booking page
    │   ├── FormField.jsx      # label + input + inline error
    │   └── ScrollToTop.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── About.jsx
    │   ├── Services.jsx
    │   ├── Contact.jsx
    │   ├── BookRide.jsx       # booking form + confirmation
    │   └── NotFound.jsx
    ├── data/
    │   └── services.js        # service catalogue (shared)
    ├── utils/
    │   └── validateBooking.js # booking form validation rules
    └── styles/
        └── global.css
```

## Routes
| Path        | Page        |
|-------------|-------------|
| `/`         | Home        |
| `/about`    | About Us    |
| `/services` | Services    |
| `/contact`  | Contact     |
| `/book`     | Book a Ride |
| `*`         | 404         |

## Booking Validation Rules
| Field        | Rule |
|--------------|------|
| Full name    | Required, at least 3 characters, letters only |
| Phone        | Required, valid 10-digit mobile number starting with 6–9 |
| Email        | Required, valid email format |
| Pickup       | Required, at least 3 characters |
| Drop-off     | Required, at least 3 characters, must differ from the pickup |
| Date         | Required, not in the past |
| Time         | Required, at least 15 minutes from now |
| Service      | Required |
| Passengers   | Between 1 and the selected service's capacity |
| Notes        | Optional, at most 200 characters |
| Terms        | Must be accepted |
