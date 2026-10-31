# Generative AI Prompts Used — Book_A_Taxi

This file records the AI prompts used to generate each part of the Book_A_Taxi front-end starter code, mapped to the project's **Action** steps and **Rubric** criteria.

---

## Step 1 — Folder Structure & Homepage
**Rubric:** Folder Structure and Homepage Generation

> **Prompt 1.1:** "Act as a senior React developer. Generate a clean front-end folder structure for a taxi ride booking web application called **Book_A_Taxi** using React and Vite. Separate reusable components, pages, data, utilities and styles into their own folders, and explain the purpose of each folder."

> **Prompt 1.2:** "Write the `package.json`, `vite.config.js`, `index.html`, `main.jsx` and `App.jsx` for this Book_A_Taxi React project. Use `react-router-dom` with `BrowserRouter` and a shared layout component."

> **Prompt 1.3:** "Create a responsive React homepage (`Home.jsx`) for Book_A_Taxi with: a hero section with a headline and 'Book a Ride' / 'Explore Services' buttons, a 'Why ride with us' features section, a 3-step 'How it works' section, a preview of popular services, and a call-to-action band. Use a taxi theme of yellow (#ffc107) and charcoal (#1f2329)."

**Output:** `index.html`, `package.json`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`, `src/pages/Home.jsx`, `src/styles/global.css`, `src/data/services.js`

---

## Step 2 — Additional Pages (About Us, Services, Contact)
**Rubric:** React Script Generation for Additional Pages

> **Prompt 2.1:** "Generate a React `About.jsx` page for Book_A_Taxi with a page header banner, an 'Our story' section, mission and vision cards, a statistics row (riders, drivers, cities, rating) and a 'Our values' grid. Reuse the same styling classes as the homepage for design consistency."

> **Prompt 2.2:** "Generate a React `Services.jsx` page that lists taxi services (Economy, Premium Sedan, SUV, Airport Transfer, Outstation, Hourly Rental) from a shared `services.js` data file. Show each service in a reusable `ServiceCard` component with icon, description, indicative fare and a 'Book' button."

> **Prompt 2.3:** "Generate a React `Contact.jsx` page with company contact details (phone, email, address, support hours) and a contact form (name, email, message) with simple validation and a success message."

> **Prompt 2.4:** "Create a reusable `PageHeader` component so every inner page has the same title banner style."

**Output:** `src/pages/About.jsx`, `src/pages/Services.jsx`, `src/pages/Contact.jsx`, `src/components/PageHeader.jsx`, `src/components/ServiceCard.jsx`

---

## Step 3 — Link All Pages (Navigation)
**Rubric:** Navigation Menu Update

> **Prompt 3.1:** "Create a responsive `Navbar` component in React Router using `NavLink` with links to Home, About Us, Services and Contact. Highlight the active page, and collapse into a hamburger menu on mobile."

> **Prompt 3.2:** "Create a `Footer` component with quick links to every page, contact info and copyright. Wrap all pages in a `Layout` component using `<Outlet />` so the navbar and footer appear on every page, and scroll to top on route change."

> **Prompt 3.3:** "Add a catch-all 404 route with a 'Back to Home' link."

**Output:** `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `src/components/Layout.jsx`, `src/components/ScrollToTop.jsx`, `src/pages/NotFound.jsx`

---

## Step 4 — Book a Ride Page
**Rubric:** Integration of the Booking Page

> **Prompt 4.1:** "Create a `BookRide.jsx` page for Book_A_Taxi with a booking form containing: full name, phone, email, pickup location, drop-off location, pickup date, pickup time, service type (dropdown from `services.js`), number of passengers, optional notes for the driver and a terms checkbox. Show a sidebar with details of the selected service."

> **Prompt 4.2:** "Link the booking page to every existing page: add a highlighted 'Book a Ride' button in the navbar and footer, make the homepage hero/CTA buttons go to `/book`, and make each service card link to `/book?service=<id>` so the service is pre-selected from the URL query parameter."

> **Prompt 4.3:** "After a successful booking, show a confirmation screen with a generated booking ID and a summary of the trip, with buttons to book another ride or go back home."

**Output:** `src/pages/BookRide.jsx`, updated `Navbar.jsx`, `Footer.jsx`, `Home.jsx`, `ServiceCard.jsx`, `App.jsx`

---

## Step 5 — Booking Form Validation
**Rubric:** Form Validation Functionality

> **Prompt 5.1:** "Write a `validateBooking.js` utility for the Book_A_Taxi booking form with these rules:
> - Full name: required, min 3 characters, letters/spaces only
> - Phone: required, valid 10-digit Indian mobile number (starts with 6–9)
> - Email: required, valid format
> - Pickup & drop-off: required, min 3 characters, drop-off must differ from pickup
> - Date: required, cannot be in the past
> - Time: required, must be at least 15 minutes from now
> - Service: required
> - Passengers: at least 1 and not more than the selected service's capacity
> - Notes: optional, max 200 characters
> - Terms: must be accepted
> Export a `validateField(name, values)` function and a `validateBooking(values)` function."

> **Prompt 5.2:** "Integrate this validation into `BookRide.jsx`: validate a field when it loses focus, re-validate as the user types once a field has been touched, re-check dependent fields (pickup→drop-off, date→time, service→passengers), show inline error messages under each field with a red border, show an error summary on submit, and move focus to the first invalid field. Make it accessible with `aria-invalid` and `aria-describedby`."

> **Prompt 5.3:** "Create a reusable `FormField` component that renders a label, an input/select/textarea and an inline error or hint message."

**Output:** `src/utils/validateBooking.js`, `src/components/FormField.jsx`, updated `src/pages/BookRide.jsx`
